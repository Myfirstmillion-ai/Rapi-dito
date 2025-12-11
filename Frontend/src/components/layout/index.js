/**
 * Layout Components
 * 
 * Exports all layout-related components used for screen structure
 */

import BottomNav from './BottomNav';
import { SafeAreaView } from '../atoms';

/**
 * AppShell - Main app container with safe areas
 */
export const AppShell = ({ children, showBottomNav = false, className = '' }) => {
  return (
    <div className={`min-h-screen-dvh bg-white ${className}`}>
      <div className="flex flex-col h-screen-dvh">
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

/**
 * FloatingActionBar - Floating bottom action bar
 */
export const FloatingActionBar = ({ 
  children, 
  className = '',
  position = 'bottom',
  ...props 
}) => {
  const positionClasses = {
    bottom: 'bottom-4',
    top: 'top-4',
  };
  
  return (
    <div 
      className={`fixed left-4 right-4 ${positionClasses[position]} z-50 ${className}`}
      {...props}
    >
      <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-4">
        {children}
      </div>
    </div>
  );
};

// Export existing components
export {
  BottomNav,
  SafeAreaView,
};

export default {
  AppShell,
  FloatingActionBar,
  BottomNav,
  SafeAreaView,
};
