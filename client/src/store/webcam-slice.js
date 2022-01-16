import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  video: true,
  audio: true,
  webcamKey: uuid()
};

const webcamSlice = createSlice({
  name: 'webcam',
  initialState,
  reducers: {
    setVideoState: (state, action) => {
      state.video = action.payload;
    },
    setAudioState: (state, action) => {
      state.audio = action.payload;
    },
    setWebcamKey: (state) => {
      state.webcamKey = uuid();
    }
  }
});

export const { setVideoState, setAudioState, setWebcamKey } = webcamSlice.actions;

export default webcamSlice.reducer;
