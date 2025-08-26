# Simple Static Site

This is a tiny, content-driven static website scaffold located in `site/`.

## Preview locally

From the project root:

```bash
# Start a local static file server
python3 -m http.server 8000 -d site
# Then open http://localhost:8000 in your browser
```

Alternatively, with Node.js installed:

```bash
npx http-server site -p 8000 -c-1
# Then open http://localhost:8000
```

## Edit content

- Site/page content is in `site/content/pages.json`.
- Update `site/styles.css` for styles.
- Update `site/index.html` structure if necessary.

### JSON structure

```json
{
  "site": {
    "title": "My Simple Site",
    "tagline": "Welcome to my website",
    "nav": [{ "slug": "home", "title": "Home" }],
    "footerTitle": "My Simple Site"
  },
  "pages": {
    "home": {
      "title": "Home",
      "sections": [
        { "type": "text", "html": "<p>Hello!</p>" }
      ]
    }
  }
}
```

Supported section types:
- `hero`: heading, subheading, cta
- `features`: heading, items[] (title, text)
- `text`: raw HTML blob