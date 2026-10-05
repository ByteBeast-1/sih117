# Sub-Phase 4 — Admin Dashboard

## Goal

Build the Admin view: server/connection monitor, model registry management (add a model without
redeploying), and the network monitor visualization — the single most important screen for the
judges, so it's worth making this one visually strong.

## Tech Stack

Recharts (for GPU/VRAM bars and any traffic graph) + React.

## Expected Files After This Sub-Phase

```
app/src/
  pages/
    AdminDashboard.jsx
  components/
    ServerStatusPanel.jsx      (connections, service health)
    ModelRegistryTable.jsx     (list + "add model" form)
    NetworkMonitorPanel.jsx    (the big "0 outbound bytes" proof widget)
```

## Design Note

Make `NetworkMonitorPanel.jsx` the visual centerpiece of this page — large, bold, unmistakable
"0 BYTES" number, ideally with a live-updating feel (poll every few seconds even against mock
data). This is your proof-of-sovereignty demo moment; it should look deliberately impressive,
not buried in a small stat card.

## Mock Data

Use `../CONTRACTS.md` Sections 6 (Model Registry) and 7 (Network Monitor) as your mock shapes.

**Model Registry "add model" form:** submitting it should optimistically add a row to the table
immediately (don't wait for a real backend round-trip during mock development) — this is what
proves the UI treats new-model-registration as a simple data operation, matching the extension
point requirement.

## What "Done" Looks Like

- Model registry table lists mock models and a working "add model" form that appends a new row.
- Network monitor panel prominently shows 0 outbound bytes, polling on an interval.
- Server status panel shows mock connection/service health data in a clear, scannable layout.

## Hands Off To

Sub-phase 5, which replaces every mock across all pages with real calls to Agents/AI.
