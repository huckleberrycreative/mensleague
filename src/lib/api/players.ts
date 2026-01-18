import { supabase } from "@/integrations/supabase/client";

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  position: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerSalary {
  id: string;
  player_id: string;
  team_id?: string;
  number?: number;
  franchise_tag: boolean;
  contract_year?: string;
  rookie_draft_round?: string;
  acquired_via_waivers: boolean;
  salary_2025?: string;
  salary_2026?: string;
  salary_2027?: string;
  salary_2028?: string;
  created_at: string;
  updated_at: string;
}

export const playersApi = {
  // Get all players
  async getAll() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('last_name');

    if (error) throw error;
    return data as Player[];
  },

  // Get player with salary info
  async getWithSalary(playerId: string) {
    const { data, error } = await supabase
      .from('players')
      .select(`
        *,
        salary:player_salaries(*),
        team:player_salaries(team:teams(*))
      `)
      .eq('id', playerId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create player
  async create(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('players')
      .insert([player])
      .select()
      .single();

    if (error) throw error;
    return data as Player;
  },

  // Update player
  async update(id: string, updates: Partial<Omit<Player, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('players')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Player;
  },

  // Delete player
  async delete(id: string) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const salariesApi = {
  // Get all salaries with player and team info
  async getAll() {
    const { data, error } = await supabase
      .from('player_salaries')
      .select(`
        *,
        player:players(*),
        team:teams(*)
      `)
      .order('number');

    if (error) throw error;
    return data;
  },

  // Get salaries by team
  async getByTeam(teamId: string) {
    const { data, error } = await supabase
      .from('player_salaries')
      .select(`
        *,
        player:players(*)
      `)
      .eq('team_id', teamId);

    if (error) throw error;
    return data;
  },

  // Create or update salary
  async upsert(salary: Omit<PlayerSalary, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('player_salaries')
      .upsert([{ ...salary, updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete salary
  async delete(id: string) {
    const { error } = await supabase
      .from('player_salaries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
