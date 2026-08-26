import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService, SystemUserItem } from "../services/role.service";

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: (params?: any) => params ? [...USER_QUERY_KEYS.all, 'list', params] as const : [...USER_QUERY_KEYS.all, 'list'] as const,
};

export function useUsers(params?: { search?: string; role?: string }) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.lists(params),
    queryFn: () => roleService.getUsers(params?.search, params?.role),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof roleService.createUser>[0]) => roleService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof roleService.updateUser>[1] }) => roleService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roleService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}
