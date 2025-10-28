# Design System - Quick Reference Guide

## 🎨 Color Tokens

### Primary Colors
```css
var(--color-primary)        /* #0A174E - Deep Space Blue */
var(--color-secondary)      /* #00D4FF - Electric Cyan */
var(--color-accent)         /* #6A00FF - Quantum Purple */
```

### Semantic Colors
```css
var(--color-error)          /* #FF4444 */
var(--color-warning)        /* #FFAA00 */
var(--color-success)        /* #00C851 */
var(--color-info)           /* #00D4FF */
```

### Neutrals
```css
var(--color-white)          /* #FFFFFF */
var(--color-black)          /* #000000 */
var(--color-gray-300)       /* Light gray for text */
var(--color-gray-500)       /* Medium gray */
var(--color-gray-900)       /* Dark gray */
```

---

## 📏 Spacing Tokens (8px grid)

```css
var(--space-1)    /* 8px  - Tiny gaps */
var(--space-2)    /* 16px - Small gaps, button padding */
var(--space-3)    /* 24px - Medium gaps */
var(--space-4)    /* 32px - Large gaps, section spacing */
var(--space-6)    /* 48px - XL gaps */
var(--space-8)    /* 64px - 2XL gaps, container padding */
var(--space-12)   /* 96px - Section padding */
```

**Most Common**: `var(--space-4)` for general padding/margins

---

## 🔤 Typography Tokens

### Font Sizes
```css
var(--font-size-xs)      /* 12px - Captions */
var(--font-size-sm)      /* 14px - Small text */
var(--font-size-base)    /* 16px - Body text */
var(--font-size-lg)      /* 18px - Large body */
var(--font-size-xl)      /* 20px - Subheadings */
var(--font-size-2xl)     /* 24px - H4 */
var(--font-size-3xl)     /* 30px - H3 */
var(--font-size-5xl)     /* 48px - H2 */
var(--font-size-7xl)     /* 72px - H1 */
```

### Font Weights
```css
var(--font-weight-light)      /* 300 */
var(--font-weight-regular)    /* 400 - Body */
var(--font-weight-medium)     /* 500 */
var(--font-weight-semibold)   /* 600 - Subheadings */
var(--font-weight-bold)       /* 700 - Headings */
var(--font-weight-extrabold)  /* 800 - Display */
```

### Line Heights
```css
var(--line-height-tight)     /* 1.25  - Headlines */
var(--line-height-normal)    /* 1.5   - Default */
var(--line-height-relaxed)   /* 1.625 - Body text */
```

---

## 🎯 Common Component Classes

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Cards
```html
<div class="card">Basic card</div>
<div class="card card-gradient">Gradient border card</div>
```

### Layout
```html
<div class="container">Max-width container (1200px)</div>
<div class="container-fluid">Full-width container</div>
<div class="section">Section with vertical padding</div>
```

### Flexbox Utilities
```html
<div class="flex items-center justify-between gap-4">
  Flex container with centered items, space-between, 32px gap
</div>
```

### Grid
```html
<div class="grid">
  <div class="col-6">Half width</div>
  <div class="col-6">Half width</div>
</div>
```

---

## 🎬 Animation Classes

```html
<div class="animate-fade-in">Fades in (500ms)</div>
<div class="animate-fade-in-up">Fades in from bottom</div>
<div class="animate-slide-in-left">Slides from left</div>
<div class="animate-slide-in-right">Slides from right</div>
<div class="animate-pulse-glow">Pulsing glow effect</div>
```

---

## ⏱️ Transitions

```css
/* Duration */
var(--transition-fast)     /* 150ms */
var(--transition-base)     /* 200ms - Most common */
var(--transition-medium)   /* 300ms */
var(--transition-slow)     /* 500ms */

/* Easing */
var(--ease-in-out)         /* Standard easing - Most common */
var(--ease-out)            /* Deceleration */
var(--ease-smooth)         /* Smooth cubic-bezier */
```

**Usage Example**:
```css
.my-component {
  transition: all var(--transition-base) var(--ease-in-out);
}
```

---

## 📦 Shadows

```css
var(--shadow-soft)              /* Subtle elevation */
var(--shadow-medium)            /* Card hover */
var(--shadow-pronounced)        /* Modal, elevated */
var(--shadow-button-primary)    /* Button shadow with glow */
```

---

## 🔲 Border Radius

```css
var(--radius-base)    /* 4px  - Buttons, inputs */
var(--radius-lg)      /* 8px  - Cards */
var(--radius-xl)      /* 12px - Large cards */
var(--radius-full)    /* 9999px - Pills, circles */
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
@media (max-width: 768px) {
  /* Tablet and below */
}

@media (min-width: 769px) and (max-width: 1199px) {
  /* Desktop */
}

@media (min-width: 1200px) {
  /* Large desktop */
}
```

---

## ♿ Accessibility Utilities

```html
<!-- Skip to main content -->
<a href="#main" class="skip-to-main">Skip to main content</a>

<!-- Screen reader only -->
<span class="sr-only">Descriptive text for screen readers</span>

<!-- Focus indicators (automatic on :focus-visible) -->
<!-- Always 3px solid cyan outline -->
```

---

## 🎨 Gradient Backgrounds

```css
background: var(--gradient-hero);      /* Purple to blue diagonal */
background: var(--gradient-accent);    /* Cyan to purple horizontal */
background: var(--gradient-overlay);   /* Dark overlay for images */
```

---

## 📊 Z-Index Scale

```css
var(--z-base)            /* 1   - Default */
var(--z-dropdown)        /* 100 - Dropdowns */
var(--z-sticky)          /* 200 - Sticky header */
var(--z-fixed)           /* 300 - Fixed elements */
var(--z-modal-backdrop)  /* 400 - Modal backdrop */
var(--z-modal)           /* 500 - Modal content */
var(--z-tooltip)         /* 700 - Tooltips */
```

---

## 💡 Common Patterns

### Card with Hover Effect
```css
.my-card {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--transition-base) var(--ease-in-out);
}

.my-card:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--color-secondary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-pronounced);
}
```

### Section with Vertical Padding
```css
.my-section {
  padding: var(--section-padding-vertical) 0;
  background-color: var(--color-primary);
}
```

### Centered Container
```css
.centered-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}
```

### Glowing Button
```css
.glow-button {
  background: var(--color-accent);
  color: var(--color-white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-button-primary);
  transition: all var(--transition-base) var(--ease-in-out);
}

.glow-button:hover {
  box-shadow: 0 6px 20px rgba(106, 0, 255, 0.5);
  transform: translateY(-2px);
}
```

---

## 🚀 Quick Start Template

```html
<div class="container section">
  <div class="flex flex-col items-center gap-8 text-center">
    <h1 class="text-white">Your Headline</h1>
    <p class="text-readable text-secondary">
      Descriptive text that's easy to read
    </p>
    <div class="flex gap-4">
      <button class="btn btn-primary btn-lg">Get Started</button>
      <button class="btn btn-secondary btn-lg">Learn More</button>
    </div>
  </div>
</div>
```

---

## 🎯 Most Used Combinations

### Hero Section
```css
background: var(--gradient-hero);
padding: var(--space-12) var(--space-6);
color: var(--color-white);
```

### Card Grid
```html
<div class="grid gap-6">
  <div class="col-4 card">Card 1</div>
  <div class="col-4 card">Card 2</div>
  <div class="col-4 card">Card 3</div>
</div>
```

### Text Block
```css
font-size: var(--font-size-lg);
line-height: var(--line-height-relaxed);
color: var(--color-gray-300);
max-width: 65ch; /* Readable line length */
```

---

**Pro Tip**: Always use design tokens instead of hard-coded values. This ensures consistency and makes global updates effortless!

**Need more details?** See [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) for comprehensive documentation.
