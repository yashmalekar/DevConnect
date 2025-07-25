import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    data: null,
    postData: null,
    projectData: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.data = null;
    },
    setData: (state, action)=>{
      state.data = action.payload;
    },
    setPostData: (state, action)=>{
      state.postData = action.payload
    },
    setProjectData: (state,action)=>{
      state.projectData = action.payload
    }
  },
});

export const { setUser, clearUser, setData, setPostData, setProjectData } = authSlice.actions;

export default authSlice.reducer;
