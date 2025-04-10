import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import projectReducer from './projectSlice';
import authReducer from './authSlice'

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  auth: authReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
