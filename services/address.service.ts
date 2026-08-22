import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Address {
  id: string;
  customerId: string;
  type: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string | null;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AddressInput = Omit<Address, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>;

export const addressService = {
  getAddresses: async (customerId: string): Promise<Address[]> => {
    const response = await axios.get(`${API_URL}/addresses?customerId=${customerId}`);
    return response.data;
  },

  addAddress: async (customerId: string, data: AddressInput): Promise<Address> => {
    const response = await axios.post(`${API_URL}/addresses?customerId=${customerId}`, data);
    return response.data;
  },

  updateAddress: async (id: string, customerId: string, data: Partial<AddressInput>): Promise<Address> => {
    const response = await axios.put(`${API_URL}/addresses/${id}?customerId=${customerId}`, data);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/addresses/${id}`);
  },

  setDefaultAddress: async (id: string, customerId: string, type: string): Promise<Address> => {
    const response = await axios.patch(`${API_URL}/addresses/${id}/default`, { customerId, type });
    return response.data;
  }
};
