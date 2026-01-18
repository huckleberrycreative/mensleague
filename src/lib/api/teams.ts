import { supabase } from "@/integrations/supabase/client";

export interface Team {
  id: string;
  name: string;
  owner_name?: string;
  created_at: string;
  updated_at: string;
}

export const teamsApi = {
  // Get all teams
  async getAll() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Team[];
  },

  // Get single team
  async getById(id: string) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Team;
  },

  // Create team
  async create(team: Omit<Team, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('teams')
      .insert([team])
      .select()
      .single();

    if (error) throw error;
    return data as Team;
  },

  // Update team
  async update(id: string, updates: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('teams')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Team;
  },

  // Delete team
  async delete(id: string) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
