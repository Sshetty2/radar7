import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  center: [number, number]; // [lng, lat]
  zoom: number;
  bounds: [[number, number], [number, number]] | null; // [[sw_lng, sw_lat], [ne_lng, ne_lat]]
}

const initialState: MapState = {
  center: [-74.006, 40.7128], // NYC default (lng, lat)
  zoom  : 12,
  bounds: null
};

const mapSlice = createSlice({
  name    : 'map',
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setBounds: (
      state,
      action: PayloadAction<[[number, number], [number, number]] | null>
    ) => {
      state.bounds = action.payload;
    },
    setMapView: (
      state,
      action: PayloadAction<{
        center: [number, number];
        zoom: number;
        bounds?: [[number, number], [number, number]];
      }>
    ) => {
      state.center = action.payload.center;
      state.zoom = action.payload.zoom;

      if (action.payload.bounds) {
        state.bounds = action.payload.bounds;
      }
    }
  }
});

export const { setCenter, setZoom, setBounds, setMapView } = mapSlice.actions;

export default mapSlice.reducer;
