import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ErrorDialogState {
  open: boolean;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  selectedEventId: string | null;
  selectedPoiId: string | null;
  filterModalOpen: boolean;
  searchMode: 'address' | 'natural';
  mapStyle: 'day' | 'night';
  errorDialog: ErrorDialogState;
}

const initialState: UIState = {
  sidebarOpen    : false,
  selectedEventId: null,
  selectedPoiId  : null,
  filterModalOpen: false,
  searchMode     : 'address',
  mapStyle       : 'night',
  errorDialog    : {
    open       : false,
    title      : '',
    description: ''
  }
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

      // Clear POI selection when event is selected (mutually exclusive)
      if (action.payload !== null) {
        state.selectedPoiId = null;
      }
    },
    setSelectedPoi: (state, action: PayloadAction<string | null>) => {
      state.selectedPoiId = action.payload;

      // Clear event selection when POI is selected (mutually exclusive)
      if (action.payload !== null) {
        state.selectedEventId = null;
      }
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
    },
    showErrorDialog: (state, action: PayloadAction<Omit<ErrorDialogState, 'open'>>) => {
      state.errorDialog = {
        ...action.payload,
        open: true
      };
    },
    closeErrorDialog: state => {
      state.errorDialog = {
        open       : false,
        title      : '',
        description: ''
      };
    }
  }
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSelectedEvent,
  setSelectedPoi,
  toggleFilterModal,
  setFilterModalOpen,
  setSearchMode,
  toggleSearchMode,
  setMapStyle,
  toggleMapStyle,
  showErrorDialog,
  closeErrorDialog
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;

export const selectSelectedEventId = (state: RootState) => state.ui.selectedEventId;

export const selectSelectedPoiId = (state: RootState) => state.ui.selectedPoiId;

export const selectFilterModalOpen = (state: RootState) => state.ui.filterModalOpen;

export const selectSearchMode = (state: RootState) => state.ui.searchMode;

export const selectMapStyle = (state: RootState) => state.ui.mapStyle;

export const selectErrorDialog = (state: RootState) => state.ui.errorDialog;

export default uiSlice.reducer;
