import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnboardChannel, OnboardStatus, OnboardState, RootState } from "../interfaces/Store";

const initialState: OnboardState = {
    onboardingStatus: null,
    selectedChannel: null,
}

const onboardSlice = createSlice({
    name: 'onboard',
    initialState,
    reducers: {
        setOnboardingStatus: (state, action: PayloadAction<OnboardStatus | null>) => {
            state.onboardingStatus = action.payload;
        },
        setSelectedChannel: (state, action: PayloadAction<OnboardChannel | null>) => {
            state.selectedChannel = action.payload;
        },
    }
})

export const { setOnboardingStatus, setSelectedChannel } = onboardSlice.actions;

export const selectOnboardingStatus = (state: RootState) => state.onboard.onboardingStatus;
export const selectSelectedChannel = (state: RootState) => state.onboard.selectedChannel;

export default onboardSlice.reducer;