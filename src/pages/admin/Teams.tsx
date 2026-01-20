import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi, Team } from '@/lib/api/teams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Upload, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeamFormData {
  name: string;
  owner_name: string;
  shield_bio: string;
  governor_response: string;
  highest_high: string;
  lowest_low: string;
  profile_image_url: string;
}

const emptyFormData: TeamFormData = {
  name: '',
  owner_name: '',
  shield_bio: '',
  governor_response: '',
  highest_high: '',
  lowest_low: '',
  profile_image_url: '',
};

export default function Teams() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<TeamFormData>(emptyFormData);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: teamsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['governor-stats'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Team created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TeamFormData> }) => {
      const { error } = await supabase
        .from('teams')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['governor-stats'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Team updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teamsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['governor-stats'] });
      toast({ title: 'Team deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingTeam(null);
  };

  const handleEdit = (team: any) => {
    setEditingTeam(team);
    setFormData({
      name: team.name || '',
      owner_name: team.owner_name || '',
      shield_bio: team.shield_bio || '',
      governor_response: team.governor_response || '',
      highest_high: team.highest_high || '',
      lowest_low: team.lowest_low || '',
      profile_image_url: team.profile_image_url || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam) {
      updateMutation.mutate({ id: editingTeam.id, data: formData });
    } else {
      createMutation.mutate({ name: formData.name, owner_name: formData.owner_name });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please upload an image file', variant: 'destructive' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please upload an image smaller than 5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${editingTeam?.id || 'new'}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('governor-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('governor-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, profile_image_url: urlData.publicUrl });
      toast({ title: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teams & Governor Profiles</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTeam ? 'Edit Team & Governor Profile' : 'Add New Team'}
              </DialogTitle>
              <DialogDescription>
                {editingTeam
                  ? 'Update the team information and governor profile'
                  : 'Create a new team for the league'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="profile" disabled={!editingTeam}>Governor Profile</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Team Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner_name">Governor Name</Label>
                    <Input
                      id="owner_name"
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="space-y-4 mt-4">
                  {/* Profile Image */}
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                        {formData.profile_image_url ? (
                          <img 
                            src={formData.profile_image_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </>
                          )}
                        </Button>
                        {formData.profile_image_url && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-2 text-destructive"
                            onClick={() => setFormData({ ...formData, profile_image_url: '' })}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shield Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="shield_bio">Official Shield Bio</Label>
                    <Textarea
                      id="shield_bio"
                      value={formData.shield_bio}
                      onChange={(e) => setFormData({ ...formData, shield_bio: e.target.value })}
                      placeholder="The official biographical summary for this governor..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">Leave blank to use auto-generated bio based on stats.</p>
                  </div>

                  {/* Governor Response */}
                  <div className="space-y-2">
                    <Label htmlFor="governor_response">Governor's Response to the Shield's Bio</Label>
                    <Textarea
                      id="governor_response"
                      value={formData.governor_response}
                      onChange={(e) => setFormData({ ...formData, governor_response: e.target.value })}
                      placeholder="The governor's personal response or commentary..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Leave blank to use auto-generated response.</p>
                  </div>

                  {/* Highest High */}
                  <div className="space-y-2">
                    <Label htmlFor="highest_high">Highest High</Label>
                    <Textarea
                      id="highest_high"
                      value={formData.highest_high}
                      onChange={(e) => setFormData({ ...formData, highest_high: e.target.value })}
                      placeholder="Their greatest achievement or moment..."
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">Leave blank to use auto-generated content.</p>
                  </div>

                  {/* Lowest Low */}
                  <div className="space-y-2">
                    <Label htmlFor="lowest_low">Lowest Low</Label>
                    <Textarea
                      id="lowest_low"
                      value={formData.lowest_low}
                      onChange={(e) => setFormData({ ...formData, lowest_low: e.target.value })}
                      placeholder="Their toughest moment or worst performance..."
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">Leave blank to use auto-generated content.</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTeam ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Photo</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Governor</TableHead>
                <TableHead>Profile Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams?.map((team: any) => {
                const hasProfile = team.shield_bio || team.governor_response || team.highest_high || team.lowest_low;
                return (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {team.profile_image_url ? (
                          <img 
                            src={team.profile_image_url} 
                            alt={team.owner_name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.owner_name || '—'}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        hasProfile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {hasProfile ? 'Custom Profile' : 'Auto-generated'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(team)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(team.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {teams?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No teams yet. Add your first team to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
