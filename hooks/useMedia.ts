import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaService, MediaFile } from '../services/media.service';

export function useMedia(folder?: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['media', folder, page, limit],
    queryFn: () => mediaService.getMediaFiles(folder, page, limit),
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaService.deleteMediaFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, folder, onProgress }: { file: File, folder: string, onProgress?: (progress: number) => void }) => {
      // 1. Upload to backend
      const record = await mediaService.uploadMedia(file, folder, onProgress);
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useSyncLocal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaService.syncLocal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
