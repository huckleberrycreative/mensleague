import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageContentSection {
  id: string;
  page_slug: string;
  section_key: string;
  content: string;
  content_type: 'text' | 'html' | 'list';
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Fetch all content for a specific page
export const usePageContent = (pageSlug: string) => {
  return useQuery({
    queryKey: ['page-content', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as PageContentSection[];
    },
  });
};

// Helper to get a specific section's content
export const usePageSection = (pageSlug: string, sectionKey: string) => {
  const { data, isLoading, error } = usePageContent(pageSlug);
  
  const section = data?.find(s => s.section_key === sectionKey);
  
  return {
    content: section?.content || '',
    contentType: section?.content_type || 'text',
    isLoading,
    error,
    exists: !!section,
  };
};

// Get content as a map for easy access
export const usePageContentMap = (pageSlug: string) => {
  const { data, isLoading, error } = usePageContent(pageSlug);
  
  const contentMap = data?.reduce((acc, section) => {
    acc[section.section_key] = section.content;
    return acc;
  }, {} as Record<string, string>) || {};
  
  return {
    content: contentMap,
    sections: data || [],
    isLoading,
    error,
    get: (key: string, fallback: string = '') => contentMap[key] || fallback,
  };
};

// Mutation to update content
export const useUpdatePageContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      pageSlug, 
      sectionKey, 
      content, 
      contentType = 'text',
      displayOrder = 0
    }: { 
      pageSlug: string; 
      sectionKey: string; 
      content: string; 
      contentType?: string;
      displayOrder?: number;
    }) => {
      const { data, error } = await supabase
        .from('page_content')
        .upsert({
          page_slug: pageSlug,
          section_key: sectionKey,
          content,
          content_type: contentType,
          display_order: displayOrder,
        }, {
          onConflict: 'page_slug,section_key',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['page-content', variables.pageSlug] });
    },
  });
};

// Mutation to delete content
export const useDeletePageContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, pageSlug }: { id: string; pageSlug: string }) => {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id, pageSlug };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['page-content', result.pageSlug] });
    },
  });
};

// Fetch all pages that have content
export const useAllPageContent = () => {
  return useQuery({
    queryKey: ['page-content', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as PageContentSection[];
    },
  });
};
