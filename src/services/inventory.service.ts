import { apiClient } from '../lib/api';
import { Product, ApiResponse } from '../types';

export const inventoryService = {
  // Get all inventory for a specific store
  getInventoryByStore: async (storeId: string): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/stores/${storeId}/inventory`);
    return response.data.data;
  },

  // Get inventory of a specific product across all stores
  getInventoryByProduct: async (productId: string): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/products/${productId}/inventory`);
    return response.data.data;
  },

  // Update Inventory / Stock
  updateStock: async (inventoryId: string, quantity: number, minStockAlert: number): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(`/inventory/${inventoryId}`, {
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
