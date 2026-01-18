import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi, Media as MediaType } from '@/lib/api/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Media() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingPreview, setUploadingPreview] = useState<string | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaType | null>(null);
  const [altText, setAltText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: mediaApi.getAll,
  });

  const uploadMutation = useMutation({
    mutationFn: mediaApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setSelectedFile(null);
      setUploadingPreview(null);
      toast({ title: 'File uploaded successfully' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setUploadingPreview(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { alt_text?: string } }) =>
      mediaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setEditingMedia(null);
      setAltText('');
      toast({ title: 'Media updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: mediaApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast({ title: 'Media deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadingPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleEdit = (media: MediaType) => {
    setEditingMedia(media);
    setAltText(media.alt_text || '');
  };

  const handleUpdateAltText = () => {
    if (editingMedia) {
      updateMutation.mutate({ id: editingMedia.id, data: { alt_text: altText } });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this media file?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'URL copied to clipboard' });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Media Library</h1>
      </div>

      {/* Upload Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Upload New Media</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  className="max-w-md"
                />
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
            {uploadingPreview && (
              <div className="mt-4">
                <img
                  src={uploadingPreview}
                  alt="Preview"
                  className="max-w-xs rounded-lg border"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {mediaItems && mediaItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mediaItems.map((media) => (
                <Card key={media.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {media.mime_type?.startsWith('image/') ? (
                      <img
                        src={media.url}
                        alt={media.alt_text || media.original_filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-gray-500">
                          {media.mime_type}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm truncate">
                      {media.original_filename}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(media.size_bytes)}
                    </p>
                    {media.alt_text && (
                      <p className="text-xs text-gray-600 mt-1 italic">
                        {media.alt_text}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyUrl(media.url, media.id)}
                        className="flex-1"
                      >
                        {copiedId === media.id ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        {copiedId === media.id ? 'Copied' : 'Copy URL'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(media)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(media.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-500">
                  No media files yet. Upload your first file to get started.
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingMedia} onOpenChange={() => setEditingMedia(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>
              Update the alt text for this media file
            </DialogDescription>
          </DialogHeader>
          {editingMedia && (
            <div className="space-y-4">
              {editingMedia.mime_type?.startsWith('image/') && (
                <img
                  src={editingMedia.url}
                  alt={editingMedia.alt_text || editingMedia.original_filename}
                  className="w-full rounded-lg"
                />
              )}
              <div className="space-y-2">
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe this image..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingMedia(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateAltText}>Update</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
