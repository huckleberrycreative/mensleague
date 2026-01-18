import { supabase } from "@/integrations/supabase/client";

export interface Media {
  id: string;
  filename: string;
  original_filename: string;
  mime_type?: string;
  size_bytes?: number;
  url: string;
  alt_text?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export const mediaApi = {
  // Get all media
  async getAll() {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Media[];
  },

  // Get media by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Media;
  },

  // Upload file
  async upload(file: File) {
    const { data: { user } } = await supabase.auth.getUser();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Save media record to database
    const { data, error } = await supabase
      .from('media')
      .insert([{
        filename: fileName,
        original_filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        url: publicUrl,
        uploaded_by: user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Media;
  },

  // Update media metadata
  async update(id: string, updates: Partial<Pick<Media, 'alt_text'>>) {
    const { data, error } = await supabase
      .from('media')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Media;
  },

  // Delete media
  async delete(id: string) {
    // Get media record
    const media = await this.getById(id);

    // Delete from storage
    const filePath = `uploads/${media.filename}`;
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
