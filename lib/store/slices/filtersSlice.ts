import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface FiltersState {
  dateRange: { start: Date | null; end: Date | null };
  categories: string[];
  eventTypes: ('PHYSICAL' | 'VIRTUAL' | 'HYBRID')[];
  price: 'all' | 'free' | 'paid';
  priceRange: [number, number];
  sources: ('meetup' | 'eventbrite' | 'linkedin' | 'luma')[];
  distance: number; // miles from map center
  useMapBounds: boolean;
  hasAvailableSpots: boolean;
  showWaitlist: boolean;
}

const initialState: FiltersState = {
  dateRange: {
    start: null,
    end  : null
  },
  categories       : [],
  eventTypes       : [],
  price            : 'all',
  priceRange       : [0, 500],
  sources          : [],
  distance         : 25,
  useMapBounds     : false,
  hasAvailableSpots: false,
  showWaitlist     : true
};

const filtersSlice = createSlice({
  name    : 'filters',
  initialState,
  reducers: {
    setDateRange: (
      state,
      action: PayloadAction<{ start: Date | null; end: Date | null }>
    ) => {
      state.dateRange = action.payload;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const index = state.categories.indexOf(action.payload);

      if (index > -1) {
        state.categories.splice(index, 1);
      } else {
        state.categories.push(action.payload);
      }
    },
    setEventTypes: (
      state,
      action: PayloadAction<('PHYSICAL' | 'VIRTUAL' | 'HYBRID')[]>
    ) => {
      state.eventTypes = action.payload;
    },
    toggleEventType: (
      state,
      action: PayloadAction<'PHYSICAL' | 'VIRTUAL' | 'HYBRID'>
    ) => {
      const index = state.eventTypes.indexOf(action.payload);

      if (index > -1) {
        state.eventTypes.splice(index, 1);
      } else {
        state.eventTypes.push(action.payload);
      }
    },
    setPrice: (state, action: PayloadAction<'all' | 'free' | 'paid'>) => {
      state.price = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setSources: (
      state,
      action: PayloadAction<('meetup' | 'eventbrite' | 'linkedin' | 'luma')[]>
    ) => {
      state.sources = action.payload;
    },
    toggleSource: (
      state,
      action: PayloadAction<'meetup' | 'eventbrite' | 'linkedin' | 'luma'>
    ) => {
      const index = state.sources.indexOf(action.payload);

      if (index > -1) {
        state.sources.splice(index, 1);
      } else {
        state.sources.push(action.payload);
      }
    },
    setDistance: (state, action: PayloadAction<number>) => {
      state.distance = action.payload;
    },
    setUseMapBounds: (state, action: PayloadAction<boolean>) => {
      state.useMapBounds = action.payload;
    },
    setHasAvailableSpots: (state, action: PayloadAction<boolean>) => {
      state.hasAvailableSpots = action.payload;
    },
    setShowWaitlist: (state, action: PayloadAction<boolean>) => {
      state.showWaitlist = action.payload;
    },
    clearAllFilters: state => initialState
  }
});

export const {
  setDateRange,
  setCategories,
  toggleCategory,
  setEventTypes,
  toggleEventType,
  setPrice,
  setPriceRange,
  setSources,
  toggleSource,
  setDistance,
  setUseMapBounds,
  setHasAvailableSpots,
  setShowWaitlist,
  clearAllFilters
} = filtersSlice.actions;

// Selectors
export const selectFilters = (state: RootState) => state.filters;

export const selectActiveFilterCount = (state: RootState) => {
  let count = 0;
  const filters = state.filters;

  if (filters.dateRange.start || filters.dateRange.end) {
    count++;
  }

  if (filters.categories.length > 0) {
    count++;
  }

  if (filters.eventTypes.length > 0) {
    count++;
  }

  if (filters.price !== 'all') {
    count++;
  }

  if (filters.sources.length > 0) {
    count++;
  }

  if (filters.distance !== 25) {
    count++;
  }

  if (filters.hasAvailableSpots) {
    count++;
  }

  if (!filters.showWaitlist) {
    count++;
  }

  return count;
};

export default filtersSlice.reducer;
