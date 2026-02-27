import { configureStore, combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import userReducer from './userSlice';
import projectReducer from './projectSlice';
import authReducer from './authSlice';
import onboardReducer from './onboardSlice';

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  project: projectReducer,
  auth: authReducer,
  onboard: onboardReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
