# Xinger Ji — GitHub Pages portfolio

This is the static GitHub Pages edition of the approved portfolio. It keeps the pixel design, wording, project carousel, light/dusk themes, project pages, printable résumé, and photography gallery with category filters and a full-screen viewer. No Node.js installation or build command is needed to publish it.

## Publish at https://xinger-ji.github.io

1. Sign into GitHub as **Xinger-Ji**. Create a **public** repository named **xinger-ji.github.io**. If that repository already exists, use it. Your existing `xingerji-technical-portfolio` repository can remain as your original source backup.
2. Extract this ZIP. Open the extracted `xinger-ji-github-pages` folder.
3. In the new repository, choose **uploading an existing file** (or **Add file → Upload files**). Drag the **contents** of the extracted folder into the upload area. Include `index.html`, `resume.html`, `assets`, `content`, `photography`, `photos`, and `projects`. Commit the upload to `main`.
4. Check that `index.html` appears directly in the repository's top-level file list. It must not be inside `XingerPortfolio` or `xinger-ji-github-pages` on GitHub.
5. Open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**. Choose **main**, **/(root)**, then **Save**. Leave the **Custom domain** field empty; GitHub supplies the `github.io` address.
6. Wait for publication. In **Settings → Pages**, use **Visit site**. Your address will be **https://xinger-ji.github.io/**. GitHub says publication can take up to 10 minutes.

This package is prepared for upload; it does not itself rename your repository, enable Pages, or replace the existing hosted site. The previous `chatgpt.site` address remains available independently. GitHub changes will update the GitHub Pages version only.

## Add your portrait

1. Upload a JPG, PNG, or WebP image to `photos/`, for example `photos/portrait.jpg`.
2. Edit `content/profile.json` on GitHub with the pencil button:

```json
{
  "src": "photos/portrait.jpg",
  "alt": "Xinger Ji",
  "position": 50
}
```

3. Commit the change. `position` controls the vertical crop from 0 (top) to 100 (bottom). Leave `src` empty to use the existing XJ placeholder.

## Add photographs

1. On GitHub, open `photos/` and choose **Add file → Upload files**. Upload your images and commit. Use simple filenames such as `boston-harbor.jpg`. Resize large originals to a reasonable web size (for example, a 2000-pixel long edge).
2. Edit `content/photos.json` with the pencil button. Replace the empty list with your entries:

```json
{
  "photos": [
    {
      "src": "photos/boston-harbor.jpg",
      "title": "Boston Harbor",
      "category": "City",
      "location": "Boston, MA",
      "caption": "Evening light along the waterfront.",
      "alt": "Warm evening light reflecting on Boston Harbor"
    },
    {
      "src": "photos/second-photograph.jpg",
      "title": "Your next photograph",
      "category": "Travel",
      "location": "",
      "caption": "",
      "alt": "Describe what appears in this photograph"
    }
  ]
}
```

3. Replace these examples with your own filenames and descriptions. Add a comma between entries, with no comma after the final entry. Commit your changes. The list order is the gallery order; the homepage shows the first six photographs in the selected category.

All image paths are relative to the website root. Use `photos/filename.jpg`, without an opening slash. Filenames and extensions must match exactly, including uppercase letters. `title` and `src` are required. The other fields are optional. Categories create filters automatically. Add `"hidden": true` to omit an entry from the gallery. This does not restrict direct access to an image file on a public website.

No photographs or portrait are bundled: the source export did not include images stored in the original site's upload service. If you added any there, download your copies and add them to `photos/` here. GitHub Pages does not provide the original owner upload panel; changes are published through GitHub uploads and commits.

## Edit wording later

- Homepage: `index.html`.
- Photography page introduction: `photography/index.html`.
- Project narratives: `projects/*.html`.
- Printable résumé: `resume.html`.
- Fonts, colors, and layout: `assets/style.css`.
- The carousel uses four `<template data-project="…">` elements near the end of `index.html`. If you revise project text, update its template. For the first project, also update the initially visible `project-deck` near the top.

## Preview locally (optional)

Use a local web server so the photo JSON files can load. Opening `index.html` by double-clicking uses `file://`, which browsers restrict.

If Python is installed, open a terminal **inside this extracted folder** and run:

```powershell
python -m http.server 8000
```

Then open http://localhost:8000. This is optional; GitHub Pages serves the files normally.

## Troubleshooting

- **404 at the main address:** confirm the repository name is `xinger-ji.github.io`, `index.html` is at its root, and Pages uses `main` and `/(root)`.
- **Upload appears inside another folder:** upload the contents of the extracted folder instead of its enclosing folder.
- **No photos:** check the JSON syntax and exact filenames. Both the image file and the JSON entry must be committed.
- **Old content:** allow publication to finish, check the repository's **Actions** tab for a successful **pages build and deployment**, then refresh the browser.
- **Need a different site address:** the account site uses your GitHub username. A project repository produces `https://xinger-ji.github.io/repository-name/`. This package uses relative links and supports either location.

Official GitHub guidance:

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
