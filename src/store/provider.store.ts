import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import projectReducer from './projectSlice';

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
