# Phase 1 — Full-Stack (Frontend + Backend)

One person, one Antigravity laptop. This phase owns everything the user ever sees or directly
clicks, plus the API layer that connects it to the Agents/AI phase.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org |
| Python | 3.11 | https://www.python.org/downloads |
| PostgreSQL | 15+ (or via Docker later) | https://www.postgresql.org/download |

| Concept | Learn it here |
|---|---|
| React function components + hooks | https://react.dev/learn |
| Tailwind CSS | https://tailwindcss.com/docs |
| FastAPI basics | https://fastapi.tiangolo.com/tutorial |
| JWT auth basics | https://fastapi.tiangolo.com/tutorial/security |
| WebSockets (for live "thinking" trace + sandbox output streaming) | https://fastapi.tiangolo.com/advanced/websockets |

## Tech Stack

React + Tailwind + Monaco Editor (code viewer) · FastAPI + Uvicorn + WebSockets + PostgreSQL + SQLAlchemy.

## Structure of This Phase (sub-phases, build in order)

| # | Sub-phase | Delivers |
|---|---|---|
| 1 | `01-setup-shell-auth` | Project scaffold, login screen, page routing shell, users table |
| 2 | `02-client-sidebar-agent-pages` | General Knowledge, Math, Blueprint pages + sidebar nav |
| 3 | `03-supervisor-coding-workspace` | The flagship main page — upload/edit/chat/run |
| 4 | `04-admin-dashboard` | Server monitor, model registry UI, network monitor view |
| 5 | `05-integration-and-polish` | Swap every mock for the real Agents/AI phase, error states |

## Input / Output at a Glance

- **Input to this phase:** nothing from other phases at first — you build entirely against mocks
  until sub-phase 5.
- **Output of this phase:** a running React app + FastAPI service that, by the end of sub-phase 5,
  makes real calls to Agents/AI per `CONTRACTS.md` and renders real responses.
- **Where it connects next:** every agent page's "send"/"run"/"upload" action calls a FastAPI route,
  which calls Agents/AI per `CONTRACTS.md`.

## Before Writing Any Code

Read `CONTRACTS.md` in this folder. It's short — only one real boundary exists (this phase ↔
Agents/AI), since Frontend and Backend are the same person and don't need a contract between them.
