# AI context questions

Answering these is the single highest-leverage way to make the site's AI
assistant richer **without letting it make things up**. It already knows the
hard facts (roles, dates, metrics). What it's missing is the *why, how, and what
you believe* — the layer that makes a visitor feel like they're interviewing
you.

## How to use this

1. Answer in your own words. Rough, first-person, conversational is perfect —
   don't polish. Bullet fragments or a voice-memo transcript both work.
2. Skip anything that doesn't fit. A blank answer is always safer than a made-up
   one; the assistant just has less to say on that topic.
3. **Only put true things here.** Everything in your answers becomes material the
   AI can paraphrase. It will never state a number, date, or name that isn't in
   the VERIFIED FACTS, but it *will* repeat opinions and stories from here — so
   keep them real.
4. When done, hand the answers back and they'll be folded into the
   `HOW VIN THINKS` section of `content/site.ts` (`aiContext`). You don't need to
   edit code — just answer the questions.

---

## 1. The through-line

- In one or two sentences, how do you describe what you do and what you're known
  for?
- What's the thread that connects engineering → Microsoft → Lyft → Asana →
  Modern Treasury → Vanta → Atlan? What were you consistently drawn to?
- Why product, coming from engineering? What made you switch?

## 2. The work, with the "why" behind it

For each role you care most about (Atlan, Vanta, Asana, Lyft, Microsoft are the
big ones), a few sentences on:

- **What was actually broken / what was the bet?** The situation before you
  showed up.
- **How did you approach it?** Your angle, not just the outcome.
- **What are you proudest of, and what would you do differently?**

> Don't restate metrics that are already in the facts (e.g. "-75% complaints").
> Give the *story* around them instead.

## 3. Opinions and beliefs

These make you sound like a person, not a résumé.

- What do you believe about building products that others disagree with?
- How should infrastructure / platform / dev-tools teams be measured?
- What's your take on building with AI right now?
- What's a hill you'll die on in a product debate?

## 4. How you work

- How do you make decisions when the data is incomplete?
- How do you work with engineers and designers?
- What kind of PM are you *not*? (What do you avoid or dislike doing?)
- What do people who've worked with you say about you?

## 5. What you want next

- What are you looking for in your next role / team / problem?
- What kind of company or mission excites you?
- What would make you say no to an otherwise great offer?

## 6. The human side

- The Chulalongkorn teaching week — why do you keep going back? What's it like?
- Bangkok → Toronto → Seattle: how has that shaped how you work?
- What do you do outside of work that says something about how you think?
- Anything you'd want a thoughtful interviewer to know that never fits on a
  résumé?

## 7. Common interview questions, your real answers

Write your actual answer to each, a few sentences:

- "Tell me about yourself."
- "What's a project you're proud of?"
- "Tell me about a failure and what you learned."
- "Why are you looking to leave / what are you looking for?"
- "What's your biggest strength / weakness?"
- "Why should we hire you?"

---

*The more real detail you give, the warmer and more specific the assistant gets,
while the guardrails keep it from inventing anything. Depth here is the only way
to get "more context" safely.*
