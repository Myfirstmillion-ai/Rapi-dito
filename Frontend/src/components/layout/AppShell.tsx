import { cn } from '../../utils/cn';
import type { AppShellProps } from './types';

export function AppShell({
  children,
  header,
  footer,
  floatingElements,
  className,
  safeAreas = true,
  backgroundColor = 'bg-luxury-black',
}: AppShellProps) {
  return (
    <div 
      className={cn(
        'relative flex flex-col h-[100dvh] overflow-hidden',
        backgroundColor,
        className
      )}
      style={{ overscrollBehavior: 'none' }}
    >
      {header && (
        <header className="relative z-10 flex-shrink-0">
           {safeAreas && <div className="pt-[env(safe-area-inset-top)]" />}
           {header}
        </header>
      )}

      <main className="relative z-0 flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {footer && (
        <footer className="relative z-10 flex-shrink-0">
          {footer}
          {safeAreas && <div className="pb-[env(safe-area-inset-bottom)]" />}
        </footer>
      )}

      {floatingElements && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="pointer-events-auto h-full w-full">
            {floatingElements}
          </div>
        </div>
      )}
    </div>
  );
}