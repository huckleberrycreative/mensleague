CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  owner_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS regular_season_standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  points_accumulated INTEGER,
  wins INTEGER,
  losses INTEGER,
  winning_percentage DECIMAL(5,2),
  total_points_for INTEGER,
  average_ppw DECIMAL(6,2),
  median_ppw DECIMAL(6,2),
  average_finish DECIMAL(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, team_id)
);

CREATE TABLE IF NOT EXISTS playoff_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  semifinal_score DECIMAL(6,2),
  is_finalist BOOLEAN DEFAULT FALSE,
  finals_score DECIMAL(6,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, team_id)
);

CREATE TABLE IF NOT EXISTS playoff_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  playoff_appearances INTEGER DEFAULT 0,
  total_seasons INTEGER DEFAULT 0,
  playoffs_percentage DECIMAL(5,2),
  playoff_wins INTEGER DEFAULT 0,
  playoff_losses INTEGER DEFAULT 0,
  playoff_win_percentage DECIMAL(5,2),
  finals_appearances INTEGER DEFAULT 0,
  finals_wins INTEGER DEFAULT 0,
  finals_losses INTEGER DEFAULT 0,
  finals_win_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id)
);

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  number INTEGER,
  franchise_tag BOOLEAN DEFAULT FALSE,
  contract_year TEXT,
  rookie_draft_round TEXT,
  acquired_via_waivers BOOLEAN DEFAULT FALSE,
  salary_2025 TEXT,
  salary_2026 TEXT,
  salary_2027 TEXT,
  salary_2028 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  url TEXT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  template TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regular_season_standings_season ON regular_season_standings(season_id);
CREATE INDEX IF NOT EXISTS idx_regular_season_standings_team ON regular_season_standings(team_id);
CREATE INDEX IF NOT EXISTS idx_playoff_outcomes_season ON playoff_outcomes(season_id);
CREATE INDEX IF NOT EXISTS idx_playoff_outcomes_team ON playoff_outcomes(team_id);
CREATE INDEX IF NOT EXISTS idx_player_salaries_player ON player_salaries(player_id);
CREATE INDEX IF NOT EXISTS idx_player_salaries_team ON player_salaries(team_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE regular_season_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE playoff_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE playoff_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage teams" ON teams FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read seasons" ON seasons FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage seasons" ON seasons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read standings" ON regular_season_standings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage standings" ON regular_season_standings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read playoffs" ON playoff_outcomes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage playoffs" ON playoff_outcomes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read playoff stats" ON playoff_statistics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage playoff stats" ON playoff_statistics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read players" ON players FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage players" ON players FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read salaries" ON player_salaries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage salaries" ON player_salaries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Authenticated users can manage posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read media" ON media FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage media" ON media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read published pages" ON pages FOR SELECT USING (published = true);
CREATE POLICY "Authenticated users can manage pages" ON pages FOR ALL USING (auth.role() = 'authenticated');
