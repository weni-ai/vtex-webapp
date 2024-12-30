/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
    name: 'project',
    initialState: {
      project_uuid: '1234'
    },
    reducers: {
      setProjectUuid: (state, action) => {
        state.project_uuid = action.payload
      }
    }
  })

  export const {setProjectUuid} = projectSlice.actions
  export const selectProject = (state: any) => state.project.project_uuid
  export default projectSlice.reducer;