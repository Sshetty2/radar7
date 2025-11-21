'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the DetailPopoverBase component
 */
export interface DetailPopoverBaseProps {

  /** Whether the popover is currently open */
  isOpen: boolean;

  /** Callback when the popover should be closed */
  onClose: () => void;

  /** Whether the sidebar is open (affects positioning in full view) */
  sidebarOpen: boolean;

  /** Content to render in full view */
  renderFullView: (isMinimized: boolean) => ReactNode;

  /** Content to render in minimized view */
  renderMinimizedView: (isMinimized: boolean) => ReactNode;

  /** Optional custom className for the modal container */
  className?: string;

  /** Optional initial minimized state (default: false) */
  initialMinimized?: boolean;
}

/**
 * Base component for detail popovers (events, POIs, etc.)
 *
 * Provides:
 * - Minimize/maximize functionality
 * - Overlay rendering (only in full view)
 * - Z-index layering
 * - Framer Motion animations
 * - Dynamic positioning based on sidebar state
 * - Responsive sizing
 *
 * Usage:
 * ```tsx
 * <DetailPopoverBase
 *   isOpen={!!selectedId}
 *   onClose={handleClose}
 *   sidebarOpen={sidebarOpen}
 *   renderFullView={() => <FullViewContent />}
 *   renderMinimizedView={() => <MinimizedViewContent />}
 * />
 * ```
 */
export function DetailPopoverBase ({
  isOpen,
  onClose,
  sidebarOpen,
  renderFullView,
  renderMinimizedView,
  className,
  initialMinimized = false
}: DetailPopoverBaseProps) {
  const [isMinimized, setIsMinimized] = useState(initialMinimized);

  const handleClose = () => {
    onClose();
    setIsMinimized(false); // Reset to full view when closing
  };

  const toggleMinimize = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsMinimized(!isMinimized);

    // Remove focus from the button to prevent focus ring
    e.currentTarget.blur();
  };

  // Handle clicking outside modal (but not on sidebar)
  // Only closes modal when in FULL view
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!isMinimized && e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Calculate position values for smooth transitions
  const getModalPosition = () => {
    if (isMinimized) {
      // Minimized position: top-left
      return {
        left: '8vw',
        top : '12vh'
      };
    }

    // Full position: center (with sidebar adjustment)
    return {
      left: sidebarOpen ? 'calc(50% - 10%)' : '50%',
      top : '45%'
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Custom Modal Overlay - only visible in full view */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.25,
                  ease    : 'easeInOut'
                }}
                className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[2px]"
                onClick={handleOverlayClick}
              />
            )}
          </AnimatePresence>

          {/* Modal Content - switches between full and minimized views */}
          <motion.div
            key="detail-modal"
            initial={{
              opacity: 0,
              scale  : 0.96
            }}
            animate={{
              opacity: 1,
              scale  : 1
            }}
            exit={{
              opacity: 0,
              scale  : 0.96
            }}
            transition={{
              duration: 0.2,
              ease    : 'easeOut'
            }}
            style={{
              left: getModalPosition().left,
              top : getModalPosition().top
            }}
            className={cn(
              'glass fixed z-[60] overflow-hidden bg-transparent p-0 glass-text pointer-events-auto transition-all duration-300 ease-out',

              // View-specific positioning and sizing
              isMinimized ? [
                // Minimized: Below logo area, responsive sizing for different viewports
                'w-[clamp(380px,36vw,640px)] h-[clamp(200px,28vh,320px)]',
                'sm:rounded-[12px] shadow-2xl'
              ] : [
                // Full: Center screen, extreme responsive sizing to ensure sidebar toggle is always visible
                'w-[calc(100%-2rem)] max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[520px] 2xl:max-w-2xl px-4 sm:px-0',
                sidebarOpen ? '-translate-x-1/2' : '-translate-x-1/2',
                '-translate-y-1/2',
                'sm:rounded-[12px]'
              ],
              className
            )}
            onClick={e => e.stopPropagation()}
          >
            {/* Control buttons - always top-right, but minimize on left in minimized view */}
            {isMinimized ? (
              <>
                {/* Minimize toggle - top left */}
                <button
                  onClick={toggleMinimize}
                  className="glass absolute left-3 top-3 z-10 rounded-xl p-2 glass-text hover:bg-secondary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  title="Maximize"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="sr-only">Maximize</span>
                </button>
                {/* Close button - top right */}
                <button
                  onClick={handleClose}
                  className="glass absolute right-3 top-3 z-10 rounded-xl p-2 glass-text hover:bg-secondary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </>
            ) : (
              <>
                {/* Minimize button - left side */}
                <button
                  onClick={toggleMinimize}
                  className="glass absolute left-3 top-3 z-10 rounded-xl p-2 glass-text hover:bg-secondary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span className="sr-only">Minimize</span>
                </button>
                {/* Close button - right side */}
                <button
                  onClick={handleClose}
                  className="glass absolute right-3 top-3 z-10 rounded-xl p-2 glass-text hover:bg-secondary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </>
            )}

            {/* Content - switches between full and minimized views */}
            <AnimatePresence
              mode="wait"
              initial={false}>
              {isMinimized ? (
                <motion.div
                  key="minimized"
                  initial={{
                    opacity: 0,
                    scale  : 0.98
                  }}
                  animate={{
                    opacity: 1,
                    scale  : 1
                  }}
                  exit={{
                    opacity: 0,
                    scale  : 0.98
                  }}
                  transition={{
                    duration: 0.25,
                    ease    : 'easeInOut'
                  }}
                  className="h-full w-full"
                >
                  {renderMinimizedView(isMinimized)}
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  initial={{
                    opacity: 0,
                    scale  : 0.98
                  }}
                  animate={{
                    opacity: 1,
                    scale  : 1
                  }}
                  exit={{
                    opacity: 0,
                    scale  : 0.98
                  }}
                  transition={{
                    duration: 0.25,
                    ease    : 'easeInOut'
                  }}
                >
                  {renderFullView(isMinimized)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
