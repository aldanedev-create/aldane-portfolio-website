# Aldane Hutchinson — Portfolio (static SPA)

Alpine.js single-page app (hash routes: `#/`, `#/work`, `#/about`, `#/contact`) with Three.js scenes. No build step.

## Run locally
    python3 -m http.server 8000      # then open http://localhost:8000

## Push to GitHub, then Vercel
    git init && git add . && git commit -m "New portfolio"
    git branch -M main
    git remote add origin https://github.com/aldanedev-create/Aldane-portfilo.git
    git push -u origin main --force   # replaces the old Flask app; omit --force to keep history

In Vercel: Add New > Project > import the repo > keep defaults (Framework: Other, no build command, output: root) > Deploy.

## Edit content
- Projects: `js/projects.js` (one line per project)
- Featured 3D cards: `FEATURED` list at the top of `js/app.js`
- Contact form: set `FORM_ENDPOINT` in `js/app.js` to a Formspree URL to send without opening a mail app
