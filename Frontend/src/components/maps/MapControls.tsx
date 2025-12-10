import { motion } from 'framer-motion';
import { Plus, Minus, Locate, Compass } from 'lucide-react';
import { GlassCard, IconButton, Divider } from '../atoms';
import { COLORS, triggerHaptic } from '../../design-system';
import type { MapControlsProps } from './types';
import { cn } from '../../utils/cn';

export function MapControls({
  onZoomIn,
  onZoomOut,
  onRecenter,
  bearing = 0,
  isFollowing,
  position = 'right',
  className
}: MapControlsProps) {
  const handlePress = (action: () => void) => {
    triggerHaptic('light');
    action();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-floating m-4",
        position === 'left' ? 'left-0' : 'right-0',
        className
      )}
    >
      <GlassCard className="flex flex-col p-1 gap-1 rounded-xl" blur="medium">
        <IconButton icon={Plus} onClick={() => handlePress(onZoomIn)} size="sm" variant="ghost" />
        <IconButton icon={Minus} onClick={() => handlePress(onZoomOut)} size="sm" variant="ghost" />
        <Divider className="my-1" />
        <IconButton 
          icon={Locate} 
          onClick={() => handlePress(onRecenter)} 
          size="sm" 
          variant="ghost"
          className={isFollowing ? 'text-luxury-accent' : ''}
        />
        <motion.div animate={{ rotate: -bearing }} style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton icon={Compass} onClick={() => {}} size="sm" variant="ghost" />
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}