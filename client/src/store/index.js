import { configureStore } from '@reduxjs/toolkit';

import chatSlice from './chat-slice';
import userSlice from './user-slice';
import webcamSlice from './webcam-slice';

const store = configureStore({
  reducer: {
    user: userSlice,
    webcam: webcamSlice,
    chat: chatSlice
  }
});

export default store;
