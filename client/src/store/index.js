import { configureStore } from '@reduxjs/toolkit';

import userSlice from './user-slice';
import webcamSlice from './webcam-slice';

const store = configureStore({
  reducer: {
    user: userSlice,
    webcam: webcamSlice
  }
});

export default store;
