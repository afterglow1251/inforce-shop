import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "../types/product";
import type { Comment } from "../types/comment";
import { productsApi } from "../api";

interface ProductState {
  product: Product | null;
  comments: Comment[];
  status: "idle" | "loading" | "failed";
  commentsStatus: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  comments: [],
  status: "idle",
  commentsStatus: "idle",
  error: null,
};

export const fetchProductById = createAsyncThunk<Product, number>(
  "product/fetchProductById",
  async (id) => {
    return await productsApi.getProductById(id);
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; data: Partial<Product> }
>("product/updateProduct", async ({ id, data }) => {
  return await productsApi.updateProduct(id, data);
});

export const addComment = createAsyncThunk<
  Comment,
  { productId: number; description: string; date: string }
>("product/addComment", async ({ productId, description, date }) => {
  return await productsApi.addComment(productId, { description, date });
});

export const deleteComment = createAsyncThunk<
  void,
  { productId: number; commentId: number }
>("product/deleteComment", async ({ productId, commentId }) => {
  await productsApi.deleteComment(productId, commentId);
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductState(state) {
      state.product = null;
      state.comments = [];
      state.status = "idle";
      state.commentsStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "idle";
        state.product = action.payload;
        state.comments = action.payload.comments;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch product";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.commentsStatus = "loading";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.commentsStatus = "idle";
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state) => {
        state.commentsStatus = "failed";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.meta.arg.commentId;
        state.comments = state.comments.filter((c) => c.id !== commentId);
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
