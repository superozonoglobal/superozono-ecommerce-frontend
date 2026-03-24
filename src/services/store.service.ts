import { apiClient } from '../lib/api';
import { Store, ApiResponse } from '../types';

export interface CreateStoreDto {
  name: string;
  subdomain: string;
  address: string;
  phone: string;
}

export interface UpdateStoreDto extends Partial<CreateStoreDto> {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export const storeService = {
  // Create Store
  createStore: async (storeData: CreateStoreDto): Promise<Store> => {
    const response = await apiClient.post<ApiResponse<Store>>('/stores', storeData);
    return response.data.data;
  },

  // Update Store
  updateStore: async (id: string, storeData: UpdateStoreDto): Promise<Store> => {
    const response = await apiClient.put<ApiResponse<Store>>(`/stores/${id}`, storeData);
    return response.data.data;
  },

  // List My Stores
  listMyStores: async (): Promise<Store[]> => {
    const response = await apiClient.get<ApiResponse<Store[]>>('/stores');
    return response.data.data;
  },

  // Get by ID
  getById: async (id: string): Promise<Store> => {
    const response = await apiClient.get<ApiResponse<Store>>(`/stores/${id}`);
    return response.data.data;
  },

  // Delete Store
  deleteStore: async (id: string): Promise<void> => {
    await apiClient.delete(`/stores/${id}`);
  },

  // Change Status (ROOT_ADMIN only)
  changeStatus: async (id: string, status: Store['status']): Promise<Store> => {
    const response = await apiClient.patch<ApiResponse<Store>>(`/stores/${id}/status`, { status });
    return response.data.data;
  },

  // Public Search by Subdomain
  getBySubdomain: async (subdomain: string): Promise<Store> => {
    const response = await apiClient.get<ApiResponse<Store>>(`/stores/by-subdomain/${subdomain}`);
    return response.data.data;
  },
};
