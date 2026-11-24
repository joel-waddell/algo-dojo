# AlgoDojo: JS problem solving trainer

A mobile-first, offline-capable PWA that takes a beginner to fluency with LeetCode-style
patterns in JavaScript, and to analyzing real JS functions (complexity, patterns, bugs).

No build step: it is plain HTML, CSS and JS. Host the folder on any static HTTPS host.

## Put it on GitHub Pages (free, installable on iPhone)
1. Create a new public repo (for example `algodojo`) and upload every file in this folder to it, keeping the folders.
2. Repo Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`. Save.
3. After a minute, open `https://<your-username>.github.io/algodojo/` in Safari on your iPhone.
4. Share button → Add to Home Screen. It now opens full screen and works offline.

## Structure
- `index.html`, `app.css`, `app.js`: app shell, views, spaced review, progress
- `runner.js`: runs your code in a Web Worker (tests, time limits, growth measurement)
- `analyzer.js`: syntax highlighting + heuristic complexity scanner used by the Lab
- `content/units-*.js`: the 17-unit curriculum; `content/reference.js`: Guide tab
- `sw.js`, `manifest.webmanifest`, `icons/`: PWA install + offline cache

Progress is stored in the browser's localStorage. Use Progress → Copy backup / Restore backup to move it between devices.
