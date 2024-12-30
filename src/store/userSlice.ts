/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: {}
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
  },
});



export const { setUser } = userSlice.actions;

export const selectUser = (state: any) => state.user.userData

export default userSlice.reducer;
