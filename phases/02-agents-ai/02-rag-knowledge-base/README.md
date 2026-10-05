# Sub-Phase 2 — RAG Knowledge Base

## Goal

Build the document ingestion pipeline and the `rag_search()` function every knowledge-grounded
agent depends on (per `../CONTRACTS.md` Part C). This is the piece that makes
`NON_NEGOTIABLES.md` rule (d) actually true in code, not just in principle.

## Getting Prototype Content (see main `README.md` Section 8)

Real MRPL documents aren't available. Write 5–10 short, realistic sample SOP-style PDFs/text
documents yourselves (e.g. "Pressure Safety SOP," "Inspection Checklist," "Equipment Tag
Reference") — this matches the problem statement's own allowance for publicly available/sample
documents. Put them in `sample_docs/`.

## Tech Stack

ChromaDB (embedded/local mode) + rank_bm25 + a local embedding model via Ollama
(`ollama pull nomic-embed-text`).

## Expected Files After This Sub-Phase

```
phases/02-agents-ai/
  sample_docs/                    (your written sample SOPs, as PDF or plain text)
  scripts/
    ingest.py                     # chunk -> embed -> store in ChromaDB, with page/subtopic metadata
  app/
    rag.py                        # rag_search(query, top_k) per CONTRACTS.md Part C
  chroma_data/                    (gitignored - local vector store)
```

## Setup Steps

1. `pip install chromadb rank_bm25 pypdf`
2. `ollama pull nomic-embed-text`
3. Write `scripts/ingest.py`: for each file in `sample_docs/`, split into ~300-500 token chunks,
   tag each chunk with `{ "document": filename, "page": n, "subtopic": <nearest heading> }`,
   embed via Ollama, store in ChromaDB.
4. Run it: `python scripts/ingest.py --path ./sample_docs/`
5. Build `rag.py`'s `rag_search()`: embed the query, get top-k from ChromaDB, also run BM25 over
   the same chunk texts, merge/dedupe, return sorted by combined confidence.

## What "Done" Looks Like

- Ingesting the sample docs populates `chroma_data/` with real, retrievable chunks.
- `rag_search("what is the max pressure for 500mm pipes")` returns a result whose `document`,
  `page`, and `subtopic` fields are all real (traceable back to your actual sample file), not
  placeholder text.
- A query with no real match in the sample docs returns an empty list — confirm this explicitly,
  it's what lets downstream agents correctly say "not found" instead of guessing.

## Hands Off To

Sub-phases 3, 5, 6 (Supervisor, Vision, Math) all call `rag_search()` from here whenever they
need to ground an answer.
