/**
 * Luxury Design System Usage Examples
 * 
 * This file demonstrates how to use the luxury design system
 * in your React components. Copy these patterns into your own components.
 */

// ===== IMPORT EXAMPLES =====

// Import specific tokens (adjust path as needed for your setup)
// With path alias: import { COLORS, SPACING, TYPOGRAPHY } from '@/design-system';
// Or use relative path:
import { COLORS, SPACING, TYPOGRAPHY } from './index';

// Import utility functions
import { getGlassStyles, getSpringConfig, triggerHaptic } from './index';

// Import everything
import * as DesignSystem from './index';

// ===== USAGE IN REACT COMPONENTS =====

// Example 1: Using color tokens
function ExampleButton() {
  return (
    <button
      style={{
        backgroundColor: COLORS.luxury.accentPrimary,
        color: COLORS.luxury.white,
        padding: `${SPACING.sm} ${SPACING.lg}`,
      }}
    >
      Click Me
    </button>
  );
}

// Example 2: Using glass morphism
function ExampleCard() {
  const glassStyles = getGlassStyles('medium');
  
  return (
    <div style={glassStyles} className="p-6 rounded-luxury-lg">
      <h2>Glass Card</h2>
      <p>This card uses glassmorphism effect</p>
    </div>
  );
}

// Example 3: Using with Framer Motion
// Note: Ensure framer-motion is imported
// import { motion } from 'framer-motion';

function ExampleAnimatedPanel() {
  const springConfig = getSpringConfig('gentle');
  
  // Uncomment when using in a real component:
  /*
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
      className="bg-luxury-surface-2 p-luxury-md rounded-luxury-xl"
    >
      <h3>Animated Panel</h3>
      <p>This uses spring animations from the design system</p>
    </motion.div>
  );
  */
  
  return (
    <div className="bg-luxury-surface-2 p-luxury-md rounded-luxury-xl">
      <h3>Animated Panel</h3>
      <p>This uses spring animations from the design system</p>
    </div>
  );
}

// Example 4: Using with Tailwind classes
function ExampleTailwindComponent() {
  return (
    <div className="bg-luxury-black text-luxury-white p-luxury-lg">
      <div className="glass-panel p-luxury-md rounded-luxury-lg shadow-luxury-md">
        <h1 className="font-luxury-display text-4xl tracking-luxury-tight leading-luxury-tight">
          Premium Typography
        </h1>
        <p className="font-luxury text-base tracking-luxury-normal leading-luxury-relaxed mt-4">
          This demonstrates the luxury typography system with proper spacing
          and line heights for optimal readability.
        </p>
      </div>
    </div>
  );
}

// Example 5: Haptic feedback on interactions
function ExampleInteractiveButton() {
  const handleClick = () => {
    triggerHaptic('medium');
    console.log('Button clicked with haptic feedback');
  };
  
  return (
    <button
      onClick={handleClick}
      className="bg-luxury-accent-primary text-luxury-white px-luxury-lg py-luxury-sm rounded-luxury-pill"
    >
      Touch Me
    </button>
  );
}

// Example 6: Responsive design with utility functions
// Note: Ensure utility functions are imported
// import { isMobile, isTablet, isDesktop } from './index';

function ExampleResponsiveComponent() {
  const getLayoutClass = () => {
    if (typeof window === 'undefined') return 'flex-col';
    if (window.innerWidth < 768) return 'flex-col space-y-4';
    if (window.innerWidth >= 768 && window.innerWidth < 1024) return 'grid grid-cols-2 gap-6';
    if (window.innerWidth >= 1024) return 'grid grid-cols-3 gap-8';
    return 'flex-col';
  };
  
  return (
    <div className={getLayoutClass()}>
      {/* Content */}
    </div>
  );
}

// Example 7: Using shadows
// Note: Ensure utility functions are imported
// import { getShadow } from './index';

function ExampleShadowCard() {
  const shadowLg = '0 8px 32px rgba(0, 0, 0, 0.24)'; // Or use getShadow('lg')
  
  return (
    <div
      style={{
        boxShadow: shadowLg,
        backgroundColor: COLORS.luxury.surface1,
        padding: SPACING.lg,
        borderRadius: '16px',
      }}
    >
      <h3>Elevated Card</h3>
      <p>This card has a luxury shadow effect</p>
    </div>
  );
}

// ===== CSS/TAILWIND CLASS EXAMPLES =====

/*
Available Tailwind Classes:

Colors:
- bg-luxury-black, text-luxury-white
- bg-luxury-surface-1, bg-luxury-surface-2, bg-luxury-surface-3
- text-luxury-accent-primary, text-luxury-accent-secondary, text-luxury-accent-tertiary
- bg-glass-light, bg-glass-medium, bg-glass-dark

Typography:
- font-luxury, font-luxury-display
- tracking-luxury-tight, tracking-luxury-normal, tracking-luxury-wide
- leading-luxury-tight, leading-luxury-normal, leading-luxury-relaxed

Spacing:
- p-luxury-xs, p-luxury-sm, p-luxury-md, p-luxury-lg, p-luxury-xl, p-luxury-2xl
- m-luxury-xs, m-luxury-sm, m-luxury-md, m-luxury-lg, m-luxury-xl, m-luxury-2xl

Border Radius:
- rounded-luxury-sm, rounded-luxury-md, rounded-luxury-lg
- rounded-luxury-xl, rounded-luxury-2xl, rounded-luxury-pill

Shadows:
- shadow-luxury-glow, shadow-luxury-inner
- shadow-luxury-sm, shadow-luxury-md, shadow-luxury-lg, shadow-luxury-xl

Backdrop Blur:
- backdrop-blur-luxury-xs, backdrop-blur-luxury-sm, backdrop-blur-luxury-md
- backdrop-blur-luxury-lg, backdrop-blur-luxury-xl, backdrop-blur-luxury-2xl

Animations:
- animate-luxury-fade-in
- animate-luxury-slide-up, animate-luxury-slide-down
- animate-luxury-scale-in
- animate-luxury-pulse-glow
- animate-luxury-float

Custom Utilities:
- glass-panel (glassmorphism effect)
- safe-area-inset (iOS safe area padding)
- luxury-scrollbar (hidden scrollbar)
- no-overscroll (prevent overscroll bounce)
*/

export {
  ExampleButton,
  ExampleCard,
  ExampleAnimatedPanel,
  ExampleTailwindComponent,
  ExampleInteractiveButton,
  ExampleResponsiveComponent,
  ExampleShadowCard,
};
