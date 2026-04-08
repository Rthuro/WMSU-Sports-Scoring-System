-- ============================================================
-- MIGRATION SCRIPT — Run this ONCE on existing databases
-- that were created before the architecture refactor.
-- This adds: soft delete columns, FK indexes, CHECK constraints.
-- ============================================================

-- ── Soft Delete Columns ──────────────────────────────

ALTER TABLE sports ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE players ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;


-- ── Foreign Key Indexes ──────────────────────────────

-- Sports sub-resources
CREATE INDEX IF NOT EXISTS idx_scoring_points_sport_id ON scoring_points(sport_id);
CREATE INDEX IF NOT EXISTS idx_set_rules_sport_id ON set_rules(sport_id);
CREATE INDEX IF NOT EXISTS idx_penalty_types_sport_id ON penalty_types(sport_id);
CREATE INDEX IF NOT EXISTS idx_sports_position_sport_id ON sports_position(sport_id);
CREATE INDEX IF NOT EXISTS idx_stats_sport_id ON stats(sport_id);

-- Players
CREATE INDEX IF NOT EXISTS idx_players_sport_id ON players(sport_id);
CREATE INDEX IF NOT EXISTS idx_player_teams_player_id ON player_teams(player_id);
CREATE INDEX IF NOT EXISTS idx_player_teams_team_id ON player_teams(team_id);
CREATE INDEX IF NOT EXISTS idx_player_penalties_player_id ON player_penalties(player_id);
CREATE INDEX IF NOT EXISTS idx_player_penalties_match_id ON player_penalties(match_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_match_id ON player_stats(match_id);

-- Teams
CREATE INDEX IF NOT EXISTS idx_teams_sport_id ON teams(sport_id);
CREATE INDEX IF NOT EXISTS idx_teams_event_id ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON teams(department_id);

-- Matches
CREATE INDEX IF NOT EXISTS idx_matches_sport_id ON matches(sport_id);
CREATE INDEX IF NOT EXISTS idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX IF NOT EXISTS idx_match_points_match_id ON match_points(match_id);

-- Tournaments
CREATE INDEX IF NOT EXISTS idx_tournaments_event_id ON tournaments(event_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_sport_id ON tournaments(sport_id);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament_id ON tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_team_id ON tournament_teams(team_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_tournament_id ON tournament_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_tally_tournament_id ON tournament_tally(tournament_id);


-- ── CHECK Constraints ────────────────────────────────
-- NOTE: ALTER TABLE ADD CONSTRAINT will fail if the constraint already exists.
--       Wrap in DO blocks to handle gracefully.

DO $$ BEGIN
  ALTER TABLE accounts ADD CONSTRAINT chk_accounts_role CHECK (role IN ('super_admin', 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE players ADD CONSTRAINT chk_players_gender CHECK (gender IN ('Male', 'Female'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE tournaments ADD CONSTRAINT chk_tournaments_bracketing CHECK (bracketing IN ('single-elimination', 'double-elimination', 'round-robin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE set_rules ADD CONSTRAINT chk_set_rules_set_number CHECK (set_number > 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE match_points ADD CONSTRAINT chk_match_points_a_score CHECK (a_score >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE match_points ADD CONSTRAINT chk_match_points_b_score CHECK (b_score >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE match_points ADD CONSTRAINT chk_match_points_set_number CHECK (set_number > 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE tournament_matches ADD CONSTRAINT chk_tournament_matches_round CHECK (round > 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE tournament_tally ADD CONSTRAINT chk_tournament_tally_wins CHECK (wins >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE tournament_tally ADD CONSTRAINT chk_tournament_tally_losses CHECK (losses >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
