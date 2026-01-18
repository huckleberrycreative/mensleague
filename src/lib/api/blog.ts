import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  author_id?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export const blogApi = {
  // Get all posts
  async getAll() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as BlogPost[];
  },

  // Get published posts only
  async getPublished() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data as BlogPost[];
  },

  // Get post by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  // Get post by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  // Create post
  async create(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{ ...post, author_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  // Update post
  async update(id: string, updates: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  // Publish post
  async publish(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  // Unpublish post
  async unpublish(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        published: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  // Delete post
  async delete(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
