export const API_ROUTES = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  COMMENTS: (productId: number) => `/products/${productId}/comments`,
  COMMENT_BY_ID: (productId: number, commentId: number) =>
    `/products/${productId}/comments/${commentId}`,
};
