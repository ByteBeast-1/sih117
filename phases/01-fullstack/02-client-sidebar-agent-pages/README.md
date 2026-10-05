# Sub-Phase 2 — Client Sidebar & Agent Pages

## Goal

Build the sidebar navigation and the three "simpler" agent pages: General Knowledge, Math/
Calculation, and Blueprint/Schematic. (The Coding Workspace is bigger and gets its own sub-phase 3.)

## Tech Stack

Same as sub-phase 1, plus a file-upload component for the Blueprint page.

## Expected Files After This Sub-Phase

```
app/src/
  pages/
    KnowledgeAgent.jsx     (chat UI + citations panel + thinking trace)
    MathAgent.jsx          (prompt box + step-by-step answer display)
    BlueprintAgent.jsx     (upload + viewer + yield prediction panel)
  components/
    Sidebar.jsx            (list-driven, not hardcoded tabs - see note below)
    CitationCard.jsx       (reusable: doc name, page, subtopic)
    ThinkingTrace.jsx      (reusable: collapsible step list)
backend/app/routers/
  agents.py                (proxies to Agents/AI per CONTRACTS.md, using mocks for now)
```

**Extension point:** `Sidebar.jsx` must render from a list/array of `{label, route, icon}`, not a
hardcoded set of `<NavLink>` tags — this is what makes adding a 7th agent later a data change, not
a code change (per `NON_NEGOTIABLES.md` rule a).

## Mock Data

Use the exact response shapes from `../CONTRACTS.md` Sections 1, 2, and 5 as static JSON under
`app/src/mocks/`. Wire your API-calling code to read these when `VITE_USE_MOCKS=true`.

## What "Done" Looks Like

- Sidebar renders all agent links from a data list.
- Knowledge Agent page shows an answer, a visible thinking trace, and citation cards — using mock data.
- Math Agent shows a step-by-step breakdown, not just a final number — using mock data.
- Blueprint Agent accepts a file upload and displays a mocked extraction + yield prediction.
- If a mock response has `"grounded": false`, the Knowledge page clearly shows "no answer found in
  organization documents" instead of hiding the field or showing nothing.

## Hands Off To

Sub-phase 3 builds the main Coding Workspace page, which is bigger and reuses `ThinkingTrace.jsx`
and the sandbox output pattern established here.
