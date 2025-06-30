export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  category: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "quantity" | "price";
  order?: "asc" | "desc";
}
