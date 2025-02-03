/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: '',
        base_address: '',
        errorTest: true
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setBaseAddress: (state, action) => {
            state.base_address = action.payload
        },
        setErrorTest: (state, action) => {
            state.errorTest = action.payload
        },
    },
});



export const { setToken, setBaseAddress, setErrorTest } = authSlice.actions;

export const selectToken = (state: any) => state.auth.token
export const selectBaseAddress = (state: any) => state.auth.selectBaseAddress

export default authSlice.reducer;
