import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const addMessageBusReducer = createSlice({
  name: "messagebus",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
      return state;
    },
    removeMessage: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    }
  },
});

export const {
  addMessage,
  removeMessage
} = addMessageBusReducer.actions;
export const reducer = addMessageBusReducer.reducer;
