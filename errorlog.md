# Error Log

This file tracks issues discovered during testing phases and their respective resolutions.

## 2026-03-04 Testing Phase

### Known Issues & Fixes
- **Issue:** Duplicate Footers and Navbars on `/resume` and `/projects` pages.
  **Cause:** The root `layout.tsx` file already included `<Navbar />` and `<Footer />`, but these components were also explicitly imported and rendered within the `app/resume/page.tsx` and `app/projects/page.tsx` code.
  **Resolution:** Removed the manual renders of `<Navbar />` and `<Footer />` from the resume and projects page components to rely solely on the root layout.
  
- **Issue:** Low visual contrast / Hard to read text.
  **Resolution:** Flipped the overall theme to a **Dark Twilight Starry Sky** palette. The background is now a deep twilight blue (`#0f172a`), the text is ethereal white (`#f8fafc`), and the mana cyan (`#38bdf8`) and gold accents pop with extremely high contrast, better reflecting the magical anime aesthetic.

- **Issue:** Navbar becomes pure white when scrolling, causing a jarring transition in the dark theme.
  **Cause:** The CSS class used `bg-dark-wood` on scroll. In the previous theme this was a dark color, but in the Twilight Starry Sky theme, `--color-dark-wood` was re-mapped to pure white (`#f8fafc`).
  **Resolution:** Changed the on-scroll Navbar class to use `bg-parchment` (twilight blue) with a backdrop blur and updated the text colors to remain high-contrast on scroll.

- **Issue:** White border visible when the mobile menu is closed.
  **Cause:** The `<div className="md:hidden fixed inset-0...">` overlay used `border-t border-gold-light/20` uniformly. When opacity transitions to 0, borders can sometimes still render their 1px lines as artifacts during/after transition on some devices.
  **Resolution:** Bound the border to the `mobileMenuOpen` state, toggling it to `border-transparent` when closed so it fully disappears alongside the opacity transition.

- **Issue:** Admin Pages (`/admin` and `/admin/dashboard`) did not pick up the Frieren dark theme properly, resulting in white text on a white background.
  **Cause:** The original knight theme used `bg-dark-wood` for dark backgrounds and `text-parchment` for light text. When the palette was inverted for the Starry Twilight theme, those semantic names were swapped (parchment became the dark background, dark wood became the light text).
  **Resolution:** Ran a script to find-and-replace all outdated Tailwind semantic classes across the admin pages, mapping them correctly to the new dark theme (`bg-parchment-texture`, `bg-aged-paper`, `text-iron-light`). Also added `glass-card` styling to the admin panels to match the main site.
