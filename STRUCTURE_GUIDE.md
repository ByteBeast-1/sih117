# Structure Guide — How to Actually Use This Repo

If you're new to the repo and need the quick practical version instead of the
full `README.md`. This is the "what do I do right now" file.

---

## 1. What to do now exactly?

1. Directly go to 6th subsection(prompt to antigravity) and start by pasting that prompt in antigravity and folllow the instructions of Antigravity from there.
2. Read `README.md` once, fully — it explains the product and the architecture to get a complete understanding.


## 2. Your Phase

You've been assigned one of:
- `phases/01-fullstack`
- `phases/02-agents-ai`
- `phases/03-devops-infra`

Open that folder's `README.md` first. It tells you the tech stack, what you're building, and
points you at Sub-Phase `01`. Work through sub-phases **in numeric order** — each one assumes
the previous one's files already exist.

## 3. Branching & PRs

```
main   ← always working, demo-ready only
  dev   ← where the 3 phases actually meet — you PR into here
    feature/<phase>-<yourname>   ← you work here
```

1. `git checkout dev && git pull`
2. `git checkout -b feature/<phase>-<yourname>` (e.g. `feature/agents-priya`)
3. Work through your sub-phases, committing as you finish each one.
4. When a sub-phase is done, open a PR into `dev` (even if your whole phase isn't finished yet —
   smaller, more frequent PRs are easier to review and merge than one giant one at the end).
5. Wait for GitHub Actions (automatic) and CodeRabbit (automatic) to finish checking the PR.
6. Once checks are green, whoever's doing the merge for that round merges it.

**Full first-time setup of GitHub Actions/CodeRabbit** (nobody's done this yet): see
`phases/03-devops-infra/05-cicd-coderabbit-github-actions/README.md` — it's a literal step-by-step,
done once, by one person, in the browser.

## 4. Testing Before You Open a PR

- Each sub-phase README tells you what "done" looks like for that piece specifically.
- At minimum: does it run on your own machine without errors, using mocks/stubs for anything
  outside your phase?
- If your change touches a `CONTRACTS.md` boundary, say so explicitly in the PR description and
  tag the other affected phase owner — don't let a contract change merge silently.

## 5. Contracts — the Light Version

There are only **two** contract boundaries in this project:
- `phases/01-fullstack/CONTRACTS.md` — what Full-Stack sends to / receives from Agents/AI
- `phases/02-agents-ai/CONTRACTS.md` — what Agents/AI sends to / receives from DevOps/Infra
  (plus the internal shapes between agents inside that phase)

**These are not fixed specs handed down before work starts.** The intended process:
1. The relevant two people have a quick conversation (5–15 min, not a formal meeting) about a
   feature before building it.
2. Whoever's building it writes down what was just decided as a JSON shape in the contract file —
   this takes a few minutes, it's transcribing a decision already made, not designing from scratch.
3. Build against that. If it turns out to be wrong once you're deeper into it, update the file in
   a small PR and ping the other person — don't just quietly change your actual code's shape and
   leave the file stale.

## 6. Feeding This Repo to Antigravity — The Common First Prompt

Use this as your opening prompt in Antigravity for **any** phase, adjusted only in the bracketed
parts. Paste it after attaching/pointing Antigravity at this repo (or the relevant phase folder):

```
I'm building [PHASE NAME, e.g. "the Agents & AI layer"] of a larger project. I've attached/shared
the full repo and have not started anything. Please:

1. Read README.md at the repo root fully first — that's the whole product's architecture and goal.
2. Read NON_NEGOTIABLES.md — these 4 rules override any suggestion you'd otherwise make. Follow
   them in every file you generate.
3. Read phases/[MY-PHASE-FOLDER]/README.md — this is specifically what I'm building.
4. Read phases/[MY-PHASE-FOLDER]/CONTRACTS.md — every request/response shape you generate must
   match this almost to keep our product running. Do not invent field names.
5. After reading all those, have told to create a branch or PR(look exactly) and guide me step-by-step for 1st proper setup completely, including prerequisites.
6. Then open phases/[MY-PHASE-FOLDER]/01-.../README.md — this is sub-phase 1. Read its goal,
   expected output files, and tech stack, then help me build exactly that, step by step, asking
   me before making assumptions I haven't specified.

Once sub-phase 1 is genuinely complete and matches its README's expected output, stop and tell me
so before moving to sub-phase 2 — don't build ahead on your own.

Work inside this repo's folder structure directly — new files belong under
phases/[MY-PHASE-FOLDER]/, not scattered elsewhere. (like in the branch not in main so they can check and merge)
```

Replace `[PHASE NAME]` and `[MY-PHASE-FOLDER]` with your actual assignment. Re-use this same
prompt shape when you move on to sub-phase 2, 3, etc. — just point it at the next folder.

## 7. When Everyone's Individually "Done"

1. Each person's final PR for their phase merges into `dev` after checks pass.
2. Whoever has the GPU-equipped laptop pulls the final `dev` branch.
3. Zip and re-feed the **whole merged repo** to that laptop's Antigravity session with a prompt
   like: *"This repo now has all 3 phases merged. Help me wire phases/01-fullstack to actually
   call phases/02-agents-ai per CONTRACTS.md, and phases/02-agents-ai to actually call
   phases/03-devops-infra per its CONTRACTS.md, replacing all mocks with real calls. Test each
   connection one at a time."*
4. Fix integration issues as they surface — this is normal, it's why you integrate early and
   often rather than only at the very end.
