# Project MaxOS Website

A responsive multi-page website for Project MaxOS, a custom ROM project based on HyperOS.

## Structure

```text
repository/
├── index.html
├── Readme.md
├── Features.md
└── projectmaxos/
    ├── index.html
    ├── about.html
    ├── gallery.html
    ├── features.html
    ├── contribution.html
    └── assets/
        ├── css/style.css
        ├── js/main.js
        ├── images/maxos-logo.jpg
        ├── images/team/ (profile pictures for the Contribution page)
        └── images/gallery/ (150 uploaded screenshots)
```

## GitHub Pages

1. Upload the contents of this folder to the root of your GitHub repository.
2. Open **Settings → Pages**.
3. Set **Build and deployment** to **Deploy from a branch**.
4. Choose your branch (usually `main`) and folder `/(root)`.
5. Save. The root `index.html` redirects visitors to `projectmaxos/index.html`.

## Customize

- Replace the placeholder gallery tiles with official screenshots when available.
- Add confirmed device names, build links, changelogs, and installation guides.
- Update Telegram profile/community URLs if the project's handles use different links.

The site avoids listing unconfirmed device support or fabricated download links.

## Gallery

The gallery has an edition selector (Void, Kyuka Sugetsu). The 150 uploaded screenshots belong to Void and are grouped into System UI, Settings, Home & Lock Screen, and Apps & Features. It includes category filters, scroll reveal effects, and an image lightbox with previous/next navigation.

## Design

A minimal frosted-glass theme: sage and white surfaces with the logo's oxblood as the single accent. All styling lives in `projectmaxos/assets/css/style.css`.
