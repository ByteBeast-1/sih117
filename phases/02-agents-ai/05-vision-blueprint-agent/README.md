# Sub-Phase 5 — Vision / Blueprint Agent

## Goal

Document/P&ID analysis and a yield-predictor stub, MRPL-flavored. **This is explicitly the
lowest-priority sub-phase for the prototype** (see main `README.md` Section 8 and 13) — build it
last, and it's fine for it to be the least "real" piece of the demo as long as that's honest and
clearly labeled, not disguised as more complete than it is (per `NON_NEGOTIABLES.md` rule b).

## Tech Stack (prototype-scoped)

- If your GPU laptop has headroom: a small VLM via Ollama (e.g. a lightweight vision-capable model).
- If not: **skip a real vision model entirely for the prototype.** Use a simple OCR library
  (`pytesseract`) for text extraction from scans, and a clearly-labeled placeholder for
  P&ID-specific structured extraction and yield prediction. Say so explicitly in the response
  (`"note": "Prototype placeholder model"`, as shown in the contract) — don't fake precision you
  don't have.

## Expected Files After This Sub-Phase

```
phases/02-agents-ai/app/
  agents/
    vision_agent.py     # analyze_document(file_path, instruction) -> dict
  routers/
    vision.py            # POST /internal/agents/vision/analyze
```

## Function Contract

Matches `phases/01-fullstack/CONTRACTS.md` Section 5 exactly — `extracted_summary`,
`structured_fields`, `yield_prediction` (with the honesty-note field), `citations` (cross-
referencing extracted values against `rag_search()` from sub-phase 2, where relevant — e.g. "this
pressure reading is within/outside the SOP limit").

## Setup Steps

1. `pip install pytesseract pillow pypdf` (prototype path) — or pull a small VLM via Ollama if
   your hardware allows.
2. Build `analyze_document()`: extract text (OCR or VLM), pull out anything that looks like an
   equipment tag or numeric reading (simple regex is fine for prototype), optionally call
   `rag_search()` to cross-check a reading against a known SOP limit.
3. Yield prediction: a simple, clearly-labeled placeholder calculation for the prototype —
   this is explicitly a "Later, full product" item per main `README.md` Section 13.

## What "Done" Looks Like

- Uploading a sample P&ID-style image/PDF returns real extracted text and at least one
  structured field pulled from it — not hardcoded fake output.
- The yield prediction is present but honestly labeled as a placeholder.
- Where a cross-reference against `rag_search()` succeeds, a citation appears; where it doesn't,
  the field is simply absent, not fabricated.

## Hands Off To

Full-Stack sub-phase 5 (Integration) wires the real Blueprint page to this.
