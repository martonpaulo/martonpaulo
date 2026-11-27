# Contributing to GitHub Bio

This repository is the GitHub profile of `martonpaulo`: GitHub shows its `README.md` on
[github.com/martonpaulo](https://github.com/martonpaulo). It holds that README, the languages card
it shows, and the script and workflow that redraw the card each week.

Read [AGENTS.md](AGENTS.md) first. It is the working agreement for this repository, for people and
coding agents alike.

## Reporting a problem

Open an issue with what you saw, what you expected, and where: the browser or app, and whether
GitHub showed its light or dark theme.

## Proposing a change

The profile text is personal, so open an issue before a pull request that changes its wording.

## Commits and pull requests

- [Conventional Commits](https://www.conventionalcommits.org), in English: `docs:`, `fix:`, `ci:`,
  `chore:`.
- When the commit belongs to an issue, end the subject with its number, never the pull request's.
- Merges keep every commit: `gh pr merge <number> --merge --delete-branch`.

## Running the checks locally

```bash
make validate
```

It runs the same checks as [`.github/workflows/validate.yml`](.github/workflows/validate.yml): the
text check, the issue-link check and the DRY gate.

To redraw the languages card by hand, with the GitHub CLI signed in:

```bash
node .github/scripts/languages.mjs
```

## Conduct

Be decent and assume good faith; harassment or personal attacks are not welcome here.
