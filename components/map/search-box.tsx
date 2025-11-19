'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleSearchMode, selectSearchMode } from '@/lib/store/slices/uiSlice';
import { setMapView } from '@/lib/store/slices/mapSlice';
import { Search, X, Loader2, MapPin, Sparkles } from 'lucide-react';
import { PlusIcon } from '@/components/icons';
import { toast } from 'sonner';
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';

export function SearchBox () {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const searchMode = useAppSelector(selectSearchMode);

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }

    if (searchMode === 'natural') {
      toast.info('AI-powered natural language search coming soon!');

      return;
    }

    // Address search mode
    setIsLoading(true);

    try {
      const response = await fetch('/api/geocoding', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Failed to geocode address');
      }

      const data = await response.json();
      dispatch(
        setMapView({
          center: data.coordinates,
          zoom  : 14
        })
      );

      toast.success(`Showing events near ${data.formattedAddress}`);
    } catch (error) {
      toast.error('Address not found. Please try a different search.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const detectMode = (input: string) => {
    // Simple heuristic: if it looks like an address (numbers, street keywords), suggest address mode
    const addressKeywords = /\b(st|street|ave|avenue|blvd|boulevard|rd|road|dr|drive|plaza|square)\b/i;
    const hasNumbers = /\d{1,5}/.test(input);

    if (hasNumbers && addressKeywords.test(input) || /^\d{5}(-\d{4})?$/.test(input)) {
      return 'address';
    }

    return 'natural';
  };

  const handleInputChange = (value: string) => {
    setQuery(value);

    // Auto-detect suggested mode based on input
    if (value.length > 3) {
      const suggestedMode = detectMode(value);

      // Don't auto-switch, just provide visual feedback
    }
  };

  return (
    <>
      <div className="absolute bottom-32 left-0 right-0 z-10 flex items-center justify-center px-4 md:bottom-8">
        {/* Spacer to push search box to center */}
        <div className="flex-1" />

        {/* Search box */}
        <div
          className="w-full max-w-md p-3"
          style={GLASS_EFFECT_STYLE}>
          <div className="flex items-center gap-2">
            {/* Search mode toggle */}
            <Button
              variant={searchMode === 'address' ? 'default' : 'outline'}
              size="icon"
              onClick={() => dispatch(toggleSearchMode())}
              className="h-10 w-10 shrink-0"
              title={searchMode === 'address' ? 'Switch to Natural Language' : 'Switch to Address Search'}
            >
              {searchMode === 'address' ? (
                <MapPin className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>

            {/* Search input */}
            <div className="relative flex-1">
              <Input
                placeholder={
                  searchMode === 'address' ? 'Enter address or zip code...' : 'Describe what you\'re looking for...'
                }
                value={query}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-8"
                disabled={isLoading}
              />
              {query && !isLoading && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isLoading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Search button */}
            <Button
              onClick={handleSearch}
              size="icon"
              disabled={isLoading || !query.trim()}
              className="h-10 w-10 shrink-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Mode indicator */}
          <div className="mt-2 text-center text-xs text-gray-400">
            {searchMode === 'address' ? (
              <span>🗺️ Address Search Mode</span>
            ) : (
              <span>✨ Natural Language Mode (Coming Soon)</span>
            )}
          </div>
        </div>

        {/* Spacer + New Event button aligned to the right */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-2xl border-[rgba(35,34,34,0.59)] text-white hover:bg-white/10"
            style={GLASS_EFFECT_STYLE}
            onClick={() => setNewEventModalOpen(true)}
          >
            <PlusIcon size={20} />
          </Button>
        </div>
      </div>

      {/* New Event Modal */}
      <Dialog
        open={newEventModalOpen}
        onOpenChange={setNewEventModalOpen}>
        <DialogContent
          className="border-[rgba(35,34,34,0.59)] text-white data-[state=open]:slide-in-from-bottom-right data-[state=closed]:slide-out-to-bottom-right data-[state=open]:animate-in data-[state=closed]:animate-out"
          style={GLASS_EFFECT_STYLE}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Create New Event</DialogTitle>
            <DialogDescription className="text-gray-400">
              Event creation is coming soon! This will be a premium feature that allows you to create and promote your own events on Radar7.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-300">
              Stay tuned for updates. This feature will include:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-400">
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
