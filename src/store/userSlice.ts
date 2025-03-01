import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountData, RootState, UserData, UserState } from 'src/interfaces/Store';

const initialState: UserState = {
  userData: null,
  accountData: null,
  loadingWhatsAppIntegration: false,
  isWhatsAppIntegrated: false,
  isAgentIntegrated: false,
  isFeatureIntegrated: false,
  whatsAppError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.userData = action.payload;
    },
    setAccount: (state, action: PayloadAction<AccountData | null>) => {
      state.accountData = action.payload;
    },
    setWhatsAppIntegrated: (state, action: PayloadAction<boolean>) => {
      state.isWhatsAppIntegrated = action.payload;
    },
    setAgentIntegrated: (state, action: PayloadAction<boolean>) => {
      state.isAgentIntegrated = action.payload;
    },
    setFeatureIntegrated: (state, action: PayloadAction<boolean>) => {
      state.isFeatureIntegrated = action.payload;
    },
    setWhatsAppError: (state, action: PayloadAction<string | null>) => {
      state.whatsAppError = action.payload;
    },
    setLoadingWhatsAppIntegration: (state, action: PayloadAction<boolean>) => {
      state.loadingWhatsAppIntegration = action.payload;
    },
  },
});

export const { 
  setUser, 
  setAccount,
  setWhatsAppIntegrated, 
  setAgentIntegrated, 
  setFeatureIntegrated, 
  setWhatsAppError, 
  setLoadingWhatsAppIntegration 
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.userData
export const selectAccount = (state: RootState) => state.user.accountData
export const isWhatsAppIntegrated = (state: RootState) => state.user.isWhatsAppIntegrated
export const isAgentIntegrated = (state: RootState) => state.user.isAgentIntegrated
export const isFeatureIntegrated = (state: RootState) => state.user.isFeatureIntegrated
export const whatsAppError = (state: RootState) => state.user.whatsAppError
export const loadingWhatsAppIntegration = (state: RootState) => state.user.loadingWhatsAppIntegration

export default userSlice.reducer;
