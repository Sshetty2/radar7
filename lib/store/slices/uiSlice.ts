import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface UIState {
  sidebarOpen: boolean;
  selectedEventId: string | null;
  filterModalOpen: boolean;
  searchMode: 'address' | 'natural';
  mapStyle: 'day' | 'night';
}

const initialState: UIState = {
  sidebarOpen    : false,
  selectedEventId: null,
  filterModalOpen: false,
  searchMode     : 'address',
  mapStyle       : 'night'
};

const uiSlice = createSlice({
  name    : 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<string | null>) => {
      state.selectedEventId = action.payload;
    },
    toggleFilterModal: state => {
      state.filterModalOpen = !state.filterModalOpen;
    },
    setFilterModalOpen: (state, action: PayloadAction<boolean>) => {
      state.filterModalOpen = action.payload;
    },
    setSearchMode: (state, action: PayloadAction<'address' | 'natural'>) => {
      state.searchMode = action.payload;
    },
    toggleSearchMode: state => {
      state.searchMode = state.searchMode === 'address' ? 'natural' : 'address';
    },
    setMapStyle: (state, action: PayloadAction<'day' | 'night'>) => {
      state.mapStyle = action.payload;
    },
    toggleMapStyle: state => {
      state.mapStyle = state.mapStyle === 'day' ? 'night' : 'day';
    }
  }
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSelectedEvent,
  toggleFilterModal,
  setFilterModalOpen,
  setSearchMode,
  toggleSearchMode,
  setMapStyle,
  toggleMapStyle
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;

export const selectSelectedEventId = (state: RootState) => state.ui.selectedEventId;

export const selectFilterModalOpen = (state: RootState) => state.ui.filterModalOpen;

export const selectSearchMode = (state: RootState) => state.ui.searchMode;

export const selectMapStyle = (state: RootState) => state.ui.mapStyle;

export default uiSlice.reducer;
