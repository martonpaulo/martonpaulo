# GitHub Bio

## What it is

The GitHub profile of `martonpaulo`: GitHub shows this repository's `README.md` at the top of
[github.com/martonpaulo](https://github.com/martonpaulo).

## Who it is for

A recruiter, a client or a developer who opens the profile, often from a repository or a commit,
and wants to know in under a minute who Marton is and what he builds.

## What it does

- Says who Marton is, how he works and what he builds, and links to
  [martonpaulo.com](https://martonpaulo.com) for the current project list.
- Shows the stack as badges, and a card of his most used languages across his public repositories,
  in GitHub's light and dark themes.
- Keeps the card current with no third-party service: `.github/scripts/languages.mjs` reads the
  GitHub API and the weekly `Languages card` workflow commits the two SVGs.

## What it will never do

- List the projects: `martonpaulo.com` owns that list, so the two never disagree. Never, by the
  owner's choice.
- Call a third-party statistics service at view time: the hosted one it replaced started answering
  503 and left a broken image. Reopened only if GitHub itself offers the card.

## How you know it worked

The profile shows the README with the card in both themes, and the card's numbers match the last
`Languages card` run.

## Constraints

- GitHub fixes the repository name: a profile README comes only from the repository named as the
  account.
- GitHub's Markdown rendering is the only platform: no script, no custom style; images and
  `<picture>` only.

## Accepted evidence gaps

- Accessibility: no automated check reads the rendered profile. The evidence is the code, reviewed
  in each change: every image in `README.md` has an `alt` text, and each card SVG carries a
  `<title>` and a `<desc>` that list every language and its share.
