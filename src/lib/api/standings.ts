import { supabase } from "@/integrations/supabase/client";

export interface RegularSeasonStanding {
  id: string;
  season_id: string;
  team_id: string;
  rank: number;
  points_accumulated?: number;
  wins?: number;
  losses?: number;
  winning_percentage?: number;
  total_points_for?: number;
  average_ppw?: number;
  median_ppw?: number;
  average_finish?: number;
  created_at: string;
  updated_at: string;
}

export const standingsApi = {
  // Get all standings
  async getAll() {
    const { data, error } = await supabase
      .from('regular_season_standings')
      .select(`
        *,
        season:seasons(*),
        team:teams(*)
      `)
      .order('rank');

    if (error) throw error;
    return data;
  },

  // Get standings by season
  async getBySeason(seasonId: string) {
    const { data, error } = await supabase
      .from('regular_season_standings')
      .select(`
        *,
        team:teams(*)
      `)
      .eq('season_id', seasonId)
      .order('rank');

    if (error) throw error;
    return data;
  },

  // Get standings by team
  async getByTeam(teamId: string) {
    const { data, error } = await supabase
      .from('regular_season_standings')
      .select(`
        *,
        season:seasons(*)
      `)
      .eq('team_id', teamId)
      .order('season.year', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create standing
  async create(standing: Omit<RegularSeasonStanding, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('regular_season_standings')
      .insert([standing])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update standing
  async update(id: string, updates: Partial<Omit<RegularSeasonStanding, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('regular_season_standings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete standing
  async delete(id: string) {
    const { error } = await supabase
      .from('regular_season_standings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
