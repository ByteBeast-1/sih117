# Sub-Phase 4 — Generation Agent

## Goal

Build one shared, reliable file-generation engine — `.docx`, `.xlsx`, `.pptx` — that every other
agent calls instead of each reimplementing file output. This is deliberately its own sub-phase
because it's called from multiple places (Supervisor, Knowledge, Math, Blueprint) and should be
built once, well, rather than duplicated.

## Tech Stack

python-docx + openpyxl + python-pptx.

## Expected Files After This Sub-Phase

```
phases/02-agents-ai/app/
  agents/
    generation_tools.py    # generate_docx(), generate_xlsx(), generate_pptx()
  routers/
    generation.py          # GET /internal/agents/generation/status/{task_id}
```

## Function Contracts (also see `../CONTRACTS.md` Part C)

```python
def generate_docx(content: dict, output_path: str) -> str:
    # content = { "title": str, "sections": [{ "heading": str, "body": str }] }
def generate_xlsx(rows: list[dict], output_path: str) -> str:
def generate_pptx(slides: list[dict], output_path: str) -> str:
    # slides = [{ "title": str, "bullets": [str] }]
```

All three write to `/shared/outputs/{task_id}/` (a path Full-Stack's backend also has access to,
so it can serve the file for download without this phase needing its own file server) and return
the final path.

## Setup Steps

1. `pip install python-docx openpyxl python-pptx`
2. Build the three functions above — keep them boring and reliable, this is not where you want
   cleverness (per `NON_NEGOTIABLES.md` rule b, structure over cleverness).
3. Build a simple in-memory or file-backed task-status tracker so
   `GET /internal/agents/generation/status/{task_id}` can report `"queued"` → `"completed"`.

## What "Done" Looks Like

- Calling `generate_docx()` with sample content produces a real, openable Word file — open it
  once yourself to confirm it's not corrupt.
- Same for xlsx and pptx.
- The status endpoint correctly reflects task progress and returns the shape from
  `phases/01-fullstack/CONTRACTS.md` Section 4.

## Hands Off To

Sub-phases 3, 5, 6 all call these functions whenever their agent needs to produce a real deliverable.
