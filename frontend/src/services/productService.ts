import { VITE_API_BASE_URL } from "@/constant";
import { ProductListParams, ApiResponse, Product } from "@/interface";
import axios from "axios";

export const productService = {
  // Get all products with search, pagination, and sorting
  async getProducts(
    params: ProductListParams = {}
  ): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append("search", params.search);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.order) searchParams.append("order", params.order);

    const response = await axios.get<{ data: Product[] }>(
      `${VITE_API_BASE_URL}/product?${searchParams.toString()}`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch products");
    }

    return response.data;
  },

  // Get single product
  async getProduct(id: string): Promise<Product> {
    const response = await axios.get<{ data: Product }>(
      `${VITE_API_BASE_URL}/product/${id}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch product");
    }

    return response.data.data;
  },

  // Create product
  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const response = await axios.post<{ data: Product }>(
      "http://localhost:3000/product",
      product
    );

    if (response.status !== 201) {
      throw new Error("Failed to create product");
    }
    return response.data.data;
  },

  // Update product
  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await axios.patch<{ data: Product }>(
      `${VITE_API_BASE_URL}/product/${id}`,
      product
    );

    if (response.status !== 200) {
      throw new Error("Failed to update product");
    }

    return response.data.data;
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    const response = await axios.delete(`http://localhost:3000/product/${id}`);
  },
};
