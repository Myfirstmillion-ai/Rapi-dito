import { cn } from '../../utils/cn';
import type { SafeAreaViewProps } from './types';

export function SafeAreaView({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  className,
  as: Component = 'div',
}: SafeAreaViewProps) {
  const paddingClasses = {
    top: 'pt-[env(safe-area-inset-top)]',
    bottom: 'pb-[env(safe-area-inset-bottom)]', 
    left: 'pl-[env(safe-area-inset-left)]',
    right: 'pr-[env(safe-area-inset-right)]',
  };

  const safeClasses = edges.map(edge => paddingClasses[edge]).join(' ');

  return (
    <Component className={cn(safeClasses, className)}>
      {children}
    </Component>
  );
}