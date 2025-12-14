# Luxury Design System

Mobile-First Premium Design Foundation for Rapi-dito

## Overview

This design system provides a comprehensive set of tokens, utilities, and guidelines for building premium mobile-first experiences. It follows the "Mobile-First Luxury" design philosophy with careful attention to:

- **Premium aesthetics** - Dark theme with glassmorphism and subtle animations
- **Mobile-first** - Optimized for touch interactions and mobile devices
- **Accessibility** - Respects reduced motion preferences and provides adequate touch targets
- **Performance** - Optimized animations and efficient styling

## Structure

```
design-system/
├── tokens.ts      # Design tokens (colors, spacing, typography, etc.)
├── theme.ts       # Utility functions for working with the design system
├── index.ts       # Barrel export for easy imports
├── examples.jsx   # Usage examples
└── README.md      # This file
```

## Quick Start

### Installation

The design system is already included in the project. Simply import what you need:

```jsx
import { COLORS, SPACING, getGlassStyles } from '@/design-system';
```

### Basic Usage

#### 1. Using Design Tokens

```jsx
import { COLORS, SPACING } from '@/design-system';

function MyComponent() {
  return (
    <div style={{
      backgroundColor: COLORS.luxury.black,
      color: COLORS.luxury.white,
      padding: SPACING.lg,
    }}>
      Premium Content
    </div>
  );
}
```

#### 2. Using Utility Functions

```jsx
import { getGlassStyles, getSpringConfig } from '@/design-system';
import { motion } from 'framer-motion';

function GlassCard() {
  const glassStyles = getGlassStyles('medium');
  const springConfig = getSpringConfig('gentle');
  
  return (
    <motion.div
      style={glassStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={springConfig}
    >
      Glass morphism card with spring animation
    </motion.div>
  );
}
```

#### 3. Using Tailwind Classes

```jsx
function PremiumButton() {
  return (
    <button className="bg-luxury-accent-primary text-luxury-white px-luxury-lg py-luxury-sm rounded-luxury-pill shadow-luxury-md animate-luxury-scale-in">
      Click Me
    </button>
  );
}
```

## Design Tokens

### Colors

```typescript
COLORS.luxury.black           // #000000 - Primary background
COLORS.luxury.surface1        // #0A0A0A - Elevated surface
COLORS.luxury.surface2        // #141414 - More elevated surface
COLORS.luxury.surface3        // #1E1E1E - Highest elevated surface
COLORS.luxury.white           // #FFFFFF - Primary text
COLORS.luxury.accentPrimary   // #10B981 - Emerald accent
COLORS.luxury.accentSecondary // #3B82F6 - Blue accent
COLORS.luxury.accentTertiary  // #8B5CF6 - Purple accent

COLORS.glass.light            // rgba(255, 255, 255, 0.1)
COLORS.glass.medium           // rgba(255, 255, 255, 0.3)
COLORS.glass.dark             // rgba(0, 0, 0, 0.3)
// ... and more glass variants
```

### Spacing

```typescript
SPACING.xs   // 0.5rem (8px)
SPACING.sm   // 1rem (16px)
SPACING.md   // 1.5rem (24px)
SPACING.lg   // 2rem (32px)
SPACING.xl   // 3rem (48px)
SPACING.2xl  // 4rem (64px)
```

### Typography

```typescript
TYPOGRAPHY.fontFamily.luxury         // ['Inter', ...]
TYPOGRAPHY.fontFamily.luxuryDisplay  // ['SF Pro Display', 'Inter', ...]

TYPOGRAPHY.letterSpacing.tight   // -0.02em
TYPOGRAPHY.letterSpacing.normal  // -0.01em
TYPOGRAPHY.letterSpacing.wide    // 0.02em

TYPOGRAPHY.lineHeight.tight      // 1.2
TYPOGRAPHY.lineHeight.normal     // 1.4
TYPOGRAPHY.lineHeight.relaxed    // 1.6

TYPOGRAPHY.fontSize.base         // 1rem (16px)
TYPOGRAPHY.fontSize.lg           // 1.125rem (18px)
// ... and more sizes
```

### Shadows

```typescript
SHADOWS.luxuryGlow   // Glowing accent shadow
SHADOWS.luxuryInner  // Inner shadow for depth
SHADOWS.luxurySm     // Small elevation
SHADOWS.luxuryMd     // Medium elevation
SHADOWS.luxuryLg     // Large elevation
SHADOWS.luxuryXl     // Extra large elevation
```

### Spring Configurations

```typescript
SPRING_CONFIG.default  // Standard spring animation
SPRING_CONFIG.gentle   // Soft, gentle spring
SPRING_CONFIG.wobbly   // Bouncy spring
SPRING_CONFIG.stiff    // Quick, stiff spring
SPRING_CONFIG.slow     // Slow, smooth spring
```

## Utility Functions

### Glass Morphism

```jsx
import { getGlassStyles, getDarkGlassStyles } from '@/design-system';

// Get glass styles for light surfaces
const glassLight = getGlassStyles('light');
const glassMedium = getGlassStyles('medium');
const glassStrong = getGlassStyles('strong');

// Get dark glass styles for driver/captain UI
const darkGlass = getDarkGlassStyles();
```

### Shadows

```jsx
import { getShadow, getGlowShadow } from '@/design-system';

const shadowSm = getShadow('sm');
const shadowLg = getShadow('lg');
const glowEffect = getGlowShadow();
```

### Spring Animations

```jsx
import { getSpringConfig, prefersReducedMotion } from '@/design-system';

// Get spring config (automatically respects reduced motion)
const spring = getSpringConfig('gentle', true);

// Check reduced motion preference
if (prefersReducedMotion()) {
  // Use simpler animations
}
```

### Haptic Feedback

```jsx
import { triggerHaptic } from '@/design-system';

function handleButtonClick() {
  triggerHaptic('medium'); // light, medium, or heavy
  // ... rest of click handler
}
```

### Responsive Utilities

```jsx
import { isMobile, isTablet, isDesktop } from '@/design-system';

function MyComponent() {
  const spacing = isMobile() ? SPACING.sm : SPACING.lg;
  // ...
}
```

### Color Utilities

```jsx
import { getAccentColor, getSurfaceColor } from '@/design-system';

const primaryAccent = getAccentColor('primary');
const surface2 = getSurfaceColor(2);
```

## Tailwind Classes

### Color Classes

```css
/* Background */
.bg-luxury-black
.bg-luxury-surface-1
.bg-luxury-surface-2
.bg-luxury-surface-3
.bg-luxury-white

/* Text */
.text-luxury-accent-primary
.text-luxury-accent-secondary
.text-luxury-accent-tertiary

/* Glass */
.bg-glass-light
.bg-glass-medium
.bg-glass-dark
```

### Typography Classes

```css
/* Font Family */
.font-luxury
.font-luxury-display

/* Letter Spacing */
.tracking-luxury-tight
.tracking-luxury-normal
.tracking-luxury-wide

/* Line Height */
.leading-luxury-tight
.leading-luxury-normal
.leading-luxury-relaxed
```

### Spacing Classes

```css
/* Padding */
.p-luxury-xs, .p-luxury-sm, .p-luxury-md
.p-luxury-lg, .p-luxury-xl, .p-luxury-2xl

/* Margin */
.m-luxury-xs, .m-luxury-sm, .m-luxury-md
.m-luxury-lg, .m-luxury-xl, .m-luxury-2xl
```

### Border Radius Classes

```css
.rounded-luxury-sm    /* 8px */
.rounded-luxury-md    /* 12px */
.rounded-luxury-lg    /* 16px */
.rounded-luxury-xl    /* 24px */
.rounded-luxury-2xl   /* 32px */
.rounded-luxury-pill  /* 9999px */
```

### Shadow Classes

```css
.shadow-luxury-glow
.shadow-luxury-inner
.shadow-luxury-sm
.shadow-luxury-md
.shadow-luxury-lg
.shadow-luxury-xl
```

### Backdrop Blur Classes

```css
.backdrop-blur-luxury-xs
.backdrop-blur-luxury-sm
.backdrop-blur-luxury-md
.backdrop-blur-luxury-lg
.backdrop-blur-luxury-xl
.backdrop-blur-luxury-2xl
```

### Animation Classes

```css
.animate-luxury-fade-in
.animate-luxury-slide-up
.animate-luxury-slide-down
.animate-luxury-scale-in
.animate-luxury-pulse-glow
.animate-luxury-float
```

### Custom Utility Classes

```css
/* Glassmorphism effect */
.glass-panel

/* iOS safe area padding */
.safe-area-inset

/* Hidden but functional scrollbar */
.luxury-scrollbar

/* Prevent overscroll bounce */
.no-overscroll
```

## Best Practices

### 1. Mobile-First Design

Always design for mobile first, then enhance for larger screens:

```jsx
function ResponsiveCard() {
  return (
    <div className="
      w-full p-luxury-sm rounded-luxury-md
      md:w-1/2 md:p-luxury-lg md:rounded-luxury-xl
      lg:w-1/3
    ">
      {/* Content */}
    </div>
  );
}
```

### 2. Use Glass Morphism Sparingly

Glass effects are premium but should be used thoughtfully:

```jsx
// Good: Used for overlays and modals
<div className="glass-panel">Modal Content</div>

// Avoid: Using glass for everything
```

### 3. Respect Reduced Motion

Always use `getSpringConfig()` which automatically respects user preferences:

```jsx
import { motion } from 'framer-motion';
import { getSpringConfig } from '@/design-system';

function AnimatedElement() {
  return (
    <motion.div
      transition={getSpringConfig('gentle', true)} // respectReducedMotion: true
    >
      Content
    </motion.div>
  );
}
```

### 4. Consistent Spacing

Use the spacing scale consistently:

```jsx
// Good: Using the spacing scale
<div className="p-luxury-md space-y-luxury-sm">

// Avoid: Arbitrary values
<div className="p-[23px] space-y-[13px]">
```

### 5. Semantic Color Usage

Use accent colors semantically:

```jsx
// Primary: Main actions (emerald)
<button className="bg-luxury-accent-primary">Submit</button>

// Secondary: Less important actions (blue)
<button className="bg-luxury-accent-secondary">Cancel</button>

// Tertiary: Highlights and special elements (purple)
<div className="border-luxury-accent-tertiary">Special Badge</div>
```

## Accessibility

### Reduced Motion

The design system automatically respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .slideUpSpring,
  .animate-luxury-fade-in {
    animation: none !important;
  }
}
```

### Touch Targets

Ensure minimum touch target sizes (44x44px):

```jsx
<button className="min-h-[44px] min-w-[44px] p-luxury-sm">
  Touch-Friendly Button
</button>
```

### Focus States

Custom focus rings are included:

```css
*:focus-visible {
  outline: 2px solid #10B981;
  outline-offset: 2px;
}
```

## Examples

See `examples.jsx` for comprehensive usage examples of:
- Basic token usage
- Glass morphism
- Framer Motion animations
- Tailwind classes
- Responsive design
- Haptic feedback
- Shadow effects

## Contributing

When adding new tokens or utilities:

1. Add the token to `tokens.ts`
2. Add utility functions to `theme.ts` if needed
3. Update Tailwind config if adding new classes
4. Update this README with examples
5. Add examples to `examples.jsx`

## Support

For questions or issues with the design system, please refer to:
- `examples.jsx` for usage patterns
- Tailwind config for available classes
- `tokens.ts` for available design tokens
