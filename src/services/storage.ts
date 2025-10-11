import { supabase } from '../config/supabase';

export type StorageBucket = 'user-avatars' | 'project-thumbnails' | 'project-exports' | 'project-assets';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class StorageService {
  static async uploadFile(
    bucket: StorageBucket,
    path: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('File upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  static async uploadBase64Image(
    bucket: StorageBucket,
    path: string,
    base64Data: string,
    contentType: string = 'image/png'
  ): Promise<string> {
    try {
      const base64WithoutPrefix = base64Data.split(',')[1] || base64Data;
      const buffer = Uint8Array.from(atob(base64WithoutPrefix), c => c.charCodeAt(0));

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, buffer, {
          contentType,
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Base64 upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  static async deleteFile(bucket: StorageBucket, path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    } catch (error: any) {
      console.error('File deletion error:', error);
      throw new Error('Failed to delete file');
    }
  }

  static async getPublicUrl(bucket: StorageBucket, path: string): Promise<string> {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Get public URL error:', error);
      throw new Error('Failed to get file URL');
    }
  }

  static async getSignedUrl(
    bucket: StorageBucket,
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;

      return data.signedUrl;
    } catch (error: any) {
      console.error('Get signed URL error:', error);
      throw new Error('Failed to get signed URL');
    }
  }

  static async listFiles(bucket: StorageBucket, folder: string = ''): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('List files error:', error);
      throw new Error('Failed to list files');
    }
  }

  static extractPathFromUrl(url: string, bucket: StorageBucket): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${bucket}/`);
      return pathParts[1] || '';
    } catch (error) {
      console.error('Path extraction error:', error);
      return '';
    }
  }

  static async uploadProjectThumbnail(
    userId: string,
    projectId: string,
    imageData: string
  ): Promise<string> {
    const path = `${userId}/${projectId}/thumbnail_${Date.now()}.png`;
    return this.uploadBase64Image('project-thumbnails', path, imageData);
  }

  static async uploadUserAvatar(userId: string, file: File): Promise<string> {
    const path = `${userId}/avatar_${Date.now()}`;
    return this.uploadFile('user-avatars', path, file);
  }

  static async uploadProjectExport(
    userId: string,
    projectId: string,
    file: Blob,
    format: string
  ): Promise<string> {
    try {
      const fileName = `${userId}/${projectId}/export_${Date.now()}.${format}`;

      const { data, error } = await supabase.storage
        .from('project-exports')
        .upload(fileName, file, {
          contentType: this.getContentType(format),
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('project-exports')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Export upload error:', error);
      throw new Error('Failed to upload export');
    }
  }

  private static getContentType(format: string): string {
    const contentTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      mp4: 'video/mp4',
      webm: 'video/webm',
      gif: 'image/gif'
    };

    return contentTypes[format.toLowerCase()] || 'application/octet-stream';
  }
}
