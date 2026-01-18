import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Swords, Trophy, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

// Rivalry data
interface RivalryMatchup {
  season: number;
  team1Score: number;
  team2Score: number;
  winner: 'team1' | 'team2';
}

interface Rivalry {
  id: string;
  gameName: string;
  slogan: string;
  trophyName: string;
  team1: string;
  team1Governor: string;
  team2: string;
  team2Governor: string;
  originStory: string[];
  matchups: RivalryMatchup[];
}

const rivalries: Rivalry[] = [
  {
    id: 'border-war',
    gameName: 'The Border War',
    slogan: 'Where neighbors become enemies',
    trophyName: 'The Fence Post Trophy',
    team1: 'Gridiron Giants',
    team1Governor: 'Mike Johnson',
    team2: 'TD Titans',
    team2Governor: 'Sarah Williams',
    originStory: [
      "The Border War traces its roots back to the league's founding in 2017, when Mike Johnson and Sarah Williams discovered they lived just three houses apart. What started as friendly neighborhood banter quickly escalated into the most heated rivalry in Men's League history.",
      "The turning point came in 2019 when Johnson's Gridiron Giants defeated Williams' TD Titans by 0.4 points in the regular season matchup, only for Williams to exact revenge in the championship game. The following Monday, neither spoke during the neighborhood HOA meeting.",
      "Today, The Border War represents more than just bragging rights—it's about which governor has to endure a full year of lawn signs proclaiming the other's superiority. The Fence Post Trophy, a literal fence post recovered from their shared property line, changes hands annually."
    ],
    matchups: [
      { season: 2017, team1Score: 142.3, team2Score: 138.7, winner: 'team1' },
      { season: 2018, team1Score: 156.8, team2Score: 161.2, winner: 'team2' },
      { season: 2019, team1Score: 148.4, team2Score: 148.0, winner: 'team1' },
      { season: 2020, team1Score: 132.1, team2Score: 145.6, winner: 'team2' },
      { season: 2021, team1Score: 167.3, team2Score: 152.8, winner: 'team1' },
      { season: 2022, team1Score: 139.5, team2Score: 142.1, winner: 'team2' },
      { season: 2023, team1Score: 155.2, team2Score: 149.8, winner: 'team1' },
      { season: 2024, team1Score: 143.7, team2Score: 158.4, winner: 'team2' },
    ],
  },
  {
    id: 'brotherhood-bowl',
    gameName: 'The Brotherhood Bowl',
    slogan: 'Blood is thicker, but fantasy points are forever',
    trophyName: 'Mom\'s Favorite Trophy',
    team1: 'Blitz Brigade',
    team1Governor: 'James Chen',
    team2: 'Fantasy Phenoms',
    team2Governor: 'Alex Thompson',
    originStory: [
      "James Chen and Alex Thompson aren't biological brothers, but you wouldn't know it from their twenty-year friendship. College roommates turned fantasy rivals, they joined Men's League together in 2018 with a pact: whoever wins their annual matchup gets called 'Mom's Favorite' for the entire following year.",
      "The rivalry intensified when Thompson's Fantasy Phenoms defeated Chen's Blitz Brigade in the 2022 Championship game. Chen claims the defeat was due to a questionable last-minute lineup decision, while Thompson maintains it was pure strategic genius.",
      "Mom's Favorite Trophy is actually a framed photo of both governors as college freshmen, with the winner's face circled in gold Sharpie each year. The photo has become so marked up that their faces are barely recognizable, but neither will replace it."
    ],
    matchups: [
      { season: 2018, team1Score: 128.9, team2Score: 134.2, winner: 'team2' },
      { season: 2019, team1Score: 145.6, team2Score: 138.4, winner: 'team1' },
      { season: 2020, team1Score: 152.3, team2Score: 147.8, winner: 'team1' },
      { season: 2021, team1Score: 139.1, team2Score: 143.5, winner: 'team2' },
      { season: 2022, team1Score: 148.7, team2Score: 156.2, winner: 'team2' },
      { season: 2023, team1Score: 162.4, team2Score: 155.1, winner: 'team1' },
      { season: 2024, team1Score: 141.8, team2Score: 139.2, winner: 'team1' },
    ],
  },
  {
    id: 'office-showdown',
    gameName: 'The Office Showdown',
    slogan: 'Synergy ends at the draft board',
    trophyName: 'The Corner Office Cup',
    team1: 'Pigskin Predators',
    team1Governor: 'Emma Davis',
    team2: 'End Zone Elite',
    team2Governor: 'Chris Martinez',
    originStory: [
      "Emma Davis and Chris Martinez work in the same building, on the same floor, in adjacent offices. Their fantasy rivalry has made Monday morning meetings particularly awkward since 2019, when Davis publicly celebrated a victory during a quarterly review presentation.",
      "The rivalry took a corporate turn when both governors started using company resources for 'research.' IT eventually had to block ESPN and Yahoo Fantasy on the office network after bandwidth complaints. Neither governor has admitted responsibility.",
      "The Corner Office Cup isn't actually a cup—it's the nameplate from the corner office that was promised to one of them before budget cuts eliminated the position entirely. Now it serves as a reminder that fantasy football glory is the only promotion that matters."
    ],
    matchups: [
      { season: 2019, team1Score: 137.8, team2Score: 129.4, winner: 'team1' },
      { season: 2020, team1Score: 144.2, team2Score: 151.6, winner: 'team2' },
      { season: 2021, team1Score: 158.9, team2Score: 142.3, winner: 'team1' },
      { season: 2022, team1Score: 133.5, team2Score: 138.7, winner: 'team2' },
      { season: 2023, team1Score: 149.1, team2Score: 145.8, winner: 'team1' },
      { season: 2024, team1Score: 156.4, team2Score: 152.1, winner: 'team1' },
    ],
  },
  {
    id: 'basement-brawl',
    gameName: 'The Basement Brawl',
    slogan: 'From the bottom, with fury',
    trophyName: 'The Golden Plunger',
    team1: 'Turf Warriors',
    team1Governor: 'Taylor Brown',
    team2: 'Scramble Squad',
    team2Governor: 'Morgan White',
    originStory: [
      "The Basement Brawl began as a consolation prize—literally. In 2020, both Taylor Brown's Turf Warriors and Morgan White's Scramble Squad found themselves in the Toilet Bowl bracket. Their matchup determined who would finish 9th versus 10th, and the intensity surprised everyone.",
      "What started as a fight to avoid last place has become one of the most emotionally charged rivalries in the league. Both governors have spent more time in the bottom half of standings than they'd like to admit, making every head-to-head victory feel like a championship.",
      "The Golden Plunger trophy was created after their 2021 matchup, when White's Scramble Squad won by a single point to push Brown to dead last. Brown commissioned the trophy as 'motivation,' though White claims it's actually an admission of defeat."
    ],
    matchups: [
      { season: 2020, team1Score: 98.4, team2Score: 102.1, winner: 'team2' },
      { season: 2021, team1Score: 108.7, team2Score: 109.7, winner: 'team2' },
      { season: 2022, team1Score: 115.3, team2Score: 112.8, winner: 'team1' },
      { season: 2023, team1Score: 121.6, team2Score: 125.4, winner: 'team2' },
      { season: 2024, team1Score: 118.9, team2Score: 114.2, winner: 'team1' },
    ],
  },
  {
    id: 'redemption-rumble',
    gameName: 'The Redemption Rumble',
    slogan: 'Every year is a comeback story',
    trophyName: 'The Phoenix Flame',
    team1: 'Redzone Raiders',
    team1Governor: 'Jordan Lee',
    team2: 'Draft Dodgers',
    team2Governor: 'Casey Miller',
    originStory: [
      "Jordan Lee and Casey Miller joined the league in different years but share a common experience: both took over struggling franchises and vowed to turn them around. Their rivalry represents the eternal optimism of the perpetual rebuilder.",
      "The Redemption Rumble became official in 2021 when both governors drafted exclusively rookies in the first three rounds, betting everything on the future. Lee's gamble paid off slightly better, but neither has yet to win a championship—or even make the playoffs.",
      "The Phoenix Flame trophy is a candle that the losing governor must keep burning on their mantle until the next Rivalry Week. It symbolizes the hope that refuses to die, no matter how many losing seasons accumulate. The candle has never once gone out."
    ],
    matchups: [
      { season: 2021, team1Score: 112.4, team2Score: 95.8, winner: 'team1' },
      { season: 2022, team1Score: 103.2, team2Score: 108.6, winner: 'team2' },
      { season: 2023, team1Score: 119.8, team2Score: 98.4, winner: 'team1' },
      { season: 2024, team1Score: 107.5, team2Score: 112.9, winner: 'team2' },
    ],
  },
];

const RivalryWeek = () => {
  const [selectedRivalry, setSelectedRivalry] = useState(rivalries[0]);

  // Calculate lifetime record
  const calculateRecord = (rivalry: Rivalry) => {
    const team1Wins = rivalry.matchups.filter(m => m.winner === 'team1').length;
    const team2Wins = rivalry.matchups.filter(m => m.winner === 'team2').length;
    return { team1Wins, team2Wins };
  };

  const record = calculateRecord(selectedRivalry);

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">RIVALRY WEEK</h1>
            <p className="text-muted-foreground">
              When regular season matchups become legendary battles.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Sidebar - Rivalry List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:w-1/4"
            >
              <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
                <div className="bg-primary/10 px-4 py-3 border-b border-border">
                  <h2 className="font-display font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Swords size={16} />
                    The Rivalries
                  </h2>
                </div>
                <nav className="divide-y divide-border">
                  {rivalries.map((rivalry) => (
                    <button
                      key={rivalry.id}
                      onClick={() => setSelectedRivalry(rivalry)}
                      className={cn(
                        'w-full text-left px-4 py-3 transition-colors hover:bg-accent/10',
                        selectedRivalry.id === rivalry.id
                          ? 'bg-accent/20 border-l-4 border-accent'
                          : ''
                      )}
                    >
                      <span className="font-semibold block">{rivalry.gameName}</span>
                      <span className="text-sm text-muted-foreground">
                        {rivalry.team1Governor} vs {rivalry.team2Governor}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Right Content - Rivalry Details */}
            <div className="md:w-3/4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRivalry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-lg">
                        <Swords size={40} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">
                          {selectedRivalry.gameName}
                        </h2>
                        <p className="text-lg text-accent italic mb-3">
                          "{selectedRivalry.slogan}"
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-1 text-sm bg-gold/20 text-gold px-3 py-1 rounded-full">
                            <Trophy size={14} />
                            {selectedRivalry.trophyName}
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm bg-background/50 px-3 py-1 rounded-full">
                            <Award size={14} />
                            {selectedRivalry.matchups.length} Meetings
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Matchup Header */}
                  <div className="px-6 md:px-8 py-4 bg-muted/30 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="font-display font-bold text-lg">{selectedRivalry.team1}</p>
                        <p className="text-sm text-muted-foreground">{selectedRivalry.team1Governor}</p>
                      </div>
                      <div className="px-6 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">All-Time</p>
                        <p className="font-mono font-bold text-xl">
                          <span className={cn(record.team1Wins > record.team2Wins ? 'text-win' : 'text-foreground')}>
                            {record.team1Wins}
                          </span>
                          <span className="text-muted-foreground mx-1">-</span>
                          <span className={cn(record.team2Wins > record.team1Wins ? 'text-win' : 'text-foreground')}>
                            {record.team2Wins}
                          </span>
                        </p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-display font-bold text-lg">{selectedRivalry.team2}</p>
                        <p className="text-sm text-muted-foreground">{selectedRivalry.team2Governor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 space-y-6">
                    {/* Origin Story */}
                    <div>
                      <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                        The Origins
                      </h3>
                      <div className="space-y-4">
                        {selectedRivalry.originStory.map((paragraph, idx) => (
                          <p key={idx} className="text-foreground leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Lifetime Record Banner */}
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                          <p className="font-display font-bold text-2xl text-win">{record.team1Wins}</p>
                          <p className="text-sm text-muted-foreground">{selectedRivalry.team1Governor}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Lifetime Record</p>
                          <Swords className="mx-auto my-1 text-accent" size={24} />
                        </div>
                        <div className="text-center">
                          <p className="font-display font-bold text-2xl text-win">{record.team2Wins}</p>
                          <p className="text-sm text-muted-foreground">{selectedRivalry.team2Governor}</p>
                        </div>
                      </div>
                    </div>

                    {/* Historic Matchups Table */}
                    <div>
                      <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                        Season-by-Season Results
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border bg-muted/30">
                              <th className="text-left py-3 px-4 font-semibold">Season</th>
                              <th className="text-center py-3 px-4 font-semibold">{selectedRivalry.team1}</th>
                              <th className="text-center py-3 px-4 font-semibold">{selectedRivalry.team2}</th>
                              <th className="text-right py-3 px-4 font-semibold">Winner</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedRivalry.matchups.slice().reverse().map((matchup) => (
                              <tr key={matchup.season} className="border-b border-border hover:bg-muted/20">
                                <td className="py-3 px-4 font-mono font-bold">{matchup.season}</td>
                                <td className={cn(
                                  "py-3 px-4 text-center font-mono",
                                  matchup.winner === 'team1' ? 'text-win font-bold' : 'text-muted-foreground'
                                )}>
                                  {matchup.team1Score.toFixed(1)}
                                </td>
                                <td className={cn(
                                  "py-3 px-4 text-center font-mono",
                                  matchup.winner === 'team2' ? 'text-win font-bold' : 'text-muted-foreground'
                                )}>
                                  {matchup.team2Score.toFixed(1)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className="inline-flex items-center gap-1 text-win">
                                    <Trophy size={14} />
                                    {matchup.winner === 'team1' 
                                      ? selectedRivalry.team1Governor 
                                      : selectedRivalry.team2Governor
                                    }
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RivalryWeek;
