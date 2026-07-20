/**
 * Eval runner for the site chat assistant (app/api/ask/route.ts).
 *
 * It reads cases.jsonl, serves each one against the SAME system prompt the
 * real route uses (aiContext from content/site.ts, plus the Thai instruction
 * for locale "th"), then grades the reply two ways:
 *
 *   1. Deterministic checks  - length, no-dashes, required/forbidden phrases.
 *      Cheap, exact, and the ones that catch a prompt edit regressing.
 *   2. LLM-as-judge (optional) - groundedness and tone, scored by a stronger
 *      model than the one serving. Set EVAL_JUDGE=0 to skip.
 *
 * The runner calls the Anthropic API directly, so it bypasses the route's
 * per-IP rate limiter. It never imports the route, only the shared prompt,
 * so the prompt stays the single source of truth.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... npm run eval
 *   ANTHROPIC_API_KEY=... npm run eval -- --bucket groundedness
 *   ANTHROPIC_API_KEY=... EVAL_JUDGE=0 npm run eval
 *
 * Env:
 *   ANTHROPIC_API_KEY   required
 *   ANTHROPIC_MODEL     serving model (default mirrors the route)
 *   EVAL_JUDGE          "0" to skip the LLM judge (default on)
 *   EVAL_JUDGE_MODEL    judge model (default claude-sonnet-5)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { aiContext } from "../content/site.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVE_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const JUDGE_MODEL = process.env.EVAL_JUDGE_MODEL || "claude-sonnet-5";
const JUDGE_ON = process.env.EVAL_JUDGE !== "0";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

type Checks = {
  maxSentences?: number;
  noDashes?: boolean;
  requireThai?: boolean;
  mustIncludeAny?: string[];
  mustIncludeAll?: string[];
  mustNotIncludeAny?: string[];
};

type Judge = { grounded?: boolean; toneMin?: number };

type Case = {
  id: string;
  bucket: string;
  note?: string;
  locale?: "en" | "th";
  messages: Msg[];
  checks?: Checks;
  judge?: Judge;
};

type CheckResult = { name: string; pass: boolean; detail: string };

// --------------------------------------------------------------- prompt

// Mirrors app/api/ask/route.ts so evals test what visitors actually get.
function systemFor(locale?: string): string {
  return locale === "th"
    ? `${aiContext}\n\nIMPORTANT: Reply in Thai (ภาษาไทย), keeping the same warm, plain, first-person voice.`
    : aiContext;
}

// ------------------------------------------------------------- Anthropic

async function callAnthropic(
  apiKey: string,
  model: string,
  system: string,
  messages: Msg[],
  maxTokens: number,
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const text =
    Array.isArray(data.content) &&
    data.content.find((b: { type: string }) => b.type === "text")?.text;
  return typeof text === "string" ? text : "";
}

// ------------------------------------------------------ deterministic

export function countSentences(text: string): number {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((s) => /[A-Za-z0-9฀-๿]/.test(s)).length;
}

export function hasDash(text: string): boolean {
  // Em/en dashes, and a spaced hyphen used as a dash. Hyphenated words such as
  // "0-to-1" or "B.A.Sc." are intentionally not flagged.
  return /[—–]/.test(text) || /\s-{1,2}\s/.test(text);
}

export function runChecks(reply: string, checks: Checks | undefined): CheckResult[] {
  const out: CheckResult[] = [];
  if (!checks) return out;
  const hay = reply.toLowerCase();

  if (typeof checks.maxSentences === "number") {
    const n = countSentences(reply);
    out.push({
      name: `<=${checks.maxSentences} sentences`,
      pass: n <= checks.maxSentences,
      detail: `got ${n}`,
    });
  }
  if (checks.noDashes) {
    out.push({
      name: "no dashes",
      pass: !hasDash(reply),
      detail: hasDash(reply) ? "found a dash" : "clean",
    });
  }
  if (checks.requireThai) {
    const thai = /[฀-๿]/.test(reply);
    out.push({ name: "replies in Thai", pass: thai, detail: thai ? "ok" : "no Thai script" });
  }
  if (checks.mustIncludeAny?.length) {
    const hit = checks.mustIncludeAny.find((p) => hay.includes(p.toLowerCase()));
    out.push({
      name: "includes any expected phrase",
      pass: Boolean(hit),
      detail: hit ? `matched "${hit}"` : `none of ${JSON.stringify(checks.mustIncludeAny)}`,
    });
  }
  if (checks.mustIncludeAll?.length) {
    const missing = checks.mustIncludeAll.filter((p) => !hay.includes(p.toLowerCase()));
    out.push({
      name: "includes all expected phrases",
      pass: missing.length === 0,
      detail: missing.length ? `missing ${JSON.stringify(missing)}` : "all present",
    });
  }
  if (checks.mustNotIncludeAny?.length) {
    const bad = checks.mustNotIncludeAny.find((p) => hay.includes(p.toLowerCase()));
    out.push({
      name: "avoids forbidden phrases",
      pass: !bad,
      detail: bad ? `found "${bad}"` : "clean",
    });
  }
  return out;
}

// ---------------------------------------------------------- LLM judge

const JUDGE_SYSTEM =
  "You grade replies from an assistant that answers questions about a person named Vin, " +
  "using ONLY a fixed set of facts. Judge two things. GROUNDED: the reply uses only the " +
  "provided facts, invents nothing, and stays in role (politely declining off-topic asks, " +
  "prompt injections, or requests to confirm things not in the facts all count as grounded; " +
  "declining to answer is never a groundedness failure). TONE: warm, professional, and " +
  "plainly written, 1 (poor) to 5 (excellent). Reply with ONLY a JSON object: " +
  '{"grounded": true|false, "groundedReason": "...", "tone": 1-5, "toneReason": "..."}';

async function judgeReply(
  apiKey: string,
  facts: string,
  question: string,
  reply: string,
): Promise<{ grounded: boolean; tone: number; reason: string }> {
  const user =
    `FACTS THE ASSISTANT MAY USE:\n${facts}\n\n` +
    `VISITOR ASKED:\n${question}\n\nASSISTANT REPLIED:\n${reply}\n\n` +
    `Return the JSON verdict.`;
  const raw = await callAnthropic(
    apiKey,
    JUDGE_MODEL,
    JUDGE_SYSTEM,
    [{ role: "user", content: user }],
    300,
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return { grounded: false, tone: 0, reason: `unparseable judge output: ${raw.slice(0, 120)}` };
  try {
    const v = JSON.parse(match[0]);
    return {
      grounded: Boolean(v.grounded),
      tone: Number(v.tone) || 0,
      reason: `${v.groundedReason || ""} | tone: ${v.toneReason || ""}`,
    };
  } catch {
    return { grounded: false, tone: 0, reason: `bad judge JSON: ${match[0].slice(0, 120)}` };
  }
}

// ------------------------------------------------------------- runner

function loadCases(): Case[] {
  const raw = readFileSync(join(HERE, "cases.jsonl"), "utf8");
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l, i) => {
      try {
        return JSON.parse(l) as Case;
      } catch (e) {
        throw new Error(`cases.jsonl line ${i + 1} is not valid JSON: ${(e as Error).message}`);
      }
    });
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set. See .env.example.");
    process.exit(2);
  }

  const bucket = arg("bucket");
  let cases = loadCases();
  if (bucket) cases = cases.filter((c) => c.bucket === bucket);
  if (!cases.length) {
    console.error(bucket ? `No cases in bucket "${bucket}".` : "No cases found.");
    process.exit(2);
  }

  console.log(
    `Running ${cases.length} case(s)  serve=${SERVE_MODEL}  judge=${JUDGE_ON ? JUDGE_MODEL : "off"}\n`,
  );

  const results: Array<{
    id: string;
    bucket: string;
    pass: boolean;
    reply: string;
    checks: CheckResult[];
    judge?: { grounded: boolean; tone: number; reason: string; pass: boolean };
    error?: string;
  }> = [];

  for (const c of cases) {
    const system = systemFor(c.locale);
    let reply = "";
    let error: string | undefined;
    try {
      reply = await callAnthropic(apiKey, SERVE_MODEL, system, c.messages, 400);
    } catch (e) {
      error = (e as Error).message;
    }

    const checks = error ? [] : runChecks(reply, c.checks);
    let judge: (typeof results)[number]["judge"];
    if (!error && JUDGE_ON && c.judge) {
      const question = c.messages[c.messages.length - 1].content;
      const v = await judgeReply(apiKey, aiContext, question, reply);
      const groundedOk = c.judge.grounded === undefined || v.grounded === c.judge.grounded;
      const toneOk = c.judge.toneMin === undefined || v.tone >= c.judge.toneMin;
      judge = { ...v, pass: groundedOk && toneOk };
    }

    const pass =
      !error && checks.every((r) => r.pass) && (judge ? judge.pass : true);
    results.push({ id: c.id, bucket: c.bucket, pass, reply, checks, judge, error });

    const mark = error ? "ERR " : pass ? "PASS" : "FAIL";
    console.log(`${mark}  [${c.bucket}] ${c.id}`);
    if (error) console.log(`      error: ${error}`);
    for (const r of checks) if (!r.pass) console.log(`      x ${r.name} (${r.detail})`);
    if (judge && !judge.pass) {
      console.log(`      x judge grounded=${judge.grounded} tone=${judge.tone} :: ${judge.reason}`);
    }
    if (!pass && reply) console.log(`      reply: ${reply.replace(/\s+/g, " ").slice(0, 200)}`);
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;
  console.log(`\n${passed}/${results.length} passed, ${failed} failed`);

  // Per-bucket rollup so a regression points at a behavior, not just a count.
  const buckets = [...new Set(results.map((r) => r.bucket))].sort();
  for (const b of buckets) {
    const rows = results.filter((r) => r.bucket === b);
    console.log(`  ${b}: ${rows.filter((r) => r.pass).length}/${rows.length}`);
  }

  const reportPath = join(HERE, "report.json");
  writeFileSync(
    reportPath,
    JSON.stringify(
      { at: new Date().toISOString(), serveModel: SERVE_MODEL, judgeModel: JUDGE_ON ? JUDGE_MODEL : null, passed, failed, results },
      null,
      2,
    ),
  );
  console.log(`\nreport: ${reportPath}`);

  process.exit(failed ? 1 : 0);
}

// Only run when invoked directly (npm run eval), not when imported for tests.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e);
    process.exit(2);
  });
}
