# Sub-Phase 3 — Supervisor / Coding Workspace (the Main Page)

## Goal

Build the flagship page: file upload/edit, a chat interface with a coding agent, a "Run" button
that opens a dedicated sandbox output window, file-edit proposals that require explicit user
confirmation, and general request routing (typing "generate a PPT of this" here should route to
the Generation agent and come back with a result).

## Tech Stack

Monaco Editor (file viewing/editing) + React + WebSocket client for live streaming.

## Expected Files After This Sub-Phase

```
app/src/
  pages/
    SupervisorWorkspace.jsx     (main layout: file tree + editor + chat panel)
  components/
    FileEditor.jsx              (Monaco wrapper)
    FileUploadZone.jsx
    ChatPanel.jsx                (reused pattern from KnowledgeAgent, generalized)
    EditConfirmationModal.jsx    (shows a diff, requires explicit click before applying)
    SandboxRunWindow.jsx         (separate window/panel showing live stdout/stderr while running)
  hooks/
    useSupervisorSocket.js       (WebSocket hook for live thinking + sandbox output)
```

## Non-Negotiable Behavior (from `NON_NEGOTIABLES.md`)

- **Any proposed file edit must show a diff and wait for an explicit confirm click before being
  "applied" (even in the mocked/prototype version).** This is not optional polish — it's a stated
  project rule. Build the confirmation flow now, don't leave it for later.
- If the response includes `"routed_to_agent": "generation"`, show a clear "routed to Generation
  agent, working..." state and poll for the result — don't silently sit there.

## Mock Data

Use `../CONTRACTS.md` Section 3 (Supervisor) and Section 4 (Generation, for the routed case) as
your mock shapes. Simulate the WebSocket stream with a `setInterval` pushing fake trace lines
before the real backend exists.

## What "Done" Looks Like

- Can upload a file, see it in the editor.
- Typing a request produces a chat reply and, when relevant, a proposed edit with a visible diff
  that does nothing until confirmed.
- Clicking "Run" opens the sandbox output view and streams mocked stdout/stderr progressively,
  not all at once.
- Typing a generation-style request shows the "routed to Generation agent" state and eventually
  a downloadable file card, using mocks.

## Hands Off To

Sub-phase 4 builds the Admin Dashboard, which is structurally simpler and independent of this page.
