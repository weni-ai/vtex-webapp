import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../interfaces/Store";

const appSlice = createSlice({
  name: 'app',
  initialState: {
    embeddedWithin: 'VTEX App' as 'VTEX App' | 'Weni Platform',
    designSystem: 'shoreline' as 'shoreline' | 'unnnic',
  },
  reducers: {
    setDesignSystem: (state, action: PayloadAction<'shoreline' | 'unnnic'>) => {
      state.designSystem = action.payload;
    },

    setEmbeddedWithin: (state, action: PayloadAction<'VTEX App' | 'Weni Platform'>) => {
      if (action.payload === 'Weni Platform') {
        state.designSystem = 'unnnic';
      }

      state.embeddedWithin = action.payload;
    }
  }
});

export const { setDesignSystem, setEmbeddedWithin } = appSlice.actions;

export const selectDesignSystem = (state: RootState) => state.app.designSystem;
export const selectEmbeddedWithin = (state: RootState) => state.app.embeddedWithin;

export default appSlice.reducer;
