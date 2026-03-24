import { apiClient } from '../lib/api';
import { Product, ApiResponse } from '../types';

export const productService = {
  // Public Catalog
  getPublicProducts: async (subdomain: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/public/stores/${subdomain}/products`);
    return response.data.data;
  },

  // List Store Products (Admin)
  getStoreProducts: async (storeId: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/stores/${storeId}/products`);
    return response.data.data;
  },

  // List All Products (Root Admin)
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data.data;
  },

  // Create Product
  createProduct: async (productData: {
    name: string;
    description: string;
    sku: string;
    category: string;
    basePrice: number;
    storeId: string;
  }): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', productData);
    return response.data.data;
  },

  // Update Inventory / Stock
  updateStock: async (productId: string, quantity: number, minStockAlert: number): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(`/inventory/products/${productId}`, {
      quantity,
      minStockAlert,
    });
    return response.data.data;
  },

  // Low Stock Alerts
  getLowStockAlerts: async (storeId: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/stores/${storeId}/inventory/low-stock`);
    return response.data.data;
  },
};
