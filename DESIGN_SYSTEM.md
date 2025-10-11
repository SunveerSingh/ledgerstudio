# Ledger Studio Design System Documentation

## Overview

This document outlines the comprehensive brand identity and design system for Ledger Studio, a professional platform for creating music visual content. The design system establishes consistency, scalability, and a premium user experience across all touchpoints.

---

## Brand Identity

### Brand Positioning

**Mission:** Empower artists and labels to create professional-grade visual content that elevates their music's identity.

**Brand Personality:**
- Professional yet approachable
- Innovative and cutting-edge
- Trustworthy and reliable
- Creative and inspiring

### Target Audience

- **Primary:** Independent musicians and producers (18-35 years old)
- **Secondary:** Record labels and music marketing agencies
- **Tertiary:** Content creators and social media influencers

---

## Visual Identity

### Logo & Branding

**Logo Concept:**
- Icon: Layered squares symbolizing multiple creative dimensions
- Represents: Layers of creativity, professional depth, structured design
- Colors: Blue gradient (primary brand colors)
- Usage: Always maintain clear space (minimum 16px on all sides)

**Logo Variations:**
- Full logo with text (primary use)
- Icon only (mobile, favicon, small spaces)
- Monochrome version (single-color applications)

### Color Palette

#### Primary Brand Colors - Ocean Blue
Professional, trustworthy, and modern technology brand

```css
--brand-primary-500: #0699FF  /* Primary actions, links */
--brand-primary-600: #0577CC  /* Hover states */
--brand-primary-700: #045599  /* Active states */
```

**Psychology:** Trust, professionalism, stability
**Usage:** Primary CTAs, active states, brand emphasis

#### Secondary Brand Colors - Emerald Fresh
Growth, creativity, and success

```css
--brand-secondary-500: #00E68A  /* Secondary actions */
--brand-secondary-600: #00B36B  /* Hover states */
--brand-secondary-700: #00804D  /* Active states */
```

**Psychology:** Growth, creativity, positive energy
**Usage:** Success states, secondary CTAs, accent highlights

#### Neutral Colors - Sophisticated Grays
Foundation for professional interfaces

```css
--neutral-50: #F8F9FA    /* Light text on dark backgrounds */
--neutral-400: #CED4DA   /* Placeholder text */
--neutral-700: #495057   /* Secondary text */
--neutral-900: #212529   /* Body text */
--neutral-950: #0D1117   /* Deep backgrounds */
```

#### Surface Colors (Dark Mode)
```css
--surface-base: #0D1117       /* Primary background */
--surface-elevated: #161B22   /* Cards, elevated surfaces */
--surface-sunken: #010409     /* Sunken areas, inputs */
```

#### Semantic Colors

**Success:** Green tones for positive actions
```css
--success: #28A745
```

**Warning:** Amber tones for cautions
```css
--warning: #FFC107
```

**Error:** Red tones for errors
```css
--error: #DC3545
```

**Info:** Cyan tones for information
```css
--info: #17A2B8
```

---

## Typography

### Font Family

**Primary:** Inter
- Professional, modern sans-serif
- Excellent readability across sizes
- Wide weight range (300-700)
- Optimized for screens

**Display:** Inter (same as primary for consistency)
**Monospace:** SF Mono, Monaco (for code/technical content)

### Type Scale

Based on 1.250 ratio (Major Third) for harmonious scaling:

```
Heading 1: 49px (3.052rem) - Page titles
Heading 2: 39px (2.441rem) - Section headers
Heading 3: 31px (1.953rem) - Subsection headers
Heading 4: 25px (1.563rem) - Card titles
Heading 5: 20px (1.25rem)  - Small headers
Heading 6: 18px (1.125rem) - Subheaders
Body:      16px (1rem)     - Default text
Small:     14px (0.875rem) - Secondary text
XSmall:    12px (0.75rem)  - Captions, labels
```

### Font Weights

```
Light:     300 - Minimal use, large displays only
Regular:   400 - Body text, descriptions
Medium:    500 - Emphasized text, labels
Semibold:  600 - Headings, buttons
Bold:      700 - Strong emphasis (minimal use)
```

### Line Height

```
Tight:    1.25  - Headings
Normal:   1.5   - Body text
Relaxed:  1.625 - Long-form content
```

### Best Practices

1. **Hierarchy:** Use size and weight to establish clear information hierarchy
2. **Contrast:** Maintain minimum 150% line-height for body text
3. **Readability:** Maximum 70-80 characters per line for optimal reading
4. **Accessibility:** Minimum 16px for body text, 14px for small text

---

## Spacing System

### 8-Point Grid

All spacing uses multiples of 8px for consistency and alignment:

```
4px  (0.25rem) - Minimal spacing
8px  (0.5rem)  - Tight spacing
12px (0.75rem) - Compact spacing
16px (1rem)    - Standard spacing
24px (1.5rem)  - Medium spacing
32px (2rem)    - Large spacing
48px (3rem)    - XL spacing
64px (4rem)    - XXL spacing
```

### Application Guidelines

- **Component padding:** 16px minimum, 24px recommended
- **Section spacing:** 48-64px between major sections
- **Card spacing:** 24px internal padding
- **Button padding:** 12px vertical, 24px horizontal
- **Input padding:** 12px vertical, 16px horizontal

---

## Components

### Buttons

#### Primary Button
- **Purpose:** Main actions, conversions
- **Style:** Gradient background (primary colors)
- **States:** Default, Hover (-translate-y), Active, Disabled, Loading
- **Elevation:** Shadow on hover for depth

#### Secondary Button
- **Purpose:** Alternative actions
- **Style:** Gradient background (secondary colors)
- **Use case:** Create actions, positive confirmations

#### Outline Button
- **Purpose:** Secondary actions, cancel operations
- **Style:** Border with transparent background
- **States:** Subtle background on hover

#### Ghost Button
- **Purpose:** Tertiary actions, navigation
- **Style:** No border or background
- **States:** Background appears on hover

### Input Fields

#### Standard Input
- **Background:** Elevated surface color
- **Border:** 1px solid neutral-700
- **Focus:** Blue ring, border color change
- **Padding:** 12px vertical, 16px horizontal
- **Icons:** Left-aligned (common), right for actions

#### States
- Default: Neutral border
- Focus: Blue border + ring
- Error: Red border + error message
- Disabled: Reduced opacity, no interaction

### Cards

#### Project Card
- **Structure:** Thumbnail + Content
- **Elevation:** Border + hover lift effect
- **Interaction:** Hover reveals overlay with play button
- **Spacing:** 20px internal padding

#### Feature Card
- **Structure:** Icon + Title + Description
- **Style:** Glass effect background
- **Interaction:** Subtle hover effect
- **Elevation:** Shadow on hover

---

## Layout & Grid

### Breakpoints

```css
Mobile:    < 640px  (sm)
Tablet:    640px    (md)
Desktop:   1024px   (lg)
Large:     1280px   (xl)
XL:        1536px   (2xl)
```

### Grid System

**Dashboard Layout:**
- Sidebar: 288px (expanded), 80px (collapsed)
- Main content: Flex-grow with max-width constraints
- Padding: 32px on desktop, 16px on mobile

**Project Grid:**
- Desktop: 4 columns (1fr each)
- Tablet: 3 columns
- Mobile: 1 column
- Gap: 24px between items

### Responsive Strategy

1. **Mobile First:** Design for mobile, enhance for desktop
2. **Content Priority:** Essential content always visible
3. **Touch Targets:** Minimum 44x44px on mobile
4. **Navigation:** Collapsible sidebar on mobile

---

## Interaction & Animation

### Transition Timings

```css
Fast:     150ms - Small UI elements (hovers, focus)
Base:     250ms - Standard interactions
Slow:     350ms - Complex transitions
Slowest:  500ms - Page transitions
```

### Easing Functions

```css
Ease-out:    cubic-bezier(0, 0, 0.2, 1)    - Default
Ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)  - Smooth both ends
Spring:      cubic-bezier(0.68, -0.55, 0.265, 1.55) - Bouncy effect
```

### Micro-interactions

1. **Button Hover:** Slight upward lift (-2px transform)
2. **Card Hover:** Border color change + shadow increase
3. **Icon Hover:** Scale increase (110%)
4. **Loading States:** Spinner with fade-in animation
5. **Page Transitions:** Fade + slide combinations

### Animation Guidelines

- **Purpose:** Every animation should serve a purpose
- **Consistency:** Use same timing/easing for similar actions
- **Performance:** Prefer transform/opacity over layout properties
- **Accessibility:** Respect prefers-reduced-motion settings

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast

All text meets WCAG AA standards:
- **Normal text (16px+):** Minimum 4.5:1 contrast
- **Large text (24px+):** Minimum 3:1 contrast
- **Interactive elements:** Clear focus indicators

### Keyboard Navigation

- **Tab order:** Logical, follows visual hierarchy
- **Focus indicators:** 2px outline, high contrast
- **Skip links:** Available for main content
- **Keyboard shortcuts:** Non-conflicting, documented

### Screen Readers

- **Semantic HTML:** Proper heading hierarchy
- **ARIA labels:** For icon buttons and complex widgets
- **Alt text:** Descriptive for all images
- **Live regions:** For dynamic content updates

### Motion & Animation

- **Reduced motion:** Respect user preferences
- **No auto-play:** Audio/video requires user action
- **No flashing:** Avoid seizure triggers

---

## Best Practices

### Do's

✓ Maintain consistent spacing using 8px grid
✓ Use design tokens (CSS variables) for colors
✓ Test designs at multiple breakpoints
✓ Ensure touch targets are ≥ 44x44px
✓ Provide clear loading states
✓ Use semantic HTML
✓ Test with keyboard navigation
✓ Verify color contrast ratios

### Don'ts

✗ Don't use more than 3 font weights per page
✗ Don't animate layout properties (width, height)
✗ Don't rely solely on color for information
✗ Don't use generic link text ("click here")
✗ Don't remove focus indicators
✗ Don't use auto-playing media
✗ Don't set font-size below 14px

---

## Component Library

### Available Components

1. **Button** (`/src/components/common/Button.tsx`)
   - Variants: primary, secondary, outline, ghost, danger
   - Sizes: sm, md, lg
   - States: loading, disabled

2. **Input** (`/src/components/common/Input.tsx`)
   - Features: label, error, helper text, icons
   - Types: text, email, password, etc.

3. **Logo** (`/src/components/common/Logo.tsx`)
   - Sizes: sm, md, lg
   - Options: with/without text

### Usage Example

```tsx
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

<Button
  variant="primary"
  size="lg"
  icon={<Plus className="h-5 w-5" />}
  onClick={handleClick}
>
  Create Project
</Button>
```

---

## Design Tokens

All design values are available as CSS variables in `/src/styles/design-system.css`:

```css
/* Example usage */
.custom-button {
  background: var(--brand-primary-500);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base) var(--ease-out);
}
```

---

## Future Considerations

### Phase 2 Enhancements

1. **Light Mode:** Alternative color scheme for light environments
2. **Theme Customization:** User-selectable accent colors
3. **Advanced Animations:** Lottie animations for key moments
4. **Illustration System:** Custom illustrations for empty states
5. **Icon Library:** Custom icon set matching brand style

### Scalability

- **Component Documentation:** Storybook integration
- **Design Tokens:** Migrate to design token spec (JSON)
- **Testing:** Visual regression testing setup
- **Performance:** Code splitting and lazy loading

---

## Contact & Support

For questions about the design system or to propose changes:
- Review this documentation
- Check component examples in codebase
- Maintain consistency with established patterns

---

**Version:** 1.0.0
**Last Updated:** October 2025
**Maintained by:** Ledger Studio Design Team
