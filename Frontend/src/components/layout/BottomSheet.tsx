import { useEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { cn } from '../../utils/cn';
import { GlassCard } from '../atoms';
import type { BottomSheetProps } from './types';

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.5, 0.9],
  className,
}: BottomSheetProps) {
  const controls = useAnimation();
  const height = typeof window !== 'undefined' ? window.innerHeight : 800;

  useEffect(() => {
    if (isOpen) {
      controls.start({ y: height * (1 - snapPoints[0]) });
    } else {
      controls.start({ y: height });
    }
  }, [isOpen, controls, height, snapPoints]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const velocity = info.velocity.y;
    const currentY = info.point.y; // Simplified
    
    if (velocity > 500) {
      onClose();
    } else {
      // Snap to nearest
      controls.start({ y: height * (1 - snapPoints[0]) });
    }
  };

  return (
    <motion.div
      initial={{ y: height }}
      animate={controls}
      drag="y"
      dragConstraints={{ top: 0, bottom: height }}
      onDragEnd={handleDragEnd}
      className={cn(
        "fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl overflow-hidden",
        className
      )}
      style={{ height: height * 0.95 }}
    >
      <GlassCard className="h-full w-full rounded-t-3xl p-4" blur="heavy">
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
        {children}
      </GlassCard>
    </motion.div>
  );
}