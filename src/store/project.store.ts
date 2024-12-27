import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice'

const project_store = configureStore({
  reducer: {
    project: projectReducer
  },
});

export default project_store;
