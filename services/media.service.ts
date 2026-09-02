import { api } from './api';

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  folder: string;
  size: number;
  dimensions?: string;
  url: string;
  key: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaPaginatedResponse {
  data: MediaFile[];
  total: number;
  page: number;
  totalPages: number;
}

export const mediaService = {
  getMediaFiles: async (folder?: string, page: number = 1, limit: number = 20): Promise<MediaPaginatedResponse> => {
    const params: any = { page, limit };
    if (folder && folder !== 'All') {
      params.folder = folder;
    }
    const { data } = await api.get('/media', { params });
    return data;
  },

  generatePresignedUrl: async (filename: string, contentType: string, folder?: string): Promise<{ url: string, key: string, publicUrl: string }> => {
    const { data } = await api.post('/media/presigned-url', { filename, contentType, folder });
    return data;
  },

import axios from 'axios';

  uploadToS3: async (presignedUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
  },

  createMediaRecord: async (payload: {
    name: string;
    type: string;
    folder: string;
    size: number;
    url: string;
    key: string;
  }): Promise<MediaFile> => {
    const { data } = await api.post('/media', payload);
    return data;
  },

  deleteMediaFile: async (id: string): Promise<void> => {
    await api.delete(`/media/${id}`);
  },

  syncS3: async (): Promise<{ added: number }> => {
    const { data } = await api.post('/media/sync-s3');
    return data;
  }
};
