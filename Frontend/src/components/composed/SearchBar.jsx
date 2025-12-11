import { motion } from 'framer-motion';
import { Search, X, Home, Briefcase } from 'lucide-react';
import { GlassCard } from '../atoms';
import { SCALE_TAP, triggerHaptic } from '../../design-system';
import { cn } from '../../utils/cn';

/**
 * SearchBar Component - Floating Island Search Bar
 * 
 * A luxury floating search bar with glassmorphism effect.
 * Features quick action pills (Home, Work) and smooth animations.
 * 
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Current search value
 * @param {function} onFocus - Focus handler
 * @param {function} onClick - Click handler
 * @param {function} onClear - Clear button handler
 * @param {boolean} showQuickActions - Show quick action pills
 * @param {Array} quickActions - Array of quick action objects {label, icon, onClick}
 * @param {string} className - Additional classes
 * @param {boolean} disabled - Disabled state
 */
function SearchBar({
  placeholder = "Where to?",
  value = "",
  onFocus,
  onClick,
  onClear,
  showQuickActions = true,
  quickActions = [],
  className = "",
  disabled = false,
}) {
  const defaultQuickActions = [
    { 
      label: 'Home', 
      icon: Home, 
      onClick: () => {
        triggerHaptic('light');
        console.log('Quick action: Home');
      }
    },
    { 
      label: 'Work', 
      icon: Briefcase, 
      onClick: () => {
        triggerHaptic('light');
        console.log('Quick action: Work');
      }
    },
  ];
  
  const actions = quickActions.length > 0 ? quickActions : defaultQuickActions;

  const handleClick = () => {
    if (disabled) return;
    triggerHaptic('light');
    if (onClick) onClick();
    if (onFocus) onFocus();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    triggerHaptic('medium');
    if (onClear) onClear();
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Main Search Bar */}
      <motion.div
        whileTap={!disabled ? SCALE_TAP : {}}
        onClick={handleClick}
        className={cn(
          "relative",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <GlassCard 
          variant="light" 
          className={cn(
            "flex items-center gap-3 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer",
            !disabled && "active:scale-[0.98]"
          )}
        >
          {/* Search Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          
          {/* Text */}
          <div className="flex-1 min-w-0">
            {value ? (
              <p className="font-medium text-gray-900 truncate">{value}</p>
            ) : (
              <p className="text-gray-500">{placeholder}</p>
            )}
          </div>
          
          {/* Clear Button */}
          {value && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>
          )}
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      {showQuickActions && !value && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          {actions.map((action, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.();
              }}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-lg border border-white/30 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              {action.icon && <action.icon className="w-4 h-4 text-emerald-600" />}
              <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {action.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default SearchBar;
