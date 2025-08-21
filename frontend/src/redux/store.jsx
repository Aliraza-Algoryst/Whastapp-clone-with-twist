import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer"; // combineReducers or slice reducers

const store = configureStore({
  reducer,
  // No need to manually set middleware unless you're adding custom ones
});

export default store;
