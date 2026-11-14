# my github.io site

Plain HTML/CSS/JS — no build step, no framework.

| file | what it is |
|---|---|
| `index.html` | all the page content (stalk-me icons, podcast, photography, school) |
| `style.css` | colors and layout (colors are at the top) |
| `ascii-bloom.js` | turns a photo into the living, colored ASCII bouquet |
| `main.js` | wires up the bouquet, the photo gallery (`PHOTOS` list) and the icon hover effect |
| `assets/flowers.webp` | the header flower photo |
| `assets/photos/` | photos for the photography section |
| `sketches/` | earlier animation experiments, kept local only (ignored by git) |
| `.nojekyll` | tells GitHub Pages to serve files as-is |

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Put it online (one time)

This folder is already a git repository with commits, so there's no `git init`.

1. On github.com, create a **new public repository** named exactly `YOURUSERNAME.github.io`.
   Leave it empty (no README, .gitignore or license).
2. Commit as your private GitHub address (Settings → Emails → "Keep my email addresses private"
   shows it, like `12345678+YOURUSERNAME@users.noreply.github.com`):

```bash
git config user.email "12345678+YOURUSERNAME@users.noreply.github.com"
```

3. Connect and push:

```bash
git remote add origin https://github.com/YOURUSERNAME/YOURUSERNAME.github.io.git
git push -u origin main
```

4. On GitHub: **Settings → Pages** → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.
5. Wait a minute or two, then visit `https://YOURUSERNAME.github.io`.

## Updating

Edit files, then:

```bash
git add -A && git commit -m "describe the change" && git push
```

If the browser shows an old version, bump the `?v=` numbers on the CSS/JS links in `index.html`.
