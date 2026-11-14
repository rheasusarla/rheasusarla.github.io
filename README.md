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

1. On github.com, create a **new public repository** named exactly `YOURUSERNAME.github.io`
   (replace with your GitHub username). Don't add a README.
2. In this folder:

```bash
git init
git add .
git commit -m "first version of my site"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/YOURUSERNAME.github.io.git
git push -u origin main
```

3. In the repo on GitHub: **Settings → Pages**. Under "Build and deployment", source should be
   **Deploy from a branch**, branch **main**, folder **/ (root)**.
4. Wait a minute, then visit `https://YOURUSERNAME.github.io`.

## Updating

Edit files, then:

```bash
git add . && git commit -m "update" && git push
```
