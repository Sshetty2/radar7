'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { PlusIcon } from '@/components/icons';

export function NewEventButton () {
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);

  return (
    <>
      {/* New Event Button */}
      <div className="absolute bottom-32 right-4 z-10 md:bottom-8">
        <Button
          variant="outline"
          size="icon"
          className="glass h-11 w-11 cursor-pointer shrink-0 rounded-xl glass-text hover:bg-secondary/50 hover:scale-105 dark:hover:bg-white/15 transition-all duration-200"
          onClick={() => setNewEventModalOpen(true)}
        >
          <PlusIcon size={18} />
        </Button>
      </div>

      {/* New Event Modal */}
      <Dialog
        open={newEventModalOpen}
        onOpenChange={setNewEventModalOpen}>
        <DialogContent
          className="glass glass-text data-[state=open]:slide-in-from-bottom-right data-[state=closed]:slide-out-to-bottom-right data-[state=open]:animate-in data-[state=closed]:animate-out"
        >
          <DialogHeader>
            <DialogTitle className="glass-text">Create New Event</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Event creation is coming soon! This will be a premium feature that allows you to create and promote your own events on Radar7.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm glass-text-muted">
              Stay tuned for updates. This feature will include:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Custom event creation</li>
              <li>Location selection</li>
              <li>Image uploads</li>
              <li>RSVP management</li>
              <li>Event promotion tools</li>
            </ul>
          </div>
          <Button
            onClick={() => setNewEventModalOpen(false)}
            className="w-full">
            Got it!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
