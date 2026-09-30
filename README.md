# stavshamir.github.io

Source for [stavshamir.github.io](https://stavshamir.github.io), built with
[Astro](https://astro.build) from its blog template and deployed to GitHub Pages
by `.github/workflows/deploy.yml` on every push to `master`.

## Writing

Posts are markdown files in `src/content/blog/`. The file name is the URL:
`src/content/blog/my-post.md` is served at `/blog/my-post/`.

```yaml
---
title: "Post title"
description: "One sentence for the post list, RSS and link previews."
pubDate: 2026-10-01
heroImage: "../../assets/blog/header.jpg" # optional
draft: true # optional; drafts show in `npm run dev` only
---
```

Images referenced with markdown (`![alt](../../assets/blog/x.png)`) are
optimized at build time. Images that need an explicit size go in `public/` and
use an `<img>` tag.

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321`, drafts included |
| `npm run build` | Production build to `./dist/`, drafts excluded |
| `npm run preview` | Preview the production build |
