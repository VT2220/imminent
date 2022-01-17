import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chat: {}
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChat: (state, action) => {
      const { msg, roomId } = action.payload;
      if (state.chat[roomId]?.length) {
        state.chat[roomId].push(msg);
        sessionStorage.setItem('chat', state.chat);
      } else {
        state.chat[roomId] = [msg];
        sessionStorage.setItem('chat', state.chat);
      }
    }
  }
});

export const { setChat } = chatSlice.actions;

export default chatSlice.reducer;
