'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/app/ui/components/badge';
import { Card, CardContent } from '@/app/ui/components/base/card';
import { Button } from '@/app/ui/components/base/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/ui/components/base/popover';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  setSelectedPoi,
  selectSelectedPoiId,
  selectSidebarOpen
} from '@/lib/store/slices/uiSlice';
import { selectPOIById, selectPOILoading, selectPOIError } from '@/lib/store/slices/poiSlice';
import { DetailPopoverBase } from '@/app/ui/components/detail-dialog-base';
import { getDirectionsUrl, getSourceName } from '@/lib/utils/popover-helpers';
import { buildFoursquarePhotoUrl } from '@/lib/api/foursquare-places';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Loader2,
  AlertCircle,
  Info,
  Star,
  DollarSign,
  Clock,
  Phone,
  Globe,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function POIDetailPopover () {
  const dispatch = useAppDispatch();
  const selectedPoiId = useAppSelector(selectSelectedPoiId);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const loading = useAppSelector(selectPOILoading);
  const error = useAppSelector(selectPOIError);

  const selectedPoi = useAppSelector(selectPOIById(selectedPoiId));

  // Photo carousel state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Tips popover state
  const [tipsPopoverOpen, setTipsPopoverOpen] = useState(false);

  const handleClose = () => {
    dispatch(setSelectedPoi(null));
    setCurrentPhotoIndex(0); // Reset carousel on close
    setTipsPopoverOpen(false); // Close tips popover
  };

  const handlePrevPhoto = () => {
    if (!selectedPoi?.photos) {
      return;
    }
    setSlideDirection('left');
    setCurrentPhotoIndex(prev => (prev === 0 ? selectedPoi.photos!.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    if (!selectedPoi?.photos) {
      return;
    }
    setSlideDirection('right');
    setCurrentPhotoIndex(prev => (prev === selectedPoi.photos!.length - 1 ? 0 : prev + 1));
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin glass-icon" />
        <p className="mt-3 text-sm glass-text-muted">Loading POI information...</p>
      </div>
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="mx-auto h-8 w-8 glass-icon text-red-400" />
        <p className="mt-3 text-sm glass-text-muted">{error || 'Failed to load POI data'}</p>
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={handleClose}
        >
          Close
        </Button>
      </div>
    </div>
  );

  // Render full view content
  const renderFullView = () => {
    if (loading) {
      return renderLoading();
    }

    if (error && !selectedPoi) {
      return renderError();
    }

    if (!selectedPoi) {
      return null;
    }

    return (
      <>
        {/* Hero Image Carousel + Title */}
        {selectedPoi.photos && selectedPoi.photos.length > 0 ? (
          <div className="relative aspect-[2.5/1] w-full overflow-hidden rounded-t-[12px]">
            {/* Current Photo with Slide Animation */}
            <AnimatePresence
              initial={false}
              mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={buildFoursquarePhotoUrl(
                  selectedPoi.photos[currentPhotoIndex].prefix,
                  selectedPoi.photos[currentPhotoIndex].suffix,
                  '800x400'
                )}
                alt={selectedPoi.name}
                className="h-full w-full object-cover"
                initial={{
                  x      : slideDirection === 'right' ? '100%' : '-100%',
                  opacity: 0
                }}
                animate={{
                  x      : 0,
                  opacity: 1
                }}
                exit={{
                  x      : slideDirection === 'right' ? '-100%' : '100%',
                  opacity: 0
                }}
                transition={{
                  type     : 'spring',
                  stiffness: 300,
                  damping  : 30
                }}
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Title and Category */}
            <div className="absolute inset-x-6 bottom-3 flex items-end justify-between gap-4">
              <div className="max-w-[70%]">
                {selectedPoi.website ? (
                  <a
                    href={selectedPoi.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold leading-tight glass-text hover:text-blue-300 transition-colors"
                  >
                    {selectedPoi.name}
                  </a>
                ) : (
                  <h2 className="text-xl font-semibold leading-tight glass-text">
                    {selectedPoi.name}
                  </h2>
                )}
              </div>
              {selectedPoi.category && (
                <div className="shrink-0 rounded-full border border-border/60 bg-secondary/35 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider glass-text shadow-lg">
                  {selectedPoi.category}
                </div>
              )}
            </div>

            {/* Navigation Arrows (only show if multiple photos) */}
            {selectedPoi.photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>

                {/* Photo Counter */}
                <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                  {currentPhotoIndex + 1} / {selectedPoi.photos.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {selectedPoi.website ? (
                  <a
                    href={selectedPoi.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold leading-tight glass-text hover:text-blue-300 transition-colors"
                  >
                    {selectedPoi.name}
                  </a>
                ) : (
                  <h2 className="text-xl font-semibold leading-tight glass-text">
                    {selectedPoi.name}
                  </h2>
                )}
                {selectedPoi.category && (
                  <div className="mt-2 w-fit rounded-full border border-border/60 bg-secondary/35 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider glass-text shadow-lg">
                    {selectedPoi.category}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="px-6 pb-5">
          <div className="space-y-4">
            {/* Grid: Rating, Price, Hours */}
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              {/* Rating */}
              {selectedPoi.rating && (
                <div className="flex items-start gap-2.5">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 glass-icon" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium glass-text">{selectedPoi.rating.toFixed(1)}/10</p>
                    <p className="mt-0.5 text-xs glass-text-muted">Rating</p>
                  </div>
                </div>
              )}

              {/* Price */}
              {selectedPoi.price && (
                <div className="flex items-start gap-2.5">
                  <DollarSign className="mt-0.5 h-4 w-4 shrink-0 glass-icon" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium glass-text">
                      {'$'.repeat(selectedPoi.price)}
                    </p>
                    <p className="mt-0.5 text-xs glass-text-muted">Price tier</p>
                  </div>
                </div>
              )}

              {/* Hours */}
              {selectedPoi.hours && (
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 glass-icon" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium glass-text">{selectedPoi.hours}</p>
                      {selectedPoi.openNow !== undefined && (
                        <div
                          className={`h-2 w-2 rounded-full ${selectedPoi.openNow ? 'bg-green-500' : 'bg-red-500'}`}
                          title={selectedPoi.openNow ? 'Open now' : 'Closed'} />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs glass-text-muted">Hours</p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {selectedPoi.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 glass-icon" />
                  <div className="min-w-0 flex-1">
                    <a
                      href={`tel:${selectedPoi.phone}`}
                      className="font-medium glass-text hover:text-blue-400"
                    >
                      {selectedPoi.phone}
                    </a>
                    <p className="mt-0.5 text-xs glass-text-muted">Phone</p>
                  </div>
                </div>
              )}

              {/* Location Information */}
              <div className="flex items-start gap-2.5 md:col-span-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 glass-icon" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium glass-text">Location</p>
                  <p className="mt-0.5 text-xs glass-text-muted break-words">
                    {selectedPoi.address}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-1 h-auto p-0 text-xs text-blue-400 hover:text-blue-300 dark:text-blue-300 dark:hover:text-blue-200"
                    asChild
                  >
                    <a
                      href={getDirectionsUrl(selectedPoi.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="mr-1 h-3 w-3" />
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Description - Scrollable */}
            {selectedPoi.aiDescription && (
              <div>
                <h3 className="mb-2 text-sm font-semibold glass-text">About this place</h3>
                <div className="max-h-32 min-h-[4rem] overflow-y-auto pr-2">
                  <p className="whitespace-pre-wrap text-xs leading-relaxed glass-text-muted">
                    {selectedPoi.aiDescription}
                  </p>
                </div>
              </div>
            )}

            {/* AI Description Loading */}
            {selectedPoi.aiDescriptionLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/20 p-3">
                <Loader2 className="h-4 w-4 animate-spin glass-icon" />
                <p className="text-xs glass-text-muted">Generating description...</p>
              </div>
            )}

            {/* Stats Cards: Tips & Popularity */}
            {(selectedPoi.tipsCount || selectedPoi.popularity) && (
              <div className="grid grid-cols-2 gap-2.5">
                {selectedPoi.tipsCount && selectedPoi.tips && selectedPoi.tips.length > 0 && (
                  <Popover
                    open={tipsPopoverOpen}
                    onOpenChange={setTipsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Card className="border-border/50 bg-secondary/20 cursor-pointer transition-all hover:bg-secondary/30 hover:border-border/70">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 glass-icon" />
                            <div>
                              <p className="text-[10px] glass-text-muted">Tips</p>
                              <p className="text-lg font-bold leading-tight glass-text">
                                {selectedPoi.tipsCount}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </PopoverTrigger>
                    <PopoverContent
                      side="left"
                      align="start"
                      className="glass w-[clamp(220px,22vw,320px)] p-0 rounded-[12px] shadow-2xl border-border/50 z-[65]"
                      sideOffset={37}
                      style={{ transform: 'translateY(-15rem)' }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                        <div>
                          <h3 className="text-sm font-semibold glass-text">Community Tips</h3>
                          <p className="text-[10px] glass-text-muted mt-0.5">{selectedPoi.tips.length} tips</p>
                        </div>
                      </div>

                      {/* Tips List - Scrollable */}
                      <div className="overflow-y-auto px-3 py-3 space-y-2 max-h-[60vh]">
                        {selectedPoi.tips.map((tip, index) => {
                          // Format relative time
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

                          return (
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
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {selectedPoi.popularity && (
                  <Card className="border-border/50 bg-secondary/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 glass-icon" />
                        <div>
                          <p className="text-[10px] glass-text-muted">Popularity</p>
                          <p className="text-lg font-bold leading-tight glass-text">
                            {selectedPoi.popularity.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Metadata & Actions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <Badge className="border-border/50 bg-secondary/50 text-[10px]">
                via Foursquare
              </Badge>
              {selectedPoi.fetchedAt && (
                <Badge className="border-border/50 bg-secondary/50 text-[10px] text-muted-foreground">
                  {new Date(selectedPoi.fetchedAt).toLocaleTimeString()}
                </Badge>
              )}
            </div>

            {/* CTA: Website */}
            {selectedPoi.website && (
              <div className="pt-1">
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a
                    href={selectedPoi.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-1.5 h-3.5 w-3.5" />
                    Website
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Render minimized view content
  const renderMinimizedView = () => {
    if (loading) {
      return renderLoading();
    }

    if (error && !selectedPoi) {
      return renderError();
    }

    if (!selectedPoi) {
      return null;
    }

    return (
      <div className="flex h-full overflow-hidden">
        {/* Left side - POI info (62% or full width if no image) */}
        <div className={`flex flex-col p-4 md:p-6 ${selectedPoi.imageUrl ? 'w-[62%]' : 'w-full'}`}>
          {/* Title and category - with left padding for minimize button */}
          <div className="mb-2 pl-8">
            {selectedPoi.website ? (
              <a
                href={selectedPoi.website}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-2 text-sm font-semibold leading-tight glass-text hover:text-blue-400 transition-colors block"
              >
                {selectedPoi.name}
              </a>
            ) : (
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight glass-text">
                {selectedPoi.name}
              </h3>
            )}

            {selectedPoi.category && (
              <div className="mt-1.5 w-fit rounded-full border border-border/60 bg-secondary/35 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider glass-text shadow-lg">
                {selectedPoi.category}
              </div>
            )}
          </div>

          {/* Key Info Grid - compact */}
          <div className="space-y-1 text-[10px]">
            {/* Rating & Price */}
            {(selectedPoi.rating || selectedPoi.price) && (
              <div className="flex items-center gap-2">
                {selectedPoi.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 glass-icon" />
                    <span className="font-medium glass-text">{selectedPoi.rating.toFixed(1)}/10</span>
                  </div>
                )}
                {selectedPoi.price && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 glass-icon" />
                    <span className="font-medium glass-text">{'$'.repeat(selectedPoi.price)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Hours */}
            {selectedPoi.hours && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 glass-icon" />
                <span className="glass-text-muted truncate">{selectedPoi.hours}</span>
                {selectedPoi.openNow !== undefined && (
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${selectedPoi.openNow ? 'bg-green-500' : 'bg-red-500'}`}
                    title={selectedPoi.openNow ? 'Open now' : 'Closed'} />
                )}
              </div>
            )}

            {/* Phone */}
            {selectedPoi.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 glass-icon" />
                <a
                  href={`tel:${selectedPoi.phone}`}
                  className="glass-text hover:text-blue-400 truncate">
                  {selectedPoi.phone}
                </a>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="mt-2 flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 glass-icon" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[10px] glass-text-muted">
                {selectedPoi.address}
              </p>
            </div>
          </div>

          {/* Description - scrollable with min height */}
          {selectedPoi.aiDescription && (
            <div className="mt-2 flex-1 min-h-[3rem] overflow-y-auto pr-2">
              <p className="text-[10px] leading-relaxed glass-text-muted md:text-[11px]">
                {selectedPoi.aiDescription}
              </p>
            </div>
          )}

          {/* AI Description Loading */}
          {selectedPoi.aiDescriptionLoading && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin glass-icon" />
              <p className="text-[10px] glass-text-muted">Generating...</p>
            </div>
          )}

          {/* Source badge at bottom */}
          <div className="mt-auto flex items-center gap-1 pt-2">
            <Badge className="border-border/50 bg-secondary/50 text-[9px]">
              via Foursquare
            </Badge>
            {selectedPoi.tipsCount && (
              <Badge className="border-border/50 bg-secondary/50 text-[9px] glass-text-muted">
                {selectedPoi.tipsCount} tips
              </Badge>
            )}
          </div>
        </div>

        {/* Right side - POI photo (38%) - Full height, responsive object-fit */}
        {selectedPoi.imageUrl && (
          <div className="w-[38%] overflow-hidden rounded-r-[12px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPoi.imageUrl}
              alt={selectedPoi.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <DetailPopoverBase
      isOpen={!!selectedPoiId || loading}
      onClose={handleClose}
      sidebarOpen={sidebarOpen}
      renderFullView={renderFullView}
      renderMinimizedView={renderMinimizedView}
    />
  );
}
