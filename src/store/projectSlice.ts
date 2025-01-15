/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
    name: 'project',
    initialState: {
      project_uuid: '1234',
      loadingSetup: false

    },
    reducers: {
      setProjectUuid: (state, action) => {
        state.project_uuid = action.payload
      },
      setLoadingSetup: (state, action) => {
        state.loadingSetup = action.payload
      }
    }
  })

  export const {setProjectUuid, setLoadingSetup} = projectSlice.actions
  export const selectProject = (state: any) => state.project.project_uuid
  export const loadingSetup = (state: any) => state.project.loadingSetup
  export default projectSlice.reducer;