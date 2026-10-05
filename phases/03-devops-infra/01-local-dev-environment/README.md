# Sub-Phase 1 — Local Dev Environment (for the whole team, not just you)

## Goal

This sub-phase isn't code — it's making sure all 3 people have what they actually need installed,
and understanding what's cloud-based vs. local (this directly answers the team's Q1 from planning:
"nobody has installed anything").

## What Each Person Actually Needs

| Person | Must install locally | Does NOT need to install |
|---|---|---|
| Full-Stack | Node.js 20, Python 3.11 | Docker (can develop fully against mocks without it) |
| Agents/AI | Python 3.11, Ollama | Docker (unless testing sandbox calls for real) |
| DevOps/Infra (you) | Docker Desktop, Python 3.11 | — you need Docker, that's this phase's job |

**GitHub Actions and CodeRabbit run entirely in the cloud** — nobody installs anything for those;
see sub-phase 5 for the actual setup, which happens once, in a browser.

## Expected Output of This Sub-Phase

Not files — a checklist, confirmed with the other two people:

- [ ] Everyone has Git configured and can clone the repo
- [ ] Everyone knows which of the table above applies to them
- [ ] You (DevOps) have Docker Desktop running (`docker run hello-world` succeeds)
- [ ] Repo exists on GitHub, all 3 people have push access or are set up to fork+PR

## Hands Off To

Sub-phase 2, where you actually start building the sandbox service using the Docker install
confirmed here.
