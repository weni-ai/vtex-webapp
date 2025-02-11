import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, RootState } from '../interfaces/Store';

const initialState: AuthState = {
    token: '',
    base_address: ''
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:  {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setBaseAddress: (state, action: PayloadAction<string>) => {
            state.base_address = action.payload;
        }
    },
});



export const { setToken, setBaseAddress } = authSlice.actions;

export const selectToken = (state: RootState) => state.auth.token
export const selectBaseAddress = (state: RootState) => state.auth.base_address

export default authSlice.reducer;
