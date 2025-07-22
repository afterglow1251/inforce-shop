import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Product } from "../types/product";
import { productsApi } from "../api";

interface ProductsState {
  products: Product[];
  status: "idle" | "loading" | "failed";
  error: string | null;
  sortBy: "name" | "count" | "default";
}

const initialState: ProductsState = {
  products: [],
  status: "idle",
  error: null,
  sortBy: "default",
};

export const fetchProducts = createAsyncThunk<Product[], string | undefined>(
  "products/fetchProducts",
  async (sortBy) => {
    const sortParam = sortBy === "default" ? undefined : sortBy;
    return await productsApi.getProducts(
      sortParam as "name" | "count" | undefined
    );
  }
);

export const deleteProduct = createAsyncThunk<void, number>(
  "products/deleteProduct",
  async (id) => {
    await productsApi.deleteProduct(id);
  }
);

export const addProduct = createAsyncThunk<
  Product,
  Omit<Product, "id" | "comments">
>("products/addProduct", async (productData) => {
  return await productsApi.createProduct(productData);
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSortBy(state, action: PayloadAction<ProductsState["sortBy"]>) {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.meta.arg);
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      });
  },
});

export const { setSortBy } = productsSlice.actions;
export default productsSlice.reducer;
