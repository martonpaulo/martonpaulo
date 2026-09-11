// Draws the "most used languages" card for the profile README.
//
// It replaces github-readme-stats.vercel.app, whose public deployment was
// paused and started answering 503, which left a broken image on the profile.
// Nothing here calls a third-party service: the numbers come from the GitHub
// API through the `gh` CLI (its token comes from the environment in CI and from
// `gh auth` locally), and the output is two static SVGs committed to the repo.
//
// Run: node .github/scripts/languages.mjs

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const LOGIN = "martonpaulo";
const SHOWN = 6;
// Markup, styling and build glue: they measure how a project is packaged, not
// what it is written in. The old card hid the first four for the same reason.
const IGNORED = new Set(["HTML", "CSS", "SCSS", "Jupyter Notebook", "Makefile", "Shell"]);

const query = `query($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      nodes {
        languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

const response = JSON.parse(
  execFileSync("gh", ["api", "graphql", "-f", `query=${query}`, "-f", `login=${LOGIN}`], {
    encoding: "utf8",
  }),
);

const totals = new Map();
for (const repo of response.data.user.repositories.nodes) {
  for (const { size, node } of repo.languages.edges) {
    if (IGNORED.has(node.name)) continue;
    const entry = totals.get(node.name) ?? { name: node.name, color: node.color ?? "#8b949e", size: 0 };
    entry.size += size;
    totals.set(node.name, entry);
  }
}

const ranked = [...totals.values()].sort((a, b) => b.size - a.size);
const sum = ranked.reduce((total, language) => total + language.size, 0);
const withShare = ranked.map((language) => ({ ...language, share: (language.size / sum) * 100 }));

// A row per language worth a row; everything under 1% goes into one "Other"
// row, so the card never lists several lines that all read "<1%".
const named = withShare.filter((language) => language.share >= 1).slice(0, SHOWN - 1);
const restShare = 100 - named.reduce((total, language) => total + language.share, 0);
const languages =
  restShare > 0.05 ? [...named, { name: "Other", color: "#8b949e", share: restShare }] : named;

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Rounded for display only; the bar uses the exact shares so its segments
// always fill the width.
const percent = (share) => `${share.toFixed(1)}%`;

const THEMES = {
  light: { title: "#1f2328", text: "#59636e", track: "#eff2f5" },
  dark: { title: "#f0f6fc", text: "#9198a1", track: "#262c36" },
};

const WIDTH = 360;
const PAD = 20;
const BAR_Y = 48;
const BAR_H = 8;
const ROW_Y = 84;
const ROW_H = 26;
const COLUMN = (WIDTH - PAD * 2) / 2;
const rows = Math.ceil(languages.length / 2);
const HEIGHT = ROW_Y + (rows - 1) * ROW_H + PAD;

function card(theme) {
  const colors = THEMES[theme];
  let x = PAD;
  const inner = WIDTH - PAD * 2;
  const segments = languages
    .map((language) => {
      const width = (language.share / 100) * inner;
      const rect = `<rect x="${x.toFixed(2)}" y="${BAR_Y}" width="${width.toFixed(2)}" height="${BAR_H}" fill="${language.color}"/>`;
      x += width;
      return rect;
    })
    .join("");

  const items = languages
    .map((language, index) => {
      const cx = PAD + (index % 2) * COLUMN;
      const cy = ROW_Y + Math.floor(index / 2) * ROW_H;
      return (
        `<circle cx="${cx + 5}" cy="${cy - 4}" r="5" fill="${language.color}"/>` +
        `<text x="${cx + 16}" y="${cy}" class="name">${escape(language.name)}</text>` +
        `<text x="${cx + COLUMN - 12}" y="${cy}" class="share" text-anchor="end">${percent(language.share)}</text>`
      );
    })
    .join("");

  const label = languages.map((language) => `${language.name} ${percent(language.share)}`).join(", ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title desc">
<title id="title">Most used languages</title>
<desc id="desc">Share of code across public repositories: ${escape(label)}.</desc>
<style>
text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
.title { font-size: 15px; font-weight: 600; fill: ${colors.title}; }
.name { font-size: 12px; fill: ${colors.title}; }
.share { font-size: 12px; fill: ${colors.text}; font-variant-numeric: tabular-nums; }
</style>
<text x="${PAD}" y="30" class="title">Most used languages</text>
<clipPath id="bar"><rect x="${PAD}" y="${BAR_Y}" width="${inner}" height="${BAR_H}" rx="4"/></clipPath>
<rect x="${PAD}" y="${BAR_Y}" width="${inner}" height="${BAR_H}" rx="4" fill="${colors.track}"/>
<g clip-path="url(#bar)">${segments}</g>
${items}
</svg>
`;
}

mkdirSync("assets", { recursive: true });
for (const theme of Object.keys(THEMES)) {
  writeFileSync(`assets/languages-${theme}.svg`, card(theme));
}
console.log(languages.map((language) => `${language.name} ${percent(language.share)}`).join("\n"));
