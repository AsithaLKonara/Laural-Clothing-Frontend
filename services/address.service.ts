import { api } from './api';
export interface Address {
  id: string;
  customerId: string;
  type: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string | null;
  addressLine3: string | null;
  district: string | null;
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
    const response = await api.get(`/addresses?customerId=${customerId}`);
    return response.data;
  },

  addAddress: async (customerId: string, data: AddressInput): Promise<Address> => {
    const response = await api.post(`/addresses?customerId=${customerId}`, data);
    return response.data;
  },

  updateAddress: async (id: string, customerId: string, data: Partial<AddressInput>): Promise<Address> => {
    const response = await api.put(`/addresses/${id}?customerId=${customerId}`, data);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefaultAddress: async (id: string, customerId: string, type: string): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}/default`, { customerId, type });
    return response.data;
  }
};
