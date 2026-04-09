# Artemisa UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Artemisa Angular frontend with glassmorphism navbar, hamburger drawer, hero section, modernized cards/rows, and consistent light/dark mode — using the existing color palette with zero routing or logic changes.

**Architecture:** Pure CSS + HTML template changes per component. One new TypeScript addition (drawer state + active route in menu-bar). All existing FontAwesome icons are kept; Ionicons in the toggle are replaced with FA for consistency. Each task is independently verifiable by running `ng serve` and inspecting the target component.

**Tech Stack:** Angular 17+, FontAwesome (`@fortawesome/angular-fontawesome`), ng-bootstrap accordion, ThemeService (existing), RouterModule (existing)

**Dev server:** Run `cd "C:\Users\Usuario\Desktop\ArtemisaAngular-main\ArtemisaAngular3.0" && npx ng serve` and keep open throughout.

---

## File Map

| File                                         | What changes                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/styles.css`                             | Add light-mode surface tokens to `:root`                                             |
| `src/app/menu-bar/menu-bar.component.ts`     | Add `drawerOpen`, `toggleDrawer()`, `closeDrawer()`, inject `Router` for active link |
| `src/app/menu-bar/menu-bar.component.html`   | Glassmorphism bar, active `routerLinkActive`, hamburger button, slide-in drawer      |
| `src/app/menu-bar/menu-bar.component.css`    | Full rewrite of nav styles; drawer; mobile breakpoint                                |
| `src/app/home/home.component.html`           | Add hero + stats bar above existing content; remove standalone search-container      |
| `src/app/home/home.component.css`            | Hero + stats styles; modernize book card; keep existing card/search/carousel rules   |
| `src/app/temario/temario.component.html`     | Wrap accordion header content in icon-box + chevron structure                        |
| `src/app/temario/temario.component.css`      | Icon-box, chevron, complexity badge, mobile sidebar toggle                           |
| `src/app/problemas/problemas.component.html` | Wrap each problem in a `.problem-row` card div; replace `<h2>` structure             |
| `src/app/problemas/problemas.component.css`  | Row card styles, color-coded difficulty tags, hover state                            |

---

## Task 1 — Global light-mode tokens (`styles.css`)

**Files:**

- Modify: `src/styles.css`

- [ ] **Step 1: Add light-mode surface tokens to `:root`**

Open `src/styles.css`. After the existing `:root { ... }` block (ends around line 37), add:

```css
/* Light-mode surface tokens */
:root {
  --surface-light: #ffffff;
  --bg-light: #f5f5f7;
  --border-light: #e4e4e7;
  --text-dark: #1a1a1a;
  --muted-light: #6b7280;
}
```

- [ ] **Step 2: Add `.light` body class rules**

After the `.dark { ... }` rule add:

```css
.light {
  background-color: var(--bg-light);
  color: var(--text-dark);
}
```

- [ ] **Step 3: Verify**

Run `ng serve`. Open http://localhost:4200. Toggle dark/light — page background should switch between `#1e1e1e` and `#f5f5f7`.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\Usuario\Desktop\ArtemisaAngular-main\ArtemisaAngular3.0"
git add src/styles.css
git commit -m "style: add light-mode surface tokens to global styles"
```

---

## Task 2 — Navbar TypeScript (`menu-bar.component.ts`)

**Files:**

- Modify: `src/app/menu-bar/menu-bar.component.ts`

- [ ] **Step 1: Add drawer state and inject Router**

Replace the entire file content with:

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { ThemeService } from "../services/theme.service";
import { AuthService } from "../services/auth.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBolt, faHouse, faBookOpen, faPuzzlePiece, faLink, faCalendar, faBars, faXmark, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-menu-bar",
  imports: [RouterModule, FontAwesomeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./menu-bar.component.html",
  styleUrl: "./menu-bar.component.css",
})
export class MenuBarComponent implements OnInit {
  drawerOpen = false;

  faBolt = faBolt;
  faHouse = faHouse;
  faBookOpen = faBookOpen;
  faPuzzlePiece = faPuzzlePiece;
  faLink = faLink;
  faCalendar = faCalendar;
  faBars = faBars;
  faXmark = faXmark;
  faSun = faSun;
  faMoon = faMoon;

  constructor(
    public theme: ThemeService,
    private authService: AuthService,
    public router: Router,
  ) {}

  toggleDarkMode() {
    this.theme.toggle();
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  @HostListener("document:keydown.escape")
  onEscape() {
    this.drawerOpen = false;
  }

  ngOnInit(): void {
    if (this.authService.tokenExpirado()) {
      this.authService.cerrarSesion();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.obtenerToken() !== null;
  }
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd "C:\Users\Usuario\Desktop\ArtemisaAngular-main\ArtemisaAngular3.0"
npx ng build --configuration development 2>&1 | tail -20
```

Expected: `Build at:` line with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/menu-bar/menu-bar.component.ts
git commit -m "feat(navbar): add drawer state, FA icons, Router injection"
```

---

## Task 3 — Navbar HTML (`menu-bar.component.html`)

**Files:**

- Modify: `src/app/menu-bar/menu-bar.component.html`

- [ ] **Step 1: Replace template**

Replace the entire file with:

```html
<div [class.dark]="theme.isDark()" [class.light]="!theme.isDark()">
  <!-- Drawer backdrop -->
  <div class="drawer-backdrop" [class.open]="drawerOpen" (click)="closeDrawer()"></div>

  <!-- Slide-in drawer (mobile) -->
  <nav class="drawer" [class.open]="drawerOpen" role="dialog" aria-label="Menú">
    <button class="drawer-close" (click)="closeDrawer()" aria-label="Cerrar menú">
      <fa-icon [icon]="faXmark"></fa-icon>
    </button>
    <div class="drawer-logo">
      <div class="logo-icon"><fa-icon [icon]="faBolt"></fa-icon></div>
      <span>Artemisa</span>
    </div>
    <div class="drawer-links">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeDrawer()" class="drawer-link">
        <div class="dl-icon"><fa-icon [icon]="faHouse"></fa-icon></div>
        Inicio
      </a>
      <a routerLink="/temario" routerLinkActive="active" (click)="closeDrawer()" class="drawer-link">
        <div class="dl-icon"><fa-icon [icon]="faBookOpen"></fa-icon></div>
        Temario
      </a>
      <a routerLink="/problemas" routerLinkActive="active" (click)="closeDrawer()" class="drawer-link">
        <div class="dl-icon"><fa-icon [icon]="faPuzzlePiece"></fa-icon></div>
        Problemas
      </a>
      <a routerLink="/links" routerLinkActive="active" (click)="closeDrawer()" class="drawer-link">
        <div class="dl-icon"><fa-icon [icon]="faLink"></fa-icon></div>
        Links
      </a>
      <a routerLink="/calendar" routerLinkActive="active" (click)="closeDrawer()" class="drawer-link">
        <div class="dl-icon"><fa-icon [icon]="faCalendar"></fa-icon></div>
        Calendario
      </a>
    </div>
  </nav>

  <!-- Main navbar -->
  <header class="menu-bar">
    <nav class="nav-container">
      <!-- Logo -->
      <a routerLink="/" class="navbar-logo">
        <div class="logo-icon"><fa-icon [icon]="faBolt"></fa-icon></div>
        <span>Artemisa</span>
      </a>

      <!-- Desktop links -->
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link"> <fa-icon [icon]="faHouse"></fa-icon> Inicio </a>
        <a routerLink="/temario" routerLinkActive="active" class="nav-link"> <fa-icon [icon]="faBookOpen"></fa-icon> Temario </a>
        <a routerLink="/problemas" routerLinkActive="active" class="nav-link"> <fa-icon [icon]="faPuzzlePiece"></fa-icon> Problemas </a>
        <a routerLink="/links" routerLinkActive="active" class="nav-link"> <fa-icon [icon]="faLink"></fa-icon> Links </a>
        <a routerLink="/calendar" routerLinkActive="active" class="nav-link"> <fa-icon [icon]="faCalendar"></fa-icon> Calendario </a>
      </div>

      <!-- Right side -->
      <div class="nav-right">
        <!-- Dark mode toggle -->
        <button class="theme-toggle" (click)="toggleDarkMode()" [attr.aria-label]="theme.isDark() ? 'Activar modo claro' : 'Activar modo oscuro'">
          <div class="toggle-track" [class.dark-active]="theme.isDark()">
            <div class="toggle-thumb">
              <fa-icon [icon]="theme.isDark() ? faMoon : faSun"></fa-icon>
            </div>
          </div>
        </button>

        <!-- Hamburger (mobile only) -->
        <button class="hamburger-btn" (click)="toggleDrawer()" aria-label="Abrir menú">
          <fa-icon [icon]="faBars"></fa-icon>
        </button>
      </div>
    </nav>
  </header>
</div>
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:4200. You should see the navbar renders without console errors. Desktop shows all links. Mobile (resize to <768px) shows only logo + hamburger.

- [ ] **Step 3: Commit**

```bash
git add src/app/menu-bar/menu-bar.component.html
git commit -m "feat(navbar): glassmorphism header, hamburger, drawer, active links"
```

---

## Task 4 — Navbar CSS (`menu-bar.component.css`)

**Files:**

- Modify: `src/app/menu-bar/menu-bar.component.css`

- [ ] **Step 1: Replace entire CSS file**

Replace the entire file with:

```css
/* ── Wrapper ── */
.dark {
  background-color: var(--background-dark);
  color: var(--text-light);
}
.light {
  background-color: var(--bg-light);
  color: var(--text-dark);
}

/* ── Main bar ── */
.menu-bar {
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.07);
}

.dark .menu-bar {
  background: rgba(30, 30, 30, 0.82);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.4);
}

/* ── Nav container ── */
.nav-container {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 2rem;
  gap: 1.5rem;
}

/* ── Logo ── */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.85rem;
  box-shadow: 0 2px 10px rgba(217, 92, 0, 0.35);
}

.navbar-logo span {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-dark);
  letter-spacing: 0.3px;
}

.dark .navbar-logo span {
  color: var(--text-light);
}

/* ── Desktop links ── */
.nav-links {
  display: flex;
  gap: 0.1rem;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--muted-light);
  font-size: 0.85rem;
  font-weight: 500;
  transition:
    background 0.2s,
    color 0.2s;
}

.nav-link:hover {
  color: var(--text-dark);
  background: rgba(0, 0, 0, 0.05);
}

.dark .nav-link {
  color: var(--text-muted);
}
.dark .nav-link:hover {
  color: var(--text-light);
  background: rgba(255, 255, 255, 0.06);
}

.nav-link.active {
  color: var(--primary-dark);
  background: rgba(217, 92, 0, 0.1);
}

.dark .nav-link.active {
  color: var(--primary-dark);
  background: rgba(217, 92, 0, 0.12);
}

/* ── Right section ── */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

/* ── Dark mode toggle ── */
.theme-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.toggle-track {
  width: 52px;
  height: 28px;
  border-radius: 999px;
  background: var(--teal-dark);
  position: relative;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  padding: 3px;
}

.toggle-track.dark-active {
  background: var(--blue-dark);
}

.toggle-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  color: var(--primary-dark);
  transition: transform 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  transform: translateX(0);
}

.toggle-track.dark-active .toggle-thumb {
  transform: translateX(24px);
  color: #aac;
}

/* ── Hamburger (mobile only) ── */
.hamburger-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-dark);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.dark .hamburger-btn {
  color: var(--text-light);
}
.hamburger-btn:hover {
  background: rgba(0, 0, 0, 0.07);
}
.dark .hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* ── Drawer backdrop ── */
.drawer-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 299;
  opacity: 0;
  transition: opacity 0.3s;
}

.drawer-backdrop.open {
  display: block;
  opacity: 1;
}

/* ── Drawer ── */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 75%;
  max-width: 300px;
  background: #fff;
  z-index: 300;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.15);
}

.dark .drawer {
  background: var(--background-dark);
  border-left: 1px solid var(--border-dark);
}

.drawer.open {
  transform: translateX(0);
}

.drawer-close {
  align-self: flex-end;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--muted-light);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  transition: background 0.2s;
}

.dark .drawer-close {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
}
.drawer-close:hover {
  background: rgba(0, 0, 0, 0.12);
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-light);
}

.dark .drawer-logo {
  border-bottom-color: var(--border-dark);
}

.drawer-logo .logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
}

.drawer-logo span {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-dark);
}

.dark .drawer-logo span {
  color: var(--text-light);
}

.drawer-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text-dark);
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    background 0.2s,
    color 0.2s;
}

.dark .drawer-link {
  color: var(--text-light);
}

.drawer-link:hover {
  background: rgba(0, 0, 0, 0.05);
}
.dark .drawer-link:hover {
  background: rgba(255, 255, 255, 0.06);
}

.drawer-link.active {
  color: var(--primary-dark);
  background: rgba(217, 92, 0, 0.08);
}

.dl-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--muted-light);
  flex-shrink: 0;
}

.dark .dl-icon {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
}

.drawer-link.active .dl-icon {
  background: rgba(217, 92, 0, 0.12);
  color: var(--primary-dark);
}

/* ── Mobile breakpoint ── */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .hamburger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nav-container {
    padding: 0 1rem;
    gap: 0.75rem;
  }
}
```

- [ ] **Step 2: Verify drawer in browser**

Resize to mobile width. Click hamburger — drawer should slide in from the right. Click backdrop or press Escape — drawer should close. Active route link should be orange.

- [ ] **Step 3: Commit**

```bash
git add src/app/menu-bar/menu-bar.component.css
git commit -m "style(navbar): glassmorphism, drawer, active links, dark/light polish"
```

---

## Task 5 — Home HTML: hero + stats bar (`home.component.html`)

**Files:**

- Modify: `src/app/home/home.component.html`

- [ ] **Step 1: Add hero + stats before the existing search-container, remove old search-container**

Replace the entire file with:

```html
<app-spinner *ngIf="loading" message="Cargando..." [fullscreen]="true"></app-spinner>
<div [class.dark]="theme.isDark()" [class.light]="!theme.isDark()">
  <!-- Hero -->
  <div class="hero-section">
    <div class="hero-badge">
      <fa-icon [icon]="faTrophy"></fa-icon>
      Plataforma de Programación Competitiva
    </div>
    <h1>Domina los algoritmos.<br /><span class="hero-accent">Gana las competencias.</span></h1>
    <p class="hero-subtitle">Teoría, código en Java / C++ / Python, y problemas clasificados por tema y dificultad.</p>

    <!-- Search (moved here from standalone section) -->
    <div class="hero-search">
      <fa-icon [icon]="faMagnifyingGlass" class="search-icon"></fa-icon>
      <input #inputSearch type="text" placeholder="Buscar tema, algoritmo, problema..." (keydown.enter)="search(inputSearch.value)" />
      <button (click)="search(inputSearch.value)"><fa-icon [icon]="faArrowRight"></fa-icon> Buscar</button>
      <!-- Autocomplete dropdown -->
      <div class="recomendations-list" *ngIf="getValorInput() != '' && filterRecomendations(getValorInput()).size() > 0">
        <ul>
          <li *ngFor="let reco of Array.from(filterRecomendations(getValorInput())) | slice: 0 : 7" (click)="autocompletar(reco)">
            {{ reco.data }}
            <span class="badge">{{ reco.type }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Stats bar -->
  <div class="stats-bar">
    <div class="stat">
      <div class="stat-num">10+</div>
      <div class="stat-label">Categorías de Temario</div>
    </div>
    <div class="stat">
      <div class="stat-num">3</div>
      <div class="stat-label">Lenguajes Disponibles</div>
    </div>
    <div class="stat">
      <div class="stat-num">5</div>
      <div class="stat-label">Niveles de Dificultad</div>
    </div>
    <div class="stat">
      <div class="stat-num">∞</div>
      <div class="stat-label">Problemas Clasificados</div>
    </div>
  </div>

  <!-- Books carousel -->
  <div class="books-container">
    <div class="section-header">
      <div class="section-title">Libros Descargables</div>
    </div>
    <div class="carousel-wrapper">
      <button class="carousel-btn left" (click)="scrollCarousel('left')">
        <fa-icon [icon]="faChevronLeft"></fa-icon>
      </button>
      <div class="books-carousel" #carousel>
        <div class="book-card" *ngFor="let libro of libros">
          <p>{{ libro.titulo }}</p>
          <img [src]="'assets/images/libros/descargables/' + libro.imagen" alt="{{ libro.titulo }}" />
          <div class="card-btns">
            <button (click)="descargarLibro(libro.archivoPdf)"><fa-icon [icon]="faDownload"></fa-icon> Descargar</button>
            <button (click)="verPdf(libro.archivoPdf)">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
          </div>
        </div>
      </div>
      <button class="carousel-btn right" (click)="scrollCarousel('right')">
        <fa-icon [icon]="faChevronRight"></fa-icon>
      </button>
    </div>
  </div>

  <!-- Topic cards -->
  <div class="explore-section">
    <div class="section-header">
      <div class="section-title">Temario</div>
    </div>
    <div class="cards-container">
      <div class="card" style="background: linear-gradient(rgb(90, 94, 183) 0%, rgb(112, 117, 234) 100%);">
        <fa-icon [icon]="faSchool"></fa-icon>
        <h2>Teoria Básica</h2>
        <button (click)="irATemario('Teoria')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(76, 175, 151) 0%, rgb(81, 198, 171) 100%);">
        <fa-icon [icon]="faMagnifyingGlass"></fa-icon>
        <h2>Algoritmos de Búsqueda</h2>
        <button (click)="irATemario('Búsquedas')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(37, 135, 156) 0%, rgb(84, 195, 219) 100%);">
        <fa-icon [icon]="faArrowUpShortWide"></fa-icon>
        <h2>Algoritmos de Ordenamiento</h2>
        <button (click)="irATemario('Ordenamientos')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(175, 97, 96) 0%, rgb(202, 138, 137) 100%);">
        <fa-icon [icon]="faTextWidth"></fa-icon>
        <h2>Strings</h2>
        <button (click)="irATemario('Strings')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(103, 74, 152) 0%, rgb(165, 148, 195) 100%);">
        <fa-icon [icon]="faSquareBinary"></fa-icon>
        <h2>Manejo Binario y Bitwise</h2>
        <button (click)="irATemario('BitWise')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(204, 115, 62) 0%, rgb(234, 163, 120) 100%);">
        <fa-icon [icon]="faPlusMinus"></fa-icon>
        <h2>Matemáticas</h2>
        <button (click)="irATemario('Matemática')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(69, 114, 182) 0%, rgb(120, 158, 218) 100%);">
        <fa-icon [icon]="faPenRuler"></fa-icon>
        <h2>Geometría</h2>
        <button (click)="irATemario('Geometría')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(241, 99, 124) 0%, rgb(227, 153, 166) 100%);">
        <fa-icon [icon]="faDiagramProject"></fa-icon>
        <h2>Teoría de grafos, arboles y redes</h2>
        <button (click)="irATemario('Grafos')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(90, 94, 183) 0%, rgb(112, 117, 234) 100%);">
        <fa-icon [icon]="faCodeCompare"></fa-icon>
        <h2>Programación Dinámica</h2>
        <button (click)="irATemario('DP')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
      <div class="card" style="background: linear-gradient(rgb(76, 175, 151) 0%, rgb(81, 198, 171) 100%);">
        <fa-icon [icon]="faCode"></fa-icon>
        <h2>Generador de Casos Prueba</h2>
        <button (click)="irATemario('Generadores')">Ver <fa-icon [icon]="faArrowRight"></fa-icon></button>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Update `home.component.ts` — add new FA icon imports**

In `src/app/home/home.component.ts`, add these imports to the existing `@fortawesome/free-solid-svg-icons` import line:

```typescript
import { faArrowUpShortWide, faCode, faCodeCompare, faDiagramProject, faMagnifyingGlass, faPenRuler, faPlusMinus, faSchool, faSquareBinary, faTextWidth, faTrophy, faArrowRight, faDownload, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
```

Then add the new icon properties at the bottom of the class (before `protected readonly Array = Array`):

```typescript
protected readonly faTrophy = faTrophy;
protected readonly faArrowRight = faArrowRight;
protected readonly faDownload = faDownload;
protected readonly faChevronLeft = faChevronLeft;
protected readonly faChevronRight = faChevronRight;
```

- [ ] **Step 3: Verify**

Open http://localhost:4200. Home page should show the hero section, stats bar, then books, then topic cards. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/home/home.component.html src/app/home/home.component.ts
git commit -m "feat(home): add hero section, stats bar, FA icons in carousel buttons"
```

---

## Task 6 — Home CSS (`home.component.css`)

**Files:**

- Modify: `src/app/home/home.component.css`

- [ ] **Step 1: Add hero and stats styles at the top of the file**

Open `src/app/home/home.component.css`. Prepend the following **before** the existing `/* Custom Scrollbar */` comment:

```css
/* ── Hero ── */
.hero-section {
  padding: 4rem 2rem 2.5rem;
  text-align: center;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217, 92, 0, 0.08) 0%, transparent 70%);
  position: relative;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(217, 92, 0, 0.1);
  border: 1px solid rgba(217, 92, 0, 0.25);
  border-radius: 999px;
  padding: 0.3rem 0.9rem;
  font-size: 0.75rem;
  color: var(--primary-dark);
  margin-bottom: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.hero-section h1 {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1rem;
  color: var(--background-dark);
}

.dark .hero-section h1 {
  color: var(--text-light);
}

.hero-accent {
  color: var(--primary-dark);
}

.hero-subtitle {
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto 2rem;
  font-size: 1rem;
  line-height: 1.6;
}

/* ── Hero search ── */
.hero-search {
  display: flex;
  align-items: center;
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  position: relative;
}

.dark .hero-search {
  background: var(--border-dark);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.hero-search:focus-within {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 3px rgba(217, 92, 0, 0.12);
}

.hero-search .search-icon {
  color: var(--text-muted);
  margin-right: 0.6rem;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.hero-search input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--background-dark);
  font-size: 0.95rem;
  min-width: 0;
}

.dark .hero-search input {
  color: var(--text-light);
}
.hero-search input::placeholder {
  color: var(--text-muted);
}

.hero-search button {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--primary-dark);
  border: none;
  border-radius: 10px;
  color: #fff;
  padding: 0.55rem 1.2rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.hero-search button:hover {
  background: #f06a00;
}

/* ── Stats bar ── */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 3rem;
  padding: 1.25rem 2rem;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  background: #fff;
}

.dark .stats-bar {
  background: var(--border-dark);
  border-color: rgba(255, 255, 255, 0.06);
}

.stat {
  text-align: center;
}

.stat-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-dark);
}

.stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.1rem;
}

/* ── Section headers ── */
.section-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem 0.75rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--background-dark);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.section-title::before {
  content: "";
  width: 4px;
  height: 1.2em;
  background: var(--primary-dark);
  border-radius: 2px;
  display: inline-block;
}

.dark .section-title {
  color: var(--text-light);
}
```

- [ ] **Step 2: Update `.book-card` height and button styles in the same file**

Find the `.book-card` rule (around line 212 of the original file, now shifted down) and change `height: 500px` to `height: auto` and `min-height: 350px`:

```css
.book-card {
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  text-align: center;
  background: var(--text-light);
  padding: 1rem;
  scroll-snap-align: start;
  height: auto;
  min-height: 350px;
  flex: 0 0 20%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid transparent;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2);
  border-color: var(--primary-dark);
}
```

- [ ] **Step 3: Update `.card-btns button` to use FA icon + flex**

Find `.card-btns button` and ensure it reads:

```css
.card-btns button {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem;
  width: 45%;
  background: var(--primary-dark);
  color: var(--text-light);
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background 0.3s ease;
  border: none;
  justify-content: center;
}
```

- [ ] **Step 4: Update `@media (max-width: 768px)` stats-bar**

Add inside the existing `@media (max-width: 768px)` block:

```css
.stats-bar {
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 1rem;
}

.hero-section {
  padding: 2.5rem 1rem 2rem;
}

.hero-search {
  padding: 0.4rem 0.4rem 0.4rem 1rem;
}
```

- [ ] **Step 5: Verify**

Open http://localhost:4200. Hero with search is visible. Stats bar below it. Books and cards below that. Light/dark toggle should affect hero background and stats bar surface.

- [ ] **Step 6: Commit**

```bash
git add src/app/home/home.component.css
git commit -m "style(home): hero section, stats bar, modernized book card hover"
```

---

## Task 7 — Temario HTML: icon boxes + chevrons (`temario.component.html`)

**Files:**

- Modify: `src/app/temario/temario.component.html`

- [ ] **Step 1: Replace accordion button content structure**

The current accordion button is:

```html
<button ngbAccordionButton class="accordion-button" type="button">
  {{ tema.tema }}
  <div>
    <p>{{ tema.supergrupo }}</p>
    <span class="complejidad" *ngIf="tema.complejidad_tiempo">{{ tema.complejidad_tiempo }}</span>
  </div>
</button>
```

Replace only that button (keep all surrounding `ngbAccordion` structure intact):

```html
<button ngbAccordionButton class="accordion-button" type="button">
  <div class="acc-icon-box">
    <fa-icon [icon]="faBook"></fa-icon>
  </div>
  <span class="acc-title">{{ tema.tema }}</span>
  <div class="acc-meta">
    <span class="acc-group">{{ tema.supergrupo }}</span>
    <span class="acc-complexity" *ngIf="tema.complejidad_tiempo">{{ tema.complejidad_tiempo }}</span>
  </div>
  <fa-icon [icon]="faChevronRight" class="acc-chevron"></fa-icon>
</button>
```

- [ ] **Step 2: Add FA imports to `temario.component.ts`**

Open `src/app/temario/temario.component.ts`. Add FontAwesomeModule to imports and add icon properties. The file should include:

```typescript
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBook, faChevronRight } from "@fortawesome/free-solid-svg-icons";
```

Add `FontAwesomeModule` to the `imports` array of the component decorator, and add to the class body:

```typescript
protected readonly faBook = faBook;
protected readonly faChevronRight = faChevronRight;
```

- [ ] **Step 3: Verify**

Navigate to http://localhost:4200/temario. Each accordion row should show a book icon box on the left, the topic name, group + complexity on the right, and a chevron at the far right.

- [ ] **Step 4: Commit**

```bash
git add src/app/temario/temario.component.html src/app/temario/temario.component.ts
git commit -m "feat(temario): icon boxes and chevron in accordion headers"
```

---

## Task 8 — Temario CSS: accordion polish (`temario.component.css`)

**Files:**

- Modify: `src/app/temario/temario.component.css`

- [ ] **Step 1: Add icon box, chevron, complexity badge, and meta layout styles**

Append to the end of `src/app/temario/temario.component.css`:

```css
/* ── Accordion header layout ── */
.accordion-button {
  display: flex !important;
  align-items: center;
  gap: 0.85rem;
}

.acc-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  flex-shrink: 0;
  transition:
    background 0.2s,
    color 0.2s;
}

.dark .acc-icon-box {
  background: rgba(255, 255, 255, 0.07);
}

/* ngb adds .accordion-button:not(.collapsed) when open */
.accordion-button:not(.collapsed) .acc-icon-box {
  background: rgba(217, 92, 0, 0.15);
  color: var(--primary-dark);
}

.acc-title {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
}

.acc-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.acc-group {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.acc-complexity {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  background: rgba(217, 92, 0, 0.12);
  color: var(--primary-dark);
  border: 1px solid rgba(217, 92, 0, 0.25);
}

.acc-chevron {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition:
    transform 0.2s,
    color 0.2s;
  flex-shrink: 0;
}

.accordion-button:not(.collapsed) .acc-chevron {
  transform: rotate(90deg);
  color: var(--primary-dark);
}
```

- [ ] **Step 2: Verify accordion opens/closes with chevron rotation**

Click an accordion item. Chevron should rotate 90°. Icon box should turn orange. Click again — should revert.

- [ ] **Step 3: Commit**

```bash
git add src/app/temario/temario.component.css
git commit -m "style(temario): icon box, chevron rotation, complexity badge"
```

---

## Task 9 — Problemas HTML: card rows + difficulty tags (`problemas.component.html`)

**Files:**

- Modify: `src/app/problemas/problemas.component.html`

- [ ] **Step 1: Replace the problem list structure**

Find the `<div class="accordion-container">` block and replace it with:

```html
<div class="problem-list">
  <div class="problem-row" *ngFor="let problema of filterProblems()">
    <div class="problem-title">{{ problema.titulo }}</div>
    <div class="problem-tags">
      <span class="tag tag-tema" *ngIf="problema.tema_1">{{ problema.tema_1 }}</span>
      <span class="tag tag-tema" *ngIf="problema.tema_2">{{ problema.tema_2 }}</span>
      <span class="tag tag-tema" *ngIf="problema.tema_3">{{ problema.tema_3 }}</span>
      <span class="tag tag-tema" *ngIf="problema.tema_4">{{ problema.tema_4 }}</span>
    </div>
    <div [ngSwitch]="determinarNivel(problema.dificultad)" class="dificultad-tag">
      <span class="tag dif-aprendiz" *ngSwitchCase="'Aprendíz'">Aprendíz</span>
      <span class="tag dif-basica" *ngSwitchCase="'Básica'">Básica</span>
      <span class="tag dif-intermedia" *ngSwitchCase="'Intermedia'">Intermedia</span>
      <span class="tag dif-avanzada" *ngSwitchCase="'Avanzada'">Avanzada</span>
      <span class="tag dif-elite" *ngSwitchCase="'Élite'">Élite</span>
    </div>
    <span class="tag tag-juez">{{ problema.juez }}</span>
    <a class="ver-btn" [href]="problema.url" target="_blank"> Ver <fa-icon [icon]="faArrowRight"></fa-icon> </a>
  </div>
</div>
```

- [ ] **Step 2: Add FA imports to `problemas.component.ts`**

Open `src/app/problemas/problemas.component.ts`. Add:

```typescript
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
```

Add `FontAwesomeModule` to the component's `imports` array and add to the class body:

```typescript
protected readonly faArrowRight = faArrowRight;
```

- [ ] **Step 3: Verify**

Navigate to http://localhost:4200/problemas. Problem rows should appear. No errors in console.

- [ ] **Step 4: Commit**

```bash
git add src/app/problemas/problemas.component.html src/app/problemas/problemas.component.ts
git commit -m "feat(problemas): card row layout, color-coded difficulty tags, FA icon"
```

---

## Task 10 — Problemas CSS: row cards + tag colors (`problemas.component.css`)

**Files:**

- Modify: `src/app/problemas/problemas.component.css`

- [ ] **Step 1: Append new styles to end of `problemas.component.css`**

```css
/* ── Problem row cards ── */
.problem-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.problem-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 1px solid var(--border-light, #e4e4e7);
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.2s;
  cursor: default;
  flex-wrap: wrap;
}

.dark .problem-row {
  background: var(--border-dark);
  border-color: rgba(255, 255, 255, 0.06);
}

.problem-row:hover {
  border-color: var(--primary-dark);
  background: rgba(217, 92, 0, 0.04);
  transform: translateX(3px);
}

.dark .problem-row:hover {
  background: rgba(217, 92, 0, 0.07);
}

.problem-title {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--background-dark);
  min-width: 120px;
}

.dark .problem-title {
  color: var(--text-light);
}

.problem-tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

/* ── Tags ── */
.tag {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  white-space: nowrap;
}

.tag-tema {
  background: rgba(31, 94, 103, 0.1);
  color: #1a6b76;
  border: 1px solid rgba(31, 94, 103, 0.2);
}

.dark .tag-tema {
  background: rgba(31, 94, 103, 0.3);
  color: #54c3db;
  border-color: rgba(84, 195, 219, 0.2);
}

.dif-aprendiz {
  background: rgba(106, 120, 82, 0.12);
  color: #4a6030;
  border: 1px solid rgba(106, 120, 82, 0.25);
}

.dark .dif-aprendiz {
  background: rgba(106, 120, 82, 0.35);
  color: #a8bc86;
  border-color: rgba(168, 188, 134, 0.2);
}

.dif-basica {
  background: rgba(58, 92, 106, 0.12);
  color: #2a5c6a;
  border: 1px solid rgba(58, 92, 106, 0.25);
}

.dark .dif-basica {
  background: rgba(58, 92, 106, 0.35);
  color: #7ab8cc;
  border-color: rgba(122, 184, 204, 0.2);
}

.dif-intermedia {
  background: rgba(192, 140, 74, 0.12);
  color: #8a6020;
  border: 1px solid rgba(192, 140, 74, 0.25);
}

.dark .dif-intermedia {
  background: rgba(192, 140, 74, 0.3);
  color: #e0b870;
  border-color: rgba(224, 184, 112, 0.2);
}

.dif-avanzada {
  background: rgba(217, 92, 0, 0.1);
  color: #c05000;
  border: 1px solid rgba(217, 92, 0, 0.2);
}

.dark .dif-avanzada {
  background: rgba(217, 92, 0, 0.25);
  color: #f0894a;
  border-color: rgba(240, 137, 74, 0.2);
}

.dif-elite {
  background: rgba(175, 97, 96, 0.12);
  color: #9a3838;
  border: 1px solid rgba(175, 97, 96, 0.2);
}

.dark .dif-elite {
  background: rgba(175, 97, 96, 0.3);
  color: #f0908f;
  border-color: rgba(240, 144, 143, 0.2);
}

.tag-juez {
  background: rgba(0, 0, 0, 0.05);
  color: var(--muted-light, #6b7280);
  border: 1px solid var(--border-light, #e4e4e7);
}

.dark .tag-juez {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  border-color: var(--border-dark);
}

/* ── Ver button ── */
.ver-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  background: var(--primary-dark);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.2s;
  margin-left: auto;
  flex-shrink: 0;
}

.ver-btn:hover {
  background: #f06a00;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .problem-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }

  .ver-btn {
    margin-left: 0;
  }
}
```

- [ ] **Step 2: Verify full problemas page**

Navigate to http://localhost:4200/problemas. Rows should be card-style. Difficulty tags should be color-coded. "Ver" buttons should be orange pills. Hover should shift the row right with an orange border.

- [ ] **Step 3: Commit**

```bash
git add src/app/problemas/problemas.component.css
git commit -m "style(problemas): card rows, color-coded difficulty tags, hover states"
```

---

## Self-Review

**Spec coverage:**

- [x] Glassmorphism navbar → Task 3/4
- [x] Hamburger + drawer → Task 2/3/4
- [x] Active route highlight → Task 3/4
- [x] Always-visible search → Task 5/6 (moved into hero)
- [x] Hero section + stats bar → Task 5/6
- [x] Topic card hover → existing CSS retained + task 6 book-card hover
- [x] Book carousel modernized → Task 5/6
- [x] Temario icon boxes + chevron → Task 7/8
- [x] Problemas card rows → Task 9/10
- [x] Color-coded difficulty tags → Task 10
- [x] Light-mode tokens → Task 1
- [x] Dark/light both modes → covered in each task's dark selectors
- [x] FontAwesome throughout (no emojis) → Tasks 2/5/7/9
- [x] No routing changes → confirmed, only CSS/HTML/template
- [x] No backend changes → confirmed

**Placeholder scan:** None found. All steps contain actual code.

**Type consistency:** `faArrowRight`, `faBook`, `faChevronRight`, `faTrophy`, `faDownload`, `faChevronLeft`, `faChevronRight`, `faBars`, `faXmark`, `faBolt`, `faSun`, `faMoon` — all imported in the task that introduces them.
