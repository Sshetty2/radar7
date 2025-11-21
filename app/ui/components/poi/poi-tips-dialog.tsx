'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/app/ui/components/base/button';
import { Card } from '@/app/ui/components/base/card';
import type { POI } from '@/lib/types/poi';

interface POITipsDialogProps {
  poi: POI;
  isOpen: boolean;
  onClose: () => void;
  triggerButtonRef?: React.RefObject<HTMLElement | null>;
}

export function POITipsDialog ({ poi, isOpen, onClose, triggerButtonRef }: POITipsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Format relative time (e.g., "2 months ago")
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    }

    if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }

    if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    if (diffInSeconds < 2592000) {
      return `${Math.floor(diffInSeconds / 604800)}w ago`;
    }

    if (diffInSeconds < 31536000) {
      return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    }

    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render if no tips available
  if (!poi.tips || poi.tips.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - z-58 to stay below POI modal (z-60) */}
          <motion.div
            className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[58]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            className="glass fixed z-[59] w-[clamp(220px,22vw,320px)] rounded-[12px] shadow-2xl -translate-y-1/2"
            style={{
              // Position to the left of the POI modal (centered modal is at 50% with -translate-x-1/2)
              // Modal max width is 520px on xl, so left edge is roughly at calc(50% - 260px)
              // Position tips dialog further left with some spacing
              right    : 'calc(50% + 280px)',
              top      : '45%',
              maxHeight: '60vh'
            }}
            initial={{
              x      : -50,
              opacity: 0
            }}
            animate={{
              x      : 0,
              opacity: 1
            }}
            exit={{
              x      : -50,
              opacity: 0
            }}
            transition={{
              type     : 'spring',
              stiffness: 300,
              damping  : 30
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold glass-text">Community Tips</h3>
                <p className="text-[10px] glass-text-muted mt-0.5">{poi.tips?.length || 0} tips</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-secondary/50"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Tips List - Scrollable */}
            <div className="overflow-y-auto px-3 py-3 space-y-2 max-h-[calc(60vh-5rem)]">
              {poi.tips?.map((tip, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 bg-secondary/20 p-2.5 shadow-sm"
                >
                  <p className="text-xs glass-text leading-relaxed whitespace-pre-wrap">
                    {tip.text}
                  </p>
                  <p className="text-[9px] glass-text-muted mt-1.5 text-right">
                    {formatRelativeTime(tip.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
