# ARP Peptide — website

A simple, static catalog website for ARP Peptide. It has **no payment and no cart**.
Customers browse products and click **Order Now**, which opens their email app with the
order pre-filled and sends it to you.

Built as plain HTML + CSS + JavaScript — **no build step, no dependencies, no backend.**

## Run it locally

Any static file server works. Two easy options:

```bash
# Python (built in on most systems)
python -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser (the site is written so it works from disk too).

## Deploy it

Upload the whole folder to any static host — Netlify, Vercel, GitHub Pages, Cloudflare
Pages, or ordinary web hosting. There is nothing to compile.

## The 3 things you'll want to change

### 1. Set your order email  → `assets/js/config.js`
```js
ordersEmail: 'orders@arppeptide.com'   // <-- replace with your real inbox
```
This is where every "Order Now" email is sent. Change it once here and the whole site updates.

### 2. Replace product images  → `assets/img/`
Current images are temporary placeholders. Drop your own photos in `assets/img/` and point
each product at them in `assets/js/products.js` (the `image:` line). Keeping the same
filenames means you don't even have to edit the data file.

### 3. Add / edit / remove products  → `assets/js/products.js`
Every product is one object in the `window.PRODUCTS` list. Copy an existing block and change:

```js
{
  slug: 'my-peptide',          // goes in the URL: product.html?slug=my-peptide (lowercase, no spaces)
  name: 'My Peptide',
  sizes: ['5mg', '10mg'],      // one or more; a dropdown appears when there's more than one
  specs: { contents: 'My Peptide', form: 'Lyophilized powder', purity: '>99%', sku: 'P-XX' },
  image: 'assets/img/my-peptide.jpg',
  descriptionHtml: `<h3>Heading</h3><p>Text...</p>`   // leave as '' for "Description coming soon"
}
```

## Pages
- `index.html` — home (hero, features, product grid, newsletter)
- `products.html` — full product listing
- `product.html` — a single product (`product.html?slug=...`), with the Order Now button
- `contact.html` — contact / how to order

## Notes
- **Retatrutide** currently shows "Description coming soon" and a placeholder image — add its
  text and photo when you have them (same as any other product above).
- All products are labelled **for laboratory research use only** in the footer disclaimer.
- No backend/admin panel yet. If you later want an admin login to manage products through a UI,
  that can be added on top of this site.
