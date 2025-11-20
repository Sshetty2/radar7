# Modal & Sidebar Interaction Documentation

## Overview
This document details the interaction model between the Event Detail Modal and the Events Sidebar, designed to provide a seamless user experience when both components are displayed simultaneously.

---

## Requirements

### 1. Modal Behavior
- ✅ Modal should close when clicking outside (standard modal backdrop behavior)
- ✅ Modal content should remain open when clicked (prevent close)
- ✅ Modal should display event details selected from markers or sidebar

### 2. Sidebar Behavior
- ✅ Sidebar should remain fully interactive when modal is open
- ✅ Clicking events in sidebar should update modal content (not close modal)
- ✅ Sidebar can be toggled open/closed independently of modal state

### 3. Layout Behavior
- ✅ Modal should shift left when sidebar is open to avoid overlap
- ✅ Modal and sidebar should have distinct z-index layers
- ✅ Both components should maintain glass-morphism styling

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

### Scenario 1: Click on Map (Modal Open, Sidebar Closed)
```
User clicks map
  → Click hits modal overlay (z-55)
  → handleOverlayClick triggered
  → e.target === e.currentTarget (direct click)
  → Modal closes ✅
```

### Scenario 2: Click on Modal Content
```
User clicks modal content
  → Click hits modal div (z-60)
  → onClick with stopPropagation() triggered
  → Event doesn't bubble to overlay
  → Modal stays open ✅
```

### Scenario 3: Click on Sidebar (Both Open)
```
User clicks sidebar event
  → Click hits sidebar (z-70)
  → Sidebar z-index > overlay z-index
  → Click never reaches modal overlay
  → Event selection handler triggers
  → Modal content updates with new event ✅
  → Modal stays open ✅
```

### Scenario 4: Click on Map with Sidebar Visible
```
User clicks map between modal and sidebar
  → Click hits modal overlay (z-55)
  → handleOverlayClick triggered
  → Modal closes ✅
  → Sidebar remains open (independent state)
```

---

## Dynamic Positioning

### Modal Positioning Logic (`components/events/event-detail-popover.tsx` lines 145-146)
```tsx
sidebarOpen 
  ? 'left-[calc(50%-8.5rem)]'          // Shifted left
  : 'left-1/2 -translate-x-1/2'        // Centered
```

**Calculation Breakdown**:
- Default: `left-1/2 -translate-x-1/2` = perfectly centered
- When sidebar open: `left-[calc(50%-8.5rem)]`
  - `50%` = viewport center
  - `-8.5rem` = shift left to avoid sidebar overlap
  - This positions modal so it doesn't interfere with floating sidebar

**Transition**: `transition-all duration-300` provides smooth sliding animation

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
- [ ] Click map marker → Modal opens
- [ ] Click outside modal → Modal closes
- [ ] Click modal content → Modal stays open
- [ ] Click sidebar toggle → Sidebar opens
- [ ] Click sidebar event (modal closed) → Modal opens with that event
- [ ] Click sidebar event (modal open) → Modal updates content
- [ ] Open sidebar with modal open → Modal shifts left
- [ ] Click map with both open → Modal closes, sidebar stays
- [ ] Close button on modal → Modal closes

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
- **Future**: Document any interaction model changes here

