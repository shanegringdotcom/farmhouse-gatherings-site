// Browser-free static prerender.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle).
// For each public route it renders the React tree to static HTML with
// react-dom/server, injects it into the built index.html shell, rewrites the
// per-route <head> (title/description/canonical/OG) and JSON-LD, and writes a
// static file so crawlers get real content + correct metadata on first request.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

// Minimal browser globals so modules that touch them at import time
// (e.g. the Supabase client's `storage: localStorage`) don't throw in Node.
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};
globalThis.localStorage = globalThis.localStorage || noopStorage;
globalThis.sessionStorage = globalThis.sessionStorage || noopStorage;

const SITE = "https://biglongfarmhouse.com";

// Route-specific JSON-LD. The homepage keeps the VacationRental / FAQPage /
// WebSite blocks that live in index.html. Sub-pages strip the homepage-only
// blocks (VacationRental, FAQPage) and get their own schema instead.
const guideJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Big Long Lake Guide", item: `${SITE}/big-long-lake` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/big-long-lake#webpage`,
    url: `${SITE}/big-long-lake`,
    name: "Big Long Lake Guide",
    description:
      "A guide to Big Long Lake in Wolcottville, Indiana — swimming, boating, fishing, kayaking, the public access boat launch, a lake map, seasonal events, and staying lakefront at The Farmhouse.",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/big-long-lake#lake` },
    primaryImageOfPage: `${SITE}/images/houses-from-lake.webp`,
  },
  {
    "@context": "https://schema.org",
    "@type": "LakeBodyOfWater",
    "@id": `${SITE}/big-long-lake#lake`,
    name: "Big Long Lake",
    description:
      "An all-sports, roughly 300-acre lake in LaGrange County, Indiana near Wolcottville. Popular for swimming, boating, water skiing, fishing, kayaking, and paddleboarding.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Wolcottville",
      addressRegion: "IN",
      addressCountry: "US",
    },
    // The lake itself (OSM water polygon centre), not the house — the house
    // stays town-level everywhere public.
    geo: { "@type": "GeoCoordinates", latitude: 41.5577, longitude: -85.2367 },
    publicAccess: true,
  },
];

// The lake's history page, nested under the Big Long Lake guide in the
// breadcrumb. `about` points at the LakeBodyOfWater entity defined on
// /big-long-lake rather than redefining it here.
const historyJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Big Long Lake Guide", item: `${SITE}/big-long-lake` },
      { "@type": "ListItem", position: 3, name: "History", item: `${SITE}/history-of-big-long-lake` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/history-of-big-long-lake#webpage`,
    url: `${SITE}/history-of-big-long-lake`,
    name: "The History of Big Long Lake",
    description:
      "The story of Big Long Lake in LaGrange County, Indiana — from the Cochran family's 1800s settlement and Cochran's Tavern to Lee Hartzell's cottage era, the 1926 amusement company, and the Shady Nook Resort.",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/big-long-lake#lake` },
    image: `${SITE}/images/history/1925-big-long-lake-survey-map.jpg`,
  },
];

// The regional lakes guide. FAQPage mirrors the questions rendered on the page —
// keep the two in sync, or the markup misrepresents the content.
const lakesGuideFaqs = [
  [
    "How many lakes are in northern Indiana?",
    "The Natural Resources Commission's official listing of public freshwater lakes records 239 across the four core lake counties alone — 76 in Steuben, 64 in Kosciusko, 52 in LaGrange and 47 in Noble.",
  ],
  [
    "Why does northeast Indiana have so many lakes?",
    "They are glacial. The Indiana DNR notes that eighteen counties in northern Indiana contain natural lakes, but Kosciusko, LaGrange, Noble and Steuben hold nearly 70% of the total surface acreage between them.",
  ],
  [
    "What is the largest lake in Indiana?",
    "Lake Wawasee in Kosciusko County, at 3,006 acres, is the largest natural lake wholly within the state.",
  ],
  [
    "What is the deepest lake in Indiana?",
    "Lake Tippecanoe in Kosciusko County, with a maximum depth of 122 feet and an average depth of 37 feet.",
  ],
  [
    "When is the best time to visit the northern Indiana lakes?",
    "Late June through August is peak season. September is the quiet favourite — still swimmable, with far less boat traffic.",
  ],
  [
    "Can you swim in the northern Indiana lakes?",
    "Yes. Public beaches include Pokagon State Park on Lake James, Chain O'Lakes State Park, Bixler Lake in Kendallville and Webster Lake.",
  ],
];

const lakesGuideJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Northern Indiana Lakes",
        item: `${SITE}/northern-indiana-lakes`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE}/northern-indiana-lakes#article`,
    headline: "Northern Indiana Lakes: A Complete Guide to Indiana's Lake Country",
    description:
      "A guide to the 239 public lakes of LaGrange, Steuben, Noble and Kosciusko counties — Indiana's lake country — with acreage, depth and fishing detail sourced from the Indiana DNR.",
    about: { "@id": `${SITE}/northern-indiana-lakes#region` },
    isPartOf: { "@id": `${SITE}/#website` },
    author: { "@type": "Organization", name: "The Farmhouse at Big Long Lake" },
    publisher: { "@id": `${SITE}/#vacation-rental` },
    image: `${SITE}/images/houses-from-lake.webp`,
  },
  {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${SITE}/northern-indiana-lakes#region`,
    name: "Northern Indiana Lake Country",
    description:
      "The lake district of northeastern Indiana, covering LaGrange, Steuben, Noble and Kosciusko counties, which together hold nearly 70% of Indiana's natural lake surface acreage.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "IN",
      addressCountry: "US",
    },
    containsPlace: [
      { "@type": "LakeBodyOfWater", name: "Lake Wawasee" },
      { "@type": "LakeBodyOfWater", name: "Lake Tippecanoe" },
      { "@type": "LakeBodyOfWater", name: "Lake James" },
      { "@type": "LakeBodyOfWater", name: "Big Long Lake" },
      { "@type": "LakeBodyOfWater", name: "Clear Lake" },
      { "@type": "LakeBodyOfWater", name: "Sylvan Lake" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE}/northern-indiana-lakes#faq`,
    mainEntity: lakesGuideFaqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

// The regional ice cream guide. As with the lakes guide, FAQPage mirrors the
// questions rendered on the page — keep the two in sync.
const iceCreamGuideFaqs = [
  [
    "Where is the closest ice cream to Big Long Lake?",
    "Cowlick's Ice Cream Shoppe on W 700 S in Wolcottville is the nearest, a few minutes from the lake, with more than 30 hand-dipped flavours plus soft serve, shakes and sundaes. Lickity Splitz in Rome City, near Sylvan Lake, is the other close one.",
  ],
  [
    "Is there an ice cream trail in northern Indiana?",
    "Yes. The Steuben County Tourism Bureau runs an official Ice Cream Trail of eight stops around Angola, Fremont, Orland, Hamilton and Pokagon State Park. It is the only formal trail in the region.",
  ],
  [
    "What is the best ice cream in Shipshewana?",
    "Vanilla Bean Creamery, beside the Blue Gate, makes around 30 flavours in small batches from scratch. Shipshewana also has Mom's Ice Cream, the Wana Cup, the Blue Gate Garden Inn soda fountain and Shawna Rae's.",
  ],
  [
    "Are the ice cream shops open year-round?",
    "Most are not. The majority are seasonal, running spring through early autumn, and several are walk-up windows. Between roughly Memorial Day and Labor Day you can turn up; outside it, ring ahead or check the shop's Facebook page.",
  ],
  [
    "Where can I find dairy-free or gluten-free ice cream in the area?",
    "Scoops in Angola carries non-dairy and gluten-free options, Skoops in North Webster has dairy-free and sugar-free, and Cowabunga Creamery in Albion offers both gluten-free and dairy-free.",
  ],
  [
    "Is the ice cream in Amish country actually Amish-made?",
    "Some of it. Several LaGrange County shops are Amish- or Mennonite-owned family businesses, and the frozen custard and root beer around Shipshewana are genuinely local. Many shops scoop excellent ice cream made elsewhere — Hudsonville, Ashby's, Velvet, Chocolate Shoppe, Glacier.",
  ],
];

const iceCreamGuideJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Northern Indiana Ice Cream",
        item: `${SITE}/northern-indiana-ice-cream`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE}/northern-indiana-ice-cream#article`,
    headline:
      "Northern Indiana Ice Cream: A Guide to the Lake Country Scoop Shops",
    description:
      "A guide to 24 ice cream shops across LaGrange, Steuben, Noble and Kosciusko counties, including the Steuben County Ice Cream Trail's eight official stops.",
    about: { "@id": `${SITE}/northern-indiana-lakes#region` },
    isPartOf: { "@id": `${SITE}/#website` },
    author: { "@type": "Organization", name: "The Farmhouse at Big Long Lake" },
    publisher: { "@id": `${SITE}/#vacation-rental` },
    image: `${SITE}/images/houses-from-lake.webp`,
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE}/northern-indiana-ice-cream#shops`,
    name: "Ice cream shops in northern Indiana's lake country",
    itemListOrder: "https://schema.org/ItemListUnordered",
    // A representative set, not the full listing — each is a business whose
    // street address has been verified. Keep in sync with src/data/ice-cream.ts.
    // [name, street, town, postcode, url]
    itemListElement: [
      ["Cowlick's Ice Cream Shoppe", "1405 W 700 S", "Wolcottville", "46795", null],
      ["Vanilla Bean Creamery", "100 S Van Buren St", "Shipshewana", "46565", null],
      ["Mom's Ice Cream", "655 S Van Buren St", "Shipshewana", "46565", "https://momsicecream.com/"],
      ["Lickity Splitz Ice Cream & Coffee", "3204 E CR 900 N", "Rome City", "46784", "https://lickitysplitz.square.site/"],
      ["Cowabunga Creamery", "118 E Main St", "Albion", "46701", "https://cowabungacreamery.square.site/"],
      ["Scoops Ice Cream", "3331 N State Rd 127", "Angola", "46703", null],
      ["Zesto", "2931 N State Rd 127", "Angola", "46703", null],
      ["The Social Ice Cream Co.", "2405 N 200 W", "Angola", "46703", null],
      ["Capt'n Pete's Dairy Dock", "7425 S Wayne St", "Hamilton", "46742", null],
      ["Skoops", "114 N Main St", "North Webster", "46555", "https://skoopsnw.com/"],
      ["Social Ice Cream & Sandwich Shop", "904 Park Ave", "Winona Lake", "46590", "https://villageatwinona.com/eat/social/"],
      ["Ritter's Frozen Custard", "3845 Lake City Hwy", "Warsaw", "46580", null],
    ].map(([name, street, town, postcode, url], i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "IceCreamShop",
        name,
        ...(url ? { url } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: street,
          addressLocality: town,
          addressRegion: "IN",
          postalCode: postcode,
          addressCountry: "US",
        },
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE}/northern-indiana-ice-cream#faq`,
    mainEntity: iceCreamGuideFaqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

const aboutJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Our Family", item: `${SITE}/about` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE}/about#webpage`,
    url: `${SITE}/about`,
    name: "Our Family | The Farmhouse at Big Long Lake",
    description:
      "Meet the Gring family, owners of The Farmhouse at Big Long Lake in Wolcottville, Indiana.",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#vacation-rental` },
  },
];

// Routes to prerender. The private /welcome page and unknown routes keep the
// SPA fallback (index.html) — they are intentionally not prerendered.
const routes = [
  {
    path: "/",
    out: "index.html",
    // Keep in sync with index.html — these values overwrite the ones in the
    // shell for the built homepage.
    // The 1-7 Aug report: 98 impressions at average position 8.8 and zero
    // clicks, second week running. Page-one visibility that never converts is a
    // listing problem, not a ranking one — at position 6.8 the searcher is
    // reading this title against Airbnb and VRBO results that show a price and a
    // Book button, and picking one of those instead. Both lines now carry an
    // explicit booking cue. Keep the lake name first (it is the query), and keep
    // capacity and the dock — they are what a group of 12 is actually filtering
    // on. Title is 54 chars and the description 155, so neither gets truncated
    // and the booking cue survives into the listing.
    title: "Big Long Lake Rental, Indiana — Sleeps 12, Book Direct",
    description:
      "Lakefront house on Big Long Lake, Wolcottville, Indiana. Sleeps 12 in 4 bedrooms, full kitchen, private dock. Book direct — send dates, we reply in 24 hours.",
    home: true,
  },
  {
    // Flat `about.html`, not `about/index.html`. With Netlify's pretty_urls a
    // directory index makes /about 301 to /about/, so every internal link, the
    // sitemap entry and the canonical (all slash-less) cost a redirect hop.
    // A flat file is served at /about directly, 200.
    path: "/about",
    out: "about.html",
    title: "Our Family | The Farmhouse at Big Long Lake",
    description:
      "Meet the Gring family, owners of The Farmhouse at Big Long Lake in Wolcottville, Indiana — one of the oldest homes on the lake, kept in the family since 2018.",
    jsonLd: aboutJsonLd,
  },
  {
    path: "/big-long-lake",
    out: "big-long-lake.html",
    title: "Big Long Lake Guide | Things to Do, Fishing & Events, Wolcottville IN",
    description:
      "A guide to Big Long Lake in Wolcottville, Indiana — swimming, boating, fishing, kayaking, the public access boat launch, a lake map, seasonal events, and staying lakefront at The Farmhouse.",
    jsonLd: guideJsonLd,
  },
  {
    path: "/history-of-big-long-lake",
    out: "history-of-big-long-lake.html",
    title: "The History of Big Long Lake | LaGrange County, Indiana",
    description:
      "The story of Big Long Lake in LaGrange County, Indiana — from the Cochran family's 1800s settlement and Cochran's Tavern to Lee Hartzell's cottage era, the 1926 amusement company, and the Shady Nook Resort.",
    jsonLd: historyJsonLd,
    // Own OG/Twitter image — the 1925 survey map, not the default deck photo.
    image: {
      url: `${SITE}/images/history/1925-big-long-lake-survey-map.jpg`,
      alt: "1925 State of Indiana Department of Conservation blueprint survey map of Big Long Lake, LaGrange County, showing depth contours, shoreline, and topography.",
    },
  },
  {
    path: "/northern-indiana-lakes",
    out: "northern-indiana-lakes.html",
    title: "Northern Indiana Lakes: Complete Guide to Indiana's Lake Country",
    description:
      "A complete guide to the lakes of northern Indiana — 239 public lakes across LaGrange, Steuben, Noble and Kosciusko counties, which hold nearly 70% of the state's natural lake acreage. Acreage, depth and fishing detail from the Indiana DNR.",
    jsonLd: lakesGuideJsonLd,
  },
  {
    path: "/northern-indiana-ice-cream",
    out: "northern-indiana-ice-cream.html",
    title: "Northern Indiana Ice Cream: 24 Shops Across Indiana's Lake Country",
    description:
      "A guide to ice cream in northern Indiana — 24 shops across LaGrange, Steuben, Noble and Kosciusko counties, including the eight stops on the Steuben County Ice Cream Trail, sorted by distance from the lakes.",
    jsonLd: iceCreamGuideJsonLd,
  },
  {
    // Where OwnerRez returns the guest after payment + e-signature. Flat file
    // for the same reason as /about, and noindex because it is a transactional
    // dead end — deliberately NOT added to sitemap.xml.
    path: "/booking-confirmed",
    out: "booking-confirmed.html",
    title: "Booking Confirmed | The Farmhouse at Big Long Lake",
    description: "Your stay at The Farmhouse at Big Long Lake is confirmed.",
    noindex: true,
  },
  {
    // Served by the Worker's `not_found_handling: "404-page"` for any unknown
    // path — a real HTTP 404 whose body is the NotFound page (the router's "*"
    // route matches "/404" too). notFound strips the canonical/og:url and sets
    // noindex: the old Netlify soft-404 problem was unknown paths carrying the
    // homepage canonical.
    path: "/404",
    out: "404.html",
    title: "Page Not Found | The Farmhouse at Big Long Lake",
    description: "That page doesn't exist. Head back to the farmhouse.",
    notFound: true,
  },
];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Remove a homepage-only JSON-LD block (identified by its HTML comment label).
const stripBlock = (html, label) =>
  html.replace(
    new RegExp(`\\s*<!-- Structured Data: ${label} -->\\s*<script type="application/ld\\+json">[\\s\\S]*?</script>`),
    ""
  );

const templatePath = path.join(distDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("prerender: dist/index.html not found — run `vite build` first.");
  process.exit(1);
}
const template = fs.readFileSync(templatePath, "utf-8");

const { render } = await import(path.join(distDir, "server", "entry-server.js"));

const applyHead = (html, route) => {
  const canonical = route.path === "/" ? `${SITE}/` : `${SITE}${route.path}`;
  const title = esc(route.title);
  const desc = esc(route.description);
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[\s\S]*?("\s*\/?>)/, `$1${desc}$2`)
    .replace(/(<link rel="canonical" href=")[\s\S]*?("\s*\/?>)/, `$1${canonical}$2`)
    .replace(/(<meta property="og:url" content=")[\s\S]*?(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:title" content=")[\s\S]*?(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[\s\S]*?(")/, `$1${desc}$2`)
    .replace(/(<meta name="twitter:title" content=")[\s\S]*?(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[\s\S]*?(")/, `$1${desc}$2`);

  if (!route.home) {
    // Homepage-specific schema shouldn't appear on sub-pages.
    html = stripBlock(html, "VacationRental");
    html = stripBlock(html, "FAQPage");
  }

  if (route.noindex) {
    // Indexable pages only. A post-payment landing page has nothing to offer a
    // searcher and would compete with the homepage for the brand query.
    html = html.replace(/(<meta name="robots" content=")[\s\S]*?(")/, "$1noindex$2");
  }

  if (route.notFound) {
    // A 404 must not claim to be a canonical page or invite indexing.
    html = html
      .replace(/\s*<link rel="canonical"[^>]*\/?>/, "")
      .replace(/\s*<meta property="og:url"[^>]*\/?>/, "")
      .replace(/(<meta name="robots" content=")[\s\S]*?(")/, "$1noindex$2");
  }

  if (route.image) {
    // Per-route social image override. Only og:image, og:image:alt and
    // twitter:image exist as tags in index.html — no og:image:width/height
    // to touch. Routes without `image` fall through untouched, so their
    // output stays byte-identical.
    const imageUrl = esc(route.image.url);
    const imageAlt = esc(route.image.alt);
    html = html
      .replace(/(<meta property="og:image" content=")[\s\S]*?(")/, `$1${imageUrl}$2`)
      .replace(/(<meta property="og:image:alt" content=")[\s\S]*?(")/, `$1${imageAlt}$2`)
      .replace(/(<meta name="twitter:image" content=")[\s\S]*?(")/, `$1${imageUrl}$2`);
  }

  if (route.jsonLd && route.jsonLd.length) {
    const scripts = route.jsonLd
      .map((obj) => `\n    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>`)
      .join("");
    html = html.replace("</head>", `${scripts}\n  </head>`);
  }

  return html;
};

let count = 0;
for (const route of routes) {
  const appHtml = render(route.path);
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  html = applyHead(html, route);

  const outPath = path.join(distDir, route.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  count++;
  console.log(`prerendered ${route.path} -> dist/${route.out} (${appHtml.length} bytes of HTML)`);
}

// The SSR bundle is only needed at build time.
fs.rmSync(path.join(distDir, "server"), { recursive: true, force: true });

console.log(`prerender: wrote ${count} route(s).`);
