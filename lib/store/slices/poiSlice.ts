import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { POI } from '@/lib/types/poi';

interface POIState {

  /** Cached POI data by ID (lat,lng as key) */
  pois: Record<string, POI>;

  /** Whether a POI fetch is currently in progress */
  loading: boolean;

  /** Error message if POI fetch failed */
  error: string | null;
}

const initialState: POIState = {
  pois   : {},
  loading: false,
  error  : null
};

const poiSlice = createSlice({
  name    : 'poi',
  initialState,
  reducers: {
    fetchPOIStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchPOISuccess: (state, action: PayloadAction<POI>) => {
      state.loading = false;
      state.error = null;

      // Cache the POI data using ID as key
      state.pois[action.payload.id] = action.payload;
    },
    fetchPOIFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    cachePOI: (state, action: PayloadAction<POI>) => {
      // Store POI data in cache
      state.pois[action.payload.id] = action.payload;
    },
    clearPOIError: state => {
      state.error = null;
    },
    setAIDescriptionLoading: (state, action: PayloadAction<{ id: string; loading: boolean }>) => {
      const poi = state.pois[action.payload.id];

      if (poi) {
        poi.aiDescriptionLoading = action.payload.loading;
      }
    },
    setAIDescription: (state, action: PayloadAction<{ id: string; description: string }>) => {
      const poi = state.pois[action.payload.id];

      if (poi) {
        poi.aiDescription = action.payload.description;
        poi.aiDescriptionLoading = false;
      }
    }
  }
});

export const {
  fetchPOIStart,
  fetchPOISuccess,
  fetchPOIFailure,
  cachePOI,
  clearPOIError,
  setAIDescriptionLoading,
  setAIDescription
} = poiSlice.actions;

// Selectors
export const selectPOIs = (state: RootState) => state.poi.pois;

export const selectPOIById = (id: string | null) => (state: RootState) => (id ? state.poi.pois[id] : null);

export const selectPOILoading = (state: RootState) => state.poi.loading;

export const selectPOIError = (state: RootState) => state.poi.error;

export default poiSlice.reducer;
