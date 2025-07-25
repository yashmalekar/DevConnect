import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice';

const config = {
  key:'auth',
  storage,
}

const persistedReducer = persistReducer(config, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:false,
      immutableCheck: false,
    })
});

export const persistor = persistStore(store);
