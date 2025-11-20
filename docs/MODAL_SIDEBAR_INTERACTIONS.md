# Modal & Sidebar Interaction Documentation

## Overview
This document details the interaction model between the Event Detail Modal and the Events Sidebar, designed to provide a seamless user experience when both components are displayed simultaneously.

---

## Requirements

### 1. Modal Behavior
- ✅ **Full View**: Modal closes when clicking outside (standard modal backdrop behavior)
- ✅ **Minimized View**: Modal only closes via close button (not backdrop dismissible)
- ✅ Modal content should remain open when clicked (prevent close)
- ✅ Modal should display event details selected from markers or sidebar
- ✅ Smooth transition between full and minimized views

### 2. Sidebar Behavior
- ✅ Sidebar should remain fully interactive when modal is open
- ✅ Clicking events in sidebar should update modal content (not close modal)
- ✅ Sidebar can be toggled open/closed independently of modal state

### 3. Layout Behavior
- ✅ **Full View**: Modal shifts left when sidebar is open to avoid overlap
- ✅ **Minimized View**: Fixed bottom-left position, independent of sidebar
- ✅ Modal and sidebar should have distinct z-index layers
- ✅ Both components should maintain glass-morphism styling

### 4. View States
- ✅ **Full View**: Center screen, complete event details, larger card
- ✅ **Minimized View**: Bottom-left corner, compact card, key info only
- ✅ Toggle between views via Minimize/Maximize button

---

## Implementation Architecture

### Z-Index Layering
```
Map Base Layer               z-index: 0
Map Controls/Buttons         z-index: 10
Modal Overlay (backdrop)     z-index: 55
Modal Content                z-index: 60
Sidebar                      z-index: 70
```

**Rationale**: Sidebar has highest z-index (70) so it appears above modal overlay (55), allowing clicks to reach sidebar even when modal is open. Modal content (60) sits between them for proper stacking.

### Pointer Events Strategy

#### Modal Overlay (`components/events/event-detail-popover.tsx` lines 135-139)
```tsx
<div
  className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[2px]"
  onClick={handleOverlayClick}
  data-state={selectedEventId ? 'open' : 'closed'}
/>
```
- **Role**: Provides backdrop effect and closes modal when clicked
- **Key Behavior**: Uses `onClick` handler to detect direct clicks (not bubbled events)
- **Styling**: Semi-transparent with subtle blur for visual separation

#### Modal Content (`components/events/event-detail-popover.tsx` lines 142-153)
```tsx
<div
  className={cn(
    'fixed top-[45%] z-[60] w-full max-w-2xl...',
    'pointer-events-auto'  // Captures all clicks
  )}
  onClick={e => e.stopPropagation()}  // Prevents close when clicking modal
>
```
- **Role**: Contains event detail content
- **Key Behavior**: `stopPropagation()` prevents clicks from bubbling to overlay
- **Positioning**: Dynamically shifts left when sidebar is open

#### Sidebar (`components/events/event-sidebar.tsx` line 37)
```tsx
<SheetContent
  className="z-[70] w-full..."
  onInteractOutside={event => event.preventDefault()}
>
```
- **Role**: Lists events and allows selection
- **Key Behavior**: 
  - `z-[70]` ensures it's above modal overlay
  - `onInteractOutside` prevents closing when clicking outside
  - Inherent `pointer-events-auto` from Radix Sheet component

---

## Click Interaction Flow

### Scenario 1: Click on Map (Full View Modal, Sidebar Closed)
```
User clicks map
  → Click hits modal overlay (z-55)
  → handleOverlayClick triggered
  → isMinimized === false
  → e.target === e.currentTarget (direct click)
  → Modal closes ✅
```

### Scenario 2: Click on Map (Minimized View Modal)
```
User clicks map
  → No overlay rendered (isMinimized === true)
  → Click goes directly to map ✅
  → Map is fully interactive and scrollable
  → Modal stays open (floating in top-left)
  → User must click close button to dismiss
```

### Scenario 3: Click Minimize/Maximize Button
```
User clicks minimize icon (full view, top-right of modal)
  → toggleMinimize() called
  → isMinimized: false → true
  → Modal transitions to top-left
  → Overlay is removed completely
  → Map becomes fully interactive
  → Toggle button moves to top-left of card
  → Modal becomes non-dismissible by backdrop ✅

User clicks maximize icon (minimized view, top-left of card)
  → toggleMinimize() called
  → isMinimized: true → false
  → Modal transitions to center
  → Overlay renders with backdrop
  → Toggle button moves to top-right
  → Modal becomes backdrop-dismissible ✅
```

### Scenario 4: Click on Modal Content
```
User clicks modal content
  → Click hits modal div (z-60)
  → onClick with stopPropagation() triggered
  → Event doesn't bubble to overlay
  → Modal stays open ✅
```

### Scenario 5: Click on Sidebar (Both Open)
```
User clicks sidebar event
  → Click hits sidebar (z-70)
  → Sidebar z-index > overlay z-index
  → Click never reaches modal overlay
  → Event selection handler triggers
  → Modal content updates with new event ✅
  → Modal stays open ✅
  → View state (minimized/full) persists
```

### Scenario 6: Click on Map with Sidebar Visible
```
User clicks map between modal and sidebar
  → Click hits modal overlay (z-55)
  → handleOverlayClick triggered
  → If full view: Modal closes ✅
  → If minimized: Modal stays open ✅
  → Sidebar remains open (independent state)
```

---

## Dynamic Positioning & Sizing

### Modal View States (`components/events/event-detail-popover.tsx`)

#### Full View Positioning
```tsx
// Full: Center screen, larger size
'top-[45%] -translate-y-1/2 w-full max-w-2xl'
sidebarOpen 
  ? 'left-1/3 -translate-x-1/3'        // Shifted left when sidebar open
  : 'left-1/2 -translate-x-1/2'        // Centered
```

**Behavior**:
- Vertically centered at 45% from top
- Horizontally shifts based on sidebar state
- Max width: 32rem (2xl)
- Backdrop-dismissible

#### Minimized View Positioning
```tsx
// Minimized: Below logo area, larger responsive sizing
'left-[8vw] top-[12vh] w-[clamp(420px,32vw,540px)]'
```

**Behavior**:
- **Responsive position**: 8vw from left, 12vh from top (adjusts to viewport)
- **Responsive width**: `clamp(420px, 32vw, 540px)` - scales between 420-540px based on viewport
- Auto height based on content
- Not backdrop-dismissible
- Independent of sidebar state
- **Map remains fully scrollable** (no overlay blocking)
- **Close button**: Always top-right corner
- **Minimize toggle**: Top-left corner

### Overlay Behavior Changes
```tsx
// Overlay only renders in full view
{!isMinimized && (
  <div className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[2px]" />
)}
```

**Key Change**: Overlay is completely **removed** when minimized (not just dimmed)
- Allows full map interaction and scrolling
- No blur effect on map UI when minimized
- Cleaner UX for browsing map with event card visible

**Transition**: `transition-all duration-300` provides smooth animations for:
- Position changes
- Size changes
- Opacity changes
- Blur intensity

---

## Related Files & Components

### Primary Files
| File | Purpose | Key Features |
|------|---------|-------------|
| `components/events/event-detail-popover.tsx` | Event detail modal | Custom overlay, positioning logic, z-60 |
| `components/events/event-sidebar.tsx` | Events sidebar | z-70, persistent when modal open |
| `components/ui/sheet.tsx` | Base sidebar component | Radix Dialog primitive wrapper |
| `components/ui/dialog.tsx` | Base dialog component | Not used for event modal (custom impl) |

### State Management
| Slice | Selector | Usage |
|-------|----------|-------|
| `uiSlice.ts` | `selectSelectedEventId` | Determines which event to show in modal |
| `uiSlice.ts` | `selectSidebarOpen` | Controls sidebar visibility and modal positioning |
| `eventsSlice.ts` | `state.events.allEvents` | Source of event data |

---

## Testing Scenarios

### Manual Testing Checklist

#### Basic Modal Operations
- [ ] Click map marker → Modal opens in full view
- [ ] Click outside modal (full view) → Modal closes
- [ ] Click modal content → Modal stays open
- [ ] Close button on modal → Modal closes

#### Minimize/Maximize
- [ ] Click minimize button → Modal transitions to bottom-left
- [ ] Click outside modal (minimized) → Modal stays open
- [ ] Click maximize button → Modal transitions to center
- [ ] Minimize state persists when switching events
- [ ] Closing modal resets to full view on next open

#### Sidebar Interactions
- [ ] Click sidebar toggle → Sidebar opens
- [ ] Click sidebar event (modal closed) → Modal opens with that event
- [ ] Click sidebar event (modal open, full view) → Modal updates content
- [ ] Click sidebar event (modal minimized) → Modal updates content, stays minimized
- [ ] Open sidebar with modal (full view) → Modal shifts left
- [ ] Open sidebar with modal (minimized) → Modal position unchanged
- [ ] Click map with both open (full view) → Modal closes, sidebar stays
- [ ] Click map with both open (minimized) → Modal stays open, sidebar stays

#### Visual Transitions
- [ ] Minimize animation is smooth (300ms)
- [ ] Maximize animation is smooth (300ms)
- [ ] Overlay dims appropriately in minimized view
- [ ] All content is visible in both views
- [ ] No layout jump when toggling sidebar

---

## Future Enhancements

### Potential Improvements
1. **Keyboard Navigation**
   - Add `Escape` key handler to close modal
   - Arrow keys to navigate between events in sidebar
   
2. **Animation Refinement**
   - Coordinate modal and sidebar animations
   - Consider spring animations for more natural feel

3. **Mobile Behavior**
   - Full-screen modal on small screens
   - Bottom sheet for sidebar on mobile
   - Different interaction model for touch devices

4. **Accessibility**
   - Focus trap within modal when open
   - Announce modal content changes to screen readers
   - Proper ARIA labels for all interactive elements

---

## Troubleshooting

### Modal won't close when clicking outside
- **Check**: Modal content z-index is below overlay z-index
- **Check**: `stopPropagation()` is called on modal content click
- **Check**: Overlay has proper click handler with target check

### Sidebar not clickable when modal open
- **Check**: Sidebar z-index (should be > overlay z-index)
- **Check**: Sidebar has `pointer-events-auto` or inherits it
- **Check**: No overlay blocking sidebar area

### Modal positioning incorrect
- **Check**: Sidebar state is correctly read in modal component
- **Check**: `cn()` utility properly applies conditional classes
- **Check**: Tailwind classes for positioning are valid

---

## Version History
- **2024-11-20**: Initial implementation with custom overlay approach
- **2024-11-20**: Added minimize/maximize functionality with two view states (full & minimized)
  - Minimized view: bottom-left corner, compact card, not backdrop-dismissible
  - Full view: center screen, complete details, backdrop-dismissible
  - Smooth transitions between states
  - State persists when switching events
- **Future**: Document any interaction model changes here

## Implementation Notes

### State Management
The `isMinimized` state is managed locally in the `EventDetailPopover` component:
```tsx
const [isMinimized, setIsMinimized] = useState(false);
```

**Design Decision**: Local state (not Redux) because:
- View preference is session-specific (no need for global state)
- Resets to full view on modal close (sensible default)
- Simpler implementation without Redux boilerplate
- No cross-component synchronization needed

### Content Rendering
Two completely different render paths based on `isMinimized`:

**Minimized View Content** (responsive width 420-540px, photo spans right 40%):
- **Layout**: Horizontal split - 60% info / 40% photo
- **Left side (60%)** - Event info with padding:
  - Title (2-line clamp) & category badge
  - Short date format (e.g., "Fri, Nov 22")
  - Time range
  - Venue name & address (truncated)
  - RSVP count & price badge inline
- **Right side (40%)**: Event photo spans full height, rounded right corner
  - Photo has more prominent presence
  - `object-cover` maintains aspect ratio
- **Controls**:
  - Minimize toggle: top-left
  - Close button: top-right

**Full View Content** (center, max-width 672px):
- Hero image with title overlay
- Complete event description
- All metadata (organizer, RSVP stats, price, type, source)
- Action buttons (View Event, Get Tickets)
- Toggle button on top-right
- Close button next to toggle

This approach ensures optimal performance—only rendering what's needed for each view state.

