# Phase 2 — Agents & AI

One person, one Antigravity laptop. This is the "brain" of the whole system — model routing,
every LangGraph agent, the local RAG pipeline, and the Generation agent's file-writing tools.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Python | 3.11 | https://www.python.org/downloads |
| Ollama | latest | https://ollama.com/download |
| A small test model | — | `ollama pull qwen2.5:1.5b` and `ollama pull qwen2.5-coder:1.5b` |

| Concept | Learn it here |
|---|---|
| LangGraph state graphs | https://langchain-ai.github.io/langgraph/tutorials/introduction |
| Conditional edges + retry loops | https://langchain-ai.github.io/langgraph/how-tos/branching |
| Ollama Python usage | https://github.com/ollama/ollama/blob/main/docs/api.md |
| ChromaDB basics | https://docs.trychroma.com/getting-started |
| BM25 keyword search | https://github.com/dorianbrown/rank_bm25 |
| python-docx / openpyxl / python-pptx | https://python-docx.readthedocs.io · https://openpyxl.readthedocs.io |

## Tech Stack

FastAPI (internal service, not public-facing) + LangGraph + Ollama + ChromaDB + rank_bm25 +
python-docx/openpyxl/python-pptx.

## Structure of This Phase (sub-phases, build in order)

| # | Sub-phase | Delivers |
|---|---|---|
| 1 | `01-model-serving-and-router` | Ollama wiring, model registry, task→model routing |
| 2 | `02-rag-knowledge-base` | Document ingestion, ChromaDB, citation-producing search |
| 3 | `03-supervisor-agent` | The routing/orchestrating agent, file-edit proposals, sandbox calls |
| 4 | `04-generation-agent` | Shared docx/xlsx/pptx generation tools, called by every other agent |
| 5 | `05-vision-blueprint-agent` | Document/P&ID analysis (prototype-scoped, see note in that README) |
| 6 | `06-math-calculation-agent` | Step-shown calculation agent |

## Input / Output at a Glance

- **Input to this phase:** requests from Full-Stack's backend, matching
  `phases/01-fullstack/CONTRACTS.md`.
- **Output of this phase:** responses matching that same contract, plus calls made *out* to
  DevOps/Infra's sandbox service, matching `CONTRACTS.md` in this folder.
- **Where it connects:** Full-Stack calls in; DevOps/Infra's sandbox service is called out to,
  for any agent that needs to execute code.

## Before Writing Any Code

Read `CONTRACTS.md` in this folder — it has **two** sections: what this phase must return to
Full-Stack (mirrors `phases/01-fullstack/CONTRACTS.md`, kept in sync), and what this phase expects
from DevOps/Infra's sandbox service.
