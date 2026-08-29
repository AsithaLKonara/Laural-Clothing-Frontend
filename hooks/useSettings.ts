import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, Setting, SettingInput } from "../services/settings.service";

export const SETTINGS_QUERY_KEYS = {
  all: ['settings'] as const,
  public: ['settings', 'public'] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.all,
    queryFn: () => settingsService.getAllSettings(),
  });
}

export function usePublicSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.public,
    queryFn: () => settingsService.getPublicSettings(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: SettingInput[]) => settingsService.bulkUpdateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.public });
    },
  });
}

export function useCreateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Setting, "description"> & { description?: string }) => settingsService.createSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.public });
    },
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => settingsService.deleteSetting(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.public });
    },
  });
}
