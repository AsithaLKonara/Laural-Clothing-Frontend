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
    mutationFn: async ({ file, folder }: { file: File, folder: string }) => {
      // 1. Get presigned URL
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const { url, key, publicUrl } = await mediaService.generatePresignedUrl(file.name, file.type, folder);
      
      // 2. Upload to S3
      await mediaService.uploadToS3(url, file);
      
      // 3. Confirm with Backend
      const record = await mediaService.createMediaRecord({
        name: file.name,
        type,
        folder,
        size: file.size,
        url: publicUrl,
        key
      });
      
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useSyncS3() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaService.syncS3,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
