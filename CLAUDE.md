# Repo instructions

## Merging finished work to the default branch

This repo's default (integration) branch is
`claude/profile-site-implementation-lw4f1p`, not `main`. Treat it as
"main" wherever these instructions say so.

After completing a build/feature branch and confirming it builds
successfully (`npm run build` passes with no errors), merge the branch
into the default branch and push — **go ahead and do this automatically,
without asking for confirmation first.** Don't leave finished, verified
work stranded on a feature branch — the default branch should reflect the
latest working state once a task is done.

Steps:
1. Verify the build: `npm install && npm run build`.
2. If the build succeeds, merge the working branch into the default
   branch and push it. No need to ask first.
3. If the build fails, fix the issue on the working branch first — do
   not merge broken builds into the default branch.
