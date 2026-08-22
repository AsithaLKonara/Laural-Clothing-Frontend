import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService, AddressInput } from '@/services/address.service';

export const ADDRESS_KEYS = {
  all: ['addresses'] as const,
  customer: (customerId: string) => ['addresses', customerId] as const,
};

// Since auth is pending, we use a mocked/temporary customer ID in our components if one isn't provided.
// In a real flow, this would come from the auth context.
export const MOCK_CUSTOMER_ID = "mock-customer-123";

export function useAddresses(customerId: string = MOCK_CUSTOMER_ID) {
  return useQuery({
    queryKey: ADDRESS_KEYS.customer(customerId),
    queryFn: () => addressService.getAddresses(customerId),
    enabled: !!customerId,
  });
}

export function useAddAddress(customerId: string = MOCK_CUSTOMER_ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressInput) => addressService.addAddress(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.customer(customerId) });
    },
  });
}

export function useUpdateAddress(customerId: string = MOCK_CUSTOMER_ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddressInput> }) => 
      addressService.updateAddress(id, customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.customer(customerId) });
    },
  });
}

export function useDeleteAddress(customerId: string = MOCK_CUSTOMER_ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.customer(customerId) });
    },
  });
}

export function useSetDefaultAddress(customerId: string = MOCK_CUSTOMER_ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: string }) => 
      addressService.setDefaultAddress(id, customerId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.customer(customerId) });
    },
  });
}
