import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(root, "data", "source", "yass");
const curatedChallengesPath = path.join(root, "data", "curated", "challenges.json");
const MAX_STORED_SOLUTIONS = 24;

const pieces = [
  { id: "c", cubes: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]] },
  { id: "p", cubes: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1]] },
  { id: "n", cubes: [[0, 0, 0], [-1, 0, 0], [-1, 1, 0], [0, 0, 1]] },
  { id: "z", cubes: [[0, 0, 0], [1, 1, 0], [0, 1, 0], [-1, 0, 0]] },
  { id: "t", cubes: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]] },
  { id: "l", cubes: [[0, 0, 0], [1, 1, 0], [1, 0, 0], [-1, 0, 0]] },
  { id: "3", cubes: [[0, 0, 0], [1, 0, 0], [0, 1, 0]] },
];

const curatedNames = new Map([
  ["cube.soma", { es: "Cubo clásico", en: "Classic cube" }],
  ["003_dog.soma", { es: "Perro escalonado", en: "Stepped dog" }],
  ["184_cantilevered_cross.soma", { es: "Cruz en voladizo", en: "Cantilevered cross" }],
  ["2Wb.soma", { es: "Doble W, variante B", en: "Double W, variant B" }],
  ["2Wc.soma", { es: "Doble W, variante C", en: "Double W, variant C" }],
  ["2x3x5_3holes.soma", { es: "Bloque de tres huecos", en: "Three-hole block" }],
  ["2x3x5_half_full_holes.soma", { es: "Bloque calado", en: "Pierced block" }],
  ["3_slide_wall.soma", { es: "Muro deslizante", en: "Sliding wall" }],
  ["3s_2s_wall.soma", { es: "Muro escalonado", en: "Stepped wall" }],
  ["3x3x3_wall_cpn.soma", { es: "Esquina amurallada", en: "Walled corner" }],
  ["3x4_3x5.soma", { es: "Marco cruzado", en: "Crossed frame" }],
  ["4x4_center_tower.soma", { es: "Torre central", en: "Center tower" }],
  ["4x4_corner_tower.soma", { es: "Torre de esquina", en: "Corner tower" }],
  ["5_seat_bench.soma", { es: "Banco de cinco asientos", en: "Five-seat bench" }],
  ["6x4_flat.soma", { es: "Plataforma 6 × 4", en: "6 × 4 platform" }],
  ["8x4_flat.soma", { es: "Plataforma 8 × 4", en: "8 × 4 platform" }],
  ["battleship.soma", { es: "Acorazado", en: "Battleship" }],
  ["alter.soma", { es: "Altar", en: "Altar" }],
  ["high_wall.soma", { es: "Muro alto", en: "High wall" }],
  ["arch.soma", { es: "Arco", en: "Arch" }],
  ["arch_high.soma", { es: "Arco elevado", en: "Raised arch" }],
  ["bench_2.soma", { es: "Banco", en: "Bench" }],
  ["bathtub.soma", { es: "Bañera", en: "Bathtub" }],
  ["bb26.soma", { es: "Bastión 26", en: "Bastion 26" }],
  ["bb28.soma", { es: "Bastión 28", en: "Bastion 28" }],
  ["bb59.soma", { es: "Bastión 59", en: "Bastion 59" }],
  ["big_3_w_pips.soma", { es: "Tres gigante", en: "Giant three" }],
  ["building.soma", { es: "Edificio", en: "Building" }],
  ["canal.soma", { es: "Canal", en: "Canal" }],
  ["flat_castle.soma", { es: "Castillo", en: "Castle" }],
  ["symmetric_castle.soma", { es: "Castillo simétrico", en: "Symmetric castle" }],
  ["church.soma", { es: "Iglesia", en: "Church" }],
  ["clip.soma", { es: "Sujetapapeles", en: "Paper clip" }],
  ["cornerstone.soma", { es: "Piedra angular", en: "Cornerstone" }],
  ["cross_preplaced.soma", { es: "Cruz elevada", en: "Raised cross" }],
  ["crystal.soma", { es: "Cristal", en: "Crystal" }],
  ["crystal_wall.soma", { es: "Muro de cristal", en: "Crystal wall" }],
  ["crystal_sticks.soma", { es: "Agujas de cristal", en: "Crystal spires" }],
  ["disassemblable_cube_joined.soma", { es: "Cubo articulado", en: "Articulated cube" }],
  ["double_tower_notch_cube.soma", { es: "Torres gemelas", en: "Twin towers" }],
  ["double_W.soma", { es: "Doble W", en: "Double W" }],
  ["apartment_building.soma", { es: "Edificio de apartamentos", en: "Apartment building" }],
  ["elephant.soma", { es: "Elefante", en: "Elephant" }],
  ["fat_t.soma", { es: "T robusta", en: "Heavy T" }],
  ["fish_wall.soma", { es: "Pez amurallado", en: "Walled fish" }],
  ["heliport_corner_corner.soma", { es: "Helipuerto esquinado", en: "Corner heliport" }],
  ["inverse_cross.soma", { es: "Cruz invertida", en: "Inverted cross" }],
  ["knot.soma", { es: "Nudo", en: "Knot" }],
  ["long_bed.soma", { es: "Cama larga", en: "Long bed" }],
  ["middle_notch.soma", { es: "Muesca central", en: "Center notch" }],
  ["odd_footing_wall.soma", { es: "Muro con contrafuerte", en: "Buttressed wall" }],
  ["p.soma", { es: "Letra P", en: "Letter P" }],
  ["paddlewheeler.soma", { es: "Barco de paletas", en: "Paddle steamer" }],
  ["duck.soma", { es: "Pato", en: "Duck" }],
  ["duck_monument.soma", { es: "Monumento al pato", en: "Duck monument" }],
  ["dog.soma", { es: "Perro", en: "Dog" }],
  ["flat_castle_4x6.soma", { es: "Castillo plano", en: "Flat castle" }],
  ["pyramid2.soma", { es: "Pirámide escalonada", en: "Stepped pyramid" }],
  ["tugboat.soma", { es: "Remolcador", en: "Tugboat" }],
  ["scorpion.soma", { es: "Escorpión", en: "Scorpion" }],
  ["snake.soma", { es: "Serpiente", en: "Snake" }],
  ["shell_game.soma", { es: "Juego de cubiletes", en: "Shell game" }],
  ["shower_box_ud.soma", { es: "Cabina de ducha", en: "Shower stall" }],
  ["chair.soma", { es: "Silla", en: "Chair" }],
  ["funky_chair.soma", { es: "Sillón", en: "Armchair" }],
  ["symmetric_front_back.soma", { es: "Fachada simétrica", en: "Symmetric facade" }],
  ["skyscraper.soma", { es: "Rascacielos", en: "Skyscraper" }],
  ["soma100.soma", { es: "Monolito", en: "Monolith" }],
  ["soma169.soma", { es: "Pórtico", en: "Gateway" }],
  ["soma169_taller.soma", { es: "Aguja", en: "Spire" }],
  ["spinner_wall.soma", { es: "Muro giratorio", en: "Spinner wall" }],
  ["swivel_pin.soma", { es: "Pivote", en: "Swivel pin" }],
  ["throne.soma", { es: "Trono", en: "Throne" }],
  ["tower.soma", { es: "Torre", en: "Tower" }],
  ["track.soma", { es: "Riel", en: "Track" }],
  ["trefoil.soma", { es: "Trébol", en: "Trefoil" }],
  ["tunnel.soma", { es: "Túnel", en: "Tunnel" }],
  ["joined_2_5_tower.soma", { es: "Torres unidas", en: "Joined towers" }],
  ["walls_wells_2_001.soma", { es: "Muros y pozos", en: "Walls and wells" }],
  ["well.soma", { es: "Pozo", en: "Well" }],
  ["well_5.soma", { es: "Pozo escalonado", en: "Stepped well" }],
]);

const preferredOrderFiles = [
  "cube.soma", "dog.soma", "chair.soma", "duck.soma", "battleship.soma",
  "tower.soma", "bench_2.soma", "funky_chair.soma", "flat_castle.soma", "symmetric_castle.soma",
];
const preferredOrder = new Map(preferredOrderFiles.map((filename, index) => [filename, index]));

const translatedWords = new Map(Object.entries({
  apartment: "edificio", arch: "arco", base: "base", bed: "cama",
  bench: "banco", boat: "barco", bridge: "puente", castle: "castillo",
  chair: "silla", corner: "esquina", cross: "cruz", cube: "cubo",
  dog: "perro", duck: "pato", flat: "plano", fortress: "fortaleza",
  high: "alto", hole: "hueco", house: "casa", joined: "unido",
  long: "largo", low: "bajo", monument: "monumento", notch: "muesca",
  pin: "aguja", pyramid: "pirámide", seat: "asiento", snake: "serpiente",
  stairs: "escaleras", symmetric: "simétrico", table: "mesa", tower: "torre",
  tugboat: "remolcador", wall: "muro",
}));

const excludedFilename = /(bad|api_test|good_tab)/i;
const key = ([x, y, z]) => `${x},${y},${z}`;

// YASS diagrams do not use one consistent "up" axis. These source-specific
// rotations preserve the exact geometry while presenting each object in its
// intended, physically coherent resting orientation.
const orientationOverrides = new Map([
  ["003_dog.soma", ([x, y, z]) => [-y, x, z]],
  ["arch.soma", ([x, y, z]) => [-x, z, y]],
  ["arch_high.soma", ([x, y, z]) => [-x, z, y]],
  ["dog.soma", ([x, y, z]) => [-x, -y, z]],
  ["tower.soma", ([x, y, z]) => [z, -y, x]],
  ["snake.soma", ([x, y, z]) => [-y, -x, -z]],
  ["joined_2_5_tower.soma", ([x, y, z]) => [-y, z, -x]],
  ["3x3x3_wall_cpn.soma", ([x, y, z]) => [-x, y, -z]],
  ["4x4_center_tower.soma", ([x, y, z]) => [-x, y, -z]],
  ["4x4_corner_tower.soma", ([x, y, z]) => [-x, y, -z]],
  ["5_seat_bench.soma", ([x, y, z]) => [x, y, -z]],
  ["6x4_flat.soma", ([x, y, z]) => [-x, y, -z]],
  ["apartment_building.soma", ([x, y, z]) => [-x, y, -z]],
  ["big_3_w_pips.soma", ([x, y, z]) => [x, -y, -z]],
  ["disassemblable_cube_joined.soma", ([x, y, z]) => [-x, y, -z]],
  ["shell_game.soma", ([x, y, z]) => [-x, y, -z]],
  ["soma100.soma", ([x, y, z]) => [-x, y, -z]],
  ["symmetric_front_back.soma", ([x, y, z]) => [-x, y, -z]],
  ["walls_wells_2_001.soma", ([x, y, z]) => [-x, y, -z]],
]);

function permutations(values) {
  return [
    [values[0], values[1], values[2]], [values[0], values[2], values[1]],
    [values[1], values[0], values[2]], [values[1], values[2], values[0]],
    [values[2], values[0], values[1]], [values[2], values[1], values[0]],
  ];
}

function parity(order) {
  let inversions = 0;
  for (let i = 0; i < order.length; i += 1) {
    for (let j = i + 1; j < order.length; j += 1) {
      if (order[i] > order[j]) inversions += 1;
    }
  }
  return inversions % 2 === 0 ? 1 : -1;
}

function makeRotations() {
  const result = [];
  for (const order of permutations([0, 1, 2])) {
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      if (parity(order) * sx * sy * sz !== 1) continue;
      result.push((point) => [point[order[0]] * sx, point[order[1]] * sy, point[order[2]] * sz]);
    }
  }
  return result;
}

const rotations = makeRotations();

function normalized(cubes) {
  if (cubes.length === 0) return [];
  const mins = [0, 1, 2].map((axis) => Math.min(...cubes.map((cube) => cube[axis])));
  return cubes
    .map((cube) => cube.map((value, axis) => value - mins[axis]))
    .sort((a, b) => key(a).localeCompare(key(b)));
}

function canonicalSignature(cubes) {
  return rotations
    .map((rotate) => normalized(cubes.map(rotate)).map(key).join("|"))
    .sort()[0];
}

const orientations = pieces.map((piece) => {
  const unique = new Map();
  for (const rotate of rotations) {
    const cubes = normalized(piece.cubes.map(rotate));
    unique.set(cubes.map(key).join("|"), cubes);
  }
  return [...unique.values()];
});

function parseFigure(raw) {
  const withoutComments = raw
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, "").trimEnd())
    .join("\n")
    .trim();
  const layers = withoutComments.split(/\n\s*\n/);
  const cells = [];
  layers.forEach((layer, z) => {
    layer.split("\n").forEach((row, rowIndex) => {
      [...row].forEach((character, x) => {
        if (character !== "." && !/\s/.test(character)) cells.push([x, -rowIndex, z]);
      });
    });
  });
  return normalized(cells);
}

function isFaceConnected(cubes) {
  if (cubes.length === 0) return false;
  const available = new Set(cubes.map(key));
  const visited = new Set([key(cubes[0])]);
  const queue = [cubes[0]];

  while (queue.length) {
    const cube = queue.pop();
    for (let axis = 0; axis < 3; axis += 1) {
      for (const direction of [-1, 1]) {
        const neighbor = [...cube];
        neighbor[axis] += direction;
        const neighborKey = key(neighbor);
        if (available.has(neighborKey) && !visited.has(neighborKey)) {
          visited.add(neighborKey);
          queue.push(neighbor);
        }
      }
    }
  }

  return visited.size === cubes.length;
}

function targetSymmetryMappings(target, targetIndex) {
  const targetKeys = new Set(target.map(key));
  const mappings = new Map();

  for (const rotate of rotations) {
    const rotated = target.map(rotate);
    const mins = [0, 1, 2].map((axis) => Math.min(...rotated.map((cube) => cube[axis])));
    const transformed = rotated.map((cube) => cube.map((value, axis) => value - mins[axis]));
    if (!transformed.every((cube) => targetKeys.has(key(cube)))) continue;
    const mapping = transformed.map((cube) => targetIndex.get(key(cube)));
    mappings.set(mapping.join(","), mapping);
  }

  return [...mappings.values()];
}

function assignmentDistance(left, right) {
  let distance = 0;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) distance += 1;
  }
  return distance;
}

function selectDiverseSolutions(allSolutions, limit = MAX_STORED_SOLUTIONS) {
  if (allSolutions.length <= limit) return allSolutions;

  const selectedIndices = [0];
  const selected = new Set(selectedIndices);
  const minimumDistances = allSolutions.map((solution) => assignmentDistance(solution, allSolutions[0]));

  while (selectedIndices.length < limit) {
    let bestIndex = -1;
    let bestDistance = -1;
    for (let index = 0; index < allSolutions.length; index += 1) {
      if (selected.has(index)) continue;
      if (minimumDistances[index] > bestDistance) {
        bestIndex = index;
        bestDistance = minimumDistances[index];
      }
    }

    selected.add(bestIndex);
    selectedIndices.push(bestIndex);
    const newest = allSolutions[bestIndex];
    for (let index = 0; index < allSolutions.length; index += 1) {
      if (selected.has(index)) continue;
      minimumDistances[index] = Math.min(
        minimumDistances[index],
        assignmentDistance(allSolutions[index], newest),
      );
    }
  }

  return selectedIndices.map((index) => allSolutions[index]);
}

function solve(target, { maxSolutions = Number.POSITIVE_INFINITY, maxNodes = Number.POSITIVE_INFINITY, dedupeSymmetry = true } = {}) {
  if (target.length !== 27) throw new Error(`expected 27 cubes, found ${target.length}`);
  const targetIndex = new Map(target.map((cube, index) => [key(cube), index]));
  const symmetryMappings = targetSymmetryMappings(target, targetIndex);
  const placements = [];

  orientations.forEach((pieceOrientations, pieceIndex) => {
    const seen = new Set();
    for (const orientation of pieceOrientations) {
      for (const targetCube of target) {
        for (const anchor of orientation) {
          const offset = targetCube.map((value, axis) => value - anchor[axis]);
          const cubes = orientation.map((cube) => cube.map((value, axis) => value + offset[axis]));
          const indices = cubes.map((cube) => targetIndex.get(key(cube)));
          if (indices.some((index) => index === undefined)) continue;
          indices.sort((a, b) => a - b);
          const signature = `${pieceIndex}:${indices.join(",")}`;
          if (seen.has(signature)) continue;
          seen.add(signature);
          placements.push({
            pieceIndex,
            indices,
            mask: indices.reduce((mask, index) => mask | (1n << BigInt(index)), 0n),
          });
        }
      }
    }
  });

  const byCell = Array.from({ length: target.length }, () => []);
  placements.forEach((placement) => placement.indices.forEach((index) => byCell[index].push(placement)));

  const storedSolutions = [];
  const solutionSignatures = new Set();
  let solutionCount = 0;
  let rawSolutionCount = 0;
  let nodes = 0;
  let truncated = false;

  function solutionSignature(selected) {
    const assignment = Array(target.length);
    for (const placement of selected) {
      const pieceId = pieces[placement.pieceIndex].id;
      placement.indices.forEach((index) => { assignment[index] = pieceId; });
    }
    if (!dedupeSymmetry) return assignment.join("");
    return symmetryMappings
      .map((mapping) => {
        const transformed = Array(target.length);
        mapping.forEach((targetPosition, sourcePosition) => {
          transformed[targetPosition] = assignment[sourcePosition];
        });
        return transformed.join("");
      })
      .sort()[0];
  }

  function search(occupied = 0n, used = 0, selected = []) {
    if (solutionCount >= maxSolutions || truncated) return;
    nodes += 1;
    if (nodes > maxNodes) {
      truncated = true;
      return;
    }
    if (selected.length === pieces.length) {
      rawSolutionCount += 1;
      const signature = solutionSignature(selected);
      if (solutionSignatures.has(signature)) return;
      solutionSignatures.add(signature);
      solutionCount += 1;
      storedSolutions.push([...selected]);
      return;
    }

    let candidates = null;
    for (let index = 0; index < target.length; index += 1) {
      if ((occupied & (1n << BigInt(index))) !== 0n) continue;
      const available = byCell[index].filter((placement) =>
        (used & (1 << placement.pieceIndex)) === 0 && (occupied & placement.mask) === 0n);
      if (available.length === 0) return;
      if (!candidates || available.length < candidates.length) candidates = available;
    }

    for (const placement of candidates) {
      search(
        occupied | placement.mask,
        used | (1 << placement.pieceIndex),
        [...selected, placement],
      );
      if (solutionCount >= maxSolutions || truncated) return;
    }
  }

  search();
  if (storedSolutions.length === 0) throw new Error(truncated ? "solver limit reached" : "no solution found");

  const allSolutions = storedSolutions.map((selected) => {
    const assignment = Array(target.length);
    selected.forEach((placement) => {
      const pieceId = pieces[placement.pieceIndex].id;
      placement.indices.forEach((index) => { assignment[index] = pieceId; });
    });
    return assignment.join("");
  });
  const solutions = selectDiverseSolutions(allSolutions);

  const firstSolution = pieces.map((piece) => ({
    id: piece.id,
    cubes: target.filter((_, index) => solutions[0][index] === piece.id),
  }));

  const contacts = adjacencyCount(target);
  const dimensions = [0, 1, 2].map((axis) => Math.max(...target.map((cube) => cube[axis])) + 1);
  const volume = dimensions.reduce((product, value) => product * value, 1);
  const fillRatio = target.length / volume;
  const surfaceArea = target.length * 6 - contacts * 2;
  const symmetryCount = symmetryMappings.length;
  const geometricDifficulty = Math.log2(24 / symmetryCount) * 1.8
    + (1 - fillRatio) * 3
    + Math.max(0, surfaceArea - 54) * 0.05;
  const score = Math.log2(placements.length + 1) * 0.4
    - Math.log2(solutionCount + 1) * 0.3
    + geometricDifficulty;

  return {
    solution: firstSolution,
    solutions,
    metrics: {
      nodes,
      placements: placements.length,
      solutions: solutionCount,
      storedSolutions: solutions.length,
      rawSolutions: rawSolutionCount,
      symmetries: symmetryCount,
      fillRatio: Number(fillRatio.toFixed(3)),
      surfaceArea,
      truncated,
      score: Number(score.toFixed(3)),
    },
  };
}

function adjacencyCount(cubes) {
  const cubeKeys = new Set(cubes.map(key));
  let contacts = 0;
  for (const cube of cubes) {
    for (const direction of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
      const neighbor = cube.map((value, axis) => value + direction[axis]);
      if (cubeKeys.has(key(neighbor))) contacts += 1;
    }
  }
  return contacts;
}

function titleFromFilename(filename) {
  const base = path.basename(filename, ".soma").replace(/[-_]+/g, " ");
  const translated = base.split(" ").map((word) => translatedWords.get(word.toLowerCase()) ?? word);
  const title = translated.join(" ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return title.replace(/\bX\b/g, "×");
}

function slugFromFilename(filename) {
  return path.basename(filename, ".soma")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const sourceFiles = (await readdir(sourceDirectory))
  .filter((filename) => filename.endsWith(".soma") && !excludedFilename.test(filename))
  .sort((a, b) => {
    const rankA = preferredOrder.get(a) ?? Number.POSITIVE_INFINITY;
    const rankB = preferredOrder.get(b) ?? Number.POSITIVE_INFINITY;
    if (rankA !== rankB) return rankA - rankB;
    return a.localeCompare(b);
  });

const challenges = [];
const seenShapes = new Set();
const skipped = [];

for (const filename of sourceFiles) {
  try {
    const parsedTarget = parseFigure(await readFile(path.join(sourceDirectory, filename), "utf8"));
    const orient = orientationOverrides.get(filename);
    const target = orient ? normalized(parsedTarget.map(orient)) : parsedTarget;
    if (!isFaceConnected(target)) throw new Error("disconnected shape");
    const signature = canonicalSignature(target);
    if (seenShapes.has(signature)) {
      skipped.push(`${filename}: duplicate`);
      continue;
    }
    const { solution, solutions, metrics } = solve(target);
    const names = curatedNames.get(filename) ?? {
      es: titleFromFilename(filename),
      en: titleFromFilename(filename),
    };
    seenShapes.add(signature);
    challenges.push({
      id: slugFromFilename(filename),
      name: names.es,
      names,
      source: filename,
      target,
      solution,
      solutions,
      metrics,
    });
  } catch (error) {
    skipped.push(`${filename}: ${error.message}`);
  }
}

const curatedChallenges = JSON.parse(await readFile(curatedChallengesPath, "utf8"));
for (const curated of curatedChallenges) {
  const target = normalized(curated.target);
  if (target.length !== 27) throw new Error(`${curated.id}: expected 27 cubes, found ${target.length}`);
  if (!isFaceConnected(target)) throw new Error(`${curated.id}: disconnected shape`);
  const signature = canonicalSignature(target);
  if (seenShapes.has(signature)) throw new Error(`${curated.id}: duplicate geometry`);
  const { solution, solutions, metrics } = solve(target);
  seenShapes.add(signature);
  challenges.push({
    id: curated.id,
    name: curated.names.es,
    names: curated.names,
    source: curated.source,
    origin: "curated",
    target,
    solution,
    solutions,
    metrics,
  });
}

const rankedChallenges = [...challenges].sort((a, b) => a.metrics.score - b.metrics.score);
rankedChallenges.forEach((challenge, index) => {
  const percentile = index / Math.max(1, rankedChallenges.length - 1);
  challenge.difficulty = percentile < 0.34 ? "easy" : percentile < 0.68 ? "medium" : "hard";
});

challenges.sort((a, b) => {
  if (a.source === "cube.soma") return -1;
  if (b.source === "cube.soma") return 1;
  return a.name.localeCompare(b.name, "es");
});

const outputDirectory = path.join(root, "src", "data");
await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "challenges.json"),
  `${JSON.stringify(challenges, null, 2)}\n`,
  "utf8",
);

const difficultyCounts = Object.groupBy(challenges, (challenge) => challenge.difficulty);
console.log(`Wrote ${challenges.length} verified, rotation-unique challenges`);
console.log(`Easy: ${difficultyCounts.easy?.length ?? 0}, medium: ${difficultyCounts.medium?.length ?? 0}, hard: ${difficultyCounts.hard?.length ?? 0}`);
console.log(`Skipped ${skipped.length} invalid, unsolved, excluded, or duplicate source files`);
console.log(`Stored ${challenges.reduce((total, challenge) => total + challenge.solutions.length, 0)} diverse solutions (maximum ${MAX_STORED_SOLUTIONS} per challenge)`);
