# /ship - Full Deploy Pipeline

Run the complete commit-to-production pipeline sequentially. Do NOT skip steps. Do NOT proceed past a failed step - stop and report the failure.

## Step 1: Pre-flight checks

- Run `git status` to see current branch and changes
- Run `npm run build` to verify the build passes
- If build fails, STOP and fix the issue before continuing
- If there are no changes to commit, skip to the appropriate step (push/PR)

## Step 2: Commit

- Stage all changed files (be specific - no `git add -A`)
- Review the diff and generate a clear commit message
- Commit with Co-Authored-By trailer

## Step 3: Feature branch handling (if on `feature/*`)

- Push the feature branch
- Create PR from feature branch to `dev` using `gh pr create --base dev --fill`
- Squash-merge the PR using `gh pr merge --squash --delete-branch`
- Switch to `dev` and pull

## Step 4: Push dev

- Ensure you are on the `dev` branch
- Push `dev` to origin

## Step 5: PR dev to main

- Create PR from `dev` to `main` using `gh pr create --base main --fill`
- Merge using regular merge (not squash) with `gh pr merge --merge`

## Step 6: Verify

- Run `git log --oneline -3` on main to confirm the merge landed
- Report the final state: branch, latest commit hash, and deploy status
- Note: Cloudflare Pages auto-deploys from `main` - the site will be live within ~2 minutes

## Important

- Follow the project's git workflow: squash for feature-to-dev, regular merge for dev-to-main
- Never force push
- Never skip the build check
- If any `gh` command fails (e.g., no changes between branches), report it clearly and stop
