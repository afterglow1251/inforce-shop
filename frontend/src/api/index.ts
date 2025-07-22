import type { Product } from "../types/product";
import type { Comment } from "../types/comment";
import { API_ROUTES } from "./config/endpoints";
import { API } from "./config/axios.config";

class ProductsApi {
  async getProducts(sortBy?: "name" | "count"): Promise<Product[]> {
    const res = await API.get<Product[]>(API_ROUTES.PRODUCTS, {
      params: { sortBy },
    });
    return res.data;
  }

  async getProductById(id: number): Promise<Product> {
    const res = await API.get<Product>(API_ROUTES.PRODUCT_BY_ID(id));
    return res.data;
  }

  async createProduct(
    product: Omit<Product, "id" | "comments">
  ): Promise<Product> {
    const res = await API.post<Product>(API_ROUTES.PRODUCTS, product);
    return res.data;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const res = await API.patch<Product>(API_ROUTES.PRODUCT_BY_ID(id), data);
    return res.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await API.delete(API_ROUTES.PRODUCT_BY_ID(id));
  }

  async addComment(
    productId: number,
    comment: { description: string; date: string }
  ): Promise<Comment> {
    const res = await API.post<Comment>(
      API_ROUTES.COMMENTS(productId),
      comment
    );
    return res.data;
  }

  async deleteComment(productId: number, commentId: number): Promise<void> {
    await API.delete(API_ROUTES.COMMENT_BY_ID(productId, commentId));
  }
}

export const productsApi = new ProductsApi();
