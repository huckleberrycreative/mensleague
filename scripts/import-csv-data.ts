/**
 * Script to import CSV data into Supabase database
 * Run this after setting up your Supabase database with the migration
 *
 * Usage: ts-node scripts/import-csv-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// CSV parsing helper
function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  return lines.map(line => {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    return values;
  });
}

async function importTeams() {
  console.log('Importing teams...');

  const teamNames = new Set([
    'Ben', 'Aicklen', 'Hobart', 'Carlos', 'Bill', 'Dino',
    'James', 'Blake', 'Johnny', 'Jackson', 'William',
    'FA' // Free Agent
  ]);

  const teams = Array.from(teamNames).map(name => ({
    name,
    owner_name: name !== 'FA' ? name : null
  }));

  const { error } = await supabase.from('teams').upsert(teams, {
    onConflict: 'name'
  });

  if (error) {
    console.error('Error importing teams:', error);
  } else {
    console.log(`✓ Imported ${teams.length} teams`);
  }
}

async function importSeasons() {
  console.log('Importing seasons...');

  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const seasons = years.map(year => ({
    year,
    is_active: year === 2025
  }));

  const { error } = await supabase.from('seasons').upsert(seasons, {
    onConflict: 'year'
  });

  if (error) {
    console.error('Error importing seasons:', error);
  } else {
    console.log(`✓ Imported ${seasons.length} seasons`);
  }
}

async function importRegularSeasonStandings() {
  console.log('Importing regular season standings...');

  // Read CSV file
  const csvPath = path.join(__dirname, '../data/Historic Regular Season Standings.csv');
  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);

  // Get teams and seasons from database
  const { data: teams } = await supabase.from('teams').select('id, name');
  const { data: seasons } = await supabase.from('seasons').select('id, year');

  if (!teams || !seasons) {
    console.error('Failed to fetch teams or seasons');
    return;
  }

  const teamMap = new Map(teams.map(t => [t.name, t.id]));
  const seasonMap = new Map(seasons.map(s => [s.year, s.id]));

  const standings = [];
  let currentYear: number | null = null;

  for (const row of rows) {
    // Check if this is a season header row
    const yearMatch = row[0]?.match(/(\d{4}) SEASON/);
    if (yearMatch) {
      currentYear = parseInt(yearMatch[1]);
      continue;
    }

    // Skip header rows and empty rows
    if (!row[1] || row[1] === 'Name' || row[1].includes('NO LONGER IN LEAGUE')) {
      continue;
    }

    if (currentYear && seasonMap.has(currentYear)) {
      const teamName = row[1];
      const teamId = teamMap.get(teamName);

      if (teamId) {
        standings.push({
          season_id: seasonMap.get(currentYear),
          team_id: teamId,
          rank: parseInt(row[0]) || 0,
          points_accumulated: parseInt(row[2]) || null,
          wins: parseInt(row[3]) || null,
          losses: parseInt(row[4]) || null,
          winning_percentage: parseFloat(row[5]?.replace('%', '')) || null,
          total_points_for: parseInt(row[6]) || null,
          average_ppw: parseFloat(row[7]) || null,
          median_ppw: parseFloat(row[8]) || null,
          average_finish: parseFloat(row[9]) || null,
        });
      }
    }
  }

  if (standings.length > 0) {
    const { error } = await supabase.from('regular_season_standings').upsert(standings, {
      onConflict: 'season_id,team_id'
    });

    if (error) {
      console.error('Error importing standings:', error);
    } else {
      console.log(`✓ Imported ${standings.length} standing records`);
    }
  }
}

async function importPlayers() {
  console.log('Importing players and salaries...');

  // Read CSV file
  const csvPath = path.join(__dirname, '../data/Player Salaries.csv');
  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);

  // Get teams from database
  const { data: teams } = await supabase.from('teams').select('id, name');
  if (!teams) {
    console.error('Failed to fetch teams');
    return;
  }

  const teamMap = new Map(teams.map(t => [t.name, t.id]));

  const players = [];
  const salaries = [];

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[7] || !row[8]) continue; // Skip if no name

    const firstName = row[7];
    const lastName = row[8];
    const fullName = row[9];
    const position = row[2];
    const teamName = row[1];

    // Create player record
    const player = {
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      position: position,
    };

    players.push(player);
  }

  // Insert players first
  const { data: insertedPlayers, error: playerError } = await supabase
    .from('players')
    .upsert(players, { onConflict: 'full_name' })
    .select();

  if (playerError) {
    console.error('Error importing players:', playerError);
    return;
  }

  console.log(`✓ Imported ${insertedPlayers.length} players`);

  // Create a map of full names to player IDs
  const playerMap = new Map(insertedPlayers.map(p => [p.full_name, p.id]));

  // Now insert salaries
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[9]) continue;

    const fullName = row[9];
    const teamName = row[1];
    const playerId = playerMap.get(fullName);
    const teamId = teamMap.get(teamName);

    if (playerId) {
      salaries.push({
        player_id: playerId,
        team_id: teamId || null,
        number: parseInt(row[0]) || null,
        franchise_tag: row[3] === 'YES',
        contract_year: row[4] || null,
        rookie_draft_round: row[5] || null,
        acquired_via_waivers: row[6] === 'YES',
        salary_2025: row[10] || null,
        salary_2026: row[11] || null,
        salary_2027: row[12] || null,
        salary_2028: row[13] || null,
      });
    }
  }

  if (salaries.length > 0) {
    const { error: salaryError } = await supabase
      .from('player_salaries')
      .upsert(salaries, { onConflict: 'player_id' });

    if (salaryError) {
      console.error('Error importing salaries:', salaryError);
    } else {
      console.log(`✓ Imported ${salaries.length} salary records`);
    }
  }
}

async function main() {
  console.log('Starting data import...\n');

  try {
    await importTeams();
    await importSeasons();
    await importRegularSeasonStandings();
    await importPlayers();

    console.log('\n✅ Data import completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during import:', error);
    process.exit(1);
  }
}

main();
