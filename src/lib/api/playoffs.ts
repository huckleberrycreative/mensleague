import { supabase } from "@/integrations/supabase/client";

export interface PlayoffOutcome {
  id: string;
  season_id: string;
  team_id: string;
  rank: number;
  semifinal_score?: number;
  is_finalist: boolean;
  finals_score?: number;
  created_at: string;
  updated_at: string;
}

export interface PlayoffStatistic {
  id: string;
  team_id: string;
  playoff_appearances: number;
  total_seasons: number;
  playoffs_percentage?: number;
  playoff_wins: number;
  playoff_losses: number;
  playoff_win_percentage?: number;
  finals_appearances: number;
  finals_wins: number;
  finals_losses: number;
  finals_win_percentage?: number;
  created_at: string;
  updated_at: string;
}

export const playoffsApi = {
  // Get all playoff outcomes
  async getAllOutcomes() {
    const { data, error } = await supabase
      .from('playoff_outcomes')
      .select(`
        *,
        season:seasons(*),
        team:teams(*)
      `)
      .order('rank');

    if (error) throw error;
    return data;
  },

  // Get playoff outcomes by season
  async getOutcomesBySeason(seasonId: string) {
    const { data, error } = await supabase
      .from('playoff_outcomes')
      .select(`
        *,
        team:teams(*)
      `)
      .eq('season_id', seasonId)
      .order('rank');

    if (error) throw error;
    return data;
  },

  // Create playoff outcome
  async createOutcome(outcome: Omit<PlayoffOutcome, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('playoff_outcomes')
      .insert([outcome])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update playoff outcome
  async updateOutcome(id: string, updates: Partial<Omit<PlayoffOutcome, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('playoff_outcomes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete playoff outcome
  async deleteOutcome(id: string) {
    const { error } = await supabase
      .from('playoff_outcomes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get all playoff statistics
  async getAllStatistics() {
    const { data, error } = await supabase
      .from('playoff_statistics')
      .select(`
        *,
        team:teams(*)
      `);

    if (error) throw error;
    return data;
  },

  // Get playoff statistics by team
  async getStatisticsByTeam(teamId: string) {
    const { data, error } = await supabase
      .from('playoff_statistics')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (error) throw error;
    return data;
  },

  // Upsert playoff statistics
  async upsertStatistics(stats: Omit<PlayoffStatistic, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('playoff_statistics')
      .upsert([{ ...stats, updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
