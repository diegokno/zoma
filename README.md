# Zoma

Zoma is a mobile-first companion for people who own a physical Soma cube. It
contains 83 exact, connected and solver-verified challenges, interactive 3D
inspection, piece-by-piece solutions, a timer and local progress tracking.

## Run locally

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Build

```powershell
npm run build
npm run preview
```

The build pipeline parses the source voxel figures, validates face
connectivity, solves each challenge as an exact-cover problem, removes
rotational duplicates and stores up to 24 diverse solutions per figure.

## Privacy

Zoma has no account system. Progress, completion state and timer records are
stored locally in the browser.

## Support

Support the project on [Ko-fi](https://ko-fi.com/diego_cano).

## License and attribution

This project is licensed under GNU GPL v3 or later. Imported `.soma` figure
descriptions are derived from
[thanks4opensource/yass](https://github.com/thanks4opensource/yass), which is
also licensed under GNU GPL v3 or later. See `THIRD_PARTY_NOTICES.md`.
