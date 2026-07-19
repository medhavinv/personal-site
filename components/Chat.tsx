"use client";

import { useEffect, useRef, useState } from "react";
import { useContent, useLocale } from "@/components/LocaleProvider";
import { track } from "@/lib/analytics";

type Message = { role: "user" | "assistant"; content: string };

export function Chat() {
  const { chat } = useContent();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: chat.welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // On small screens the launcher sits over the contact form's submit button,
  // so hide it (when the panel is closed) while the contact section is on
  // screen. Desktop has room, so it stays.
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const showSuggestions = messages.length <= 1;

  // Keep the seeded welcome in sync with the language, until the user chats.
  useEffect(() => {
    setMessages((m) =>
      m.length === 1 && m[0].role === "assistant"
        ? [{ role: "assistant", content: chat.welcome }]
        : m,
    );
  }, [chat.welcome]);

  useEffect(() => {
    // Keep the newest message in view.
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  const send = async (q: string) => {
    const text = q.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    track("chat_message", { length: text.length });

    try {
      // Send the conversation without the seeded welcome message; the system
      // prompt lives server-side in /api/ask.
      const history = next.filter(
        (m, i) => !(i === 0 && m.role === "assistant"),
      );
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, locale }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        typeof data.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : chat.emptyReply;
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: chat.errorReply }]);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setOpen((o) => {
      if (!o) track("chat_open", {});
      return !o;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-[14px] font-display">
      {open && (
        <div className="flex h-[520px] max-h-[calc(100vh-120px)] w-[380px] max-w-[calc(100vw-40px)] animate-fadeUp flex-col overflow-hidden rounded-[16px] border border-hairline-strong bg-surface shadow-[0_24px_70px_rgba(20,18,30,.28)]">
          <div className="flex items-center justify-between gap-[9px] border-b border-hairline px-[18px] py-[14px]">
            <div className="flex items-center gap-[9px] font-mono text-[12px] font-medium text-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              {chat.panelTitle}
            </div>
            <button
              onClick={toggle}
              aria-label={chat.closeChat}
              className="cursor-pointer border-none bg-transparent px-[2px] text-[22px] leading-none text-muted"
            >
              ×
            </button>
          </div>

          <div
            ref={listRef}
            className="flex flex-1 flex-col gap-[14px] overflow-y-auto p-5"
          >
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={i}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-[15px] py-3 text-[14px] leading-[1.5] ${
                      isUser
                        ? "rounded-[14px] rounded-br-[4px] bg-ink font-display text-paper"
                        : "rounded-[14px] rounded-bl-[4px] bg-surface-alt font-body text-ink"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}

            {showSuggestions && (
              <div className="mt-[2px] flex flex-col gap-2">
                {chat.suggested.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="cursor-pointer rounded-[10px] border border-[rgba(30,27,22,0.2)] bg-transparent px-[13px] py-[10px] text-left font-mono text-[12.5px] text-ink"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="self-start font-mono text-[20px] tracking-[2px] text-accent">
                <span className="animate-blink">•</span>
                <span className="animate-blink [animation-delay:0.2s]">•</span>
                <span className="animate-blink [animation-delay:0.4s]">•</span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-[10px] border-t border-hairline p-[14px]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chat.inputPlaceholder}
              className="min-w-0 flex-1 rounded-[10px] border border-[rgba(30,27,22,0.2)] bg-white px-[14px] py-3 text-[14px] text-ink outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-[10px] border-none bg-ink px-[18px] py-3 font-display text-[14px] font-medium text-paper"
            >
              {chat.ask}
            </button>
          </form>
        </div>
      )}

      {/* Full pill from sm up; a compact circle on phones, hidden there while
          the contact section is visible so it never covers the send button. */}
      <button
        onClick={toggle}
        aria-label={chat.launcherLabel}
        className={`flex cursor-pointer items-center justify-center rounded-full border-none bg-ink font-display text-[14px] font-medium text-paper shadow-[0_12px_30px_rgba(20,18,30,.28)] transition-opacity hover:opacity-90 max-sm:h-[52px] max-sm:w-[52px] sm:gap-[10px] sm:px-[22px] sm:py-[14px] ${
          contactInView && !open ? "max-sm:hidden" : ""
        }`}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-accent max-sm:hidden" />
        <span className="max-sm:sr-only">{chat.launcherLabel}</span>
        <svg
          className="sm:hidden"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.37-4.1-1.03L3 21l1.53-5.4A8.5 8.5 0 1 1 21 12z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
