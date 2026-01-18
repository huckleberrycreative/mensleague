import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { 
  teams, 
  RANKING_POINTS, 
  season2025Weeks, 
  playoff2025Rounds,
  calculateWeeklyRankings,
  calculate2025Standings,
  get2025CompletedWeeks,
  PlayoffMatchup 
} from '@/data/leagueData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trophy, Medal, AlertTriangle, Skull, TrendingUp, TrendingDown, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

const getPlayoffTier = (rank: number): 'playoff' | 'purgatory' | 'toilet' => {
  if (rank <= 4) return 'playoff';
  if (rank === 5) return 'purgatory';
  return 'toilet';
};

const MatchupCard = ({ 
  matchup, 
  label 
}: { 
  matchup: PlayoffMatchup; 
  label?: string;
}) => {
  const team1 = matchup.team1Id ? teams.find(t => t.id === matchup.team1Id) : null;
  const team2 = matchup.team2Id ? teams.find(t => t.id === matchup.team2Id) : null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {label && (
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">
          {label}
        </p>
      )}
      <div className="space-y-2">
        <div className={cn(
          "flex items-center justify-between p-3 rounded-md border",
          matchup.completed && matchup.winnerId === matchup.team1Id 
            ? "bg-win/10 border-win/30" 
            : "bg-muted/30 border-border"
        )}>
          <span className="font-semibold">
            {team1?.name || 'TBD'}
          </span>
          {matchup.completed && matchup.team1Score !== undefined && (
            <span className="font-mono font-bold">{matchup.team1Score.toFixed(1)}</span>
          )}
        </div>
        <div className="text-center text-xs text-muted-foreground">vs</div>
        <div className={cn(
          "flex items-center justify-between p-3 rounded-md border",
          matchup.completed && matchup.winnerId === matchup.team2Id 
            ? "bg-win/10 border-win/30" 
            : "bg-muted/30 border-border"
        )}>
          <span className="font-semibold">
            {team2?.name || 'TBD'}
          </span>
          {matchup.completed && matchup.team2Score !== undefined && (
            <span className="font-mono font-bold">{matchup.team2Score.toFixed(1)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Season2025 = () => {
  const currentWeek = get2025CompletedWeeks();
  const isRegularSeasonComplete = currentWeek >= 13;

  const currentStandings = useMemo(() => {
    return calculate2025Standings(Math.min(currentWeek, 13));
  }, [currentWeek]);

  // Calculate previous week standings for trend arrows
  const previousStandings = useMemo(() => {
    if (currentWeek <= 1) return null;
    return calculate2025Standings(currentWeek - 1);
  }, [currentWeek]);

  const getTrend = (teamId: string, currentRank: number) => {
    if (!previousStandings) return null;
    const prevTeam = previousStandings.find(s => s.id === teamId);
    if (!prevTeam) return null;
    const diff = prevTeam.rank - currentRank;
    if (diff > 0) return 'up';
    if (diff < 0) return 'down';
    return null;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">2025 SEASON</h1>
            <p className="text-muted-foreground">
              13-week regular season • Weeks 14-15 Semifinals • Weeks 16-17 Finals
            </p>
          </motion.div>

          {/* Current Standings Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 grid md:grid-cols-3 gap-6"
          >
            {/* Playoffs Section (1-4) */}
            <div className="bg-card rounded-lg border border-win/30 overflow-hidden">
              <div className="bg-win/10 px-4 py-3 border-b border-win/20">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-win flex items-center gap-2">
                  <Trophy size={16} />
                  If Playoffs Started Tomorrow
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {currentStandings.filter(s => s.rank <= 4).map((standing) => {
                  const trend = getTrend(standing.id, standing.rank);
                  return (
                    <div
                      key={standing.id}
                      className="flex items-center justify-between p-3 rounded-md bg-win/5 border border-win/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-lg w-6 text-win">
                          {standing.rank}
                        </span>
                        {standing.rank === 1 && <Trophy size={16} className="text-gold" />}
                        {standing.rank === 2 && <Medal size={16} className="text-muted-foreground" />}
                        {standing.rank === 3 && <Medal size={16} className="text-amber-700" />}
                        {trend === 'up' && <TrendingUp size={14} className="text-win" />}
                        {trend === 'down' && <TrendingDown size={14} className="text-loss" />}
                        <div>
                          <p className="font-semibold text-sm">{standing.name}</p>
                          <p className="text-xs text-muted-foreground">{standing.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-win">{standing.totalPoints}</p>
                        <p className="text-xs text-muted-foreground">{standing.pointsFor.toFixed(1)} PF</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purgatory Section (5) */}
            <div className="bg-card rounded-lg border border-amber-500/30 overflow-hidden">
              <div className="bg-amber-500/10 px-4 py-3 border-b border-amber-500/20">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-amber-500 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Purgatory
                </h3>
              </div>
              <div className="p-4">
                {currentStandings.filter(s => s.rank === 5).map((standing) => {
                  const trend = getTrend(standing.id, standing.rank);
                  return (
                    <div
                      key={standing.id}
                      className="flex items-center justify-between p-4 rounded-md bg-amber-500/5 border border-amber-500/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-xl w-6 text-amber-500">
                          {standing.rank}
                        </span>
                        {trend === 'up' && <TrendingUp size={14} className="text-win" />}
                        {trend === 'down' && <TrendingDown size={14} className="text-loss" />}
                        <div>
                          <p className="font-semibold">{standing.name}</p>
                          <p className="text-xs text-muted-foreground">{standing.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-amber-500 text-lg">{standing.totalPoints}</p>
                        <p className="text-xs text-muted-foreground">{standing.pointsFor.toFixed(1)} PF</p>
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground text-center mt-3 italic">
                  Neither rewarded nor condemned
                </p>
              </div>
            </div>

            {/* Toilet Bowl Section (6-10) */}
            <div className="bg-card rounded-lg border border-loss/30 overflow-hidden">
              <div className="bg-loss/10 px-4 py-3 border-b border-loss/20">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-loss flex items-center gap-2">
                  <Skull size={16} />
                  The Toilet Bowl
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Presented by Ruggables™</p>
              </div>
              <div className="p-4 space-y-2">
                {currentStandings.filter(s => s.rank >= 6).map((standing) => {
                  const trend = getTrend(standing.id, standing.rank);
                  return (
                    <div
                      key={standing.id}
                      className="flex items-center justify-between p-3 rounded-md bg-loss/5 border border-loss/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-lg w-6 text-loss">
                          {standing.rank}
                        </span>
                        {standing.rank === 10 && <Skull size={14} className="text-loss" />}
                        {trend === 'up' && <TrendingUp size={14} className="text-win" />}
                        {trend === 'down' && <TrendingDown size={14} className="text-loss" />}
                        <div>
                          <p className="font-semibold text-sm">{standing.name}</p>
                          <p className="text-xs text-muted-foreground">{standing.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-loss">{standing.totalPoints}</p>
                        <p className="text-xs text-muted-foreground">{standing.pointsFor.toFixed(1)} PF</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Week indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mb-6 text-center"
          >
            <p className="text-muted-foreground text-sm">
              {isRegularSeasonComplete ? (
                <span className="font-semibold text-foreground">Regular Season Complete</span>
              ) : (
                <>
                  Standings through <span className="font-semibold text-foreground">Week {currentWeek}</span>
                  <span className="text-muted-foreground"> of 13</span>
                </>
              )}
            </p>
          </motion.div>

          {/* Playoff Brackets Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Swords className="h-6 w-6 text-accent" />
              <h2 className="font-display text-2xl font-bold">Playoff Bracket</h2>
            </div>

            <div className="space-y-8">
              {playoff2025Rounds.map((round, roundIndex) => (
                <div key={round.name} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-xl font-bold">{round.name}</h3>
                    <span className="text-sm text-muted-foreground">{round.weeks}</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Championship Bracket */}
                    <div>
                      <h4 className="font-semibold text-win text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Trophy size={14} />
                        Championship Bracket
                      </h4>
                      <div className="space-y-4">
                        {round.matchups.championship.map((matchup, idx) => (
                          <MatchupCard 
                            key={idx} 
                            matchup={matchup} 
                            label={roundIndex === 0 
                              ? (idx === 0 ? '#1 vs #4' : '#2 vs #3')
                              : (idx === 0 ? 'Championship' : '3rd Place')
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Consolation Bracket */}
                    <div>
                      <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Medal size={14} />
                        Consolation Bracket
                      </h4>
                      <div className="space-y-4">
                        {round.matchups.consolation.map((matchup, idx) => (
                          <MatchupCard 
                            key={idx} 
                            matchup={matchup}
                            label={roundIndex === 0 
                              ? (idx === 0 ? '#6 vs #7' : '#8 vs #9')
                              : (idx === 0 ? '5th Place' : '7th Place')
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Toilet Bowl */}
                    {round.matchups.toiletBowl && (
                      <div>
                        <h4 className="font-semibold text-loss text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Skull size={14} />
                          Toilet Bowl
                        </h4>
                        <div className="space-y-4">
                          {round.matchups.toiletBowl.map((matchup, idx) => (
                            <MatchupCard 
                              key={idx} 
                              matchup={matchup}
                              label={roundIndex === 0 
                                ? '#5 vs #10 (Purgatory vs Last)'
                                : '9th Place (Toilet Bowl Final)'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Scores Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-display text-2xl font-bold mb-6">Weekly Scores</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {season2025Weeks.map((weekData) => {
                const rankings = weekData.completed
                  ? calculateWeeklyRankings(weekData.scores)
                  : [];

                return (
                  <AccordionItem
                    key={weekData.week}
                    value={`week-${weekData.week}`}
                    className="bg-card border border-border rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <span className="font-display font-bold text-lg">
                            Week {weekData.week}
                          </span>
                          {weekData.completed ? (
                            <span className="text-xs bg-win/10 text-win px-2 py-1 rounded-full">
                              Complete
                            </span>
                          ) : (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                              Upcoming
                            </span>
                          )}
                        </div>
                        {weekData.completed && rankings[0] && (
                          <div className="text-sm text-muted-foreground">
                            <span className="text-win font-semibold">{rankings[0].team?.name}</span>
                            <span className="mx-2">•</span>
                            <span className="font-mono">{rankings[0].score.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      {weekData.completed ? (
                        <div className="space-y-2">
                          {rankings.map((item) => {
                            const tier = getPlayoffTier(item.rank);
                            return (
                              <div
                                key={item.teamId}
                                className={cn(
                                  'flex items-center justify-between p-3 rounded-md border',
                                  tier === 'playoff' && 'bg-win/5 border-win/10',
                                  tier === 'purgatory' && 'bg-amber-500/5 border-amber-500/10',
                                  tier === 'toilet' && 'bg-loss/5 border-loss/10'
                                )}
                              >
                                <div className="flex items-center gap-4">
                                  <span
                                    className={cn(
                                      'font-display font-bold w-6',
                                      tier === 'playoff' && 'text-win',
                                      tier === 'purgatory' && 'text-amber-500',
                                      tier === 'toilet' && 'text-loss'
                                    )}
                                  >
                                    {item.rank}
                                  </span>
                                  <div>
                                    <p className="font-semibold">{item.team?.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.team?.owner}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-mono font-bold">{item.score.toFixed(1)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    +{item.rankingPoints} pts
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          Scores will be posted after the week concludes.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Season2025;