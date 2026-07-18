"use client";

import { useState } from "react";
import { contact } from "@/content/site";
import { track } from "@/lib/analytics";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      track("contact_submit", {});
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try LinkedIn instead.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="border-t border-hairline pb-10 pt-[60px]"
    >
      <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-5 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-faint">
            {contact.kicker}
          </div>
          <h2 className="mb-5 mt-0 max-w-[14ch] font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em]">
            {contact.heading}
          </h2>
          <p className="mb-7 mt-0 font-serif text-[19px] leading-[1.6] text-ink2">
            {contact.intro}
          </p>
          <div className="flex flex-col gap-3 font-mono text-[14px] text-ink2">
            <div>
              <span className="inline-block w-20 text-faint">linkedin</span>{" "}
              <a href={contact.linkedinUrl} target="_blank" rel="noopener">
                {contact.linkedinHandle}
              </a>
            </div>
            <div>
              <span className="inline-block w-20 text-faint">based</span>{" "}
              {contact.based}
            </div>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="animate-fadeUp rounded-[12px] border border-hairline-strong bg-surface px-8 py-12 text-center">
              <div className="mb-4 font-display text-[44px] font-light leading-none text-accent">
                ✓
              </div>
              <div className="mb-2 font-display text-[20px] font-semibold">
                {contact.successHeading(form.name || "there")}
              </div>
              <div className="font-serif text-[17px] text-ink2">
                {contact.successBody}
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-[12px] border border-hairline-strong bg-surface p-7"
            >
              <div className="mb-[18px]">
                <label className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-faint">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full rounded-[8px] border border-[rgba(30,27,22,0.2)] bg-white px-[14px] py-3 text-[15px] text-ink outline-none focus:border-accent"
                />
              </div>
              <div className="mb-[18px]">
                <label className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-faint">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full rounded-[8px] border border-[rgba(30,27,22,0.2)] bg-white px-[14px] py-3 text-[15px] text-ink outline-none focus:border-accent"
                />
              </div>
              <div className="mb-[22px]">
                <label className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-faint">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="w-full resize-y rounded-[8px] border border-[rgba(30,27,22,0.2)] bg-white px-[14px] py-3 text-[15px] text-ink outline-none focus:border-accent"
                />
              </div>
              {error && (
                <div className="mb-3 font-mono text-[12px] text-[#b5502e]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full border-none bg-ink p-[15px] font-display text-[15px] font-medium text-paper disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send message →"}
              </button>
              <div className="my-5 mb-1 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-faint">
                <span className="h-px flex-1 bg-[rgba(30,27,22,0.14)]" />
                or
                <span className="h-px flex-1 bg-[rgba(30,27,22,0.14)]" />
              </div>
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener"
                className="box-border flex w-full items-center justify-center gap-[9px] rounded-full border border-[rgba(30,27,22,0.28)] bg-transparent p-[15px] font-display text-[15px] font-medium text-ink"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
                Connect on LinkedIn
              </a>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
