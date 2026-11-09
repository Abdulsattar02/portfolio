# Abdul Sattar Maher — Portfolio

A static site built with HTML, CSS and a small vanilla JavaScript file. There is no build step and nothing to install. It deploys as-is to Vercel or GitHub Pages.

## Page order

Hero → About + Qualification → Live projects → Client work → Stack → Contact → Footer

## Folder structure

```
portfolio/
├── index.html                    # all page content (visible even if JavaScript fails)
├── styles.css                    # colour tokens at the top (light + soft dark), then sections in page order
├── script.js                     # scroll reveals, theme toggle, active nav, cursor, contact form
├── Abdul_Sattar_Maher_CV.pdf     # downloaded by the "Download resume" button
├── abdulsattarmaher.jpg          # portrait (JPG fallback)
├── abdulsattarmaher-400.webp     # portrait, small
├── abdulsattarmaher-680.webp     # portrait, large
├── assets/projects/*.webp        # project screenshots
├── og-image.png                  # 1200×630 link-preview image
├── og-source.html                # the page og-image.png was rendered from (not deployed)
├── favicon.svg
├── about.html, contact.html,     # old URLs that redirect into index.html
│   home.html, services.html
├── vercel.json                   # caching + security headers
├── .vercelignore                 # keeps notes and backups off the live site
└── _previous/                    # backup of the old version (not deployed, safe to delete)
```

## Run it locally

Open `index.html` in a browser. For auto-reload while editing, use the VS Code **Live Server** extension. The contact form also works from Live Server.

## Contact form (Web3Forms → your Gmail)

1. Go to **https://web3forms.com**.
2. In "Create your Access Key", type **abdulsattarmaher20@gmail.com** and click **Create Access Key**. No account or password is needed.
3. Open your Gmail inbox. Web3Forms sends you the key, a long code like `a1b2c3d4-....`.
4. Open `index.html` and find this line (search for `YOUR_WEB3FORMS_ACCESS_KEY`):
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
   Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your key. Keep the quotes.
5. Save, deploy, and send yourself a test message from the live site. Check your **Spam** folder the first time and mark it "Not spam".

The key is safe to have in public code: it can only send mail to your own address.

Already built in:
- **Validation**: name, a valid email, and a message of at least 10 characters, with inline error text.
- **Spam protection**: a hidden `botcheck` honeypot field, which Web3Forms also checks on its side.
- **Messages**: "Thanks, your message is on its way" on success, a friendly error with your email on failure.
- **Reply-to**: hitting Reply in Gmail answers the visitor directly.

## Deploy on Vercel (recommended)

1. Create a GitHub repository and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/Abdulsattar02/portfolio.git
   git push -u origin main
   ```
2. On **vercel.com**, go to **Add New → Project** and import that repository.
3. Set Framework Preset to **Other** and leave Build Command and Output Directory empty. Click **Deploy**.
4. Copy your live address (for example `https://abdulsattar.vercel.app`) and put it in `index.html` wherever it says `YOUR-DOMAIN.vercel.app` (4 places). Push again.

Every later `git push` redeploys automatically.

## Or deploy on GitHub Pages

1. Push the folder to a repository (step 1 above).
2. In the repository, go to **Settings → Pages**, set **Source: Deploy from a branch**, then **Branch: main / (root)**, and click **Save**.
3. After a minute the site is live at `https://abdulsattar02.github.io/portfolio/`. Use that address for the `YOUR-DOMAIN` placeholders.

(Name the repository `Abdulsattar02.github.io` if you want the address without `/portfolio`.)

## What you must replace

Search the project for `[PLACEHOLDER]`.

| What | Where |
|---|---|
| ~~Web3Forms access key~~ | done (set in `index.html`) |
| ~~Site address~~ | done: https://abdulsattarmaher.vercel.app |
| Perfume Store live link | `index.html`, the "Live demo soon" button in the Tehreem Perfume Store card |
| "Available for work" badge (optional) | `index.html`, first line of the hero. Delete it if you are not looking. |
| Photo (only if you want a new one) | replace `abdulsattarmaher.jpg` and both `.webp` files, keeping the names. Use a square-ish photo with your face in the upper middle. |
| CV | replace `Abdul_Sattar_Maher_CV.pdf`, keeping the name |

## Editing tips

- **Colours** are in the first block of `styles.css` (`--bg`, `--ink`, `--accent`, …). The dark theme is the block just below.
- **Add a live project**: copy one `<article class="card project">` block in `index.html` and add a ~1100px-wide WebP screenshot to `assets/projects/`.
- **Add client work**: copy one `<li class="client">` row. Keep it to a name and one line.
- **Animation speed** is `--dur` in `styles.css` (0.9s). Visitors with "reduce motion" turned on get no animation.
- **New link-preview image**: edit `og-source.html`, open it in Edge, and take a 1200×630 screenshot (or re-run headless Edge with `--screenshot`).
