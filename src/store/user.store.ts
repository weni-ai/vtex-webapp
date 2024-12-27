import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const user_store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default user_store;
