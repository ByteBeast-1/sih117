# Sub-Phase 5 — CI/CD: CodeRabbit + GitHub Actions, From Zero

## Goal

Set up the two automated systems that check every PR before it merges. This is written for
someone who has genuinely never done this before — follow it top to bottom, once, and it's done
for the whole team, permanently.

## The Core Thing to Understand First

**Neither of these runs on anyone's laptop.** GitHub Actions runs on GitHub's own cloud servers.
CodeRabbit is a hosted service you connect to your repo. You do this once, in a browser, and it
works for every future PR automatically — nobody installs anything for this specific purpose.

They also do genuinely different jobs:
- **CodeRabbit** — an AI that reads every PR's diff and leaves review comments (bugs, style,
  security smells). Advisory — doesn't block merging by default.
- **GitHub Actions** — runs real automated tests/checks in the cloud and reports pass/fail. This
  is what you configure to actually **block** a bad merge.

## Step 1 — Push This Repo to GitHub (if not already done)

```bash
cd sih-workbench
git init
git add .
git commit -m "Initial repo structure"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
git checkout -b dev
git push -u origin dev
```

## Step 2 — Connect CodeRabbit (5 minutes, browser only)

1. Go to https://coderabbit.ai, click "Sign in with GitHub."
2. Authorize it, then click "Add repository" and select this repo.
3. That's it — CodeRabbit is now watching every future PR automatically.
4. Optional: this repo already includes `.github/.coderabbit.yaml` with sensible defaults
   (ignores `.md` files, focuses extra attention on security-sensitive folders like the sandbox
   service) — CodeRabbit will pick this up automatically, no action needed.

## Step 3 — The GitHub Actions Workflow Files (already written for you)

This repo already includes:
- `.github/workflows/contract-tests.yml` — runs `pytest` against each phase's contract tests
- `.github/workflows/lint-and-test.yml` — runs linters + unit tests per phase

You don't need to write these from scratch — just make sure each phase actually has a
`tests/contract/` folder with real tests as you build, or these workflows will run and (correctly)
report "no tests found," which isn't a failure but isn't useful either. Add real contract tests
as each sub-phase's endpoints get built.

## Step 4 — Turn On Branch Protection (this is what makes checks actually BLOCK a merge)

1. On GitHub, go to your repo → **Settings** → **Branches**.
2. Click **Add branch protection rule**.
3. Branch name pattern: `dev`
4. Check **"Require status checks to pass before merging."**
5. In the search box that appears, select `contract-tests` and `lint-and-test` (these names come
   from the `name:` field at the top of each workflow file — they'll show up in this list once
   the workflows have run at least once, so do one small test PR first if the list is empty).
6. Save.

**Result:** from now on, the green "Merge pull request" button on GitHub is greyed out until both
checks pass. This is the actual mechanical gate — nobody can merge broken code by accident anymore.

## Step 5 — Verify It Actually Works

1. Make a trivial change on a test branch (e.g. add a comment to any file).
2. Open a PR into `dev`.
3. Within a minute or two, you should see on the PR page:
   - Two check marks (or an ✗ if something's wrong) for `contract-tests` and `lint-and-test`
   - A comment from the CodeRabbit bot
4. Confirm the Merge button is disabled until both checks show green.
5. Delete the test branch once confirmed.

## What "Done" Looks Like

- [ ] CodeRabbit is connected and commented on at least one real PR
- [ ] Both GitHub Actions workflows have run at least once and show up as selectable required checks
- [ ] Branch protection on `dev` is active and confirmed to actually block merging on a red check
- [ ] All 3 team members know: open PR → wait for checks + CodeRabbit → green means mergeable

## This Is the Last DevOps/Infra Sub-Phase

Everything from here is normal ongoing work — keeping the Compose stack, sandbox service, and CI
green as the other two phases' real code lands.
