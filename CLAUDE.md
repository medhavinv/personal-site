# Repo instructions

## Merging finished work to main

After completing a build/feature branch and confirming it builds
successfully (`npm run build` passes with no errors), merge the branch
into `main` and push. Don't leave finished, verified work stranded on a
feature branch — main should reflect the latest working state once a
task is done.

Steps:
1. Verify the build: `npm install && npm run build`.
2. If the build succeeds, merge the working branch into `main` (or open
   a PR into `main` if the user's workflow requires review) and push
   `main`.
3. If the build fails, fix the issue on the working branch first — do
   not merge broken builds into `main`.
