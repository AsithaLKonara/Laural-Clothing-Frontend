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

export const mediaService = {
  getMediaFiles: async (folder?: string): Promise<MediaFile[]> => {
    const params = folder && folder !== 'All' ? { folder } : {};
    const { data } = await api.get('/media', { params });
    return data;
  },

  generatePresignedUrl: async (filename: string, contentType: string, folder?: string): Promise<{ url: string, key: string, publicUrl: string }> => {
    const { data } = await api.post('/media/presigned-url', { filename, contentType, folder });
    return data;
  },

  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
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
};
