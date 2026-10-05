# Sub-Phase 6 — Math / Calculation Agent

## Goal

Build the step-shown calculation agent. Reuses the reasoning model from sub-phase 1 — no
dedicated model needed for the prototype, just a different system prompt and output structure.

## Tech Stack

Same model client as sub-phase 1, no new dependencies.

## Expected Files After This Sub-Phase

```
phases/02-agents-ai/app/
  agents/
    math_agent.py     # calculate(prompt) -> dict
  routers/
    math.py            # POST /internal/agents/math/calculate
```

## Function Contract

Matches `phases/01-fullstack/CONTRACTS.md` Section 2 exactly — `final_answer`, `steps` (a real
list of intermediate reasoning/formula steps, not a single blob of text), `grounded`, `citations`
(when the calculation references a value from `rag_search()`, e.g. a pressure limit from an SOP).

## Setup Steps

1. Use `route_task("reasoning")` from sub-phase 1 to get the model.
2. Prompt it specifically to output a numbered list of steps and a final answer as **separate,
   parseable fields** — not a single freeform paragraph the frontend has to guess how to split.
   (Simplest approach: ask for JSON output directly and validate/parse it.)
3. Before finalizing, call `rag_search()` for any values that should come from an SOP (e.g. a
   pressure limit) rather than letting the model state a number from its own general training —
   this is `NON_NEGOTIABLES.md` rule (d) applied to a calculation agent specifically.

## What "Done" Looks Like

- A calculation request returns a real, correct multi-step breakdown, not just a final number.
- If the calculation depends on an SOP-defined limit, that value is cited back to
  `rag_search()`'s result, not stated as if the model just "knows" it.

## This Is the Last Agents/AI Sub-Phase

After this, remaining work is refinement and bug-fixing, tracked as normal PRs.
