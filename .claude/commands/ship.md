# /ship - Full Deploy Pipeline

Run the complete commit-to-production pipeline sequentially. Do NOT skip steps. Do NOT proceed past a failed step - stop and report the failure.

## Step 1: Sync all branches

- Run `git fetch origin` to get latest remote state
- If on a feature branch: `git pull origin $(git branch --show-current)` (if remote tracking exists)
- Run `git stash` if there are uncommitted changes (note: restore after sync)
- Checkout `dev`, run `git pull origin dev`
- Checkout `main`, run `git pull origin main`
- Return to the original working branch
- Run `git stash pop` if you stashed earlier
- **Report any divergence** - if local was behind remote on any branch, say so explicitly

## Step 2: Pre-flight checks

- Run `git status` to see current branch and changes
- Run `npm run build` to verify the build passes
- If build fails, STOP and fix the issue before continuing
- If there are no changes to commit, skip to the appropriate step (push/PR)

## Step 3: Commit

- Stage all changed files (be specific - no `git add -A`)
- Review the diff and generate a clear commit message
- Commit with Co-Authored-By trailer

## Step 4: Feature branch handling (if on `feature/*`)

- Push the feature branch
- Create PR from feature branch to `dev` using `gh pr create --base dev --fill`
- Squash-merge the PR using `gh pr merge --squash --delete-branch`
- Switch to `dev` and pull: `git checkout dev && git pull origin dev`

## Step 5: Push dev

- Ensure you are on the `dev` branch
- Push `dev` to origin: `git push origin dev`

## Step 6: PR dev to main

- Create PR from `dev` to `main` using `gh pr create --base main --fill`
- Merge using regular merge (not squash) with `gh pr merge --merge`

## Step 7: Sync local after merge

This is critical. `gh pr merge` merges on GitHub (remote). Local refs are now stale.

- `git checkout main && git pull origin main`
- `git checkout dev && git pull origin dev` (picks up the merge commit)
- Verify: `git log --oneline main -3` should show the merge PR commit
- Verify: `git log --oneline origin/main -3` should match local main exactly
- If local and remote don't match, STOP and report the discrepancy

## Step 8: Final verification

- Run `git status` - should be clean, on `dev` branch
- Run `git log --oneline dev -1` and `git log --oneline main -1`
- Confirm dev and main are in sync (main's HEAD merge commit should contain dev's HEAD)
- Report: current branch, latest commit hash on both dev and main, deploy status
- Note: Cloudflare Pages auto-deploys from `main` - the site will be live within ~2 minutes

## Important

- Follow the project's git workflow: squash for feature-to-dev, regular merge for dev-to-main
- Never force push
- Never skip the build check
- Never skip the post-merge sync (Step 7) - this is what keeps local state accurate
- If any `gh` command fails (e.g., no changes between branches), report it clearly and stop
- `gh pr merge` operates on the REMOTE - always pull locally after any remote merge
