import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reviewPath = process.argv[2];
if (!reviewPath) throw new Error("usage: node scripts/import-pdf-review.mjs <review.json>");

const review = JSON.parse(await readFile(reviewPath, "utf8"));
if (review.format !== "zoma-pdf-review-v1") throw new Error(`unsupported review format: ${review.format}`);

const curatedPath = path.join(root, "data", "curated", "challenges.json");
const curatedRaw = await readFile(curatedPath, "utf8");
const curated = JSON.parse(curatedRaw);

const key = ([x, y, z]) => `${x},${y},${z}`;
function normalize(cubes) {
  const minimums = [0, 1, 2].map((axis) => Math.min(...cubes.map((cube) => cube[axis])));
  return cubes
    .map((cube) => cube.map((value, axis) => value - minimums[axis]))
    .sort((left, right) => key(left).localeCompare(key(right)));
}

// The review tool rotates around Three.js world Y. In challenge coordinates,
// that is a quarter turn around the vertical Z axis.
function applyReviewOrientation(cubes, quarterTurns) {
  let result = cubes.map((cube) => [...cube]);
  for (let turn = 0; turn < ((quarterTurns % 4) + 4) % 4; turn += 1) {
    result = result.map(([x, y, z]) => [-y, x, z]);
  }
  return normalize(result);
}

const approved = review.figures
  .filter((figure) => figure.decision === "approved")
  .map((figure) => {
    if (figure.target?.length !== 27) throw new Error(`${figure.id}: expected 27 cubes`);
    return {
      id: figure.id,
      names: figure.names,
      source: `hb3f:${review.source}#page=${figure.sourcePage}`,
      target: applyReviewOrientation(figure.target, figure.orientation?.quarterTurns ?? 0),
    };
  });

const existingIds = new Set(curated.map((challenge) => challenge.id));
const repeated = approved.filter((challenge) => existingIds.has(challenge.id));
if (repeated.length) throw new Error(`already imported: ${repeated.map((challenge) => challenge.id).join(", ")}`);

function serializeChallenge(challenge) {
  const cubeRows = [];
  for (let index = 0; index < challenge.target.length; index += 6) {
    cubeRows.push(`      ${challenge.target.slice(index, index + 6).map((cube) => JSON.stringify(cube)).join(", ")}`);
  }
  return [
    "  {",
    `    "id": ${JSON.stringify(challenge.id)},`,
    `    "names": ${JSON.stringify(challenge.names)},`,
    `    "source": ${JSON.stringify(challenge.source)},`,
    "    \"target\": [",
    cubeRows.join(",\n"),
    "    ]",
    "  }",
  ].join("\n");
}

const insertion = approved.map(serializeChallenge).join(",\n");
const withoutClosingBracket = curatedRaw.trimEnd().replace(/\]\s*$/, "").trimEnd();
await writeFile(curatedPath, `${withoutClosingBracket},\n${insertion}\n]\n`, "utf8");
console.log(`Imported ${approved.length} approved PDF figures; ignored ${review.figures.length - approved.length} rejected or pending figures.`);
