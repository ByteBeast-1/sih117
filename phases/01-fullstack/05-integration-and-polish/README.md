# Sub-Phase 5 — Integration & Polish

## Goal

Replace every mock built in sub-phases 1–4 with real calls to the Agents/AI service, per
`../CONTRACTS.md`. Add proper loading/error states everywhere. This is the sub-phase that only
makes sense once Agents/AI has something real running (see `phases/02-agents-ai`).

## What Changes

- `VITE_USE_MOCKS=false`, `VITE_API_BASE_URL` points at the real backend.
- Backend's `routers/agents.py` actually calls the Agents/AI service's internal endpoints instead
  of returning canned data (`USE_AGENTS_MOCK=false` in backend `.env`).
- Every page gets a real loading spinner/skeleton state and a real error state matching the
  Universal Error Shape in `../CONTRACTS.md`.

## Expected Files After This Sub-Phase

No major new files — this sub-phase is about deleting mock branches and hardening what exists:

```
backend/app/routers/agents.py    (real httpx calls, mock branch removed or clearly gated)
app/src/api/client.js            (single place all real API calls go through)
```

## What "Done" Looks Like

- Every page in the product works against the real Agents/AI service running locally (or over
  LAN on the GPU laptop).
- Killing the Agents/AI service and reloading a page shows a clear, non-crashing error state,
  not a blank screen or a raw stack trace.
- A file uploaded on the Blueprint page really gets analyzed by the real vision agent (or its
  prototype-scope placeholder — see `phases/02-agents-ai/05-vision-blueprint-agent`).
- The Network Monitor panel shows a real, measured 0 (or a genuinely nonzero number if something's
  wrong — and if it's ever nonzero, that's a bug to fix immediately, not a display issue to hide).

## This Is the Last Full-Stack Sub-Phase

After this, remaining work is bug-fixing and demo polish, tracked as normal PRs, not new sub-phases.
