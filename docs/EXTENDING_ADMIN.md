# Extending the Admin CMS

This guide explains how to add new admin pages and features to your CMS.

## Adding a New Admin Page

Follow these steps to add a new admin management page (e.g., for Standings, Playoffs, etc.):

### 1. Create the Page Component

Create a new file in `src/pages/admin/`, for example `Standings.tsx`:

```typescript
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { standingsApi } from '@/lib/api/standings';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Standings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: standings, isLoading } = useQuery({
    queryKey: ['standings'],
    queryFn: standingsApi.getAll,
  });

  // Add your CRUD operations here

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Standings Management</h1>
      {/* Add your UI here */}
    </div>
  );
}
```

### 2. Add the Route

Update `src/App.tsx`:

```typescript
// Import your new page
import AdminStandings from "./pages/admin/Standings";

// Add to the admin routes section
<Route path="/admin" element={...}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="teams" element={<AdminTeams />} />
  <Route path="standings" element={<AdminStandings />} /> {/* NEW */}
  <Route path="blog" element={<AdminBlog />} />
  {/* ... other routes */}
</Route>
```

### 3. Add to Sidebar Navigation

Update `src/components/layout/AdminLayout.tsx`:

The navigation is already set up! Just verify your new page's icon and label are in the `navItems` array.

## Common Patterns

### CRUD Operations Template

```typescript
const createMutation = useMutation({
  mutationFn: yourApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['your-data'] });
    toast({ title: 'Created successfully' });
  },
});

const updateMutation = useMutation({
  mutationFn: ({ id, data }) => yourApi.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['your-data'] });
    toast({ title: 'Updated successfully' });
  },
});

const deleteMutation = useMutation({
  mutationFn: yourApi.delete,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['your-data'] });
    toast({ title: 'Deleted successfully' });
  },
});
```

### Form Dialog Pattern

```typescript
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogTrigger asChild>
    <Button>Add New</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Item</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <Button type="submit">Save</Button>
    </form>
  </DialogContent>
</Dialog>
```

### Data Table Pattern

```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data?.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.value}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Available UI Components

Your admin panel has access to all shadcn-ui components:

- **Forms**: Input, Textarea, Select, Checkbox, Radio
- **Feedback**: Toast, Alert, Badge, Progress
- **Overlays**: Dialog, Sheet, Popover, Tooltip
- **Data**: Table, Card, Tabs
- **Navigation**: Button, Dropdown Menu
- **Layout**: Separator, Scroll Area

See `/src/components/ui/` for all available components.

## API Helpers

### Creating a New API Module

Create a new file in `src/lib/api/`, for example `seasons.ts`:

```typescript
import { supabase } from "@/integrations/supabase/client";

export interface Season {
  id: string;
  year: number;
  is_active: boolean;
  // ... other fields
}

export const seasonsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;
    return data as Season[];
  },

  async create(season: Omit<Season, 'id'>) {
    const { data, error } = await supabase
      .from('seasons')
      .insert([season])
      .select()
      .single();

    if (error) throw error;
    return data as Season;
  },

  async update(id: string, updates: Partial<Season>) {
    const { data, error } = await supabase
      .from('seasons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Season;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
```

## Adding Database Tables

If you need to add new tables:

### 1. Create Migration SQL

Create a new file: `supabase/migrations/002_add_new_table.sql`

```sql
CREATE TABLE IF NOT EXISTS your_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read" ON your_table FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage" ON your_table FOR ALL
  USING (auth.role() = 'authenticated');
```

### 2. Run Migration

Go to Supabase SQL Editor and run your new migration.

### 3. Create TypeScript Types

Add types to your API module based on the table structure.

## Best Practices

1. **Always use React Query** for data fetching and mutations
2. **Invalidate queries** after mutations to refresh data
3. **Show loading states** while data is being fetched
4. **Handle errors** and show user-friendly messages
5. **Use the useToast hook** for feedback
6. **Validate form inputs** before submission
7. **Confirm destructive actions** (like delete)
8. **Keep API logic separate** from UI components

## Example: Complete Admin Page

Here's a minimal but complete example:

```typescript
// src/pages/admin/Seasons.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seasonsApi, Season } from '@/lib/api/seasons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Seasons() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [year, setYear] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: seasons, isLoading } = useQuery({
    queryKey: ['seasons'],
    queryFn: seasonsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: seasonsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      setIsDialogOpen(false);
      setYear('');
      toast({ title: 'Season created' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: seasonsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      toast({ title: 'Season deleted' });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Seasons</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Season</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Season</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate({ year: parseInt(year), is_active: false });
            }}>
              <Input
                type="number"
                placeholder="2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
              <Button type="submit" className="mt-4">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasons?.map((season) => (
              <TableRow key={season.id}>
                <TableCell>{season.year}</TableCell>
                <TableCell>{season.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Delete this season?')) {
                        deleteMutation.mutate(season.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
```

## Need Help?

- Check existing admin pages in `src/pages/admin/` for reference
- Review the API modules in `src/lib/api/` for patterns
- Look at shadcn-ui docs: https://ui.shadcn.com
- Check React Query docs: https://tanstack.com/query/latest

Happy coding! 🚀
