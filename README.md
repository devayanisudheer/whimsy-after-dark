# 🌙 Whimsy After Dark

**Beautifully strange things worth finding.**

A dark, whimsical, purple-and-black affiliate product-discovery website. Visitors browse curated finds and click through to the real product page on Amazon, Meesho, Flipkart, Myntra, or wherever you're an affiliate. No cart, no checkout, no backend — just a beautiful static site that runs entirely for free on **GitHub Pages**.

---

## 1. What's in this project

```
whimsy-after-dark/
├── index.html          ← the whole site (one page, many sections)
├── products.json        ← your product database — edit this to add/remove products
├── README.md             ← this file
├── robots.txt            ← tells search engines they can crawl the site
├── sitemap.xml            ← helps search engines find the page
├── assets/
│   ├── images/            ← put your product photos here
│   └── icons/
│       └── favicon.svg     ← the little moon icon in the browser tab
├── css/
│   └── style.css           ← all styling (dark/purple theme)
└── js/
    └── script.js            ← loads products.json and powers search/filters/modal
```

**How it works, in plain terms:**

1. `index.html` is the page structure — header, hero, sections, footer, and an empty product-preview modal.
2. `products.json` is your database. It's just a list of product objects.
3. `js/script.js` fetches `products.json` when the page loads, and builds the product cards on the page automatically — Trending, Under ₹299, Recently Added, and the full filterable "All Finds" grid.
4. Because it's a **static site** (no server, no database), GitHub Pages can host it for free. GitHub simply serves the HTML/CSS/JS/JSON files as-is.

**The one real limitation of a static site:** there's no server-side logic. Search, filtering, and sorting all happen in the visitor's browser using the data already in `products.json`. That's perfect for a catalog of hundreds of products, but it isn't a real search engine and it can't do things like personalized recommendations or a real shopping cart — which you don't need here anyway.

---

## 2. How to add a new product (no HTML editing required)

Open `products.json` and add a new object to the array. Example:

```json
{
  "id": 13,
  "name": "Starlit Velvet Scrunchie Set",
  "description": "Three deep-purple velvet scrunchies for hair that wants to look expensive.",
  "price": "₹229",
  "category": "Soft Girl",
  "marketplace": "Meesho",
  "image": "assets/images/scrunchie-set.jpg",
  "affiliateUrl": "https://your-real-affiliate-link.com/product/12345",
  "badge": "New",
  "featured": false,
  "tags": ["hair", "scrunchie", "velvet", "purple"]
}
```

Steps:

1. Save your product photo into `assets/images/` (e.g. `scrunchie-set.jpg`).
2. Open `products.json`, add a comma after the last product's closing `}`, then paste your new product object.
3. Set `"image"` to match the filename you used.
4. Set `"affiliateUrl"` to your real affiliate link (never a placeholder — see the note below).
5. Commit and push to GitHub (or edit directly on GitHub — see below).

That's it. No HTML editing, no rebuilding anything. The site reads `products.json` every time it loads.

**Field reference:**

| Field | Required | Notes |
|---|---|---|
| `id` | yes | A unique number. Used for sorting "Newest" and for `?product=id` links. |
| `name` | yes | Product name. |
| `description` | yes | Short aesthetic description (1–2 sentences). |
| `price` | yes | Display string, e.g. `"₹299"`. |
| `category` | yes | Must match one of the category chips (see below) to filter correctly. |
| `marketplace` | yes | `Amazon`, `Meesho`, `Flipkart`, `Myntra`, or `Other`. |
| `image` | yes | Relative path, e.g. `assets/images/yourfile.jpg`. |
| `affiliateUrl` | yes | The real external link visitors are redirected to. |
| `badge` | no | e.g. `Trending`, `New`, `Editor's Pick`, `Under ₹299`. |
| `featured` | no | `true`/`false`. Featured products get priority in "Featured" sort and Trending. |
| `tags` | no | Array of lowercase keywords used by search and the "Find Your Mood" cards. |

**Important:** this project ships with 12 **sample/demo products** using `https://example.com/...` placeholder links so the site isn't blank when you first open it. Replace every `example.com` link with your own real, legitimate affiliate URL before promoting the site. Never invent or auto-generate affiliate links — only use links you actually obtained from an affiliate program.

---

## 3. Deploying to GitHub Pages (beginner-friendly, no terminal needed)

### Step 1 — Create the repository

1. Go to [github.com](https://github.com) and log in (create a free account if you don't have one).
2. Click the **+** icon top-right → **New repository**.
3. Name it exactly: `whimsy-after-dark`
4. Set it to **Public**.
5. Do **not** check "Add a README" (you already have one).
6. Click **Create repository**.

### Step 2 — Upload the project files

1. On your new (empty) repository page, click **uploading an existing file**.
2. Drag in every file and folder from this project — `index.html`, `products.json`, `README.md`, `robots.txt`, `sitemap.xml`, and the `css/`, `js/`, `assets/` folders (drag whole folders in at once; GitHub keeps the structure).
3. Scroll down, add a commit message like `Initial upload`, and click **Commit changes**.

### Step 3 — Enable GitHub Pages

1. In your repository, click **Settings** (top menu).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **main** and folder **/ (root)**, then click **Save**.
5. Wait 1–2 minutes. Refresh the Pages settings page — you'll see a green banner with your live URL:

   ```
   https://YOUR_USERNAME.github.io/whimsy-after-dark/
   ```

That's your live site.

### Step 4 — Update the site later

Every time you want to add a product or change something:

1. Open the file on GitHub (e.g. `products.json`).
2. Click the pencil ✏️ icon to edit it directly in the browser.
3. Make your change.
4. Scroll down, add a commit message, click **Commit changes**.
5. GitHub Pages redeploys automatically within a minute or two.

### Optional: using Git from the terminal instead

```bash
git clone https://github.com/YOUR_USERNAME/whimsy-after-dark.git
cd whimsy-after-dark
# copy/edit files here
git add .
git commit -m "Add new products"
git push
```

---

## 4. How to customize

| What | Where |
|---|---|
| Website name / tagline | `index.html` — search for `WHIMSY AFTER DARK` and the tagline text; update the `<title>` and meta tags too. |
| Colors | `css/style.css` — all colors are CSS variables at the top of the file under `:root`. Change one value and it updates everywhere. |
| Categories | `index.html` — the `.category-chips` list; also update `data-category` values to match what you use in `products.json`. |
| Social links | `index.html` footer — replace the `YOUR_USERNAME` placeholders in the Instagram/Pinterest/TikTok links. |
| Affiliate disclosure | `index.html` — the `#affiliate-disclosure` section. |
| Products | `products.json` — see section 2 above. |
| Your real domain | Replace `YOUR_USERNAME` in `index.html` (canonical/OG tags), `robots.txt`, and `sitemap.xml` once your GitHub Pages URL is live. |

---

## 5. Sharing individual products (`?product=123`)

Every product can be linked directly and will pop open its preview modal automatically:

```
https://YOUR_USERNAME.github.io/whimsy-after-dark/?product=3
```

This works because `js/script.js` reads the `product` URL parameter on load and opens that product's modal — perfect for Instagram bio links, Pinterest pins, or WhatsApp shares. No extra setup needed; it works out of the box on GitHub Pages.

---

## 6. Testing checklist

Before promoting the site, check:

- [ ] **Product links** — click every product image, title, and "Reveal the find" button; confirm it opens the correct `affiliateUrl` in a new tab.
- [ ] **Mobile layout** — open the live URL on your phone; check the hero, product grid (2 columns), hamburger menu, and modal all look right.
- [ ] **Search** — try a product name, a tag, and a nonsense word (should show "No magical finds here yet. ✦").
- [ ] **Filters** — test category chips, marketplace dropdown, "Editor's Picks only", and every sort option.
- [ ] **Images** — confirm every `image` path in `products.json` actually matches a file in `assets/images/`. Missing images fall back to a plain dark tile rather than breaking the layout.
- [ ] **GitHub Pages deployment** — visit the live `github.io` URL (not just your local files) to confirm everything loads correctly from the real hosted paths.
- [ ] **Affiliate URLs** — double-check every `affiliateUrl` is a real, legitimate link before sharing the site publicly. The sample products use `https://example.com/...` placeholders that must be replaced.
- [ ] **Reduced motion** — enable "reduce motion" in your OS accessibility settings and confirm animations calm down.

---

## 7. Future improvements (optional, not required for launch)

- A "Copy link" button on each product card for even faster sharing.
- A lightweight build step (e.g. a small Node script) that auto-generates `sitemap.xml` entries per product.
- Wishlist/favorites using `localStorage` (works fine outside of Claude artifacts — just not inside this chat's preview).
- Lazy-loaded product images via an `IntersectionObserver` for very large catalogs (100+ products).
- A dedicated `?category=` URL parameter, similar to the existing `?product=` one, for direct category deep-links.
- Pagination or "Load more" once your catalog grows past ~60–80 products, so the initial page stays fast.

None of these are needed to launch — the current version is a complete, working site.

---

## 8. A note on affiliate links & images

This project intentionally does **not** auto-generate affiliate URLs, scrape marketplaces, or download copyrighted product photos. You supply:

- Real affiliate/product URLs you're authorized to use (from Amazon Associates, Meesho, Flipkart Affiliate, Myntra, etc.).
- Product images you're permitted to use — typically supplied through the affiliate program's own creative assets, or photos you've taken/licensed yourself.

Keep the footer's affiliate disclosure visible and accurate at all times.
