# Chat assistant evals

Behavioral tests for the floating chat assistant (`app/api/ask/route.ts`).
They guard the promises the system prompt (`aiContext` in `content/site.ts`)
makes to visitors and recruiters: answer only from the listed facts, stay
within 2 to 4 sentences, no dashes, admit what it doesn't know and point to
LinkedIn, and reply in Thai for the Thai locale.

The runner imports the real `aiContext`, so the prompt stays the single
source of truth. Edit the prompt, re-run, and see what moved.

## Run

```bash
# Needs an Anthropic key. The runner calls the API directly, so it is NOT
# subject to the route's per-IP rate limiter.
export ANTHROPIC_API_KEY=sk-ant-...
npm run eval

# One behavior bucket only:
npm run eval -- --bucket groundedness

# Deterministic checks only (skip the LLM judge, cheaper):
EVAL_JUDGE=0 npm run eval
```

Exit code is non-zero if any case fails, so it works as a CI gate. A full
run writes `evals/report.json` with every reply and verdict.

### Environment

| Var | Default | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | (required) | Serving and judging. |
| `ANTHROPIC_MODEL` | `claude-haiku-4-5-20251001` | Serving model (mirrors the route). |
| `EVAL_JUDGE` | on | Set to `0` to skip the LLM judge. |
| `EVAL_JUDGE_MODEL` | `claude-sonnet-5` | Judge model (stronger than the server). |

## How grading works

Each reply is graded two ways:

1. **Deterministic checks** — exact and free: sentence count, no-dashes,
   required / forbidden phrases, Thai script. These catch a prompt edit
   silently regressing a rule.
2. **LLM-as-judge** (optional) — scores `grounded` (used only the facts and
   stayed in role) and `tone` (1-5), judged by a stronger model than the one
   serving. Declining to answer is never a groundedness failure.

A case passes only if every deterministic check passes and the judge verdict
(when present) meets the case's `grounded` / `toneMin` expectation.

## Add a case

`cases.jsonl` is one JSON object per line. The flywheel: whenever the bot
says something you didn't like, paste it in as a new case, then re-run after
each prompt edit.

```jsonc
{
  "id": "ground-rust",              // unique
  "bucket": "groundedness",         // groundedness | accuracy | format | deflection | robustness | localization
  "note": "why this case exists",
  "locale": "en",                   // optional; "th" adds the Thai instruction
  "messages": [                     // full turn history; must end on a user turn
    { "role": "user", "content": "Does Vin know Rust?" }
  ],
  "checks": {                       // all optional, all must pass
    "maxSentences": 4,
    "noDashes": true,
    "requireThai": true,            // reply must contain Thai script
    "mustIncludeAny": ["linkedin"], // case-insensitive
    "mustIncludeAll": ["thai", "english"],
    "mustNotIncludeAny": ["completed a phd"]
  },
  "judge": {                        // optional LLM-judge expectations
    "grounded": true,
    "toneMin": 3
  }
}
```
