import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './slices/mapSlice';
import eventsReducer from './slices/eventsSlice';
import uiReducer from './slices/uiSlice';
import filtersReducer from './slices/filtersSlice';
import poiReducer from './slices/poiSlice';

export const store = configureStore({
  reducer: {
    map    : mapReducer,
    events : eventsReducer,
    ui     : uiReducer,
    filters: filtersReducer,
    poi    : poiReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types for date serialization
      ignoredActions: ['filters/setDateRange'],

      // Ignore these field paths in all actions
      ignoredActionPaths: ['payload.start', 'payload.end'],

      // Ignore these paths in the state
      ignoredPaths: ['filters.dateRange.start', 'filters.dateRange.end']
    }
  })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
