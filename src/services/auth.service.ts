import { apiClient } from '../lib/api';
import { User, ApiResponse } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  // Login Endpoint
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  },

  // Get Current Profile Endpoint
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Create Admin (For ROOT_ADMIN)
  createAdmin: async (adminData: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'ADMIN' | 'DISTRIBUTOR';
  }): Promise<User> => {
    // Discovery showed /auth/create-admin fails with 500. 
    // Trying /users as the primary resource for user creation if create-admin is not the one.
    // However, if the backend uses a dedicated invitation flow, it might be /auth/invite.
    // Let's try /users for now as it's the most standard REST path.
    const response = await apiClient.post<ApiResponse<User>>('/users', adminData);
    return response.data.data;
  },

  // Create Distributor (For ROOT_ADMIN or ADMIN)
  createDistributor: async (distributorData: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'DISTRIBUTOR';
  }): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', distributorData);
    return response.data.data;
  },

  // Get Users (Corrected from /auth/users to /users)
  getAdmins: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  // Set Password for Invitation
  registerPassword: async (token: string, password: string): Promise<any> => {
    const response = await apiClient.post('/auth/register-password', { token, password });
    return response.data;
  },

  // Verify OTP Code
  verifyInvitationEmail: async (email: string, code: string): Promise<any> => {
    const response = await apiClient.post('/auth/verify-email', { email, code });
    return response.data;
  },
};
