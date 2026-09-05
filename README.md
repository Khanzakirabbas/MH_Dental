# MH Dental — ASP.NET Core Razor Pages + PWA

A Razor Pages recreation of the MH Dental homepage, set up as an installable
Progressive Web App (PWA).

## Requirements
- .NET 8 SDK (https://dotnet.microsoft.com/download)

## Run locally
```bash
cd MHDental
dotnet restore
dotnet run
```
Then open the URL shown in the console (e.g. `https://localhost:7216`).

## Project structure
```
MHDental/
├── Program.cs                  # App startup, static files, Razor Pages
├── MHDental.csproj
├── appsettings.json
├── Pages/
│   ├── Index.cshtml            # Homepage markup
│   ├── Index.cshtml.cs         # Homepage data (products, events, reviews)
│   ├── Error.cshtml / .cs
│   ├── _ViewImports.cshtml
│   ├── _ViewStart.cshtml
│   └── Shared/
│       └── _Layout.cshtml      # Header, nav, footer, PWA meta tags
└── wwwroot/
    ├── css/site.css
    ├── js/site.js               # Registers service worker, handles install prompt
    ├── manifest.json            # PWA manifest
    ├── service-worker.js        # Offline caching (network-first for pages)
    ├── favicon.ico
    └── icons/
        ├── icon-192.png
        ├── icon-512.png
        └── icon-maskable-512.png
```

## PWA features included
- **Web App Manifest** (`wwwroot/manifest.json`) — name, icons, theme color,
  `display: standalone` so it opens without browser chrome when installed.
- **Service worker** (`wwwroot/service-worker.js`) — precaches the app shell
  (CSS/JS/icons) and the homepage, uses a network-first strategy for page
  navigations (with cache fallback when offline) and cache-first for static
  assets.
- **Install prompt UI** — `site.js` listens for `beforeinstallprompt` and
  shows a small "Install the MH Dental app" banner instead of relying on the
  browser's default UI; `appinstalled` hides it once installed.
- **No-cache headers on the service worker file itself** (set in `Program.cs`)
  so browsers always fetch the latest service worker and pick up updates.

## What's new in this update
- **Real images everywhere** — categories, hot products, partner "logos",
  and testimonial avatars now use placeholder image services
  (LoremFlickr for product/category photos, placehold.co for partner
  logo badges, pravatar.cc for reviewer photos) instead of flat icons, so
  the page looks populated with real photography out of the box.
  **These are dummy placeholders** — swap each `ImageUrl` / `LogoUrl` /
  `PhotoUrl` in `Index.cshtml.cs` for your real product photos and actual
  partner logos before going live (the partner names shown are for layout
  reference only, not confirmed licensing relationships).
- **Row sliders** — Shop By Category, Hot Products, and Our Partners are
  now horizontally scrolling sliders with left/right arrow buttons
  (`.slider-track` + `.slider-arrow`, wired up in `site.js`). They also
  support touch swipe natively and snap each card into place
  (`scroll-snap-type`).
- **Hero banner repositioned** — the "Upcoming events" panel content is
  now top-aligned (with a heading) instead of vertically centered, and the
  hero now shows a full-bleed background photo with a gradient overlay.
- **Fully responsive / mobile-first** — a hamburger menu replaces the top
  nav below 768px, the search bar wraps to its own row, sliders shrink
  their card widths at 768px and 480px breakpoints, and the hero stacks
  vertically on small screens.

## Latest fixes
- **Upcoming Events moved** — the events list now lives in the top-left
  hero panel (was previously a separate card further down the page); the
  duplicate "Upcoming Events" card in the promo strip was removed, which
  is now a 2-column offer/help layout.
- **Hot Products header re-centered** — the "Hot Products" heading is now
  centered like the other section titles, with the "View All Products"
  link sitting to its left (`Pages/Index.cshtml` + `.section-head-row` in
  `site.css`, now a 3-column grid).
- **Slider scrollbars hidden** — the visible horizontal scrollbar under
  Shop By Category / Hot Products / Our Partners is now hidden
  (`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`); the
  sliders still scroll via the arrow buttons or touch swipe.
- **Fixed the PWA install banner not closing** — it was toggled with the
  `hidden` HTML attribute, but the `.pwa-install-banner{display:flex}`
  class rule silently overrode it (equal CSS specificity, author styles
  win). It now toggles a `.show` class instead, and is `display:none` by
  default, so the Install/× buttons actually dismiss it.
- **"Request a Quote" simplified** — replaced with a small icon-only
  button (no label) in the header, styled as a circular icon
  (`.action-icon-only` in `site.css`).
- Icons are generated placeholder tooth logos — swap the files in
  `wwwroot/icons/` with your real brand icons (keep the same file names and
  sizes, or update `manifest.json` accordingly).
- All product/category/partner/testimonial images are loaded from external
  placeholder services at runtime (see `Pages/Index.cshtml.cs`). Replace
  each URL with your own hosted images (e.g. under `wwwroot/images/`) for
  production — this also removes the runtime dependency on third-party
  image hosts.
- To verify PWA installability, run the app over HTTPS (or `localhost`,
  which browsers treat as a secure context) and check the "Lighthouse" PWA
  audit or the browser's install icon in the address bar.
- Bump `CACHE_VERSION` in `service-worker.js` whenever you change cached
  assets so returning users get the update (already bumped to `v2` for
  this update).

## Latest updates (images, offers, auto-slider)
- **Event photos** — each upcoming event in the hero panel now shows a
  small thumbnail image alongside the date and details.
- **"Need Help? Chat with Us" removed** — replaced with a second offer
  card ("Up to 25% OFF on Autoclaves & Sterilizers"), styled to match the
  first offer with its own image. The WhatsApp chat option is still
  available via the floating green button in the bottom-right corner.
- **Auto-advancing testimonial slider** — "What Our Customers Say" now
  cycles through reviews automatically every ~4.5s, with clickable dots
  and pause-on-hover (`data-testimonial-slider` in `Index.cshtml`, logic
  in `site.js`). A 4th testimonial was added.
- **A note on brand logos**: real trademarked partner logos (KaVo, Dürr
  Dental, NSK, etc.) can't be sourced and embedded here — they're each
  company's registered IP. The partner strip still uses styled text
  badges as placeholders; swap in the official logo files once you have
  the brand assets/permission from each partner.

## Image sources (updated - real dental photos)
Every category, product, event, and offer photo was swapped from generic
LoremFlickr placeholders to **real dental/clinical photography from
Pexels** (free stock photos; Pexels License permits free commercial use,
no attribution required: https://www.pexels.com/license/). A handful of
categories that don't have an exact literal photo on Pexels (intraoral
scanner, LED curing light, ultrasonic scaler, compressor/suction unit)
use the closest genuinely dental/clinical photo available (e.g. a dental
handpiece close-up or a dental office interior) rather than an unrelated
stock photo.

Still placeholders, unchanged:
- **Partner logos** — styled text badges (placehold.co). Real trademarked
  logos (KaVo, Dürr Dental, NSK, etc.) are each company's IP and can't be
  sourced/embedded without their permission.
- **Testimonial avatars** — generic placeholder headshots (pravatar.cc),
  not real photos of the named reviewers.

For a production site, replace the Pexels URLs in `Pages/Index.cshtml.cs`
with your own product photography as you get it — it'll always look more
authentic and specific to your actual inventory than any stock photo.

## Latest fixes (images not loading, header Install button, testimonial layout)
- **Images not showing** — added `referrerpolicy="no-referrer"` to every
  external image (some CDNs quietly block hotlinked images that send a
  referrer header) and a JS fallback (`data-fallback-label` + an `error`
  listener in `site.js`) that swaps any image that still fails to load
  for a clean generated placeholder instead of a broken-image icon. If
  images still don't load after this, it almost always means the machine
  running the app has no outbound internet access to `images.pexels.com` /
  `i.pravatar.cc` (common on offline dev machines or behind a strict
  corporate firewall) — the fallback placeholders will show instead, and
  the real photos will appear as soon as that machine has network access.
- **Install button moved to the header** — a circular Install icon is now
  the first icon in the top-right header actions (left of "Request a
  Quote"). Clicking it opens a confirmation dialog ("Install MH Dental?")
  before triggering the actual browser install prompt. The bottom banner
  that auto-appears on `beforeinstallprompt` still installs directly from
  its own Install button, since the banner text itself already serves as
  the explanation/confirmation.
- **Testimonial carousel redesigned** — now shows 3 cards per view on
  desktop (≥769px) and 1 on mobile, auto-advances every ~4.5s, and
  rebuilds its dot pagination responsively on window resize instead of
  the earlier one-at-a-time layout that looked cramped.
