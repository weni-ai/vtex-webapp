/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: '',
        base_address: ''
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setBaseAddress: (state, action) => {
            state.base_address = action.payload
        }
    },
});



export const { setToken, setBaseAddress } = authSlice.actions;

export const selectToken = (state: any) => state.auth.token
export const selectBaseAddress = (state: any) => state.auth.selectBaseAddress

export default authSlice.reducer;
