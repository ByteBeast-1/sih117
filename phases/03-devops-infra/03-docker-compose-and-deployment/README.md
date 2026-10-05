# Sub-Phase 3 — Docker Compose & Deployment

## Goal

Write the root `docker-compose.yml` that wires all 6 services together (per `../CONTRACTS.md`
Section 2), plus the air-gap bundle script.

## Tech Stack

Docker Compose.

## Expected Files After This Sub-Phase

```
sih-workbench/
  docker-compose.yml              # at repo ROOT, not inside this phase folder
  .env.example
phases/03-devops-infra/
  scripts/
    build_bundle.sh
```

Each phase should already have its own `Dockerfile` in its own folder by this point (Full-Stack
and Agents/AI own theirs — if they don't exist yet when you reach this sub-phase, write a minimal
placeholder one and flag it to that phase's owner rather than blocking on it).

## Setup Steps

1. Write `docker-compose.yml` per the service map in `../CONTRACTS.md` Section 2 — one service
   block per row of that table, a shared `shared-outputs` named volume, a custom bridge network.
2. `docker-compose up -d` and `docker-compose ps` — confirm all 6 services report healthy.
3. Write `scripts/build_bundle.sh`: `docker-compose build` all images, `docker save` each into
   `images/*.tar`, copy `docker-compose.yml` + a generated `.env.example` into `bundle/`, write an
   `install.sh` that does `docker load` + `docker-compose up -d`, tar the whole `bundle/` folder.

## What "Done" Looks Like

- `docker-compose up -d` from a clean clone brings up all 6 services.
- `./scripts/build_bundle.sh` produces a working `.tar.gz` — test it on a **second machine** if at
  all possible, since "works on my machine" is exactly the failure mode this bundle exists to prevent.

## Hands Off To

Sub-phase 4 builds the actual network/GPU monitoring that feeds into this running stack.
