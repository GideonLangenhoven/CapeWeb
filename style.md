# Flowweb Visual Direction

The interface should feel like a calm, high-end product suite. Think founder dashboards and premium SaaS landing pages—lots of breathable space, crisp typography, and purposeful use of colour. The entire site leans light and modern with bold, editorial headlines and confident calls to action.

## Palette

| Token | Hex | Notes |
| --- | --- | --- |
| `--color-bg` | `#F5F6FB` | Page background; a soft blue-white that keeps things airy. |
| `--color-surface` | `#FFFFFF` | Card & panel background. Use generous shadows, not heavy borders. |
| `--color-surface-muted` | `#EEF2FB` | Subtle striping for alternating sections. |
| `--color-text` | `#0F172A` | Base copy colour. |
| `--color-text-muted` | `rgba(15, 23, 42, 0.7)` | Secondary copy. |
| `--color-accent` | `#1F5CF0` | Primary CTA, highlights, icon accents. |
| `--color-accent-alt` | `#38BDF8` | Gradient support colour. |
| `--color-success` | `#15803D` | Success states and confirmations. |
| `--color-border` | `rgba(15, 23, 42, 0.08)` | Default borders/dividers. |

Gradients should blend `#1F5CF0 → #4338CA → #38BDF8`. Use sparingly on CTAs or hero backgrounds.

## Typography

- **Display**: `Space Grotesk` for headings. Use tight tracking (-0.02em) and bold weights.
- **Body**: `Inter` for all supporting copy.
- Sizes per breakpoint:
  - Mobile: 32 / 24 / 18 / 16 px scale
  - Desktop: 48 / 32 / 20 / 16 px scale
- Line-height: 1.15 for hero headlines, 1.6 for paragraphs.

## Layout & Spacing

- 8pt base grid with `clamp()` for responsive spacing.
- `max-width: 1200px` with `clamp(1.4rem, 4vw, 3.2rem)` side padding.
- Alternate light surfaces (`#FFFFFF` / `#EEF2FB`) to create rhythm down the page.
- Cards use rounded corners (20px) and soft shadow: `0 24px 40px rgba(15, 23, 42, 0.12)`.

## Components

- **Buttons**
  - Primary: filled gradient background, white text, soft glow on hover.
  - Secondary (ghost): transparent with accent outline, fills subtly on hover.
  - Border radius: pill shape, consistent focus outline.
- **Surface Panels**
  - White background, 1px border (`--color-border`), subtle gradient top edge via pseudo-element.
  - Remove neon highlights and dark glassmorphism from the previous version.
- **Eyebrow / Tag**
  - Capsule with accent outline + soft fill. Uppercase with 0.14em tracking.
- **Forms**
  - White fields, 12px radius, 1px border. Focus ring: `rgba(31, 92, 240, 0.3)` with 2px outline.
- **Lists**
  - Use custom bullets (`◆` or small filled dot) in accent colour.

## Imagery & Motion

- Hero: still photography or abstract gradient shapes—no particle sliders.
- Subtle fade/slide reveals using small Y offsets, duration < 600ms.
- Remove heavy parallax and excessive blur effects; keep motion purposeful.

## Accessibility

- Minimum colour contrast: 4.5:1 for body text, 3:1 for large headlines.
- Maintain keyboard focus outlines on all interactives.
- Replace decorative `<div>` logos with accessible text or SVGs that include meaningful `aria-label` copy.

## Page Frames

1. **Header**: translucent white, slim, sticky. Navigation left aligned, CTA right aligned. Mobile uses a clean sheet with “More” accordion for secondary links.
2. **Hero**: 50–60% viewport height on mobile, 60–70% on desktop. Always includes H1, supporting sentence, primary CTA, secondary CTA, and trust proof.
3. **Content Sections**: Each section focuses on one story beat. Use icon lists or stat blocks for quick scanning. Avoid more than two CTA buttons per view.
4. **Footer**: Two-tier layout. Light card for newsletter, dark gradient band for meta/navigation. Repeat the primary CTA once.

Deliver every page against this system so the entire experience feels cohesive and “world class” without visual noise.
