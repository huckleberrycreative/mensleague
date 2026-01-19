import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (error || !page) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />
        </article>
      </div>
    </Layout>
  );
}
