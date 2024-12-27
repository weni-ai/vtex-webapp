/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {}
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});



export const { setUser } = userSlice.actions;

export const selectUser = (state: any) => state.user.user

export default userSlice.reducer;
