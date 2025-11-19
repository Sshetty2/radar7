'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setFilterModalOpen, selectFilterModalOpen } from '@/lib/store/slices/uiSlice';
import {
  selectFilters,
  selectActiveFilterCount,
  setCategories,
  toggleCategory,
  setEventTypes,
  toggleEventType,
  setPrice,
  setSources,
  toggleSource,
  setDistance,
  setUseMapBounds,
  setHasAvailableSpots,
  setShowWaitlist,
  clearAllFilters,
  setDateRange
} from '@/lib/store/slices/filtersSlice';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';

const CATEGORIES = [
  'Social Activities',
  'Technology',
  'Food & Drink',
  'Sports & Fitness',
  'Arts & Culture',
  'Professional Development',
  'Professional Networking',
  'Music & Arts',
  'Health & Wellness'
];

const EVENT_TYPES: ('PHYSICAL' | 'VIRTUAL' | 'HYBRID')[] = ['PHYSICAL', 'VIRTUAL', 'HYBRID'];

const SOURCES: ('meetup' | 'eventbrite' | 'linkedin' | 'luma')[] = [
  'meetup',
  'eventbrite',
  'linkedin',
  'luma'
];

export function FilterModal () {
  const dispatch = useAppDispatch();
  const filterModalOpen = useAppSelector(selectFilterModalOpen);
  const filters = useAppSelector(selectFilters);
  const activeFilterCount = useAppSelector(selectActiveFilterCount);

  const handleClose = () => {
    dispatch(setFilterModalOpen(false));
  };

  const handleClearAll = () => {
    dispatch(clearAllFilters());
  };

  const handleQuickDate = (days: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);
    dispatch(setDateRange({
      start,
      end
    }));
  };

  return (
    <Dialog
      open={filterModalOpen}
      onOpenChange={handleClose}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl border-[rgba(35,34,34,0.59)] text-white"
        style={GLASS_EFFECT_STYLE}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            Filter Events
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="border-white/20 bg-white/10 text-white">
                {activeFilterCount} active
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Customize your event discovery experience
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Date Range Quick Picks */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Date Range</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDate(1)}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDate(3)}
                >
                  This Weekend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDate(7)}
                >
                  This Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDate(30)}
                >
                  This Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(setDateRange({
                    start: null,
                    end  : null
                  }))}
                >
                  Any Time
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Categories</Label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(category => (
                  <div
                    key={category}
                    className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => dispatch(toggleCategory(category))}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Type */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Event Type</Label>
              <div className="flex gap-3">
                {EVENT_TYPES.map(type => (
                  <div
                    key={type}
                    className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.eventTypes.includes(type)}
                      onCheckedChange={() => dispatch(toggleEventType(type))}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.toLowerCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Price</Label>
              <RadioGroup
                value={filters.price}
                onValueChange={(value: 'all' | 'free' | 'paid') => dispatch(setPrice(value))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="all"
                    id="price-all" />
                  <Label htmlFor="price-all">All Events</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="free"
                    id="price-free" />
                  <Label htmlFor="price-free">Free Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="paid"
                    id="price-paid" />
                  <Label htmlFor="price-paid">Paid Only</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Source */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Event Source</Label>
              <div className="grid grid-cols-2 gap-3">
                {SOURCES.map(source => (
                  <div
                    key={source}
                    className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={filters.sources.includes(source)}
                      onCheckedChange={() => dispatch(toggleSource(source))}
                    />
                    <label
                      htmlFor={`source-${source}`}
                      className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {source}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Distance</Label>
                <span className="text-sm text-muted-foreground">
                  {filters.distance} miles
                </span>
              </div>
              <Slider
                value={[filters.distance]}
                onValueChange={value => dispatch(setDistance(value[0]))}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-map-bounds"
                  checked={filters.useMapBounds}
                  onCheckedChange={checked => dispatch(setUseMapBounds(checked as boolean))
                  }
                />
                <label
                  htmlFor="use-map-bounds"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use current map view instead
                </label>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Availability</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available-spots"
                    checked={filters.hasAvailableSpots}
                    onCheckedChange={checked => dispatch(setHasAvailableSpots(checked as boolean))
                    }
                  />
                  <label
                    htmlFor="available-spots"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Only show events with available spots
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-waitlist"
                    checked={filters.showWaitlist}
                    onCheckedChange={checked => dispatch(setShowWaitlist(checked as boolean))
                    }
                  />
                  <label
                    htmlFor="show-waitlist"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include waitlist events
                  </label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClearAll}>
            Clear All Filters
          </Button>
          <Button onClick={handleClose}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
