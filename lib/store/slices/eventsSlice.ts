import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Event } from '@/lib/db/crawler-schema';
import type { RootState } from '../store';

interface EventsState {
  allEvents: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  allEvents: [],
  loading  : false,
  error    : null
};

const eventsSlice = createSlice({
  name    : 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.allEvents = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: state => {
      state.error = null;
    }
  }
});

export const { setEvents, setLoading, setError, clearError } = eventsSlice.actions;

// Selectors
export const selectAllEvents = (state: RootState) => state.events.allEvents;

export const selectEventsLoading = (state: RootState) => state.events.loading;

export const selectEventsError = (state: RootState) => state.events.error;

export default eventsSlice.reducer;
