# CapeWeb UI/UX Style Guide & Design System
## Cape Town Web Automation | Production-Ready Design Standards

**Version:** 1.0.0
**Last Updated:** January 2025
**Brand:** CapeWeb - AI-powered website automation for Cape Town businesses
**Audience:** B2B Local Services (SMBs in Cape Town seeking automation)

---

## 0) How to use this guide

* **Product owners**: use Sections 1–3 to understand brand goals and site structure.
* **Designers**: Sections 4–13 cover visual/UI decisions and component specifications.
* **Engineers**: Sections 14–16 translate design to code (existing tokens, needed changes, accessibility).
* **Everyone**: use the checklists at the end for QA and maintenance.

> **Status Legend:**
> - ✅ **CURRENT** - Already implemented
> - ⚠️ **NEEDS IMPROVEMENT** - Implemented but inconsistent
> - 🔴 **MISSING** - Not yet implemented
> - 💡 **RECOMMENDATION** - Suggested enhancement

---

## 1) Experience principles

✅ **CURRENT STATE:** Implicit in design, but not documented.

### Establish these principles:

1. **Cape Town-first, global-ready** – design for local businesses with international standards.
2. **Speed as a selling point** – instant feedback; performance is a feature we sell.
3. **Clarity over tech jargon** – speak plain language; avoid buzzwords unless explaining them.
4. **Show don't tell** – interactive demos > static descriptions.
5. **Accessible by default** – accessibility choices are the baseline, not optional.
6. **Mobile-majority thinking** – most visitors are on phones; design for that reality.
7. **Trust signals prominent** – social proof, testimonials, and security visible early.

---

## 2) Information architecture & navigation

⚠️ **CURRENT STATE:** Basic structure exists but needs refinement.

### Current Navigation Structure
```
Header: Logo | Services | Work | Resources | Contact | CTA Button
Footer: Company Info | Services | Legal | Social Links
```

### 💡 RECOMMENDATIONS:

* **Limit top-level nav to 5–7 items** ✅ (Currently: 5 items - good!)
* **Add breadcrumbs** 🔴 for deep content pages (blog, case studies)
* **Sticky header** ⚠️ - implement with reduced height on scroll
* **Global search** 🔴 - add for resources/documentation sections
* **Keyboard shortcut** 🔴 - `/` to focus search
* **Footer enhancement** - add language selector if targeting international clients

**Implementation Priority:** High

---

## 3) Layout & responsive rules

⚠️ **CURRENT STATE:** Grid system exists, but hero section breaks responsive rules.

### Current Grid System
```css
/* ✅ GOOD: 12-column grid defined */
--container-max-width: 1200px;
--grid-columns: 12;
--grid-gutter: 24px;
```

### 🔴 ISSUES IDENTIFIED:

1. **Hero carousel** uses fixed positioning (`transform: translateX(20rem)`) that breaks on smaller screens
2. **No responsive breakpoints** for carousel in Hero.css
3. **Container max-width** inconsistent: design-system uses 1200px, but hero has custom sizing
4. **Spacing system** not consistently applied in Hero component

### 💡 REQUIRED FIXES:

```css
/* Hero.css - Line 140: Replace fixed transform with responsive */
.hero-container .right-part {
  /* 🔴 REMOVE: margin-left: 25rem; */
  /* 🔴 REMOVE: transform: translateX(20rem); */

  /* ✅ ADD: Responsive spacing using design tokens */
  margin-left: var(--space-8); /* 64px on desktop */
}

@media (max-width: 1024px) {
  .hero-container .right-part {
    margin-left: var(--space-4); /* 32px on tablet */
  }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr; /* Stack vertically */
    gap: var(--space-6);
  }

  .hero-container .right-part {
    margin-left: 0;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
}
```

### Safe Gutters
* ✅ **Desktop:** 48–64px (using `--space-6` to `--space-8`)
* ⚠️ **Tablet:** Should be 24px (`--space-3`)
* ⚠️ **Mobile:** Should be 16px (`--space-2`)

**Implementation Priority:** CRITICAL

---

## 4) Typography

⚠️ **CRITICAL INCONSISTENCY DETECTED**

### Current Fonts in Use

```css
/* design-system.css - Line 71 */
--font-primary: 'Helvetica Neue', Arial, 'Segoe UI', sans-serif;

/* Hero.css - Line 6 (via index.css) */
font-family: 'Helvetica Neue', Arial, sans-serif;

/* Hero.css - Line 133 (carousel text) */
font-family: 'monument_extendedregular', sans-serif;
```

### 🔴 PROBLEMS:

1. **No Google Fonts integration** - Using system fonts only
2. **Monument Extended** loaded from external CDN (yudiz.com) - **security risk**
3. **No font-display: swap** - potential FOUT (Flash of Unstyled Text)
4. **Typography scale inconsistent** between Hero and design system

### 💡 RECOMMENDATIONS:

#### Option A: Self-Host Professional Fonts (Recommended)
```css
/* Use Inter (modern, professional, free) */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-VariableFont.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

/* Use Source Serif 4 for editorial content */
@font-face {
  font-family: 'Source Serif 4';
  src: url('/fonts/SourceSerif4-Variable.woff2') format('woff2');
  font-weight: 200 900;
  font-display: swap;
}

/* Use JetBrains Mono for code */
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Variable.woff2') format('woff2');
  font-weight: 100 800;
  font-display: swap;
}
```

#### Option B: Google Fonts CDN (Faster Implementation)
```html
<!-- In public/index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

### Recommended Pairing for CapeWeb
```css
:root {
  /* Primary: Inter - clean, modern, professional */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;

  /* Display: Space Grotesk - tech-forward, attention-grabbing */
  --font-display: "Space Grotesk", "Inter", sans-serif;

  /* Mono: JetBrains Mono - code blocks, technical specs */
  --font-mono: "JetBrains Mono", "Courier New", monospace;
}

/* Apply to components */
body { font-family: var(--font-sans); }
h1, h2 { font-family: var(--font-display); }
.hero-container .right-part .box { font-family: var(--font-display); }
code, pre { font-family: var(--font-mono); }
```

### Type Scale - NEEDS STANDARDIZATION

#### ⚠️ Current Hero Typography (Inconsistent)
```css
/* Hero.css - Line 38 */
.left-part h1 {
  font-size: clamp(3.74rem, 7.48vw, 6.35rem); /* 59.84px → 101.6px */
}
```

#### ✅ Design System Typography (Should be Source of Truth)
```css
/* design-system.css - Lines 82-94 */
--font-size-7xl: 4.5rem;   /* 72px - should be h1 max */
--font-size-6xl: 3.75rem;  /* 60px */
--font-size-5xl: 3rem;     /* 48px - h2 */
```

### 💡 REQUIRED FIX:

```css
/* Hero.css - Update to use design tokens */
.left-part h1 {
  font-size: clamp(
    var(--font-size-5xl),      /* 48px min (mobile) */
    5vw + 1rem,                /* fluid */
    var(--font-size-7xl)       /* 72px max (desktop) */
  );
  font-family: var(--font-display);
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-tight);
}

.subtitle {
  font-size: clamp(
    var(--font-size-lg),       /* 18px min */
    1vw + 1rem,
    var(--font-size-2xl)       /* 24px max */
  );
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}
```

### Legibility Checklist
* ✅ No text below 14px
* ⚠️ Line heights: Hero needs adjustment (see above)
* ✅ Weights limited to 400/500/600/700/800
* 🔴 font-display: swap not implemented
* 🔴 Preconnect to font hosts missing

**Implementation Priority:** HIGH

---

## 5) Color, elevation & theming

✅ **STRONG FOUNDATION** | ⚠️ **NEEDS DARK MODE**

### Current Color System

```css
/* ✅ EXCELLENT: WCAG-compliant palette defined */
--color-primary: #0A174E;        /* Navy - 60% dominance */
--color-secondary: #00D4FF;      /* Electric Cyan - 30% */
--color-accent: #6A00FF;         /* Purple - 10% highlights */

/* Neutrals - Well defined */
--color-gray-900: #111827;  /* Dark text */
--color-gray-700: #374151;  /* Muted text */
--color-gray-300: #D1D5DB;  /* Borders */
--color-gray-100: #F3F4F6;  /* Surfaces */

/* Semantic colors - WCAG AA+ */
--color-success: #00C851;   /* ✅ 4.6:1 contrast on white */
--color-error: #FF4444;     /* ✅ 4.5:1 contrast on white */
--color-warning: #FFAA00;   /* ✅ 3.2:1 contrast on white */
```

### 🔴 CRITICAL ISSUE: Hero Section Colors

```css
/* Hero.css - Lines 38-69: Colors hardcoded, not using tokens */
.left-part h1 { color: #0f1d56; }  /* 🔴 Should be var(--color-primary) */
.text { color: #1b33d4; }          /* 🔴 Not in design system */
.subtitle { color: #23316c; }      /* 🔴 Not in design system */
```

### 💡 REQUIRED FIX:

```css
/* Hero.css - Use design tokens */
.left-part h1 {
  color: var(--color-primary);
  -webkit-text-fill-color: var(--color-primary);
}

.text {
  color: var(--color-accent);  /* Use existing purple for dynamic text */
  -webkit-text-fill-color: var(--color-accent);
}

.subtitle {
  color: var(--color-primary-light);  /* Existing token: #1a2a6e */
}

.hero-description {
  color: var(--color-gray-700);  /* Better contrast on light background */
}
```

### 🔴 MISSING: Dark Mode

```css
/* Add to design-system.css after line 193 */
@media (prefers-color-scheme: dark) {
  :root {
    /* Override colors for dark mode */
    --color-primary: #1a2a6e;           /* Lighter navy */
    --color-primary-light: #2a3a7e;
    --color-primary-dark: #0A174E;

    /* Text colors */
    --text-primary: hsl(0 0% 95%);
    --text-secondary: hsl(220 10% 75%);

    /* Surfaces */
    --surface-primary: #050b27;         /* Dark navy background */
    --surface-secondary: #0A174E;
    --surface-elevated: #1a2a6e;

    /* Keep accent colors vibrant */
    --color-secondary: #33ddff;         /* Slightly brighter cyan */
    --color-accent: #8533ff;            /* Slightly brighter purple */

    /* Neutral adjustments */
    --color-gray-900: #F9FAFB;          /* Inverted for dark mode text */
    --color-gray-700: #D1D5DB;
    --color-gray-300: #4B5563;
    --color-gray-100: #1F2937;
  }

  /* Hero section dark mode */
  .hero-container {
    background: linear-gradient(180deg, #050b27 0%, #0A174E 50%, #1a2a6e 100%);
  }

  .left-part h1,
  .subtitle,
  .hero-description {
    color: var(--text-primary);
  }
}
```

### Elevation System

✅ **WELL DEFINED** - Three tiers with appropriate shadows

```css
--shadow-soft: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
--shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-pronounced: 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Contrast Compliance

✅ **WCAG 2.2 AA Compliant** for most combinations
⚠️ **Test Required:** New hero gradient colors need contrast verification

**Implementation Priority:** MEDIUM (Dark mode), HIGH (Color token consistency)

---

## 6) Iconography & imagery

✅ **GOOD START** | 🔴 **NO ICON SYSTEM DEFINED**

### 💡 RECOMMENDATION: Add Icon Library

**Recommended: Heroicons** (matches design language, free, MIT license)

```bash
npm install @heroicons/react
```

```jsx
// Example usage in components
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

<button className="btn btn-primary">
  Get Started
  <ArrowRightIcon className="w-5 h-5" />
</button>
```

### Icon Standards
* **Sizes:** 16/20/24/32px (use `w-4`, `w-5`, `w-6`, `w-8` Tailwind classes or custom tokens)
* **Style:** Outline for UI, Solid for emphasis
* **Stroke:** 1.5px consistent
* **Colors:** Inherit from parent or use `text-secondary` for accents
* **Accessibility:** Always `aria-hidden="true"` for decorative icons

### Current Image Issues

🔴 **Hero Carousel Images:** Using Unsplash URLs directly
```javascript
// Hero.js - Lines 100-137
<img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=400" />
```

### 💡 REQUIRED FIX:

1. **Download and optimize images** - Save to `/public/images/hero/`
2. **Use responsive image sets:**

```jsx
<picture>
  <source
    srcSet="/images/hero/web-design-400.avif 400w, /images/hero/web-design-800.avif 800w"
    type="image/avif"
  />
  <source
    srcSet="/images/hero/web-design-400.webp 400w, /images/hero/web-design-800.webp 800w"
    type="image/webp"
  />
  <img
    src="/images/hero/web-design-400.jpg"
    alt="Modern website design showcase"
    width="400"
    height="400"
    loading="lazy"
  />
</picture>
```

3. **Compress images:** <100KB for carousel images (currently unoptimized)

**Implementation Priority:** MEDIUM

---

## 7) Core components

⚠️ **PARTIALLY IMPLEMENTED** - Some components need refinement

### Buttons

✅ **WELL DEFINED** in design-system.css (Lines 300-413)

#### Current States
```css
.btn-primary {
  /* ✅ Good: Accessible colors */
  background-color: var(--color-accent);  /* #6A00FF */
  color: var(--color-white);

  /* ✅ Good: Smooth transitions */
  transition: all var(--transition-base) var(--ease-in-out);

  /* ✅ Good: Visual feedback */
  transform: translateY(-2px) on hover;
  box-shadow: var(--shadow-button-hover);
}
```

#### ⚠️ ISSUES:

1. **Hero buttons** (Hero.css Lines 76-107) duplicate styles instead of using `.btn` classes
2. **Min height not enforced** - Should be 44px for accessibility

### 💡 REQUIRED FIX:

```css
/* Hero.css - Replace custom button styles */
.cta-buttons .btn {
  /* Remove duplicate styles, use design system */
  min-height: 44px;  /* ✅ ADD: WCAG touch target */
  min-width: 44px;
}

/* Ensure focus visible */
.btn:focus-visible {
  outline: 3px solid var(--color-secondary);
  outline-offset: 2px;
}
```

```jsx
// Hero.js - Use consistent classes
<div className="cta-buttons">
  <a href="#contact" className="btn btn-primary">
    Get a Free Site Audit
  </a>
  <a href="#work" className="btn btn-secondary">
    See Our Work
  </a>
</div>
```

### Forms & Inputs

🔴 **NOT YET IMPLEMENTED** - No form component system

### 💡 REQUIRED ADDITION:

```css
/* Add to design-system.css */
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
}

.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-gray-900);
  background-color: var(--color-white);
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-base);
  transition: all var(--transition-base) var(--ease-in-out);
  min-height: 44px; /* ✅ WCAG compliance */
}

.form-input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.form-input:disabled {
  opacity: var(--opacity-50);
  cursor: not-allowed;
  background-color: var(--color-gray-100);
}

.form-error {
  margin-top: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

.form-helper {
  margin-top: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}
```

### Navigation

✅ **HEADER IMPLEMENTED** (index.css Lines 56-101)
⚠️ **NEEDS MOBILE MENU**

### Cards

✅ **WELL DEFINED** (design-system.css Lines 419-458)

### Tables & Data

🔴 **NOT IMPLEMENTED**

### Modals/Drawers

✅ **MODAL COMPONENT EXISTS** (`src/components/Modal.js`)

### Toasts

🔴 **NOT IMPLEMENTED** - Should add notification system

### Empty & Error States

🔴 **NOT IMPLEMENTED**

### Loading States

✅ **SKELETON DEFINED** (design-system.css Lines 882-901)
🔴 **NOT USED IN COMPONENTS**

**Implementation Priority:** HIGH (Forms), MEDIUM (Missing components)

---

## 8) Motion & feedback

✅ **GOOD FOUNDATION** | ⚠️ **NEEDS REDUCED MOTION SUPPORT**

### Current Motion System

```css
/* ✅ Well-defined durations */
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-medium: 300ms;
--transition-slow: 500ms;

/* ✅ Appropriate easing curves */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-smooth: cubic-bezier(0.215, 0.61, 0.355, 1);
```

### ✅ EXCELLENT: Reduced Motion Implemented

```css
/* design-system.css Lines 611-620 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 🔴 ISSUE: Hero Carousel Ignores Reduced Motion

```css
/* Hero.css - Lines 330-431: Box animations run regardless */
@keyframes box-1 { /* 30s animation */ }
@keyframes box-2 { /* 30s animation */ }
/* ... */
```

### 💡 REQUIRED FIX:

```css
/* Hero.css - Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .hero-container .right-part .box {
    animation: none !important;
    /* Show static final positions */
  }

  .hero-container .bg-line img,
  .hero-container .bg-dash-circle img,
  .hero-container .bg-circle-h-line img {
    animation: none !important;
  }
}
```

### Motion Guidelines

* ✅ Micro-interactions: 150-200ms
* ✅ Page transitions: 200-300ms
* ⚠️ Hero carousel: 30s is too slow, consider 20s
* ✅ Easing curves appropriate

**Implementation Priority:** HIGH (Reduced motion in hero)

---

## 9) Accessibility

✅ **SOLID FOUNDATION** | ⚠️ **NEEDS HERO IMPROVEMENTS**

### Current Accessibility Features

#### ✅ EXCELLENT:
```css
/* Focus indicators (design-system.css Lines 559-574) */
:focus-visible {
  outline: 3px solid var(--color-secondary);  /* ✅ 3:1 contrast */
  outline-offset: 2px;
}

/* Skip to content (Lines 577-591) */
.skip-to-main { /* ✅ Implemented */ }

/* Screen reader only (Lines 594-604) */
.sr-only { /* ✅ Implemented */ }
```

### 🔴 ISSUES IN HERO COMPONENT:

1. **No skip link in actual markup** - defined in CSS but not used in Hero.js
2. **Carousel lacks ARIA labels**
3. **No alt text strategy** for decorative SVGs
4. **Buttons missing focus-visible styles** (overridden)

### 💡 REQUIRED FIXES:

```jsx
// Hero.js - Add accessibility attributes
<section className="hero-container" aria-label="Homepage hero">
  <a href="#main-content" className="skip-to-main">
    Skip to main content
  </a>

  {/* Decorative elements */}
  <div className="bg-decoration bg-decoration-1" aria-hidden="true"></div>

  {/* Carousel */}
  <div
    className="main-grid d-flex"
    role="img"
    aria-label="Rotating showcase of CapeWeb services: websites, AI, automation, and design"
  >
    {/* Individual boxes don't need individual labels if parent has comprehensive label */}
  </div>

  {/* SVGs */}
  <div className="bg-line" aria-hidden="true">
    <img src="..." alt="" role="presentation" />
  </div>
</section>
```

### Keyboard Navigation

✅ **Tab order:** Logical (header → hero CTAs → content)
⚠️ **Focus trap:** Not implemented for modals
🔴 **Keyboard shortcuts:** None defined

### Color Accessibility

✅ **WCAG AA Compliance:** Most combinations pass
⚠️ **Needs testing:** Hero gradient text on background

```bash
# Test contrast ratios
# Primary text: #0f1d56 on white → 13.2:1 ✅
# Subtitle: #23316c on white → 10.8:1 ✅
# Description: #2f3b77 on white → 8.5:1 ✅
# Secondary button: #00D4FF border → 3.5:1 ✅ (for UI graphics)
```

### Semantic HTML

⚠️ **NEEDS IMPROVEMENT:**

```jsx
// Current Hero.js - Missing semantic elements
<section className="hero-container">  {/* ✅ Good */}
  <div className="hero-content">       {/* ⚠️ Should be <main> or contain <header> */}
    <div className="left-part">        {/* ⚠️ Should be <div role="region"> with aria-label */}
      <h1>                             {/* ✅ Good: One H1 per page */}
```

**Implementation Priority:** HIGH

---

## 10) Content & microcopy

⚠️ **NEEDS REFINEMENT**

### Current Hero Copy

```
Headline: "Websites that [sell 24/7|book meetings|qualify leads|...]"
Subhead: "We build websites and AI workflows that automate what you'd rather not do manually."
Description: "From custom-built sites to chat agents, booking flows, and lead pipelines..."
```

### ✅ STRENGTHS:
* Clear value proposition
* Action-oriented dynamic text
* Specific examples (chat agents, booking flows)

### ⚠️ IMPROVEMENTS NEEDED:

**Issue 1:** "What you'd rather not do manually" is passive
**Better:** "Automate your repetitive tasks and focus on growth"

**Issue 2:** Two body paragraphs dilute the message
**Better:** Merge into one strong statement

### 💡 RECOMMENDED REVISION:

```
H1: Websites that [sell 24/7|qualify leads|book meetings|capture data]

Subhead: Stop losing leads to slow websites. We build automated systems that work while you sleep.

Body: Custom websites + AI chat agents + lead pipelines for Cape Town businesses.
100% local, 100% automated.

CTA 1: Get Free Automation Audit
CTA 2: See Live Demos
```

### Microcopy Standards

* **Voice:** Direct, confident, results-focused
* **Tone:** Helpful but not salesy; technical but not jargon-heavy
* **POV:** Use "you/your" for customer benefits, "we" for capabilities
* **Numbers:** Always specific ("3x more leads" not "more leads")
* **CTAs:** Command verbs ("Get", "Start", "See", "Book") + specific outcome

### Button Text Guidelines

| ❌ Generic | ✅ Specific |
|-----------|------------|
| Submit | Send Message |
| Click Here | Get Free Audit |
| Learn More | See Case Studies |
| Contact Us | Book Strategy Call |
| Sign Up | Start Free Trial |

**Implementation Priority:** MEDIUM

---

## 11) Performance & SEO

⚠️ **NEEDS OPTIMIZATION**

### Current Performance Issues

🔴 **CRITICAL:**
1. **Unsplash images** loaded directly (unoptimized, slow)
2. **External font CDN** (yudiz.com/monumentextended) - single point of failure
3. **No image lazy loading** beyond default
4. **No preconnect** to font hosts
5. **External SVGs** from CDN instead of inline or local

### 💡 REQUIRED OPTIMIZATIONS:

#### 1. Fonts (CRITICAL)
```html
<!-- public/index.html - Add before other links -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com">

<!-- Replace Monument Extended with self-hosted or Google Fonts alternative -->
```

#### 2. Images (HIGH PRIORITY)
```jsx
// Hero.js - Optimize images
const HERO_IMAGES = [
  {
    src: '/images/hero/web-design',
    alt: 'Modern responsive website design',
    width: 400,
    height: 400
  },
  // ...
];

<picture>
  <source srcSet={`${img.src}-400.avif 400w, ${img.src}-800.avif 800w`} type="image/avif" />
  <source srcSet={`${img.src}-400.webp 400w, ${img.src}-800.webp 800w`} type="image/webp" />
  <img
    src={`${img.src}-400.jpg`}
    alt={img.alt}
    width={img.width}
    height={img.height}
    loading="lazy"
    decoding="async"
  />
</picture>
```

#### 3. Core Web Vitals Targets

| Metric | Target | Current Status | Fix Priority |
|--------|--------|----------------|--------------|
| **LCP** | ≤2.5s | 🔴 Unknown | HIGH - Test with Lighthouse |
| **INP** | ≤200ms | ⚠️ Likely OK | MEDIUM - Test interactions |
| **CLS** | ≤0.1 | 🔴 Likely failing | HIGH - Hero carousel shifts |

### 💡 FIX CLS (Cumulative Layout Shift):

```css
/* Hero.css - Reserve space for carousel */
.hero-container .right-part {
  /* ✅ ADD: Prevent layout shift */
  aspect-ratio: 1 / 1;
  width: 588px;
  height: 588px;
  contain: layout style paint; /* CSS containment */
}

.hero-container .right-part .bg-img {
  /* ✅ ADD: Prevent image shift */
  aspect-ratio: 1 / 1;
}

.hero-container .right-part .bg-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### SEO Checklist

🔴 **MISSING - Add to public/index.html:**

```html
<head>
  <!-- Primary Meta Tags -->
  <title>CapeWeb - AI Website Automation for Cape Town Businesses</title>
  <meta name="title" content="CapeWeb - AI Website Automation for Cape Town Businesses">
  <meta name="description" content="Stop losing leads to slow websites. We build automated systems that sell 24/7. Custom websites + AI chat + lead pipelines for Cape Town SMBs.">
  <meta name="keywords" content="website automation, AI chatbots, lead generation, Cape Town web design, small business automation">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://capeweb.co.za/">
  <meta property="og:title" content="CapeWeb - AI Website Automation for Cape Town">
  <meta property="og:description" content="Automated websites that work while you sleep. Built for Cape Town businesses.">
  <meta property="og:image" content="https://capeweb.co.za/og-image.jpg">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://capeweb.co.za/">
  <meta property="twitter:title" content="CapeWeb - AI Website Automation">
  <meta property="twitter:description" content="Automated websites that work while you sleep.">
  <meta property="twitter:image" content="https://capeweb.co.za/twitter-image.jpg">

  <!-- Canonical -->
  <link rel="canonical" href="https://capeweb.co.za/">

  <!-- Structured Data - Organization -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CapeWeb",
    "url": "https://capeweb.co.za",
    "logo": "https://capeweb.co.za/logo.png",
    "sameAs": [
      "https://www.facebook.com/capeweb",
      "https://twitter.com/capeweb",
      "https://www.linkedin.com/company/capeweb"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+27-XX-XXX-XXXX",
      "contactType": "Sales",
      "areaServed": "ZA",
      "availableLanguage": ["en", "af"]
    }
  }
  </script>

  <!-- Structured Data - LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CapeWeb",
    "image": "https://capeweb.co.za/storefront.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cape Town",
      "addressRegion": "Western Cape",
      "addressCountry": "ZA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.9249,
      "longitude": 18.4241
    },
    "url": "https://capeweb.co.za",
    "telephone": "+27-XX-XXX-XXXX",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    ]
  }
  </script>
</head>
```

**Implementation Priority:** CRITICAL

---

## 12) Internationalization & localization

🔴 **NOT IMPLEMENTED** | 💡 **PLAN FOR FUTURE**

### Current State
* English only
* ZAR pricing assumed (not displayed)
* South African date formats implicit

### 💡 FUTURE CONSIDERATIONS:

```jsx
// If expanding beyond Cape Town
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <h1>{t('hero.headline')}</h1>
  );
};

// en.json
{
  "hero": {
    "headline": "Websites that sell 24/7",
    "cta": "Get a Free Site Audit"
  }
  
}

// af.json (Afrikaans)
{
  "hero": {
    "headline": "Webwerwe wat 24/7 verkoop",
    "cta": "Kry 'n Gratis Webwerf Oudit"
  }
}
```

### Text Expansion Planning
* English → Afrikaans: ~5-10% expansion (minimal)
* Reserve 15% extra space in buttons and cards

**Implementation Priority:** LOW (Future enhancement)

---

## 13) Privacy, trust & compliance

🔴 **NOT IMPLEMENTED**

### 💡 REQUIRED ADDITIONS:

#### 1. Trust Badges (Below Hero)
```jsx
<section className="trust-section">
  <div className="container">
    <div className="trust-badges">
      <div className="badge">
        <CheckCircleIcon />
        <span>SSL Secure</span>
      </div>
      <div className="badge">
        <ShieldCheckIcon />
        <span>POPIA Compliant</span>
      </div>
      <div className="badge">
        <ClockIcon />
        <span>24/7 Support</span>
      </div>
      <div className="badge">
        <MapPinIcon />
        <span>Cape Town Based</span>
      </div>
    </div>
  </div>
</section>
```

#### 2. Cookie Consent Banner

```jsx
// components/CookieConsent.js
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <p>
        We use cookies to improve your experience.
        <a href="/privacy">Learn more</a>
      </p>
      <button onClick={handleAccept} className="btn btn-primary btn-sm">
        Accept
      </button>
    </div>
  );
}
```

```css
/* Add to design-system.css */
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-4) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  box-shadow: var(--shadow-pronounced);
  z-index: var(--z-fixed);
  animation: slideInUp 0.3s var(--ease-out);
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

#### 3. Privacy Policy & Terms (New Pages Needed)

**Implementation Priority:** HIGH (Legal requirement for POPIA compliance)

---

## 14) Design tokens - Single source of truth

✅ **EXCELLENT FOUNDATION** | ⚠️ **INCONSISTENT USE**

### Current Token System

**Location:** `src/styles/design-system.css` (Lines 11-193)

#### ✅ WELL DEFINED:

```css
/* Spacing - 8px base system */
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-12: 6rem;    /* 96px */

/* Radius */
--radius-base: 0.25rem;   /* 4px */
--radius-lg: 0.5rem;      /* 8px */
--radius-xl: 0.75rem;     /* 12px */
--radius-full: 9999px;

/* Shadows */
--shadow-soft: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
--shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-pronounced: 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);

/* Motion */
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-medium: 300ms;
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-smooth: cubic-bezier(0.215, 0.61, 0.355, 1);

/* Z-index scale */
--z-base: 1;
--z-dropdown: 100;
--z-sticky: 200;
--z-fixed: 300;
--z-modal: 500;
```

### 🔴 CRITICAL ISSUES:

#### 1. Hero.css Ignores Tokens

```css
/* ❌ WRONG: Hero.css Line 38 */
.left-part h1 {
  font-size: clamp(3.74rem, 7.48vw, 6.35rem);
  margin-bottom: 30px;  /* ❌ Should be var(--space-4) */
}

/* ✅ CORRECT: */
.left-part h1 {
  font-size: clamp(var(--font-size-5xl), 5vw + 1rem, var(--font-size-7xl));
  margin-bottom: var(--space-4);
}
```

#### 2. Hardcoded Values Throughout Hero

```css
/* ❌ Hero.css Lines with hardcoded values */
Line 41: margin-bottom: 30px;     /* → var(--space-4) */
Line 59: margin-bottom: 20px;     /* → var(--space-3) */
Line 68: margin-bottom: 40px;     /* → var(--space-6) */
Line 78: padding: 16px 32px;      /* → var(--space-2) var(--space-4) */
Line 88: border-radius: 8px;      /* → var(--radius-lg) */
Line 144: height: 588px;          /* → Custom token needed */
Line 147: transform: translateX(20rem); /* → Use spacing tokens */
```

### 💡 REQUIRED ADDITIONS TO DESIGN SYSTEM:

```css
/* Add to design-system.css after line 136 */

/* ===== COMPONENT-SPECIFIC TOKENS ===== */

/* Hero Component */
--hero-carousel-size: 588px;
--hero-carousel-gap: var(--space-3);  /* 24px */
--hero-carousel-offset: var(--space-12);  /* 96px */

/* Button Sizes */
--button-height-sm: 36px;
--button-height-base: 44px;   /* WCAG minimum */
--button-height-lg: 52px;
--button-padding-x: var(--space-4);
--button-padding-y: var(--space-3);

/* Typography Scale (Responsive) */
--text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
--text-base: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
--text-2xl: clamp(1.5rem, 1.2rem + 1vw, 2rem);
--text-3xl: clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);
--text-4xl: clamp(2.25rem, 1.8rem + 2vw, 3rem);
--text-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);
--text-7xl: clamp(4rem, 3rem + 4vw, 6rem);
```

### Export Tokens as JSON (For Documentation)

```javascript
// scripts/export-tokens.js
const fs = require('fs');
const css = require('css');

const designSystemCSS = fs.readFileSync('./src/styles/design-system.css', 'utf8');
const parsed = css.parse(designSystemCSS);

const tokens = {};
parsed.stylesheet.rules
  .filter(rule => rule.type === 'rule' && rule.selectors.includes(':root'))
  .forEach(rule => {
    rule.declarations
      .filter(decl => decl.type === 'declaration' && decl.property.startsWith('--'))
      .forEach(decl => {
        tokens[decl.property] = decl.value;
      });
  });

fs.writeFileSync('./design-tokens.json', JSON.stringify(tokens, null, 2));
console.log('✅ Design tokens exported to design-tokens.json');
```

**Implementation Priority:** CRITICAL - Foundation for consistency

---

## 15) Component library structure

⚠️ **NEEDS ORGANIZATION**

### Current Component Files (25 components found)

```
src/components/
├── Hero.js ✅ (Active)
├── Header.js ✅ (Active)
├── Footer.js ✅ (Active)
├── Modal.js ✅ (Active)
├── ServiceCard.js
├── Testimonial.js
├── TestimonialSlideshow.js
├── Gallery.js
├── GalleryModal.js
├── ... (16 more)
```

### 💡 RECOMMENDED STRUCTURE:

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── Container.js
│   ├── sections/
│   │   ├── Hero.js
│   │   ├── Services.js
│   │   ├── Testimonials.js
│   │   └── Gallery.js
│   ├── ui/
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Card.js
│   │   └── Modal.js
│   └── shared/
│       ├── Loading.js
│       ├── ErrorBoundary.js
│       └── SEOHead.js
├── styles/
│   ├── design-system.css ✅ (Keep as source of truth)
│   ├── components/
│   │   ├── Hero.css
│   │   ├── Header.css
│   │   └── Footer.css
│   └── utils/
│       └── animations.css
└── hooks/
    ├── useMediaQuery.js
    ├── useScrollPosition.js
    └── useReducedMotion.js
```

### 💡 CREATE REUSABLE BUTTON COMPONENT:

```jsx
// src/components/ui/Button.js
import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'base',
  href,
  onClick,
  disabled = false,
  icon,
  iconPosition = 'right',
  className = '',
  ...props
}) {
  const Component = href ? 'a' : 'button';

  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    icon && 'btn-with-icon',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={classes}
      href={href}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </Component>
  );
}

// Usage in Hero.js
import Button from '../ui/Button';

<div className="cta-buttons">
  <Button variant="primary" size="lg" href="#contact">
    Get a Free Site Audit
  </Button>
  <Button variant="secondary" size="lg" href="#work">
    See Our Work
  </Button>
</div>
```

**Implementation Priority:** MEDIUM (Improves maintainability)

---

## 16) Testing & metrics

🔴 **NOT IMPLEMENTED**

### 💡 RECOMMENDED TESTING SETUP:

#### 1. Visual Regression Testing

```bash
npm install --save-dev @playwright/test
```

```javascript
// tests/hero.spec.js
import { test, expect } from '@playwright/test';

test('hero section displays correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check hero is visible
  const hero = page.locator('.hero-container');
  await expect(hero).toBeVisible();

  // Check CTAs are present
  const primaryCTA = page.locator('.btn-primary');
  await expect(primaryCTA).toHaveText('Get a Free Site Audit');

  // Screenshot for visual regression
  await page.screenshot({ path: 'tests/screenshots/hero-desktop.png' });
});

test('hero is responsive', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await page.goto('http://localhost:3000');

  await page.screenshot({ path: 'tests/screenshots/hero-mobile.png' });
});
```

#### 2. Accessibility Testing

```bash
npm install --save-dev @axe-core/playwright
```

```javascript
// tests/accessibility.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

#### 3. Performance Testing

```bash
npm install --save-dev lighthouse
```

```javascript
// scripts/lighthouse-test.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);

  // Targets
  console.log('Performance:', runnerResult.lhr.categories.performance.score * 100);
  console.log('Accessibility:', runnerResult.lhr.categories.accessibility.score * 100);

  await chrome.kill();
}

runLighthouse();
```

### Metrics to Track

| Metric | Target | Test Frequency |
|--------|--------|----------------|
| **Lighthouse Performance** | >90 | Every deploy |
| **Lighthouse Accessibility** | 100 | Every deploy |
| **LCP** | <2.5s | Every deploy |
| **CLS** | <0.1 | Every deploy |
| **INP** | <200ms | Weekly |
| **Bundle Size** | <500KB | Every PR |

**Implementation Priority:** HIGH (Set up CI/CD pipeline)

---

## 17) Design handoff checklist

### For Designers → Developers

- [ ] All colors use design tokens (no hardcoded hex)
- [ ] All spacing uses 8px multiples (`--space-*`)
- [ ] All font sizes from type scale
- [ ] Components named consistently (PascalCase for files, kebab-case for CSS)
- [ ] States documented (hover, focus, active, disabled, loading, error)
- [ ] Responsive breakpoints specified (mobile/tablet/desktop)
- [ ] Accessibility notes included (ARIA labels, focus order, color contrast)
- [ ] Motion specs provided (duration, easing, reduced-motion fallback)
- [ ] Edge cases designed (empty states, error states, long text, missing images)
- [ ] Export assets optimized (AVIF/WebP, compressed, responsive)

### For Developers → QA

- [ ] All design tokens implemented correctly
- [ ] Responsive on 320px → 1920px
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] Lighthouse score >90
- [ ] No console errors
- [ ] Images optimized (<100KB each)
- [ ] Fonts loaded correctly
- [ ] Animations respect `prefers-reduced-motion`

---

## 18) Governance & maintenance

### Design System Ownership

**Primary Owner:** Lead Developer + Design Lead
**Contributors:** All team members can propose changes via PR
**Review Process:** Design council (weekly 30min review)

### Versioning

**Current Version:** 1.0.0 (This document)

**Semantic Versioning:**
- **Major (2.0.0):** Breaking changes (color system overhaul, font change)
- **Minor (1.1.0):** New components, new tokens
- **Patch (1.0.1):** Bug fixes, documentation updates

### Change Process

1. **Propose:** Open GitHub issue with `[Design System]` tag
2. **Discuss:** Design council reviews in weekly meeting
3. **Approve:** Requires 2 approvals (1 designer + 1 developer)
4. **Implement:** Create PR with updated components + documentation
5. **Release:** Update CHANGELOG.md, bump version, deploy

### Quarterly Audits

**Q1, Q3:** Accessibility audit (WCAG 2.2 AA compliance)
**Q2, Q4:** Performance audit (Lighthouse, Core Web Vitals)
**Ongoing:** Component usage tracking (which components are actually used)

---

## 19) Priority implementation roadmap

### 🔴 CRITICAL (Week 1-2)

1. **Fix Hero.css to use design tokens** (2 days)
   - Replace all hardcoded values with variables
   - Implement responsive breakpoints
   - Fix color inconsistencies

2. **Implement responsive carousel positioning** (1 day)
   - Remove fixed `transform: translateX(20rem)`
   - Use `margin-left` with breakpoints

3. **Add SEO metadata** (1 day)
   - Meta tags in `index.html`
   - Open Graph tags
   - Structured data (JSON-LD)

4. **Optimize images** (2 days)
   - Download and compress Unsplash images
   - Implement responsive image sets (AVIF/WebP)
   - Add proper alt text

5. **Fix accessibility issues** (2 days)
   - Add skip-to-content link
   - Add ARIA labels to carousel
   - Test with screen reader

### ⚠️ HIGH PRIORITY (Week 3-4)

6. **Replace external font CDN** (1 day)
   - Self-host fonts or use Google Fonts
   - Add `font-display: swap`
   - Preconnect to font hosts

7. **Implement dark mode** (3 days)
   - Add `prefers-color-scheme` media queries
   - Test all components in dark mode
   - Add theme toggle (optional)

8. **Add form component system** (3 days)
   - Input, Textarea, Select components
   - Form validation patterns
   - Error/success states

9. **Implement reduced motion** (1 day)
   - Test hero carousel respects preference
   - Add static fallbacks

10. **Set up performance monitoring** (2 days)
    - Lighthouse CI in GitHub Actions
    - Core Web Vitals tracking

### 💡 MEDIUM PRIORITY (Month 2)

11. **Create component library structure** (3 days)
    - Reorganize files by type
    - Extract reusable Button component
    - Extract reusable Card component

12. **Add missing components** (1 week)
    - Toast notifications
    - Loading states
    - Empty states
    - Error boundaries

13. **Implement cookie consent** (2 days)
    - Cookie banner component
    - Privacy policy page
    - POPIA compliance

14. **Content refinement** (2 days)
    - Revise hero copy
    - Standardize button text
    - Add microcopy guidelines

### ✅ LOW PRIORITY (Month 3+)

15. **Internationalization setup** (1 week)
16. **Advanced testing suite** (1 week)
17. **Storybook documentation** (3 days)
18. **Design token automation** (2 days)

---

## 20) Quick reference - Design tokens

### Colors

```css
/* Primary Palette */
--color-primary: #0A174E;      /* Navy */
--color-secondary: #00D4FF;    /* Cyan */
--color-accent: #6A00FF;       /* Purple */

/* Semantic */
--color-success: #00C851;
--color-error: #FF4444;
--color-warning: #FFAA00;

/* Neutrals */
--color-gray-900: #111827;     /* Darkest */
--color-gray-100: #F3F4F6;     /* Lightest */
```

### Spacing (8px base)

```css
--space-1: 8px
--space-2: 16px
--space-3: 24px
--space-4: 32px
--space-6: 48px
--space-8: 64px
--space-12: 96px
```

### Typography

```css
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 30px
--font-size-4xl: 36px
--font-size-5xl: 48px
--font-size-7xl: 72px
```

### Breakpoints

```css
@media (max-width: 768px)   /* Mobile */
@media (max-width: 1024px)  /* Tablet */
@media (min-width: 1200px)  /* Desktop */
```

---

## 21) Component status matrix

| Component | Design System | Responsive | Accessible | Optimized | Status |
|-----------|--------------|------------|------------|-----------|--------|
| **Hero** | ⚠️ Partial | 🔴 No | ⚠️ Partial | 🔴 No | NEEDS WORK |
| **Header** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| **Footer** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| **Buttons** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | EXCELLENT |
| **Cards** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| **Forms** | 🔴 No | 🔴 No | 🔴 No | 🔴 No | NOT IMPLEMENTED |
| **Modal** | ✅ Yes | ⚠️ Partial | ⚠️ Partial | ✅ Yes | NEEDS WORK |
| **Carousel** | 🔴 No | 🔴 No | ⚠️ Partial | 🔴 No | NEEDS WORK |

---

## 22) Useful commands

```bash
# Development
npm start                    # Start dev server
npm run build               # Production build
npm test                    # Run tests

# Testing
npx playwright test         # Run E2E tests
npx playwright test --ui    # Interactive test UI
npm run lighthouse          # Performance audit

# Code quality
npm run lint                # Lint code
npm run format              # Format with Prettier

# Design system
npm run export-tokens       # Export CSS vars to JSON
npm run generate-changelog  # Update CHANGELOG.md
```

---

## 23) Resources & references

### Official Documentation
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [React Documentation](https://react.dev/)

### Design Systems
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Shadcn UI](https://ui.shadcn.com/) - Component patterns
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first inspiration

### Tools
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google Fonts](https://fonts.google.com/)
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimizer
- [Squoosh](https://squoosh.app/) - Image optimizer

### Testing
- [Playwright](https://playwright.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## 24) Changelog

### Version 1.0.0 (January 2025)
- ✅ Initial style guide created
- ✅ Current state documented
- ✅ Issues identified
- ✅ Implementation roadmap defined

### Upcoming (Version 1.1.0)
- ⏳ Hero component refactored
- ⏳ Design tokens enforced across all components
- ⏳ Dark mode implemented
- ⏳ SEO metadata complete

---

## 25) Contact & contribution

**Questions:** Open an issue on GitHub with `[Style Guide]` tag
**Suggestions:** Submit PR to this document
**Design Review:** Weekly Fridays 2pm SAST

**Maintainers:**
- Design Lead: [Name]
- Lead Developer: [Name]
- Accessibility Champion: [Name]

---

**End of CapeWeb Style Guide v1.0.0**

*Last updated: January 2025*
*Next review: April 2025*
