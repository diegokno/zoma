import * as THREE from "three";
import noSleepMedia from "nosleep.js/src/media.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  Check, ChevronDown, ChevronLeft, ChevronRight, Coffee, Ellipsis, Flag, History, Languages, Maximize2, Minimize2, Pause, Play, RefreshCw, RotateCcw, Search,
  Shuffle, Sparkles, TimerReset, Trash2, Trophy, Undo2, X, createElement,
} from "lucide";
import challenges from "./data/challenges.json";
import release from "./release.js";
import "./styles.css";

const isKofiTheme = document.body.classList.contains("kofi-theme");
const isKofiColorStudy = document.body.classList.contains("kofi-color-study-v2");
const isMercuryTheme = document.body.classList.contains("mercury-theme");
const colors = isMercuryTheme ? {
  c: "#3f72ff",
  p: "#7d70a8",
  n: "#a4746e",
  z: "#b59758",
  t: "#628b9a",
  l: "#6f8b72",
  3: "#a86666",
} : isKofiColorStudy ? {
  c: "#698f92",
  p: "#9a7ca4",
  n: "#c47b69",
  z: "#d2a64d",
  t: "#7fa1b5",
  l: "#7f986d",
  3: "#d5625d",
} : isKofiTheme ? {
  c: "#82918d",
  p: "#a47f98",
  n: "#c98167",
  z: "#d4aa55",
  t: "#72aaa1",
  l: "#7f976f",
  3: "#df665b",
} : {
  c: "oklch(0.6 0.19 255)",
  p: "oklch(0.61 0.17 320)",
  n: "oklch(0.72 0.16 68)",
  z: "oklch(0.82 0.15 95)",
  t: "oklch(0.72 0.13 220)",
  l: "oklch(0.65 0.14 150)",
  3: "oklch(0.62 0.19 28)",
};

const pieceNames = {
  es: { c: "C", p: "P positiva", n: "P negativa", z: "Z", t: "T", l: "L", 3: "V" },
  en: { c: "C", p: "Positive P", n: "Negative P", z: "Z", t: "T", l: "L", 3: "V" },
};

const pieceShapes = {
  c: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
  p: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1]],
  n: [[0, 0, 0], [-1, 0, 0], [-1, 1, 0], [0, 0, 1]],
  z: [[0, 0, 0], [1, 1, 0], [0, 1, 0], [-1, 0, 0]],
  t: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]],
  l: [[0, 0, 0], [1, 1, 0], [1, 0, 0], [-1, 0, 0]],
  3: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
};

const LAST_CHALLENGE_KEY = "soma:last-challenge";
const PROGRESS_KEY = "soma:progress";
const LANGUAGE_KEY = "soma:language";
const RELEASE_SEEN_KEY = "soma:release-seen";
const UPDATE_DEFERRED_KEY = "soma:update-deferred";
const LIBRARY_SEEN_RELEASE_KEY = "soma:library-seen-release";
const wasReturningUser = hasStoredAppState();
const translations = {
  es: {
    pageTitle: "Zoma",
    pageDescription: "Retos tridimensionales exactos para el cubo Soma.",
    openLibrary: "Abrir biblioteca",
    library: "Biblioteca",
    completedProgress: (done, total) => `${done} de ${total} completadas`,
    closeLibrary: "Cerrar biblioteca",
    search: "Buscar figuras",
    searchPlaceholder: "Buscar una figura",
    noMatches: "No hay figuras con ese nombre.",
    storageNote: "El progreso y los récords se guardan solo en este dispositivo.",
    language: "Idioma",
    spanish: "Español",
    english: "English",
    supportOnKofi: "Apóyame en Ko-fi",
    clearProgress: "Borrar progreso",
    confirmClear: "Confirmar borrado",
    clearProgressTitle: "¿Borrar todo el progreso?",
    clearProgressDescription: "Las figuras completadas y los récords se guardan únicamente en este dispositivo. Esta acción los eliminará de forma permanente.",
    cancel: "Cancelar",
    deleteProgress: "Borrar progreso",
    scene: "Figura tridimensional interactiva",
    resetView: "Restablecer vista y selección",
    difficulty: "Dificultad",
    difficultyOptions: { all: "Todas", easy: "Fácil", medium: "Media", hard: "Difícil" },
    challengeCount: (current, total) => `Reto ${current} / ${total}`,
    challengeDifficulty: (value) => `Dificultad ${value.toLowerCase()}`,
    cubes: "27 cubos",
    timer: "Cronómetro",
    noRecord: "Sin registro",
    completed: "Completada",
    record: (time) => `Récord ${time}`,
    newRecord: (time) => `Nuevo récord ${time}`,
    startTimer: "Iniciar cronómetro",
    pauseTimer: "Pausar cronómetro",
    resetTimer: "Reiniciar cronómetro",
    markDone: "Marcar figura como hecha",
    unmarkDone: "Quitar marca de completada",
    finishSave: "Finalizar y guardar tiempo",
    done: "Hecho",
    finishShort: "Finalizar",
    challengeMode: "Reto",
    solutionMode: "Solución",
    displayMode: "Modo de visualización",
    solutionPieces: "Piezas de la solución",
    highlightPiece: (name) => `Destacar pieza ${name}`,
    piece: (name) => `Pieza ${name}`,
    previousChallenge: "Reto anterior",
    nextChallenge: "Reto siguiente",
    random: "Aleatorio",
    previousSolution: "Solución anterior",
    nextSolution: "Solución siguiente",
    solutionPosition: (current, total) => `Solución ${current} de ${total}`,
    keepAwake: "Mantener pantalla encendida",
    allowSleep: "Dejar que la pantalla se apague",
    screenOn: "Pantalla encendida",
    keepOnShort: "Mantener encendida",
    alwaysOn: "Always On",
    enterFullscreen: "Ver figura a pantalla completa",
    exitFullscreen: "Salir de pantalla completa",
    fullscreenControls: "Controles de pantalla completa",
    openChallenge: (name) => `Abrir ${name}`,
    challengeCard: (number, status) => `Reto ${number} · ${status}`,
    challengeCardSimple: (number) => `Reto ${number}`,
    challengeHistory: "Historial del reto",
    moreOptions: "Más opciones",
    viewRecords: "Ver récords",
    markAsDone: "Marcar como hecho",
    markNotDone: "Marcar como no hecho",
    recordsTitle: (name) => `Récords de ${name}`,
    noRecords: "No hay tiempos guardados todavía.",
    closeRecords: "Cerrar récords",
    deleteRecord: "Eliminar este registro",
    bestRecord: "Mejor tiempo",
    today: "Hoy",
    yesterday: "Ayer",
    updateAvailable: "Actualización disponible",
    updateDescription: "Hay una versión nueva de Zoma lista para instalar.",
    updateNow: "Actualizar",
    updateLater: "Más tarde",
    updateDone: "Entendido",
    tryNewChallenge: "Probar un reto nuevo",
    closeUpdate: "Cerrar aviso",
  },
  en: {
    pageTitle: "Zoma",
    pageDescription: "Precise three-dimensional challenges for the Soma cube.",
    openLibrary: "Open library",
    library: "Library",
    completedProgress: (done, total) => `${done} of ${total} completed`,
    closeLibrary: "Close library",
    search: "Search shapes",
    searchPlaceholder: "Search for a shape",
    noMatches: "No shapes match that name.",
    storageNote: "Progress and records are stored only on this device.",
    language: "Language",
    spanish: "Español",
    english: "English",
    supportOnKofi: "Support on Ko-fi",
    clearProgress: "Clear progress",
    confirmClear: "Confirm deletion",
    clearProgressTitle: "Clear all progress?",
    clearProgressDescription: "Completed shapes and records are stored only on this device. This action will permanently remove them.",
    cancel: "Cancel",
    deleteProgress: "Clear progress",
    scene: "Interactive three-dimensional shape",
    resetView: "Reset view and selection",
    difficulty: "Difficulty",
    difficultyOptions: { all: "All", easy: "Easy", medium: "Medium", hard: "Hard" },
    challengeCount: (current, total) => `Challenge ${current} / ${total}`,
    challengeDifficulty: (value) => `${value} difficulty`,
    cubes: "27 cubes",
    timer: "Timer",
    noRecord: "No record",
    completed: "Completed",
    record: (time) => `Record ${time}`,
    newRecord: (time) => `New record ${time}`,
    startTimer: "Start timer",
    pauseTimer: "Pause timer",
    resetTimer: "Reset timer",
    markDone: "Mark shape as done",
    unmarkDone: "Remove completed mark",
    finishSave: "Finish and save time",
    done: "Done",
    finishShort: "Finish",
    challengeMode: "Challenge",
    solutionMode: "Solution",
    displayMode: "Display mode",
    solutionPieces: "Solution pieces",
    highlightPiece: (name) => `Highlight ${name} piece`,
    piece: (name) => `${name} piece`,
    previousChallenge: "Previous challenge",
    nextChallenge: "Next challenge",
    random: "Random",
    previousSolution: "Previous solution",
    nextSolution: "Next solution",
    solutionPosition: (current, total) => `Solution ${current} of ${total}`,
    keepAwake: "Keep screen awake",
    allowSleep: "Allow screen to sleep",
    screenOn: "Screen awake",
    keepOnShort: "Keep awake",
    alwaysOn: "Always On",
    enterFullscreen: "View shape fullscreen",
    exitFullscreen: "Exit fullscreen",
    fullscreenControls: "Fullscreen controls",
    openChallenge: (name) => `Open ${name}`,
    challengeCard: (number, status) => `Challenge ${number} · ${status}`,
    challengeCardSimple: (number) => `Challenge ${number}`,
    challengeHistory: "Challenge history",
    moreOptions: "More options",
    viewRecords: "View records",
    markAsDone: "Mark as done",
    markNotDone: "Mark as not done",
    recordsTitle: (name) => `${name} records`,
    noRecords: "No saved times yet.",
    closeRecords: "Close records",
    deleteRecord: "Delete this record",
    bestRecord: "Best time",
    today: "Today",
    yesterday: "Yesterday",
    updateAvailable: "Update available",
    updateDescription: "A new version of Zoma is ready to install.",
    updateNow: "Update",
    updateLater: "Later",
    updateDone: "Got it",
    tryNewChallenge: "Try a new challenge",
    closeUpdate: "Close notice",
  },
};
const sceneElement = document.querySelector("#scene");
const titleElement = document.querySelector("#challenge-title");
const countElement = document.querySelector("#challenge-count");
const difficultyLabel = document.querySelector("#difficulty-label");
const difficultyFilter = document.querySelector("#difficulty-filter");
const piecePicker = document.querySelector("#piece-picker");
const pieceFeedback = document.querySelector("#piece-feedback");
const progressElement = document.querySelector("#catalog-progress");
const timerDisplay = document.querySelector("#timer-display");
const timerToggle = document.querySelector("#timer-toggle");
const timerRecord = document.querySelector("#timer-record");
const completeButton = document.querySelector("#mark-complete");
const wakeButton = document.querySelector("#wake-lock");
const wakeLabel = wakeButton.querySelector(".wake-label");
const libraryDialog = document.querySelector("#library-dialog");
const libraryGrid = document.querySelector("#library-grid");
const librarySearch = document.querySelector("#library-search");
const libraryEmpty = document.querySelector("#library-empty");
const libraryProgress = document.querySelector("#library-progress");
const libraryUpdateBadge = document.querySelector("#library-update-badge");
const clearProgressButton = document.querySelector("#clear-progress");
const clearProgressDialog = document.querySelector("#clear-progress-dialog");
const clearProgressCancel = document.querySelector("#clear-progress-cancel");
const clearProgressConfirm = document.querySelector("#clear-progress-confirm");
const recordsDialog = document.querySelector("#records-dialog");
const recordsTitle = document.querySelector("#records-title");
const recordsEyebrow = document.querySelector("#records-eyebrow");
const recordsList = document.querySelector("#records-list");
const recordsEmpty = document.querySelector("#records-empty");
const recordsClose = document.querySelector("#records-close");
const languageSelect = document.querySelector("#language-select");
const languageTrigger = document.querySelector("#language-trigger");
const languageMenu = document.querySelector("#language-menu");
const completeLabel = completeButton.querySelector(".complete-label");
const solutionNavigation = document.querySelector("#solution-navigation");
const solutionCount = document.querySelector("#solution-count");
const viewerElement = sceneElement.parentElement;
const fullscreenButton = document.querySelector("#fullscreen-toggle");
const fullscreenHud = document.querySelector(".fullscreen-hud");
const fullscreenTimerDisplay = document.querySelector("#fullscreen-timer-display");
const fullscreenTimerToggle = document.querySelector("#fullscreen-timer-toggle");
const fullscreenCompleteButton = document.querySelector("#fullscreen-mark-complete");
const modeButtons = [...document.querySelectorAll(".mode-button")];
const updateNotice = document.querySelector("#update-notice");
const updateNoticeIcon = document.querySelector("#update-notice-icon");
const updateNoticeTitle = document.querySelector("#update-notice-title");
const updateNoticeDescription = document.querySelector("#update-notice-description");
const updateNoticePreview = document.querySelector("#update-notice-preview");
const updateNoticePrimary = document.querySelector("#update-notice-primary");
const updateNoticeSecondary = document.querySelector("#update-notice-secondary");
const updateNoticeClose = document.querySelector("#update-notice-close");

if (document.body.classList.contains("fixed-zoom")) {
  document.addEventListener("dblclick", (event) => event.preventDefault(), { passive: false });
}

let visibleChallenges = challenges;
let challengeIndex = restoreChallengeIndex();
let mode = "challenge";
let model = null;
let floor = null;
let homeCamera = null;
let viewSize = 7;
let modelFitDiameter = 4.7;
let selectedPiece = null;
let pieceRecords = new Map();
let elapsedMs = 0;
let timerStartedAt = 0;
let timerRunning = false;
let timerHasNewAttempt = false;
let currentSolutionIndex = 0;
let progress = loadProgress();
let wakeLock = null;
let wakeRequested = false;
let wakeVideoActive = false;
let wakeRetryTimer = null;
let pseudoFullscreen = false;
let languagePreference = loadLanguagePreference();
let language = resolveLanguage(languagePreference);
let recordsChallengeId = null;
let availableRelease = null;
let updateNoticeMode = null;

function hasStoredAppState() {
  try {
    return [LAST_CHALLENGE_KEY, PROGRESS_KEY, LANGUAGE_KEY]
      .some((keyName) => localStorage.getItem(keyName) !== null);
  } catch {
    return false;
  }
}

const wakeVideo = document.createElement("video");
wakeVideo.muted = true;
wakeVideo.loop = true;
wakeVideo.playsInline = true;
wakeVideo.preload = "auto";
wakeVideo.setAttribute("aria-hidden", "true");
wakeVideo.style.display = "none";
for (const [type, sourceUrl] of [["webm", noSleepMedia.webm], ["mp4", noSleepMedia.mp4]]) {
  const source = document.createElement("source");
  source.src = sourceUrl;
  source.type = `video/${type}`;
  wakeVideo.append(source);
}
document.body.append(wakeVideo);
wakeVideo.addEventListener("playing", () => {
  wakeVideoActive = true;
  updateWakeButton();
});
wakeVideo.addEventListener("pause", () => {
  wakeVideoActive = false;
  updateWakeButton();
});

function loadLanguagePreference() {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return ["auto", "es", "en"].includes(stored) ? stored : "auto";
  } catch {
    return "auto";
  }
}

function resolveLanguage(preference) {
  if (preference !== "auto") return preference;
  const primaryLocale = navigator.languages?.[0] ?? navigator.language;
  return primaryLocale?.toLowerCase().startsWith("es") ? "es" : "en";
}

function t(key) {
  return translations[language][key];
}

function challengeName(challenge) {
  return challenge.names?.[language] ?? challenge.names?.es ?? challenge.name;
}

function pieceName(pieceId) {
  return pieceNames[language][pieceId];
}

const colorCanvas = document.createElement("canvas");
colorCanvas.width = 1;
colorCanvas.height = 1;
const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });

function threeColor(style) {
  colorContext.clearRect(0, 0, 1, 1);
  colorContext.fillStyle = style;
  colorContext.fillRect(0, 0, 1, 1);
  const [red, green, blue] = colorContext.getImageData(0, 0, 1, 1).data;
  return new THREE.Color().setRGB(red / 255, green / 255, blue / 255, THREE.SRGBColorSpace);
}

function iconMarkup(Icon) {
  const element = createElement(Icon);
  element.setAttribute("aria-hidden", "true");
  return element.outerHTML;
}

function releaseNotesFor(targetRelease) {
  return targetRelease?.notes?.[language]
    ?? targetRelease?.notes?.es
    ?? { title: "Zoma", description: "" };
}

function renderUpdateNotice() {
  if (!updateNoticeMode || !availableRelease) return;
  const notes = releaseNotesFor(availableRelease);
  const isUpdate = updateNoticeMode === "update";
  updateNoticeIcon.innerHTML = iconMarkup(isUpdate ? RefreshCw : Sparkles);
  updateNoticeTitle.textContent = isUpdate ? t("updateAvailable") : notes.title;
  updateNoticeDescription.textContent = isUpdate
    ? `${t("updateDescription")} ${notes.title}: ${notes.description}`
    : notes.description;
  const featuredChallenges = (availableRelease.featuredChallengeIds ?? [])
    .map((id) => challenges.find((challenge) => challenge.id === id))
    .filter(Boolean);
  updateNoticePreview.innerHTML = featuredChallenges
    .map((challenge) => `<span>${challengeThumbnailSvg(challenge.target, "xMidYMax meet")}</span>`)
    .join("");
  updateNoticePreview.hidden = featuredChallenges.length === 0;
  updateNoticePrimary.textContent = isUpdate ? t("updateNow") : t("tryNewChallenge");
  updateNoticeSecondary.textContent = isUpdate ? t("updateLater") : t("updateDone");
  updateNoticeSecondary.hidden = false;
  updateNoticeClose.setAttribute("aria-label", t("closeUpdate"));
  updateNoticeClose.innerHTML = iconMarkup(X);
}

function showUpdateNotice(mode, targetRelease) {
  updateNoticeMode = mode;
  availableRelease = targetRelease;
  renderUpdateNotice();
  if (!updateNotice.open) showModalWithoutInitialControlFocus(updateNotice);
}

function hideUpdateNotice() {
  if (updateNotice.open) updateNotice.close();
  updateNoticeMode = null;
}

function openRandomReleaseChallenge() {
  const releaseChallenges = (availableRelease?.challengeIds ?? [])
    .filter((id) => challenges.some((challenge) => challenge.id === id));
  if (!releaseChallenges.length) {
    hideUpdateNotice();
    return;
  }
  const challengeId = releaseChallenges[Math.floor(Math.random() * releaseChallenges.length)];
  markReleaseSeen(availableRelease.version);
  hideUpdateNotice();
  openChallenge(challengeId);
}

function markReleaseSeen(version) {
  try {
    localStorage.setItem(RELEASE_SEEN_KEY, version);
  } catch {
    // Release notes can reappear when persistent storage is restricted.
  }
}

function updateLibraryBadge() {
  if (!libraryUpdateBadge) return;
  try {
    libraryUpdateBadge.hidden = localStorage.getItem(LIBRARY_SEEN_RELEASE_KEY) === release.version;
  } catch {
    libraryUpdateBadge.hidden = false;
  }
}

function markLibrarySeen() {
  try {
    localStorage.setItem(LIBRARY_SEEN_RELEASE_KEY, release.version);
  } catch {
    // The indicator can reappear when persistent storage is restricted.
  }
  updateLibraryBadge();
}

function deferUpdate(version) {
  try {
    sessionStorage.setItem(UPDATE_DEFERRED_KEY, version);
  } catch {
    // The update remains available if session storage is restricted.
  }
  hideUpdateNotice();
}

function installAvailableUpdate() {
  if (!availableRelease) return;
  const url = new URL(window.location.href);
  url.searchParams.set("update", availableRelease.version);
  window.location.replace(url);
}

async function fetchLatestRelease() {
  const response = await fetch(`/release.json?time=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Release check failed with ${response.status}`);
  return response.json();
}

async function checkForAppUpdate() {
  if (!navigator.onLine) return;
  try {
    const latest = await fetchLatestRelease();
    if (latest.version !== release.version) {
      let deferred = null;
      try { deferred = sessionStorage.getItem(UPDATE_DEFERRED_KEY); } catch { /* No session storage. */ }
      if (deferred !== latest.version) showUpdateNotice("update", latest);
      return;
    }

    let seenVersion = null;
    try { seenVersion = localStorage.getItem(RELEASE_SEEN_KEY); } catch { /* No persistent storage. */ }
    if (!seenVersion && !wasReturningUser) {
      markReleaseSeen(release.version);
      return;
    }
    if (seenVersion !== release.version) showUpdateNotice("release", release);
  } catch {
    // Update checks are best-effort; the current app stays fully usable offline.
  }
}

async function initializeAppUpdates() {
  if ("serviceWorker" in navigator && window.isSecureContext) {
    try {
      await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
    } catch {
      // Version checks still work when service workers are unavailable.
    }
  }
  await checkForAppUpdate();
}

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
sceneElement.append(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 100);
camera.position.set(7, 6, 9);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.enablePan = false;
controls.enableZoom = !document.body.classList.contains("fixed-zoom");
controls.minZoom = 0.72;
controls.maxZoom = 2.8;

scene.add(new THREE.HemisphereLight(
  threeColor("oklch(0.98 0.01 230)"),
  threeColor("oklch(0.68 0.02 230)"),
  2.5,
));

const keyLight = new THREE.DirectionalLight(threeColor("oklch(1 0 0)"), 3.2);
keyLight.position.set(7, 10, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 10;
keyLight.shadow.camera.bottom = -10;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(threeColor("oklch(0.78 0.1 230)"), 0.8);
fillLight.position.set(-6, 3, -4);
scene.add(fillLight);

const cubeGeometry = new RoundedBoxGeometry(0.94, 0.94, 0.94, 3, 0.055);
const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.945, 0.945, 0.945));
const challengeMaterial = new THREE.MeshStandardMaterial({
  color: threeColor(isMercuryTheme ? "#aeb3b8" : isKofiColorStudy ? "#9b9e9b" : isKofiTheme ? "#a2968b" : "oklch(0.74 0.025 230)"),
  roughness: isKofiTheme || isMercuryTheme ? 0.82 : 0.73,
  metalness: 0,
});
const challengeEdgeMaterial = new THREE.LineBasicMaterial({
  color: threeColor(isMercuryTheme ? "#32363a" : isKofiColorStudy ? "#414441" : isKofiTheme ? "#403a35" : "oklch(0.23 0.02 230)"),
  transparent: true,
  opacity: isKofiTheme || isMercuryTheme ? 0.16 : 0.22,
});

function toWorld([x, y, z]) {
  return new THREE.Vector3(x, z, -y);
}

function makeCube(position, material, edgeMaterial, pieceId = null) {
  const group = new THREE.Group();
  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  if (pieceId) cube.userData.pieceId = pieceId;
  group.add(cube);
  group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
  group.position.copy(position);
  return group;
}

function clearModel() {
  if (!model) return;
  scene.remove(model);
  for (const { material, edgeMaterial } of pieceRecords.values()) {
    material.dispose();
    edgeMaterial.dispose();
  }
  pieceRecords = new Map();
}

function positionModel(group) {
  const bounds = new THREE.Box3().setFromObject(group);
  const center = bounds.getCenter(new THREE.Vector3());
  group.position.x -= center.x;
  group.position.z -= center.z;
  group.position.y -= bounds.min.y;
}

function applyProjection() {
  const aspect = Math.max(0.1, sceneElement.clientWidth / sceneElement.clientHeight);
  camera.left = (-viewSize * aspect) / 2;
  camera.right = (viewSize * aspect) / 2;
  camera.top = viewSize / 2;
  camera.bottom = -viewSize / 2;
  camera.updateProjectionMatrix();
}

function updateViewSize() {
  const aspect = Math.max(0.1, sceneElement.clientWidth / sceneElement.clientHeight);
  viewSize = Math.max(4.7, modelFitDiameter / Math.min(1, aspect));
  applyProjection();
}

function fitCamera(group) {
  const bounds = new THREE.Box3().setFromObject(group);
  const size = bounds.getSize(new THREE.Vector3());
  const sphere = bounds.getBoundingSphere(new THREE.Sphere());
  modelFitDiameter = sphere.radius * (isKofiTheme ? 2.16 : isMercuryTheme ? 2.22 : 2.35);
  updateViewSize();
  camera.position.set(viewSize * 0.92, viewSize * 0.78, viewSize * 1.08);
  camera.zoom = 1;
  controls.target.set(0, Math.max(0.6, size.y * (isKofiTheme ? 0.5 : isMercuryTheme ? 0.47 : 0.43)), 0);
  camera.lookAt(controls.target);
  controls.update();
  homeCamera = { position: camera.position.clone(), target: controls.target.clone(), zoom: camera.zoom };

  if (floor) {
    scene.remove(floor);
    floor.geometry.dispose();
    floor.material.dispose();
  }
  const floorMaterial = new THREE.ShadowMaterial({
    color: threeColor("oklch(0.22 0.015 230)"), opacity: 0.13,
  });
  floor = new THREE.Mesh(new THREE.PlaneGeometry(viewSize * 3, viewSize * 3), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  scene.add(floor);
}

function currentChallenge() {
  return visibleChallenges[challengeIndex];
}

function restoreChallengeIndex() {
  try {
    const savedId = localStorage.getItem(LAST_CHALLENGE_KEY);
    const savedIndex = challenges.findIndex((challenge) => challenge.id === savedId);
    return savedIndex >= 0 ? savedIndex : 0;
  } catch {
    return 0;
  }
}

function rememberCurrentChallenge() {
  try {
    localStorage.setItem(LAST_CHALLENGE_KEY, currentChallenge().id);
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

function loadProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // The app remains usable when persistent storage is unavailable.
  }
}

function recordsFor(record) {
  if (!record) return [];
  if (Array.isArray(record.records)) {
    return record.records.filter((entry) => Number.isFinite(entry?.ms) && Number.isFinite(entry?.at));
  }
  if (Number.isFinite(record.bestMs)) {
    return [{ id: "legacy", ms: record.bestMs, at: record.completedAt || Date.now() }];
  }
  return [];
}

function recordId() {
  return globalThis.crypto?.randomUUID?.() ?? `record-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function withRecordStats(record, records) {
  const bestMs = records.length ? Math.min(...records.map((entry) => entry.ms)) : undefined;
  return { ...record, records, bestMs };
}

function formatRecordDate(timestamp) {
  const locale = language === "es" ? "es-PE" : "en-US";
  const date = new Date(timestamp);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDifference = Math.round((startOfToday - startOfDate) / 86_400_000);
  const dateLabel = dayDifference === 0
    ? t("today")
    : dayDifference === 1
      ? t("yesterday")
      : new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
      }).format(date);
  const timeLabel = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${dateLabel} · ${timeLabel}`;
}

function formatExactRecordDate(timestamp) {
  return new Intl.DateTimeFormat(language === "es" ? "es-PE" : "en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function solutionCountFor(challenge = currentChallenge()) {
  return challenge.solutions?.length || 1;
}

function solutionAt(challenge = currentChallenge(), index = currentSolutionIndex) {
  const encoded = challenge.solutions?.[index];
  if (typeof encoded !== "string") return encoded ?? challenge.solution;
  return Object.keys(colors).map((pieceId) => ({
    id: pieceId,
    cubes: challenge.target.filter((_, cubeIndex) => encoded[cubeIndex] === pieceId),
  }));
}

function formatDuration(milliseconds) {
  const minutes = Math.floor(milliseconds / 60_000);
  const seconds = Math.floor((milliseconds % 60_000) / 1_000);
  const tenths = Math.floor((milliseconds % 1_000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function renderChallenge({ resetCamera = true } = {}) {
  clearModel();
  selectedPiece = null;
  pieceFeedback.textContent = "";
  pieceFeedback.classList.remove("is-visible");
  model = new THREE.Group();
  const challenge = currentChallenge();
  const solutionTotal = solutionCountFor(challenge);
  currentSolutionIndex %= solutionTotal;
  rememberCurrentChallenge();

  if (mode === "challenge") {
    challenge.target.forEach((cube) => {
      model.add(makeCube(toWorld(cube), challengeMaterial, challengeEdgeMaterial));
    });
  } else {
    solutionAt(challenge).forEach((piece) => {
      const group = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({
        color: threeColor(colors[piece.id]), roughness: 0.68, metalness: 0,
        transparent: true, opacity: 1,
      });
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: threeColor("oklch(0.2 0.02 230)"), transparent: true, opacity: 0.24,
      });
      piece.cubes.forEach((cube) => group.add(makeCube(toWorld(cube), material, edgeMaterial, piece.id)));
      pieceRecords.set(piece.id, { group, material, edgeMaterial });
      model.add(group);
    });
  }

  positionModel(model);
  scene.add(model);
  if (resetCamera) fitCamera(model);
  updateInterface();
}

function pieceThumbnailSvg(pieceId) {
  const color = colors[pieceId];
  const isoX = Math.sqrt(3) * 5;
  const isoY = 5;
  const cubeHeight = 10;
  const cubes = [...pieceShapes[pieceId]].sort((a, b) =>
    (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
  const polygons = [];
  const points = [];

  for (const [x, y, z] of cubes) {
    const cx = (x - z) * isoX;
    const cy = (x + z) * isoY - y * cubeHeight;
    const top = [[cx, cy - isoY], [cx + isoX, cy], [cx, cy + isoY], [cx - isoX, cy]];
    const left = [[cx - isoX, cy], [cx, cy + isoY], [cx, cy + isoY + cubeHeight], [cx - isoX, cy + cubeHeight]];
    const right = [[cx + isoX, cy], [cx, cy + isoY], [cx, cy + isoY + cubeHeight], [cx + isoX, cy + cubeHeight]];
    points.push(...top, ...left, ...right);
    polygons.push(
      `<polygon points="${top.map((point) => point.join(",")).join(" ")}" style="fill:color-mix(in oklch, ${color}, white 22%)"/>`,
      `<polygon points="${left.map((point) => point.join(",")).join(" ")}" style="fill:color-mix(in oklch, ${color}, black 10%)"/>`,
      `<polygon points="${right.map((point) => point.join(",")).join(" ")}" style="fill:${color}"/>`,
    );
  }

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs) - 2;
  const minY = Math.min(...ys) - 2;
  const width = Math.max(...xs) - minX + 2;
  const height = Math.max(...ys) - minY + 2;
  return `<svg viewBox="${minX} ${minY} ${width} ${height}" aria-hidden="true">${polygons.join("")}</svg>`;
}

function challengeThumbnailSvg(cubes, preserveAspectRatio = "xMidYMid meet") {
  const occupied = new Set(cubes.map(([x, y, z]) => `${x},${y},${z}`));
  const sorted = [...cubes].sort((a, b) =>
    (a[0] - a[1] + a[2]) - (b[0] - b[1] + b[2]));
  const polygons = [];
  const points = [];
  const face = (vertices, color) => {
    points.push(...vertices);
    polygons.push(`<polygon points="${vertices.map((point) => point.join(",")).join(" ")}" fill="${color}" stroke="oklch(0.42 0.025 230)" stroke-width="0.65" stroke-linejoin="round"/>`);
  };

  for (const [x, y, z] of sorted) {
    // Match the default Three.js camera: +X, -Y and +Z in challenge coordinates.
    const cx = (x + y) * 10;
    const cy = (x - y) * 5 - z * 10;
    if (!occupied.has(`${x},${y},${z + 1}`)) {
      face([[cx, cy - 5], [cx + 10, cy], [cx, cy + 5], [cx - 10, cy]], "oklch(0.86 0.025 230)");
    }
    if (!occupied.has(`${x},${y - 1},${z}`)) {
      face([[cx - 10, cy], [cx, cy + 5], [cx, cy + 15], [cx - 10, cy + 10]], "oklch(0.68 0.03 230)");
    }
    if (!occupied.has(`${x + 1},${y},${z}`)) {
      face([[cx + 10, cy], [cx, cy + 5], [cx, cy + 15], [cx + 10, cy + 10]], "oklch(0.76 0.03 230)");
    }
  }

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs) - 10;
  const minY = Math.min(...ys) - 10;
  const width = Math.max(...xs) - minX + 10;
  const height = Math.max(...ys) - minY + 10;
  return `<svg viewBox="${minX} ${minY} ${width} ${height}" preserveAspectRatio="${preserveAspectRatio}" aria-hidden="true">${polygons.join("")}</svg>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);
}

function searchable(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const searchNumberWords = {
  es: { uno: "1", dos: "2", tres: "3", cuatro: "4", cinco: "5", seis: "6", siete: "7", ocho: "8", nueve: "9" },
  en: { one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9" },
};

function normalizeSearch(value, locale = language) {
  return searchable(value)
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => searchNumberWords[locale]?.[token] ?? token)
    .join(" ");
}

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const previous = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = previous;
    }
  }
  return row[b.length];
}

function challengeSearchScore(challenge, rawQuery) {
  const query = normalizeSearch(rawQuery);
  if (!query) return 0;

  const name = normalizeSearch(challengeName(challenge));
  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  if (name.includes(query)) return 2;

  const queryTokens = query.split(" ");
  const nameWords = name.split(" ");
  const prefixMatch = queryTokens.every((token) => nameWords.some((word) => word.startsWith(token)));
  if (prefixMatch) return 3;

  const fuzzyMatch = queryTokens.every((token) => {
    const tolerance = token.length >= 8 ? 2 : token.length >= 4 ? 1 : 0;
    return tolerance > 0 && nameWords.some((word) => editDistance(token, word) <= tolerance);
  });
  if (fuzzyMatch) return 4;

  const challengeNumber = String(challenges.indexOf(challenge) + 1);
  return challengeNumber === query ? 8 : Number.POSITIVE_INFINITY;
}

function renderLibrary() {
  const query = librarySearch.value.trim();
  const matches = challenges
    .map((challenge, index) => ({ challenge, index, score: challengeSearchScore(challenge, query) }))
    .filter((result) => Number.isFinite(result.score))
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .map((result) => result.challenge);
  const completedCount = challenges.filter((challenge) => progress[challenge.id]?.completed).length;
  libraryProgress.textContent = t("completedProgress")(completedCount, challenges.length);
  libraryEmpty.hidden = matches.length > 0;
  libraryGrid.innerHTML = matches.map((challenge) => {
    const record = progress[challenge.id];
    const recordEntries = recordsFor(record);
    const name = challengeName(challenge);
    const challengeNumber = challenges.indexOf(challenge) + 1;
    const status = record?.bestMs
      ? t("record")(formatDuration(record.bestMs))
      : t("difficultyOptions")[challenge.difficulty];
    const cardMeta = document.body.classList.contains("no-difficulty")
      ? t("challengeCardSimple")(String(challengeNumber).padStart(2, "0"))
      : t("challengeCard")(String(challengeNumber).padStart(2, "0"), status);
    return `
      <article class="challenge-card${record?.completed ? " is-complete" : ""}" data-challenge-card="${challenge.id}">
        <button class="challenge-card-open" type="button" data-challenge="${challenge.id}"
          aria-label="${escapeHtml(t("openChallenge")(name))}">
          <span class="challenge-card-visual">
            ${challengeThumbnailSvg(challenge.target)}
            ${record?.bestMs ? `<span class="challenge-card-record" title="${escapeHtml(t("bestRecord"))}">${iconMarkup(Trophy)}<span>${formatDuration(record.bestMs)}</span></span>` : ""}
          </span>
          <span class="challenge-card-copy">
            <strong>${escapeHtml(name)}</strong>
            <small>${cardMeta}</small>
          </span>
        </button>
        ${record?.completed ? `<span class="challenge-card-check" title="${t("completed")}">${iconMarkup(Check)}</span>` : ""}
        <button class="challenge-card-more" type="button" aria-label="${escapeHtml(`${t("moreOptions")}: ${name}`)}"
          aria-haspopup="menu" aria-expanded="false" data-card-menu-trigger="${challenge.id}">${iconMarkup(Ellipsis)}</button>
        <div class="challenge-card-menu" role="menu" hidden>
          <button type="button" role="menuitem" data-view-records="${challenge.id}"${recordEntries.length ? "" : " disabled"}>${iconMarkup(History)}<span>${t("viewRecords")}</span></button>
          <button type="button" role="menuitem" data-mark-challenge="${challenge.id}"${record?.completed ? " disabled" : ""}>${iconMarkup(Flag)}<span>${t("markAsDone")}</span></button>
          <button type="button" role="menuitem" data-unmark-challenge="${challenge.id}"${record?.completed ? "" : " disabled"}>${iconMarkup(Undo2)}<span>${t("markNotDone")}</span></button>
        </div>
      </article>
    `;
  }).join("");

  libraryGrid.querySelectorAll(".challenge-card-open").forEach((button) => {
    button.addEventListener("click", () => openChallenge(button.dataset.challenge));
  });
  libraryGrid.querySelectorAll("[data-card-menu-trigger]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      languageMenu.hidden = true;
      languageTrigger.setAttribute("aria-expanded", "false");
      const menu = button.nextElementSibling;
      const willOpen = menu.hidden;
      closeChallengeMenus();
      menu.hidden = !willOpen;
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });
  libraryGrid.querySelectorAll("[data-view-records]").forEach((button) => {
    button.addEventListener("click", () => openRecordsDialog(button.dataset.viewRecords));
  });
  libraryGrid.querySelectorAll("[data-mark-challenge]").forEach((button) => {
    button.addEventListener("click", () => markChallengeDone(button.dataset.markChallenge));
  });
  libraryGrid.querySelectorAll("[data-unmark-challenge]").forEach((button) => {
    button.addEventListener("click", () => unmarkChallenge(button.dataset.unmarkChallenge));
  });
}

function closeChallengeMenus() {
  libraryGrid.querySelectorAll(".challenge-card-menu").forEach((menu) => { menu.hidden = true; });
  libraryGrid.querySelectorAll("[data-card-menu-trigger]").forEach((button) => button.setAttribute("aria-expanded", "false"));
}

function unmarkChallenge(challengeId) {
  const previous = progress[challengeId];
  if (!previous) return;
  progress[challengeId] = { ...previous, completed: false };
  saveProgress();
  renderLibrary();
  if (currentChallenge().id === challengeId) updateProgressInterface();
}

function markChallengeDone(challengeId) {
  const previous = progress[challengeId] ?? {};
  progress[challengeId] = { ...previous, completed: true, completedAt: previous.completedAt ?? Date.now() };
  saveProgress();
  renderLibrary();
  if (currentChallenge().id === challengeId) updateProgressInterface();
}

function renderRecordsDialog() {
  const challenge = challenges.find((entry) => entry.id === recordsChallengeId);
  if (!challenge) return;
  const records = recordsFor(progress[recordsChallengeId]).sort((a, b) => a.ms - b.ms);
  recordsEyebrow.textContent = t("challengeHistory");
  recordsTitle.textContent = t("recordsTitle")(challengeName(challenge));
  recordsClose.setAttribute("aria-label", t("closeRecords"));
  recordsEmpty.textContent = t("noRecords");
  recordsEmpty.hidden = records.length > 0;
  recordsList.innerHTML = records.map((entry, index) => `
    <div class="record-row-shell" data-record-id="${escapeHtml(entry.id)}">
      <div class="record-row">
        <span class="record-rank${index < 3 ? " is-medal" : ""}" aria-label="${index + 1}">
          ${index < 3 ? ["🥇", "🥈", "🥉"][index] : String(index + 1).padStart(2, "0")}
        </span>
        <span class="record-copy">
          <strong>${formatDuration(entry.ms)}</strong>
          <small><time datetime="${new Date(entry.at).toISOString()}" title="${escapeHtml(formatExactRecordDate(entry.at))}">${escapeHtml(formatRecordDate(entry.at))}</time>${index === 0 ? ` · ${t("bestRecord")}` : ""}</small>
        </span>
        <button class="record-delete" type="button" aria-label="${t("deleteRecord")}">${iconMarkup(Trash2)}</button>
      </div>
    </div>
  `).join("");
  recordsList.querySelectorAll(".record-delete").forEach((button) => {
    button.addEventListener("click", () => deleteRecord(recordsChallengeId, button.closest(".record-row-shell").dataset.recordId));
  });
}

function openRecordsDialog(challengeId) {
  recordsChallengeId = challengeId;
  closeChallengeMenus();
  renderRecordsDialog();
  showModalWithoutInitialControlFocus(recordsDialog);
}

function deleteRecord(challengeId, id) {
  const previous = progress[challengeId];
  if (!previous) return;
  const records = recordsFor(previous).filter((entry) => entry.id !== id);
  progress[challengeId] = withRecordStats(previous, records);
  saveProgress();
  renderRecordsDialog();
  renderLibrary();
  if (currentChallenge().id === challengeId) updateProgressInterface();
}

function openChallenge(challengeId) {
  visibleChallenges = challenges;
  difficultyFilter.value = "all";
  challengeIndex = challenges.findIndex((challenge) => challenge.id === challengeId);
  currentSolutionIndex = 0;
  mode = "challenge";
  resetTimer();
  renderChallenge({ resetCamera: true });
  libraryDialog.close();
}

function renderPiecePicker(challenge) {
  piecePicker.hidden = mode !== "solution";
  if (mode !== "solution") {
    piecePicker.innerHTML = "";
    return;
  }
  piecePicker.innerHTML = solutionAt(challenge).map((piece) => `
    <button class="piece-thumbnail" type="button" data-piece="${piece.id}"
      aria-label="${t("highlightPiece")(pieceName(piece.id))}" aria-pressed="false"
      title="${t("piece")(pieceName(piece.id))}">
      ${pieceThumbnailSvg(piece.id)}
    </button>
  `).join("");
  piecePicker.querySelectorAll(".piece-thumbnail").forEach((button) => {
    button.addEventListener("click", () => setSelectedPiece(button.dataset.piece));
  });
}

function setSelectedPiece(pieceId) {
  selectedPiece = selectedPiece === pieceId ? null : pieceId;
  for (const [id, record] of pieceRecords) {
    const muted = selectedPiece && id !== selectedPiece;
    record.material.opacity = muted ? 0.13 : 1;
    record.material.depthWrite = !muted;
    record.material.emissive.copy(record.material.color);
    record.material.emissiveIntensity = selectedPiece === id ? 0.12 : 0;
    record.edgeMaterial.opacity = muted ? 0.04 : 0.24;
  }
  piecePicker.querySelectorAll(".piece-thumbnail").forEach((button) => {
    const active = button.dataset.piece === selectedPiece;
    button.classList.toggle("is-selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
  pieceFeedback.textContent = selectedPiece ? t("piece")(pieceName(selectedPiece)) : "";
  pieceFeedback.classList.toggle("is-visible", Boolean(selectedPiece));
}

function updateSolutionNavigation(challenge) {
  const storedSolutions = solutionCountFor(challenge);
  const hidden = mode !== "solution" || storedSolutions < 2;
  solutionNavigation.hidden = hidden;
  sceneElement.parentElement.classList.toggle("has-solution-navigation", !hidden);
  solutionCount.textContent = `${currentSolutionIndex + 1} / ${storedSolutions}`;
  solutionNavigation.title = t("solutionPosition")(currentSolutionIndex + 1, storedSolutions);
}

function updateProgressInterface() {
  const record = progress[currentChallenge().id];
  const completed = Boolean(record?.completed);
  const compactCompletionAction = document.body.classList.contains("completion-action-v2");
  const attemptInProgress = timerHasNewAttempt;
  const completeLabelText = attemptInProgress
    ? t("finishSave")
    : compactCompletionAction && completed ? t("completed") : completed ? t("unmarkDone") : t("markDone");
  const completeTitle = attemptInProgress
    ? t("finishSave")
    : completed ? t("completed") : t("markDone");
  for (const button of [completeButton, fullscreenCompleteButton]) {
    button.classList.toggle("is-complete", completed && !attemptInProgress);
    button.classList.toggle("is-timing", attemptInProgress);
    button.setAttribute("aria-pressed", String(completed));
    button.setAttribute("aria-label", completeLabelText);
    button.setAttribute("aria-disabled", String(compactCompletionAction && completed && !attemptInProgress));
    button.title = completeTitle;
  }
  if (compactCompletionAction) {
    const actionIcon = attemptInProgress || !completed ? Flag : Check;
    completeButton.querySelector(".complete-icon").innerHTML = iconMarkup(actionIcon);
    completeLabel.textContent = attemptInProgress ? t("finishShort") : t("done");
    fullscreenCompleteButton.innerHTML = iconMarkup(actionIcon);
  }

  if (record?.bestMs) {
    timerRecord.innerHTML = `${iconMarkup(Trophy)} ${t("record")(formatDuration(record.bestMs))}`;
  } else {
    timerRecord.textContent = completed ? t("completed") : t("noRecord");
  }
}

function updateInterface() {
  const challenge = currentChallenge();
  titleElement.textContent = challengeName(challenge);
  countElement.textContent = t("challengeCount")(
    String(challengeIndex + 1).padStart(2, "0"),
    String(visibleChallenges.length).padStart(2, "0"),
  );
  difficultyLabel.textContent = t("challengeDifficulty")(t("difficultyOptions")[challenge.difficulty]);
  progressElement.style.width = `${((challengeIndex + 1) / visibleChallenges.length) * 100}%`;
  modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  updateSolutionNavigation(challenge);
  updateProgressInterface();
  renderPiecePicker(challenge);
}

function resetTimer() {
  timerRunning = false;
  timerHasNewAttempt = false;
  elapsedMs = 0;
  timerStartedAt = 0;
  updateTimer();
  updateTimerButton();
  updateProgressInterface();
}

function updateTimer() {
  const total = timerRunning ? performance.now() - timerStartedAt : elapsedMs;
  const formatted = formatDuration(total);
  timerDisplay.textContent = formatted;
  fullscreenTimerDisplay.textContent = formatted;
}

function updateTimerButton() {
  const icon = iconMarkup(timerRunning ? Pause : Play);
  const label = timerRunning ? t("pauseTimer") : t("startTimer");
  for (const button of [timerToggle, fullscreenTimerToggle]) {
    button.innerHTML = icon;
    button.setAttribute("aria-label", label);
    button.title = label;
  }
}

function toggleTimer() {
  if (timerRunning) {
    elapsedMs = performance.now() - timerStartedAt;
    timerRunning = false;
  } else {
    if (!timerHasNewAttempt) elapsedMs = 0;
    timerStartedAt = performance.now() - elapsedMs;
    timerRunning = true;
    timerHasNewAttempt = true;
  }
  updateTimer();
  updateTimerButton();
  updateProgressInterface();
}

function markCurrentComplete() {
  const challengeId = currentChallenge().id;
  const previous = progress[challengeId] ?? {};
  const compactCompletionAction = document.body.classList.contains("completion-action-v2");
  if (compactCompletionAction && previous.completed && !timerRunning && !timerHasNewAttempt) return;
  let attemptMs = null;

  if (timerRunning) {
    elapsedMs = performance.now() - timerStartedAt;
    timerRunning = false;
    updateTimer();
    updateTimerButton();
  }
  if (timerHasNewAttempt && elapsedMs > 0) attemptMs = elapsedMs;

  const isNewRecord = attemptMs !== null && (!previous.bestMs || attemptMs < previous.bestMs);
  const records = recordsFor(previous);
  if (attemptMs !== null) records.push({ id: recordId(), ms: attemptMs, at: Date.now() });
  progress[challengeId] = withRecordStats({
    ...previous,
    completed: attemptMs !== null ? true : !previous.completed,
    completedAt: attemptMs !== null || !previous.completed ? Date.now() : previous.completedAt,
  }, records);
  timerHasNewAttempt = false;
  saveProgress();
  updateProgressInterface();
  if (libraryDialog.open) renderLibrary();

  if (isNewRecord) {
    timerRecord.classList.add("is-new-record");
    timerRecord.innerHTML = `${iconMarkup(Trophy)} ${t("newRecord")(formatDuration(attemptMs))}`;
    window.setTimeout(() => {
      timerRecord.classList.remove("is-new-record");
      if (currentChallenge().id === challengeId) updateProgressInterface();
    }, 2400);
  }
}

function resetClearConfirmation() {
  clearProgressButton.innerHTML = `${iconMarkup(Trash2)} ${t("clearProgress")}`;
  if (clearProgressDialog.open) clearProgressDialog.close();
}

function clearStoredProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(LAST_CHALLENGE_KEY);
  } catch {
    // Reset the in-memory state even when persistent storage is restricted.
  }
  progress = {};
  visibleChallenges = challenges;
  difficultyFilter.value = "all";
  challengeIndex = 0;
  currentSolutionIndex = 0;
  mode = "challenge";
  resetTimer();
  renderChallenge({ resetCamera: true });
  renderLibrary();
  resetClearConfirmation();
}

function openClearProgressDialog() {
  document.querySelector("#clear-progress-title").textContent = t("clearProgressTitle");
  document.querySelector("#clear-progress-description").textContent = t("clearProgressDescription");
  clearProgressCancel.textContent = t("cancel");
  clearProgressConfirm.textContent = t("deleteProgress");
  showModalWithoutInitialControlFocus(clearProgressDialog);
}

function showModalWithoutInitialControlFocus(dialog) {
  dialog.tabIndex = -1;
  dialog.showModal();
  dialog.focus({ preventScroll: true });
}

function changeChallenge(nextIndex) {
  challengeIndex = (nextIndex + visibleChallenges.length) % visibleChallenges.length;
  currentSolutionIndex = 0;
  mode = "challenge";
  resetTimer();
  renderChallenge({ resetCamera: true });
}

async function requestWakeLock() {
  if (!wakeRequested) return;
  const videoAttempt = wakeVideo.play()
    .then(() => { wakeVideoActive = !wakeVideo.paused; })
    .catch(() => { wakeVideoActive = false; });

  if ("wakeLock" in navigator && document.visibilityState === "visible" && !wakeLock) {
    try {
      const sentinel = await navigator.wakeLock.request("screen");
      wakeLock = sentinel;
      sentinel.addEventListener("release", () => {
        if (wakeLock === sentinel) wakeLock = null;
        updateWakeButton();
      });
    } catch {
      wakeLock = null;
    }
  }

  await videoAttempt;
  if (!wakeLock && !wakeVideoActive) wakeRequested = false;
  if (wakeRequested && !wakeRetryTimer) {
    wakeRetryTimer = window.setInterval(() => {
      if (wakeRequested && document.visibilityState === "visible" && !wakeLock) requestWakeLock();
    }, 15_000);
  }
  updateWakeButton();
}

async function releaseWakeLock() {
  wakeRequested = false;
  window.clearInterval(wakeRetryTimer);
  wakeRetryTimer = null;
  if (wakeLock) await wakeLock.release();
  wakeLock = null;
  wakeVideo.pause();
  wakeVideoActive = false;
  updateWakeButton();
}

function updateWakeButton() {
  const active = wakeRequested && (Boolean(wakeLock) || wakeVideoActive);
  wakeButton.classList.toggle("is-active", active);
  wakeButton.classList.toggle("is-requested", wakeRequested);
  wakeButton.setAttribute("aria-checked", String(active));
  wakeButton.setAttribute("aria-label", active ? t("allowSleep") : t("keepAwake"));
  wakeButton.title = active ? t("screenOn") : t("keepAwake");
  const label = document.body.classList.contains("colorful-theme")
    ? t("alwaysOn")
    : active ? t("screenOn") : t("keepOnShort");
  if (wakeLabel.textContent !== label) wakeLabel.textContent = label;
}

function isViewerFullscreen() {
  return document.fullscreenElement === viewerElement || pseudoFullscreen;
}

function updateFullscreenInterface() {
  const active = isViewerFullscreen();
  const label = active ? t("exitFullscreen") : t("enterFullscreen");
  fullscreenButton.innerHTML = iconMarkup(active ? Minimize2 : Maximize2);
  fullscreenButton.setAttribute("aria-label", label);
  fullscreenButton.title = label;
  fullscreenButton.setAttribute("aria-pressed", String(active));
}

function enterPseudoFullscreen() {
  pseudoFullscreen = true;
  viewerElement.classList.add("is-pseudo-fullscreen");
  document.body.classList.add("has-pseudo-fullscreen");
  updateFullscreenInterface();
}

function exitPseudoFullscreen() {
  pseudoFullscreen = false;
  viewerElement.classList.remove("is-pseudo-fullscreen");
  document.body.classList.remove("has-pseudo-fullscreen");
  updateFullscreenInterface();
}

async function toggleFullscreen() {
  if (document.fullscreenElement === viewerElement) {
    await document.exitFullscreen();
    return;
  }
  if (pseudoFullscreen) {
    exitPseudoFullscreen();
    return;
  }
  if (viewerElement.requestFullscreen) {
    try {
      await viewerElement.requestFullscreen();
      return;
    } catch {
      enterPseudoFullscreen();
      return;
    }
  }
  enterPseudoFullscreen();
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]').content = t("pageDescription");
  document.querySelector("#menu-toggle").setAttribute("aria-label", t("openLibrary"));
  document.querySelector("#library-close").setAttribute("aria-label", t("closeLibrary"));
  recordsClose.setAttribute("aria-label", t("closeRecords"));
  document.querySelector(".library-search .sr-only").textContent = t("search");
  librarySearch.placeholder = t("searchPlaceholder");
  libraryEmpty.textContent = t("noMatches");
  document.querySelector("#language-label").textContent = t("language");
  languageSelect.value = language;
  const optionLabels = [t("spanish"), t("english")];
  [...languageSelect.options].forEach((option, index) => {
    option.textContent = optionLabels[index];
  });
  document.querySelectorAll("[data-language-choice]").forEach((button, index) => {
    const active = button.dataset.languageChoice === language;
    button.setAttribute("aria-checked", String(active));
    button.querySelector("span:first-child").textContent = optionLabels[index];
  });
  document.querySelector("#language-code").textContent = language === "es" ? "ES" : "US";
  languageTrigger.setAttribute("aria-label", `${t("language")}: ${language === "es" ? t("spanish") : t("english")}`);
  document.querySelectorAll("[data-support-link] .support-label").forEach((element) => {
    element.textContent = t("supportOnKofi");
  });

  sceneElement.setAttribute("aria-label", t("scene"));
  fullscreenHud.setAttribute("aria-label", t("fullscreenControls"));
  const resetViewButton = document.querySelector("#reset-view");
  resetViewButton.setAttribute("aria-label", t("resetView"));
  resetViewButton.title = t("resetView");
  document.querySelector(".difficulty-control span").textContent = t("difficulty");
  [...difficultyFilter.options].forEach((option) => {
    option.textContent = t("difficultyOptions")[option.value];
  });
  document.querySelector(".challenge-meta span:last-child").textContent = t("cubes");
  document.querySelector(".timer-bar").setAttribute("aria-label", t("timer"));
  const timerResetButton = document.querySelector("#timer-reset");
  timerResetButton.setAttribute("aria-label", t("resetTimer"));
  timerResetButton.title = t("resetTimer");
  completeLabel.textContent = t("done");
  document.querySelector(".mode-switch").setAttribute("aria-label", t("displayMode"));
  modeButtons.find((button) => button.dataset.mode === "challenge").textContent = t("challengeMode");
  modeButtons.find((button) => button.dataset.mode === "solution").textContent = t("solutionMode");
  piecePicker.setAttribute("aria-label", t("solutionPieces"));

  const previousButton = document.querySelector("#previous");
  previousButton.setAttribute("aria-label", t("previousChallenge"));
  previousButton.title = t("previousChallenge");
  const nextButton = document.querySelector("#next");
  nextButton.setAttribute("aria-label", t("nextChallenge"));
  nextButton.title = t("nextChallenge");
  document.querySelector("#shuffle").innerHTML = `${iconMarkup(Shuffle)} ${t("random")}`;
  document.querySelector("#previous-solution").setAttribute("aria-label", t("previousSolution"));
  document.querySelector("#next-solution").setAttribute("aria-label", t("nextSolution"));
  updateFullscreenInterface();
  resetClearConfirmation();
  updateTimerButton();
  updateWakeButton();
  updateInterface();
  if (libraryDialog.open) renderLibrary();
  if (recordsDialog.open) renderRecordsDialog();
  if (updateNotice.open) renderUpdateNotice();
}

document.querySelector("#reset-view").innerHTML = iconMarkup(RotateCcw);
document.querySelector("#previous").innerHTML = iconMarkup(ChevronLeft);
document.querySelector("#next").innerHTML = iconMarkup(ChevronRight);
document.querySelector("#timer-reset").innerHTML = iconMarkup(TimerReset);
document.querySelector(".complete-icon").innerHTML = iconMarkup(Check);
document.querySelector("#library-close").innerHTML = iconMarkup(X);
recordsClose.innerHTML = iconMarkup(X);
document.querySelector(".library-search-icon").innerHTML = iconMarkup(Search);
document.querySelector("#previous-solution").innerHTML = iconMarkup(ChevronLeft);
document.querySelector("#next-solution").innerHTML = iconMarkup(ChevronRight);

updateNoticePrimary.addEventListener("click", () => {
  if (updateNoticeMode === "update") {
    installAvailableUpdate();
    return;
  }
  openRandomReleaseChallenge();
});
updateNoticeSecondary.addEventListener("click", () => {
  if (updateNoticeMode === "update" && availableRelease) {
    deferUpdate(availableRelease.version);
    return;
  }
  if (availableRelease) markReleaseSeen(availableRelease.version);
  hideUpdateNotice();
});
updateNoticeClose.addEventListener("click", () => {
  if (updateNoticeMode === "update" && availableRelease) {
    deferUpdate(availableRelease.version);
    return;
  }
  if (availableRelease) markReleaseSeen(availableRelease.version);
  hideUpdateNotice();
});
updateNotice.addEventListener("cancel", (event) => {
  event.preventDefault();
  updateNoticeClose.click();
});
document.querySelector(".language-chevron").innerHTML = iconMarkup(ChevronDown);
document.querySelector(".language-icon").innerHTML = iconMarkup(Languages);
document.querySelectorAll(".language-check").forEach((element) => { element.innerHTML = iconMarkup(Check); });
document.querySelectorAll(".support-icon").forEach((element) => { element.innerHTML = iconMarkup(Coffee); });
document.querySelector(".confirm-dialog-icon").innerHTML = iconMarkup(Trash2);
fullscreenCompleteButton.innerHTML = iconMarkup(Check);
applyLanguage();
updateLibraryBadge();

document.querySelector("#menu-toggle").addEventListener("click", () => {
  markLibrarySeen();
  librarySearch.value = "";
  resetClearConfirmation();
  renderLibrary();
  showModalWithoutInitialControlFocus(libraryDialog);
});

document.querySelector("#library-close").addEventListener("click", () => libraryDialog.close());
librarySearch.addEventListener("input", renderLibrary);
clearProgressButton.addEventListener("click", openClearProgressDialog);
clearProgressCancel.addEventListener("click", () => clearProgressDialog.close());
clearProgressConfirm.addEventListener("click", clearStoredProgress);
clearProgressDialog.addEventListener("click", (event) => {
  if (event.target === clearProgressDialog) clearProgressDialog.close();
});
recordsClose.addEventListener("click", () => recordsDialog.close());
recordsDialog.addEventListener("click", (event) => {
  if (event.target === recordsDialog) recordsDialog.close();
});
languageSelect.addEventListener("change", () => {
  languagePreference = languageSelect.value;
  language = resolveLanguage(languagePreference);
  try {
    localStorage.setItem(LANGUAGE_KEY, languagePreference);
  } catch {
    // Language still applies for the current session when storage is restricted.
  }
  applyLanguage();
});
document.querySelectorAll("[data-language-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    languageSelect.value = button.dataset.languageChoice;
    languageSelect.dispatchEvent(new Event("change"));
    languageMenu.hidden = true;
    languageTrigger.setAttribute("aria-expanded", "false");
    languageTrigger.focus();
  });
});
languageTrigger.addEventListener("click", () => {
  const open = languageMenu.hidden;
  languageMenu.hidden = !open;
  languageTrigger.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (event) => {
  if (event.target instanceof Node && !document.querySelector(".language-control").contains(event.target)) {
    languageMenu.hidden = true;
    languageTrigger.setAttribute("aria-expanded", "false");
  }
  if (event.target instanceof Node && !libraryGrid.contains(event.target)) closeChallengeMenus();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || languageMenu.hidden) return;
  languageMenu.hidden = true;
  languageTrigger.setAttribute("aria-expanded", "false");
  languageTrigger.focus();
});
window.addEventListener("languagechange", () => {
  if (languagePreference !== "auto") return;
  language = resolveLanguage(languagePreference);
  applyLanguage();
});
libraryDialog.addEventListener("click", (event) => {
  if (event.target === libraryDialog) libraryDialog.close();
});

document.querySelector("#reset-view").addEventListener("click", () => {
  if (!homeCamera) return;
  setSelectedPiece(null);
  camera.position.copy(homeCamera.position);
  camera.zoom = homeCamera.zoom;
  controls.target.copy(homeCamera.target);
  camera.updateProjectionMatrix();
  controls.update();
});

fullscreenButton.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenInterface);

document.querySelector("#previous").addEventListener("click", () => changeChallenge(challengeIndex - 1));
document.querySelector("#next").addEventListener("click", () => changeChallenge(challengeIndex + 1));
document.querySelector("#shuffle").addEventListener("click", () => {
  const offset = 1 + Math.floor(Math.random() * Math.max(1, visibleChallenges.length - 1));
  changeChallenge(challengeIndex + offset);
});

difficultyFilter.addEventListener("change", () => {
  visibleChallenges = difficultyFilter.value === "all"
    ? challenges
    : challenges.filter((challenge) => challenge.difficulty === difficultyFilter.value);
  challengeIndex = 0;
  currentSolutionIndex = 0;
  mode = "challenge";
  resetTimer();
  renderChallenge({ resetCamera: true });
});

modeButtons.forEach((button) => button.addEventListener("click", () => {
  if (mode === button.dataset.mode) return;
  mode = button.dataset.mode;
  renderChallenge({ resetCamera: false });
}));

timerToggle.addEventListener("click", toggleTimer);
fullscreenTimerToggle.addEventListener("click", toggleTimer);

document.querySelector("#timer-reset").addEventListener("click", resetTimer);
completeButton.addEventListener("click", markCurrentComplete);
fullscreenCompleteButton.addEventListener("click", markCurrentComplete);

document.querySelector("#previous-solution").addEventListener("click", () => {
  const solutionTotal = solutionCountFor();
  currentSolutionIndex = (currentSolutionIndex - 1 + solutionTotal) % solutionTotal;
  renderChallenge({ resetCamera: false });
});

document.querySelector("#next-solution").addEventListener("click", () => {
  currentSolutionIndex = (currentSolutionIndex + 1) % solutionCountFor();
  renderChallenge({ resetCamera: false });
});

wakeButton.addEventListener("click", () => {
  wakeRequested = !wakeRequested;
  updateWakeButton();
  if (wakeRequested) void requestWakeLock();
  else void releaseWakeLock();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  if (wakeRequested && !wakeLock) requestWakeLock();
  void checkForAppUpdate();
});
window.addEventListener("online", () => void checkForAppUpdate());

window.addEventListener("keydown", (event) => {
  if (libraryDialog.open || (event.target instanceof Element && event.target.matches("input, select"))) return;
  if (event.key === "Escape" && pseudoFullscreen) {
    exitPseudoFullscreen();
    return;
  }
  if (event.key === "ArrowLeft") changeChallenge(challengeIndex - 1);
  if (event.key === "ArrowRight") changeChallenge(challengeIndex + 1);
  if (event.key.toLowerCase() === "s") {
    mode = mode === "challenge" ? "solution" : "challenge";
    renderChallenge({ resetCamera: false });
  }
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerStart = null;

renderer.domElement.addEventListener("pointerdown", (event) => {
  pointerStart = { x: event.clientX, y: event.clientY };
});

renderer.domElement.addEventListener("pointerup", (event) => {
  if (mode !== "solution" || !pointerStart) return;
  const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  pointerStart = null;
  if (distance > 7) return;
  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(model, true).find((intersection) => intersection.object.userData.pieceId);
  setSelectedPiece(hit?.object.userData.pieceId ?? null);
});

const resizeObserver = new ResizeObserver(() => {
  const width = sceneElement.clientWidth;
  const height = sceneElement.clientHeight;
  renderer.setSize(width, height, false);
  updateViewSize();
});
resizeObserver.observe(sceneElement);

function animate() {
  controls.update();
  if (timerRunning) updateTimer();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

resetTimer();
renderChallenge();
animate();
void initializeAppUpdates();
