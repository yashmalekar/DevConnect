import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    data: null,
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
  },
});

export const { setUser, clearUser, setData } = authSlice.actions;

export default authSlice.reducer;
