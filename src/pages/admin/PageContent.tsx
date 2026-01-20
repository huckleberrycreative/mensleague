import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileText, Save } from 'lucide-react';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
import { PageContentSection } from '@/hooks/usePageContent';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Define the pages and their editable sections
const PAGE_DEFINITIONS = {
  manifesto: {
    name: 'The Manifesto',
    route: '/manifesto',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'origin_title', label: 'Origin Section Title', type: 'text' },
      { key: 'origin_content', label: 'Origin Story Content', type: 'html' },
      { key: 'beliefs_title', label: 'Beliefs Section Title', type: 'text' },
      { key: 'belief_1_title', label: 'Belief 1 Title', type: 'text' },
      { key: 'belief_1_content', label: 'Belief 1 Content', type: 'text' },
      { key: 'belief_2_title', label: 'Belief 2 Title', type: 'text' },
      { key: 'belief_2_content', label: 'Belief 2 Content', type: 'text' },
      { key: 'belief_3_title', label: 'Belief 3 Title', type: 'text' },
      { key: 'belief_3_content', label: 'Belief 3 Content', type: 'text' },
      { key: 'belief_4_title', label: 'Belief 4 Title', type: 'text' },
      { key: 'belief_4_content', label: 'Belief 4 Content', type: 'text' },
      { key: 'belief_5_title', label: 'Belief 5 Title', type: 'text' },
      { key: 'belief_5_content', label: 'Belief 5 Content', type: 'text' },
      { key: 'founders_quote', label: "Founder's Quote", type: 'text' },
      { key: 'founders_attribution', label: 'Quote Attribution', type: 'text' },
      { key: 'closing', label: 'Closing Message', type: 'text' },
      { key: 'closing_tagline', label: 'Closing Tagline', type: 'text' },
    ],
  },
  constitution: {
    name: 'The Constitution',
    route: '/constitution',
    sections: [
      { key: 'preamble', label: 'Preamble', type: 'html' },
      { key: 'article_1', label: 'Article I: League Structure', type: 'html' },
      { key: 'article_2', label: 'Article II: Scoring', type: 'html' },
      { key: 'article_3', label: 'Article III: Playoffs', type: 'html' },
      { key: 'article_4', label: 'Article IV: Draft', type: 'html' },
      { key: 'article_5', label: 'Article V: Salaries & Contracts', type: 'html' },
      { key: 'article_6', label: 'Article VI: Trades', type: 'html' },
      { key: 'article_7', label: 'Article VII: Conduct', type: 'html' },
      { key: 'article_8', label: 'Article VIII: Amendments', type: 'html' },
      { key: 'ratification', label: 'Ratification Text', type: 'text' },
    ],
  },
  lore: {
    name: 'League Lore',
    route: '/lore',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
    ],
  },
  'meet-the-league': {
    name: 'Meet The League',
    route: '/meet-the-league',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
    ],
  },
  'rivalry-week': {
    name: 'Rivalry Week',
    route: '/rivalry-week',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
    ],
  },
  pantheon: {
    name: 'The Pantheon',
    route: '/pantheon',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'apex_title', label: 'Apex Tier Title', type: 'text' },
      { key: 'elite_title', label: 'Elite Tier Title', type: 'text' },
      { key: 'notable_title', label: 'Notable Mentions Title', type: 'text' },
    ],
  },
};

type PageSlug = keyof typeof PAGE_DEFINITIONS;

const PageContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<PageSlug>('manifesto');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all page content
  const { data: allContent, isLoading } = useQuery({
    queryKey: ['page-content', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug')
        .order('display_order');

      if (error) throw error;
      return data as PageContentSection[];
    },
  });

  // Get content for current page
  const pageContent = allContent?.filter(c => c.page_slug === selectedPage) || [];
  const contentMap = pageContent.reduce((acc, c) => {
    acc[c.section_key] = c;
    return acc;
  }, {} as Record<string, PageContentSection>);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async ({ pageSlug, sectionKey, content, contentType }: { 
      pageSlug: string; 
      sectionKey: string; 
      content: string; 
      contentType: string;
    }) => {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_slug: pageSlug,
          section_key: sectionKey,
          content,
          content_type: contentType,
          display_order: PAGE_DEFINITIONS[pageSlug as PageSlug]?.sections.findIndex(s => s.key === sectionKey) || 0,
        }, {
          onConflict: 'page_slug,section_key',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast({ title: 'Content saved!' });
      setIsDialogOpen(false);
      setEditingSection(null);
    },
    onError: (error) => {
      toast({ title: 'Error saving content', description: String(error), variant: 'destructive' });
    },
  });

  const handleEdit = (sectionKey: string) => {
    const existing = contentMap[sectionKey];
    setEditContent(existing?.content || '');
    setEditingSection(sectionKey);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingSection) return;
    
    const sectionDef = PAGE_DEFINITIONS[selectedPage].sections.find(s => s.key === editingSection);
    
    saveMutation.mutate({
      pageSlug: selectedPage,
      sectionKey: editingSection,
      content: editContent,
      contentType: sectionDef?.type || 'text',
    });
  };

  const currentPageDef = PAGE_DEFINITIONS[selectedPage];
  const editingSectionDef = currentPageDef?.sections.find(s => s.key === editingSection);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Page Content Editor</h1>
        <p className="text-muted-foreground">
          Edit the text content of your static pages. The page layouts and designs are preserved.
        </p>
      </div>

      {/* Page Selector */}
      <div className="flex gap-4 items-center">
        <Label>Select Page:</Label>
        <Select value={selectedPage} onValueChange={(v) => setSelectedPage(v as PageSlug)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PAGE_DEFINITIONS).map(([slug, def]) => (
              <SelectItem key={slug} value={slug}>
                {def.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <a 
          href={currentPageDef.route} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Preview page →
        </a>
      </div>

      {/* Content Sections */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Section</TableHead>
              <TableHead>Current Content</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageDef.sections.map((section) => {
              const existing = contentMap[section.key];
              const hasContent = !!existing?.content;
              
              return (
                <TableRow key={section.key}>
                  <TableCell className="font-medium">
                    <div>
                      {section.label}
                      <span className="text-xs text-muted-foreground block">
                        {section.type === 'html' ? 'Rich text' : 'Plain text'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate text-sm text-muted-foreground">
                      {existing?.content ? (
                        <span dangerouslySetInnerHTML={{ 
                          __html: existing.content.substring(0, 100) + (existing.content.length > 100 ? '...' : '') 
                        }} />
                      ) : (
                        <span className="italic">Using default content</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      hasContent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {hasContent ? 'Custom' : 'Default'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(section.key)}
                    >
                      <Edit size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit: {editingSectionDef?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingSectionDef?.type === 'html' ? (
              <WysiwygEditor
                content={editContent}
                onChange={setEditContent}
                placeholder="Enter content..."
                className="min-h-[300px]"
              />
            ) : (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Enter content..."
                className="w-full min-h-[150px] p-3 border rounded-md resize-y"
              />
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageContent;
