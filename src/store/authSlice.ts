/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: ''
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});



export const { setToken } = authSlice.actions;

export const selectToken = (state: any) => state.auth.token

export default authSlice.reducer;
