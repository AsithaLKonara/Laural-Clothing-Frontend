import { api } from './api';
import axios from 'axios';

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

  uploadMedia: async (file: File, folder?: string, onProgress?: (progress: number) => void): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const { data } = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return data;
  },

  deleteMediaFile: async (id: string): Promise<void> => {
    await api.delete(`/media/${id}`);
  },

  syncLocal: async (): Promise<{ added: number }> => {
    const { data } = await api.post('/media/sync-s3'); // Keeps old path for backwards compatibility
    return data;
  }
};
