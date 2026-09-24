# React Debug & Explain Exercise

**Duration:** ~35 minutes · **Format:** conversation over screen share

You're handed a small product-catalog app and a JSON dataset. It compiles and
runs, but it has problems, the kind you'd flag in a code review or hit in
production. Your job is to read the code, walk us through what's wrong and *why*,
and propose how you'd fix it.

This is a conversation, not a typing test. Talking through your reasoning matters
more than writing code. You're welcome to make live edits if it helps you explain
something, but it isn't required.

---

## Setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

Everything you need is in `App.jsx`. The data comes from `products.json` through a
simulated API with variable latency. `main.jsx` and `index.html` are just the
standard entrypoint.

---

## What the app does

- Search products by name
- Filter by category
- Sort by relevance or price
- Mark products as favorites (the tab title shows the favorites count)

---

## What we'd like from you

- **Find the problems.** Look at correctness, state design, rendering behavior,
  and code structure.
- **Explain the why.** For each issue, tell us what goes wrong, when it happens,
  and why the code behaves that way.
- **Prioritize.** Tell us what you'd fix first and what can wait.
- **Talk trade-offs.** Most fixes have more than one reasonable answer. Tell us
  what you'd choose, what it costs, and when you *wouldn't* do it.

We may ask follow-up questions or push on edge cases as you go. There's no single
"right" final version of the code.

---

## Ground rules

- **No AI tools** (Copilot, ChatGPT, Claude, etc.) during the exercise.
- React docs, MDN, and browser DevTools (including React DevTools) are fine.
- Ask questions any time, clarifying the requirements is part of the job.
