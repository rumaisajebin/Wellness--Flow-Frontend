// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../pages/auth/services/slice/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here if necessary
  },
});

export default store;
