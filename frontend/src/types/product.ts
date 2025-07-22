import type { Comment } from "./comment";

export interface Size {
  width: number;
  height: number;
}

export interface Product {
  id: number;
  imageUrl: string;
  name: string;
  count: number;
  size: Size;
  weight: string;
  comments: Comment[];
}
