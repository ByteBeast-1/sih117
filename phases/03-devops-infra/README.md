# Phase 3 — DevOps & Infra

One person, one Antigravity laptop. This phase owns the sandbox execution engine (the security
mechanism, not the UI page — see main `README.md` Section 6 for that distinction), the Docker
Compose stack, the network-proof tooling, and — critically — the actual step-by-step CI/CD setup,
since nobody on the team has done this before.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Docker Desktop | latest | https://docs.docker.com/get-started/get-docker |
| Python | 3.11 | https://www.python.org/downloads |

| Concept | Learn it here |
|---|---|
| Docker fundamentals | https://docs.docker.com/get-started |
| Docker Compose | https://docs.docker.com/compose/compose-file |
| Docker Engine API (Python SDK) | https://docker-py.readthedocs.io/en/stable |
| Container security flags | https://docs.docker.com/engine/security |
| GitHub Actions basics | https://docs.github.com/en/actions/writing-workflows/quickstart |
| `tcpdump` basics | https://www.tcpdump.org/manpages/tcpdump.1.html |

## Tech Stack

Docker + Docker Engine API (Python SDK) + Docker Compose + GitHub Actions + CodeRabbit.

## Structure of This Phase (sub-phases, build in order)

| # | Sub-phase | Delivers |
|---|---|---|
| 1 | `01-local-dev-environment` | What everyone (not just you) needs installed, and why |
| 2 | `02-sandbox-execution-service` | The isolated code-execution engine |
| 3 | `03-docker-compose-and-deployment` | Full stack wiring, air-gap bundle script |
| 4 | `04-network-proof-and-monitoring` | The actual zero-outbound-bytes measurement |
| 5 | `05-cicd-coderabbit-github-actions` | Literal step-by-step: set up CI from zero |

## Input / Output at a Glance

- **Input to this phase:** code-execution requests from Agents/AI, per `CONTRACTS.md`.
- **Output of this phase:** a running sandbox service, a `docker-compose.yml` that boots the
  whole system, real network/GPU metrics, and working CI on the GitHub repo.
- **Where it connects:** Agents/AI calls this phase's sandbox service directly; Full-Stack's
  Admin Dashboard reads this phase's network/GPU metrics (via Agents/AI's forwarding, or directly
  — whichever is simpler for your setup, note it in `CONTRACTS.md` if you pick direct).

## Before Writing Any Code

Read `CONTRACTS.md` — the sandbox service's request/response shape is called directly by
Agents/AI's Supervisor agent, so it must match exactly, including the failure-case shape.
