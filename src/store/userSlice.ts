import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountData, RootState, UserData, UserState } from 'src/interfaces/Store';

const initialState: UserState = {
  userData: null,
  accountData: null,
  loadingWhatsAppIntegration: false,
  isWhatsAppIntegrated: false,
  isWebChatIntegrated: false,
  isAgentBuilderIntegrated: false,
  whatsAppError: null,
  WhatsAppPhoneNumber: null,
  webchatAppUuid: null,
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
    setAgentBuilderIntegrated: (state, action: PayloadAction<boolean>) => {
      state.isAgentBuilderIntegrated = action.payload;
    },
    setWhatsAppError: (state, action: PayloadAction<string | null>) => {
      state.whatsAppError = action.payload;
    },
    setLoadingWhatsAppIntegration: (state, action: PayloadAction<boolean>) => {
      state.loadingWhatsAppIntegration = action.payload;
    },
    setWhatsAppPhoneNumber: (state, action: PayloadAction<string | null>) => {
      state.WhatsAppPhoneNumber = action.payload;
    },
    setWebChatIntegrated: (state, action: PayloadAction<boolean>) => {
      state.isWebChatIntegrated = action.payload;
    },
    setWebChatAppUuid: (state, action: PayloadAction<string | null>) => {
      state.webchatAppUuid = action.payload;
    },
  },
});

export const { 
  setUser, 
  setAccount,
  setWhatsAppIntegrated, 
  setWebChatIntegrated,
  setWebChatAppUuid,
  setAgentBuilderIntegrated, 
  setWhatsAppError, 
  setLoadingWhatsAppIntegration,
  setWhatsAppPhoneNumber,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.userData
export const selectAccount = (state: RootState) => state.user.accountData
export const isWhatsAppIntegrated = (state: RootState) => state.user.isWhatsAppIntegrated
export const isWebChatIntegrated = (state: RootState) => state.user.isWebChatIntegrated
export const isAgentBuilderIntegrated = (state: RootState) => state.user.isAgentBuilderIntegrated
export const whatsAppError = (state: RootState) => state.user.whatsAppError
export const loadingWhatsAppIntegration = (state: RootState) => state.user.loadingWhatsAppIntegration
export const selectWebChatAppUuid = (state: RootState) => state.user.webchatAppUuid

export default userSlice.reducer;
