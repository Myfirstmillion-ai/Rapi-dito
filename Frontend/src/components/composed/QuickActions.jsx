import { motion } from 'framer-motion';
import { GlassCard } from '../atoms';
import { SCALE_TAP, triggerHaptic } from '../../design-system';
import { cn } from '../../utils/cn';

/**
 * QuickActions Component - Home Screen Quick Action Buttons
 * 
 * Displays a grid or horizontal scroll of action buttons.
 * 
 * @param {Array} actions - Array of action objects {label, icon, onClick, variant}
 * @param {string} layout - 'grid' or 'scroll'
 * @param {string} className - Additional classes
 */
function QuickActions({
  actions = [],
  layout = 'grid',
  className = "",
}) {
  const handleAction = (action) => {
    triggerHaptic('light');
    action.onClick?.();
  };

  if (actions.length === 0) {
    return null;
  }

  const containerClasses = layout === 'grid' 
    ? "grid grid-cols-2 gap-3"
    : "flex gap-3 overflow-x-auto pb-2 scrollbar-hide";

  return (
    <div className={cn(containerClasses, className)}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        
        const variantStyles = {
          primary: 'from-emerald-500 to-emerald-600 text-white',
          secondary: 'from-gray-100 to-gray-200 text-gray-900',
          accent: 'from-blue-500 to-blue-600 text-white',
          warning: 'from-yellow-400 to-yellow-500 text-gray-900',
        };

        const bgGradient = variantStyles[action.variant || 'primary'];

        return (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileTap={SCALE_TAP}
            className={cn(
              layout === 'scroll' && "flex-shrink-0 w-40"
            )}
          >
            <button
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              className={cn(
                "w-full h-full p-4 rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                bgGradient
              )}
            >
              <div className="flex flex-col items-center justify-center gap-3 min-h-[100px]">
                {Icon && (
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-sm leading-tight">
                    {action.label}
                  </p>
                  {action.description && (
                    <p className="text-xs opacity-90 mt-1">
                      {action.description}
                    </p>
                  )}
                </div>
                {action.badge && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

export default QuickActions;
