import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import productReducer from "./productSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
