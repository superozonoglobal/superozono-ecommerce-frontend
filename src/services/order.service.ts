import { apiClient } from '../lib/api';
import { Order, ApiResponse } from '../types';

export const orderService = {
  // Public Checkout
  checkout: async (subdomain: string, checkoutData: {
    customerName: string;
    customerEmail: string;
    items: { productId: string; quantity: number }[];
  }): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/public/stores/${subdomain}/checkout`, checkoutData);
    return response.data.data;
  },

  // List Orders for a Store (Admin)
  getStoreOrders: async (storeId: string, page = 0, size = 20): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>(`/stores/${storeId}/orders`, {
      params: { page, size },
    });
    return response.data.data;
  },

  // Get Order Detail
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data;
  },

  // Update Order Status
  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
    return response.data.data;
  },
};
