import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user.store';
import projectReducer from './project.store';

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
