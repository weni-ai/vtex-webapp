/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: {},
    loadingWhatsAppIntegration: false,
    isWhatsAppIntegrated: false,
    isAgentIntegrated: false,
    whatsAppError: null
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    setWhatsAppIntegrated: (state, action) => {
      state.isWhatsAppIntegrated = action.payload
    },
    setAgentIntegrated: (state, action) => {
      state.isAgentIntegrated = action.payload
    },
    setWhatsAppError: (state, action) => {
      state.whatsAppError = action.payload
    },
    setLoadingWhatsAppIntegration: (state, action) => {
      state.loadingWhatsAppIntegration = action.payload
    }
  },
});

export const { setUser, setWhatsAppIntegrated, setAgentIntegrated, setWhatsAppError, setLoadingWhatsAppIntegration} = userSlice.actions;

export const selectUser = (state: any) => state.user.userData
export const isWhatsAppIntegrated = (state: any) => state.user.isWhatsAppIntegrated
export const isAgentIntegrated = (state: any) => state.user.isAgentIntegrated
export const whatsAppError = (state: any) => state.user.whatsAppError
export const loadingWhatsAppIntegration = (state: any) => state.user.loadingWhatsAppIntegration

export default userSlice.reducer;
