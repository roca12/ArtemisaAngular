# Artemisa UI Redesign — Design Spec

**Date:** 2026-04-09  
**Scope:** Full Polish (Option C) — same color palette, improved UX + mobile experience

---

## 1. Goals

- Polish the existing design without reinventing it (same orange/teal/dark palette)
- Fix broken mobile UX (no hamburger menu, hidden search, no active states)
- Make both light and dark modes feel equally complete and professional
- Improve typography hierarchy and spacing consistency across all pages
- Enhance Temario and Problemas (the two core pages) with better visual structure

---

## 2. Design Tokens

No new colors are introduced. The existing CSS variables in `styles.css` are used throughout:

```css
--background-dark: #1e1e1e --text-light: #f0f0f0 --primary-dark: #d95c00 /* orange — primary accent */ --secondary-dark: #c08c4a /* gold */ --olive-dark: #6a7852 --blue-dark: #3a5c6a --teal-dark: #1f5e67 --border-dark: #303030;
```

Light mode surface colors (added to `:root`):

```css
--surface-light: #ffffff --bg-light: #f5f5f7 --border-light: #e4e4e7 --text-dark: #1a1a1a --muted-light: #6b7280;
```

---

## 3. Global Styles (`styles.css`)

- Add light-mode surface tokens to `:root`
- Add `.light` body class rules for background, text, border colors
- Typography: keep Roboto; establish 3-level heading scale (h1/h2/h3) with consistent sizes

---

## 4. Navbar (`menu-bar` component)

### Current problems

- Mobile: all links stack vertically, no drawer/hamburger
- No active route highlight
- Dark mode toggle background doesn't match navbar background
- Logo is oversized on mobile

### Changes

- **Glassmorphism**: `backdrop-filter: blur(18px)` + semi-transparent background (both modes)
- **Active link**: highlight current route with orange color + subtle orange background pill
- **Search pill**: always-visible search pill in nav (replaces home-only expanding search)
- **Hamburger menu** (mobile only, `≤768px`): three-line icon opens a slide-in drawer
- **Drawer**: covers right 75% of screen, lists all routes with FontAwesome icons, close button top-right
- **Dark mode toggle**: redesigned as a proper pill toggle (sun/moon icons inside, circle slides)
- Logo: constrain to `32px` height on mobile

### Icons used (already in project via FontAwesome)

| Route      | Icon              |
| ---------- | ----------------- |
| Inicio     | `fa-house`        |
| Temario    | `fa-book-open`    |
| Problemas  | `fa-puzzle-piece` |
| Links      | `fa-link`         |
| Calendario | `fa-calendar`     |

---

## 5. Home Page (`home` component)

### Current problems

- Search bar starts at `width: 0` — not discoverable
- No hero/headline — landing feels abrupt
- Cards section title is just "Temario" with no context

### Changes

- **Hero section**: headline "Domina los algoritmos. Gana las competencias." + subtitle + always-visible search bar with orange search button
- **Stats bar**: 4 quick stats (10+ categorías, lenguajes, niveles de dificultad) below hero
- **Topic cards**: same gradient colors, add `fa-icon` in a frosted icon box, tighten hover (`translateY(-4px)`)
- **Books carousel**: reduce card height from 500px to auto; modernize with border + hover border-color change to orange
- **Search autocomplete**: keep existing logic, restyle dropdown (already clean)
- Remove the standalone `.search-container` section (search moves into hero)

---

## 6. Temario Page (`temario` component)

### Current problems

- Sidebar has no visual separation from main content on mobile
- Accordion buttons have no icon, just text
- No complexity badge styling distinction between collapsed/expanded

### Changes

- **Accordion header**: add icon box (32×32, rounded, muted bg → orange bg when open)
- **Complexity badge**: orange pill, font-weight 700
- **Chevron**: `fa-chevron-right`, rotates 90° when open
- **Sidebar mobile**: hidden by default; toggled via a "Filtros" button that slides it in as a bottom sheet
- **Sidebar desktop**: no change to layout, improve visual separation with border-right

---

## 7. Problemas Page (`problemas` component)

### Current problems

- Problem rows look like plain `<h2>` buttons with no visual polish
- Difficulty labels are text only, not color-coded
- No hover state on rows

### Changes

- **Problem rows**: card-style rows with `border-radius: 12px`, white/dark bg, `border: 1px solid`
- **Hover**: `translateX(3px)` + orange border + orange-tinted background
- **Difficulty tags**: color-coded pill badges:
  - Aprendíz → green tint
  - Básica → teal tint
  - Intermedia → gold tint
  - Avanzada → orange tint
  - Élite → red tint
- **Judge tag**: neutral gray pill
- **"Ver" button**: small orange pill button replacing plain link
- **Sidebar mobile**: same bottom-sheet pattern as Temario

---

## 8. Dark / Light Mode

Both modes use identical structure — only the CSS variable values differ. The toggle in the navbar switches the `.dark` / `.light` class on the root container (already implemented). Light mode adds:

- White card surfaces
- Soft gray page background (`#f5f5f7`)
- Toned-down tag colors (same hue, lighter tint)
- Code blocks always use dark background regardless of mode

---

## 9. Mobile Breakpoints

| Breakpoint | Behavior                                                            |
| ---------- | ------------------------------------------------------------------- |
| `> 768px`  | Full navbar with all links visible                                  |
| `≤ 768px`  | Hamburger icon, drawer menu, sidebar as bottom sheet                |
| `≤ 480px`  | Topic cards go to 2-column grid, book carousel single card per view |

---

## 10. Animations

- Navbar drawer: `transform: translateX(100%)` → `translateX(0)`, `transition: 0.3s ease`
- Topic cards: `translateY(-4px)` on hover, `transition: 0.25s`
- Problem rows: `translateX(3px)` on hover, `transition: 0.2s`
- Accordion chevron: `rotate(90deg)`, `transition: 0.2s`
- Dark mode toggle circle: `translateX` slide, `transition: 0.3s ease`

---

## 11. What Does NOT Change

- Routing (`app.routes.ts`) — no changes
- Backend API calls — no changes
- Angular component logic (`.ts` files) — no changes except adding `@HostListener` for drawer close-on-outside-click
- FontAwesome icons already used in cards — kept as-is
- Ionicons in dark mode toggle — replaced with FontAwesome `fa-sun` / `fa-moon` for consistency
- Color palette variables — no new colors, only light-mode surface tokens added

---

## 12. Files Changed

| File                                         | Change                                          |
| -------------------------------------------- | ----------------------------------------------- |
| `src/styles.css`                             | Add light-mode tokens, heading scale            |
| `src/app/menu-bar/menu-bar.component.html`   | Hamburger, drawer, active links, new toggle     |
| `src/app/menu-bar/menu-bar.component.css`    | Glassmorphism, drawer, mobile styles            |
| `src/app/menu-bar/menu-bar.component.ts`     | Drawer open/close state, active route detection |
| `src/app/home/home.component.html`           | Hero section, stats bar, remove old search      |
| `src/app/home/home.component.css`            | Hero, stats, card hover, book card modernize    |
| `src/app/temario/temario.component.html`     | Icon boxes in accordion headers, chevron        |
| `src/app/temario/temario.component.css`      | Accordion styles, sidebar mobile                |
| `src/app/problemas/problemas.component.html` | Row card layout, tag pills, "Ver" button        |
| `src/app/problemas/problemas.component.css`  | Row styles, tags, hover, sidebar mobile         |
