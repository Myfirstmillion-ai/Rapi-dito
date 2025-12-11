/**
 * Atoms - Foundational UI Components
 * 
 * This file exports all atomic/foundational UI components
 * that are used throughout the luxury screens.
 * 
 * These components are either imported from existing UI components
 * or created as simple wrappers for consistency.
 */

// Import existing components
import Button from '../Button';
import Heading from '../Heading';
import Input from '../Input';
import Spinner from '../Spinner';

// Import from UI directory
import BottomSheet from '../ui/BottomSheet';
import Modal from '../ui/Modal';
import StarRating from '../ui/StarRating';

// Simple wrapper components for atoms

/**
 * Text Component - Simple text wrapper with variants
 */
export const Text = ({ 
  children, 
  variant = 'body', 
  size = 'base',
  className = '',
  ...props 
}) => {
  const variantClasses = {
    heading: 'font-bold',
    body: 'font-normal',
    caption: 'font-normal text-gray-600',
    label: 'font-medium',
  };
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };
  
  return (
    <p 
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

/**
 * Avatar Component - User/Driver avatar
 */
export const Avatar = ({ 
  src, 
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  };
  
  return (
    <div 
      className={`rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-semibold ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{fallback || alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

/**
 * GlassCard Component - Glassmorphism card
 */
export const GlassCard = ({ 
  children, 
  variant = 'light',
  className = '',
  onClick,
  ...props 
}) => {
  const variantClasses = {
    light: 'bg-white/80 backdrop-blur-xl border border-white/30 shadow-lg',
    dark: 'bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl',
    subtle: 'bg-white/60 backdrop-blur-md border border-white/20 shadow-md',
  };
  
  return (
    <div 
      className={`rounded-2xl p-4 ${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * IconButton Component - Button with only icon
 */
export const IconButton = ({ 
  icon: Icon,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-white/80 hover:bg-white text-gray-900',
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full backdrop-blur-lg border border-white/30 
        transition-all duration-200 
        active:scale-95 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        shadow-md hover:shadow-lg
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-full h-full" />}
    </button>
  );
};

/**
 * Badge Component - Status badge
 */
export const Badge = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Divider Component - Horizontal divider
 */
export const Divider = ({ className = '', ...props }) => {
  return <div className={`border-t border-gray-200 ${className}`} {...props} />;
};

/**
 * Container Component - Safe area container
 */
export const SafeAreaView = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`pt-safe pb-safe px-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Export all components
export {
  Button,
  Heading,
  Input,
  Spinner,
  BottomSheet,
  Modal,
  StarRating,
};

// Default export of all atoms
export default {
  Button,
  Text,
  Avatar,
  GlassCard,
  IconButton,
  Badge,
  Divider,
  SafeAreaView,
  Heading,
  Input,
  Spinner,
  BottomSheet,
  Modal,
  StarRating,
};
