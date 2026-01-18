import { supabase } from "@/integrations/supabase/client";

export interface Season {
  id: string;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const seasonsApi = {
  // Get all seasons
  async getAll() {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;
    return data as Season[];
  },

  // Get active season
  async getActive() {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data as Season;
  },

  // Get single season
  async getById(id: string) {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Season;
  },

  // Create season
  async create(season: Omit<Season, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('seasons')
      .insert([season])
      .select()
      .single();

    if (error) throw error;
    return data as Season;
  },

  // Update season
  async update(id: string, updates: Partial<Omit<Season, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('seasons')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Season;
  },

  // Delete season
  async delete(id: string) {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
