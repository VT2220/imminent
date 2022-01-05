import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  video: true,
  audio: true
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
    }
  }
});

export const { setVideoState, setAudioState } = webcamSlice.actions;

export default webcamSlice.reducer;
