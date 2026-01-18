import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Trophy, Target, Flame, Award, ArrowRightLeft } from 'lucide-react';

interface Trade {
  date: string;
  team1: string;
  gave1: string[];
  team2: string;
  gave2: string[];
  impact: string;
}

interface PlayoffMatchup {
  round: string;
  team1: string;
  team1Seed: number;
  team1Score: number;
  team2: string;
  team2Seed: number;
  team2Score: number;
  winner: string;
}

interface PlayoffBracket {
  seeds: { seed: number; team: string; owner: string }[];
  semifinals: PlayoffMatchup[];
  finals: PlayoffMatchup;
  thirdPlace: PlayoffMatchup;
  consolation: { winner: string; loser: string };
}

interface SeasonLore {
  year: number;
  summary: string;
  champion: string;
  championTeam: string;
  runnerUp: string;
  runnerUpTeam: string;
  mvp: string;
  mvpStats: string;
  biggestStory: string;
  toiletBowl: string;
  notableEvents: string[];
  consequentialTrades: Trade[];
  playoffs: PlayoffBracket;
}

const seasonLore: SeasonLore[] = [
  {
    year: 2024,
    summary: "The 2024 season will go down as one of the most competitive in league history. The Gridiron Giants' dominant regular season was challenged by a surging TD Titans squad that peaked at exactly the right time. The playoff race came down to the final week, with five teams fighting for the last two spots.",
    champion: "Mike Johnson",
    championTeam: "Gridiron Giants",
    runnerUp: "Sarah Williams",
    runnerUpTeam: "TD Titans",
    mvp: "Josh Allen",
    mvpStats: "4,832 passing yards, 42 TDs, 8 rushing TDs",
    biggestStory: "The emergence of rookie Brock Bowers as a league-winning asset, fundamentally changing how teams value the TE position.",
    toiletBowl: "Draft Dodgers",
    notableEvents: [
      "Week 7: Gridiron Giants score league-record 198.4 points",
      "Week 11: Three-way tie for 4th place creates tiebreaker chaos",
      "Trade Deadline: Six trades completed in final 24 hours",
      "Championship: Decided by 2.3 points on Monday Night Football",
    ],
    consequentialTrades: [
      {
        date: "Week 4",
        team1: "Gridiron Giants",
        gave1: ["2025 1st", "2025 2nd"],
        team2: "Draft Dodgers",
        gave2: ["Brock Bowers"],
        impact: "The Giants acquired the rookie TE who would become a league-winner, cementing their championship run."
      },
      {
        date: "Week 8",
        team1: "TD Titans",
        gave1: ["DeVonta Smith", "2025 3rd"],
        team2: "Fantasy Phenoms",
        gave2: ["Puka Nacua"],
        impact: "Williams bet on the sophomore breakout—Nacua's consistency down the stretch carried the Titans to the finals."
      },
      {
        date: "Trade Deadline",
        team1: "Blitz Brigade",
        gave1: ["Ja'Marr Chase"],
        team2: "Pigskin Predators",
        gave2: ["2025 1st", "2026 1st", "Tank Dell"],
        impact: "A blockbuster that reshaped both rosters—Chase gave the Predators firepower, while Chen stockpiled for a 2025 rebuild."
      },
    ],
    playoffs: {
      seeds: [
        { seed: 1, team: "Gridiron Giants", owner: "Mike Johnson" },
        { seed: 2, team: "TD Titans", owner: "Sarah Williams" },
        { seed: 3, team: "Blitz Brigade", owner: "James Chen" },
        { seed: 4, team: "Fantasy Phenoms", owner: "Alex Thompson" },
        { seed: 5, team: "Pigskin Predators", owner: "Emma Davis" },
      ],
      semifinals: [
        { round: "Semifinal 1", team1: "Gridiron Giants", team1Seed: 1, team1Score: 156.8, team2: "Fantasy Phenoms", team2Seed: 4, team2Score: 134.2, winner: "Gridiron Giants" },
        { round: "Semifinal 2", team1: "TD Titans", team1Seed: 2, team1Score: 148.4, team2: "Pigskin Predators", team2Seed: 5, team2Score: 141.7, winner: "TD Titans" },
      ],
      finals: { round: "Championship", team1: "Gridiron Giants", team1Seed: 1, team1Score: 142.1, team2: "TD Titans", team2Seed: 2, team2Score: 139.8, winner: "Gridiron Giants" },
      thirdPlace: { round: "3rd Place", team1: "Fantasy Phenoms", team1Seed: 4, team1Score: 128.9, team2: "Pigskin Predators", team2Seed: 5, team2Score: 132.4, winner: "Pigskin Predators" },
      consolation: { winner: "End Zone Elite", loser: "Draft Dodgers" },
    },
  },
  {
    year: 2023,
    summary: "A season defined by parity and chaos. No team finished with more than 8 wins, and the eventual champion came from the 5th seed. The mid-season trade frenzy reshaped multiple rosters and set the stage for an unpredictable playoff run.",
    champion: "Sarah Williams",
    championTeam: "TD Titans",
    runnerUp: "James Chen",
    runnerUpTeam: "Blitz Brigade",
    mvp: "Tyreek Hill",
    mvpStats: "1,799 receiving yards, 13 TDs, league-leading 22.4 PPG",
    biggestStory: "The Blitz Brigade's stunning playoff run after starting 2-5, winning five straight to reach the finals.",
    toiletBowl: "Scramble Squad",
    notableEvents: [
      "Week 3: Commissioner introduces new waiver rules",
      "Week 8: Defending champ misses playoffs for first time",
      "Week 12: Record 7 games decided by under 5 points",
      "Consolation Bracket: Most competitive in league history",
    ],
    consequentialTrades: [
      {
        date: "Week 6",
        team1: "TD Titans",
        gave1: ["2024 1st", "Jaylen Waddle"],
        team2: "Scramble Squad",
        gave2: ["Tyreek Hill"],
        impact: "Williams reunited with Hill after losing him in the startup—he delivered MVP numbers and a title."
      },
      {
        date: "Week 9",
        team1: "Blitz Brigade",
        gave1: ["Breece Hall"],
        team2: "End Zone Elite",
        gave2: ["Travis Etienne", "2024 2nd"],
        impact: "A controversial swap at the time, but Etienne's playoff explosion justified Chen's gamble."
      },
    ],
    playoffs: {
      seeds: [
        { seed: 1, team: "Gridiron Giants", owner: "Mike Johnson" },
        { seed: 2, team: "Pigskin Predators", owner: "Emma Davis" },
        { seed: 3, team: "TD Titans", owner: "Sarah Williams" },
        { seed: 4, team: "Blitz Brigade", owner: "James Chen" },
        { seed: 5, team: "Fantasy Phenoms", owner: "Alex Thompson" },
      ],
      semifinals: [
        { round: "Semifinal 1", team1: "Gridiron Giants", team1Seed: 1, team1Score: 118.2, team2: "Blitz Brigade", team2Seed: 4, team2Score: 124.6, winner: "Blitz Brigade" },
        { round: "Semifinal 2", team1: "Pigskin Predators", team1Seed: 2, team1Score: 112.8, team2: "TD Titans", team2Seed: 3, team2Score: 136.4, winner: "TD Titans" },
      ],
      finals: { round: "Championship", team1: "Blitz Brigade", team1Seed: 4, team1Score: 128.7, team2: "TD Titans", team2Seed: 3, team2Score: 134.2, winner: "TD Titans" },
      thirdPlace: { round: "3rd Place", team1: "Gridiron Giants", team1Seed: 1, team1Score: 142.3, team2: "Pigskin Predators", team2Seed: 2, team2Score: 119.8, winner: "Gridiron Giants" },
      consolation: { winner: "End Zone Elite", loser: "Scramble Squad" },
    },
  },
  {
    year: 2022,
    summary: "The Year of the Underdog. Fantasy Phenoms, perennial basement dwellers, shocked the league with their first-ever championship. Alex Thompson's patient rebuild finally paid dividends, proving that dynasty success requires long-term vision.",
    champion: "Alex Thompson",
    championTeam: "Fantasy Phenoms",
    runnerUp: "Mike Johnson",
    runnerUpTeam: "Gridiron Giants",
    mvp: "Justin Jefferson",
    mvpStats: "1,809 receiving yards, 8 TDs, consistent WR1 production",
    biggestStory: "Thompson's decision to tank in 2021 for draft capital proved brilliant, netting Jefferson and Chase.",
    toiletBowl: "Redzone Raiders",
    notableEvents: [
      "Rookie Draft: Most hyped class in league history",
      "Week 5: Jefferson's 223-yard explosion breaks single-game record",
      "Trade: Phenoms acquire key pieces for future 1sts",
      "Finals: First championship for a team under 5 years old",
    ],
    consequentialTrades: [
      {
        date: "Offseason",
        team1: "Fantasy Phenoms",
        gave1: ["2022 1st (1.02)", "2023 1st"],
        team2: "Gridiron Giants",
        gave2: ["Justin Jefferson"],
        impact: "The trade that launched a championship. Johnson's decision to sell high on JJ haunted him in the finals."
      },
      {
        date: "Week 10",
        team1: "Fantasy Phenoms",
        gave1: ["2023 2nd"],
        team2: "Turf Warriors",
        gave2: ["Dallas Goedert"],
        impact: "A depth move that proved crucial—Goedert's 18-point championship performance was the difference."
      },
    ],
    playoffs: {
      seeds: [
        { seed: 1, team: "Gridiron Giants", owner: "Mike Johnson" },
        { seed: 2, team: "TD Titans", owner: "Sarah Williams" },
        { seed: 3, team: "Blitz Brigade", owner: "James Chen" },
        { seed: 4, team: "Fantasy Phenoms", owner: "Alex Thompson" },
        { seed: 5, team: "Pigskin Predators", owner: "Emma Davis" },
      ],
      semifinals: [
        { round: "Semifinal 1", team1: "Gridiron Giants", team1Seed: 1, team1Score: 152.4, team2: "Fantasy Phenoms", team2Seed: 4, team2Score: 158.7, winner: "Fantasy Phenoms" },
        { round: "Semifinal 2", team1: "TD Titans", team1Seed: 2, team1Score: 134.6, team2: "Pigskin Predators", team2Seed: 5, team2Score: 128.9, winner: "TD Titans" },
      ],
      finals: { round: "Championship", team1: "Fantasy Phenoms", team1Seed: 4, team1Score: 146.8, team2: "Gridiron Giants", team2Seed: 1, team2Score: 142.1, winner: "Fantasy Phenoms" },
      thirdPlace: { round: "3rd Place", team1: "TD Titans", team1Seed: 2, team1Score: 124.3, team2: "Pigskin Predators", team2Seed: 5, team2Score: 118.7, winner: "TD Titans" },
      consolation: { winner: "End Zone Elite", loser: "Redzone Raiders" },
    },
  },
  {
    year: 2021,
    summary: "The Gridiron Giants established themselves as the league's first true dynasty, capturing their second consecutive title. Mike Johnson's roster construction became the blueprint for success, combining elite QB play with volume-based receivers.",
    champion: "Mike Johnson",
    championTeam: "Gridiron Giants",
    runnerUp: "Emma Davis",
    runnerUpTeam: "Pigskin Predators",
    mvp: "Josh Allen",
    mvpStats: "First QB to win back-to-back MVP awards in league history",
    biggestStory: "The Predators' heartbreaking loss in the finals after leading by 40 entering Monday night.",
    toiletBowl: "Draft Dodgers",
    notableEvents: [
      "Week 1: League expands playoff format to 4 teams",
      "Week 9: Giants clinch playoff berth earliest in league history",
      "Semifinals: Both games decided in overtime periods",
      "Record: Highest-scoring championship game ever",
    ],
    consequentialTrades: [
      {
        date: "Week 3",
        team1: "Gridiron Giants",
        gave1: ["2022 1st", "Tee Higgins"],
        team2: "Pigskin Predators",
        gave2: ["Stefon Diggs"],
        impact: "Diggs' target volume paired perfectly with Allen, creating an unstoppable stack."
      },
      {
        date: "Trade Deadline",
        team1: "Pigskin Predators",
        gave1: ["2022 2nd"],
        team2: "Scramble Squad",
        gave2: ["Mark Andrews"],
        impact: "The TE upgrade gave Davis the firepower to reach the finals—but not quite enough to win."
      },
    ],
    playoffs: {
      seeds: [
        { seed: 1, team: "Gridiron Giants", owner: "Mike Johnson" },
        { seed: 2, team: "TD Titans", owner: "Sarah Williams" },
        { seed: 3, team: "Pigskin Predators", owner: "Emma Davis" },
        { seed: 4, team: "Blitz Brigade", owner: "James Chen" },
        { seed: 5, team: "End Zone Elite", owner: "Chris Martinez" },
      ],
      semifinals: [
        { round: "Semifinal 1", team1: "Gridiron Giants", team1Seed: 1, team1Score: 168.4, team2: "Blitz Brigade", team2Seed: 4, team2Score: 156.2, winner: "Gridiron Giants" },
        { round: "Semifinal 2", team1: "TD Titans", team1Seed: 2, team1Score: 142.8, team2: "Pigskin Predators", team2Seed: 3, team2Score: 148.6, winner: "Pigskin Predators" },
      ],
      finals: { round: "Championship", team1: "Gridiron Giants", team1Seed: 1, team1Score: 178.9, team2: "Pigskin Predators", team2Seed: 3, team2Score: 164.2, winner: "Gridiron Giants" },
      thirdPlace: { round: "3rd Place", team1: "TD Titans", team1Seed: 2, team1Score: 132.4, team2: "Blitz Brigade", team2Seed: 4, team2Score: 128.7, winner: "TD Titans" },
      consolation: { winner: "Scramble Squad", loser: "Draft Dodgers" },
    },
  },
  {
    year: 2020,
    summary: "The inaugural dynasty season brought new rules, new strategies, and a new champion. The Gridiron Giants' calculated approach to the startup draft set the tone for years to come. The league's foundation was laid with competitive balance as the priority.",
    champion: "Mike Johnson",
    championTeam: "Gridiron Giants",
    runnerUp: "James Chen",
    runnerUpTeam: "Blitz Brigade",
    mvp: "Patrick Mahomes",
    mvpStats: "4,740 passing yards, 38 TDs, revolutionized QB scoring",
    biggestStory: "The startup draft lasted 14 hours and established dynasty values that still influence trades today.",
    toiletBowl: "Turf Warriors",
    notableEvents: [
      "League Founded: 10 governors sign the original Constitution",
      "Startup Draft: First pick traded three times before selection",
      "Week 6: First 200-point game in league history",
      "Championship: Giants win inaugural title by 31 points",
    ],
    consequentialTrades: [
      {
        date: "Startup Draft",
        team1: "Gridiron Giants",
        gave1: ["Round 3 Pick", "Round 5 Pick"],
        team2: "TD Titans",
        gave2: ["Round 2 Pick (Josh Allen)"],
        impact: "The trade that started it all. Johnson moved up to secure Allen, who became a 3-time league MVP."
      },
      {
        date: "Week 8",
        team1: "Blitz Brigade",
        gave1: ["Alvin Kamara"],
        team2: "Redzone Raiders",
        gave2: ["2021 1st", "Jonathan Taylor"],
        impact: "Chen sold high on Kamara and acquired a rookie RB who would anchor his team for years."
      },
    ],
    playoffs: {
      seeds: [
        { seed: 1, team: "Gridiron Giants", owner: "Mike Johnson" },
        { seed: 2, team: "Blitz Brigade", owner: "James Chen" },
        { seed: 3, team: "TD Titans", owner: "Sarah Williams" },
        { seed: 4, team: "Pigskin Predators", owner: "Emma Davis" },
        { seed: 5, team: "End Zone Elite", owner: "Chris Martinez" },
      ],
      semifinals: [
        { round: "Semifinal 1", team1: "Gridiron Giants", team1Seed: 1, team1Score: 178.6, team2: "Pigskin Predators", team2Seed: 4, team2Score: 142.3, winner: "Gridiron Giants" },
        { round: "Semifinal 2", team1: "Blitz Brigade", team1Seed: 2, team1Score: 156.8, team2: "TD Titans", team2Seed: 3, team2Score: 148.2, winner: "Blitz Brigade" },
      ],
      finals: { round: "Championship", team1: "Gridiron Giants", team1Seed: 1, team1Score: 168.4, team2: "Blitz Brigade", team2Seed: 2, team2Score: 137.2, winner: "Gridiron Giants" },
      thirdPlace: { round: "3rd Place", team1: "TD Titans", team1Seed: 3, team1Score: 134.6, team2: "Pigskin Predators", team2Seed: 4, team2Score: 128.9, winner: "TD Titans" },
      consolation: { winner: "Redzone Raiders", loser: "Turf Warriors" },
    },
  },
];

const Lore = () => {
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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">THE LORE</h1>
            <p className="text-muted-foreground">
              A comprehensive history of Men's League, season by season.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {seasonLore.map((season, index) => (
                <AccordionItem
                  key={season.year}
                  value={`season-${season.year}`}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/5">
                    <div className="flex items-center gap-4 text-left">
                      <span className="font-display text-2xl font-bold text-accent">
                        {season.year}
                      </span>
                      <div>
                        <span className="font-semibold block">
                          Champion: {season.championTeam}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {season.champion} • MVP: {season.mvp}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6 pt-4">
                      {/* Season Summary */}
                      <div>
                        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">
                          Season Summary
                        </h3>
                        <p className="text-foreground leading-relaxed">{season.summary}</p>
                      </div>

                      {/* Playoff Bracket */}
                      <div className="bg-gradient-to-br from-gold/20 to-gold/5 rounded-lg p-5 border border-gold/30">
                        <div className="flex items-center gap-2 mb-4">
                          <Trophy className="text-gold" size={20} />
                          <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                            Playoff Bracket
                          </h3>
                        </div>

                        {/* Seeding */}
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Playoff Seeds</p>
                          <div className="flex flex-wrap gap-2">
                            {season.playoffs.seeds.map((s) => (
                              <div key={s.seed} className="flex items-center gap-1.5 bg-card/50 px-2 py-1 rounded text-xs">
                                <span className="font-bold text-accent">#{s.seed}</span>
                                <span className="font-semibold">{s.team}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bracket Matchups */}
                        <div className="space-y-3">
                          {/* Semifinals */}
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Semifinals</p>
                            <div className="grid md:grid-cols-2 gap-3">
                              {season.playoffs.semifinals.map((game, i) => (
                                <div key={i} className="bg-card/60 rounded border border-border p-3">
                                  <div className={`flex justify-between items-center text-sm mb-1 ${game.winner === game.team1 ? 'font-bold' : 'text-muted-foreground'}`}>
                                    <span className="flex items-center gap-1.5">
                                      <span className="text-xs text-accent">#{game.team1Seed}</span>
                                      {game.team1}
                                      {game.winner === game.team1 && <span className="text-green-500">✓</span>}
                                    </span>
                                    <span className="font-mono">{game.team1Score.toFixed(1)}</span>
                                  </div>
                                  <div className={`flex justify-between items-center text-sm ${game.winner === game.team2 ? 'font-bold' : 'text-muted-foreground'}`}>
                                    <span className="flex items-center gap-1.5">
                                      <span className="text-xs text-accent">#{game.team2Seed}</span>
                                      {game.team2}
                                      {game.winner === game.team2 && <span className="text-green-500">✓</span>}
                                    </span>
                                    <span className="font-mono">{game.team2Score.toFixed(1)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Finals & 3rd Place */}
                          <div className="grid md:grid-cols-2 gap-3">
                            {/* Championship */}
                            <div>
                              <p className="text-xs text-gold uppercase tracking-wider mb-2 font-bold">Championship</p>
                              <div className="bg-gradient-to-r from-gold/20 to-gold/10 rounded border-2 border-gold/50 p-3">
                                <div className={`flex justify-between items-center text-sm mb-1 ${season.playoffs.finals.winner === season.playoffs.finals.team1 ? 'font-bold' : 'text-muted-foreground'}`}>
                                  <span className="flex items-center gap-1.5">
                                    <span className="text-xs text-gold">#{season.playoffs.finals.team1Seed}</span>
                                    {season.playoffs.finals.team1}
                                    {season.playoffs.finals.winner === season.playoffs.finals.team1 && <Trophy className="text-gold" size={14} />}
                                  </span>
                                  <span className="font-mono">{season.playoffs.finals.team1Score.toFixed(1)}</span>
                                </div>
                                <div className={`flex justify-between items-center text-sm ${season.playoffs.finals.winner === season.playoffs.finals.team2 ? 'font-bold' : 'text-muted-foreground'}`}>
                                  <span className="flex items-center gap-1.5">
                                    <span className="text-xs text-gold">#{season.playoffs.finals.team2Seed}</span>
                                    {season.playoffs.finals.team2}
                                    {season.playoffs.finals.winner === season.playoffs.finals.team2 && <Trophy className="text-gold" size={14} />}
                                  </span>
                                  <span className="font-mono">{season.playoffs.finals.team2Score.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>

                            {/* 3rd Place */}
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">3rd Place Game</p>
                              <div className="bg-card/60 rounded border border-border p-3">
                                <div className={`flex justify-between items-center text-sm mb-1 ${season.playoffs.thirdPlace.winner === season.playoffs.thirdPlace.team1 ? 'font-bold' : 'text-muted-foreground'}`}>
                                  <span className="flex items-center gap-1.5">
                                    <span className="text-xs text-accent">#{season.playoffs.thirdPlace.team1Seed}</span>
                                    {season.playoffs.thirdPlace.team1}
                                    {season.playoffs.thirdPlace.winner === season.playoffs.thirdPlace.team1 && <span className="text-green-500">✓</span>}
                                  </span>
                                  <span className="font-mono">{season.playoffs.thirdPlace.team1Score.toFixed(1)}</span>
                                </div>
                                <div className={`flex justify-between items-center text-sm ${season.playoffs.thirdPlace.winner === season.playoffs.thirdPlace.team2 ? 'font-bold' : 'text-muted-foreground'}`}>
                                  <span className="flex items-center gap-1.5">
                                    <span className="text-xs text-accent">#{season.playoffs.thirdPlace.team2Seed}</span>
                                    {season.playoffs.thirdPlace.team2}
                                    {season.playoffs.thirdPlace.winner === season.playoffs.thirdPlace.team2 && <span className="text-green-500">✓</span>}
                                  </span>
                                  <span className="font-mono">{season.playoffs.thirdPlace.team2Score.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Consolation */}
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Consolation Bracket</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>
                                <span className="text-muted-foreground">Winner:</span>{" "}
                                <span className="font-semibold">{season.playoffs.consolation.winner}</span>
                              </span>
                              <span className="text-muted-foreground">|</span>
                              <span>
                                <span className="text-muted-foreground">Toilet Bowl:</span>{" "}
                                <span className="text-red-400">{season.playoffs.consolation.loser}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* MVP */}
                      <div className="bg-accent/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="text-accent" size={20} />
                          <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                            League MVP
                          </h3>
                        </div>
                        <p className="font-semibold text-lg mb-1">{season.mvp}</p>
                        <p className="text-sm text-muted-foreground">{season.mvpStats}</p>
                      </div>

                      {/* Biggest Story */}
                      <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-accent">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="text-orange-500" size={18} />
                          <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                            The Biggest Story
                          </h3>
                        </div>
                        <p className="text-foreground">{season.biggestStory}</p>
                      </div>

                      {/* Most Consequential Trades */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <ArrowRightLeft className="text-accent" size={18} />
                          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">
                            Most Consequential Trades
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {season.consequentialTrades.map((trade, i) => (
                            <div key={i} className="bg-card/50 border border-border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                                  {trade.date}
                                </span>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 mb-3">
                                <div className="text-sm">
                                  <span className="font-semibold text-foreground">{trade.team1}</span>
                                  <span className="text-muted-foreground"> gave:</span>
                                  <ul className="mt-1 space-y-0.5">
                                    {trade.gave1.map((item, j) => (
                                      <li key={j} className="text-red-400 text-xs flex items-center gap-1">
                                        <span>−</span> {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="text-sm">
                                  <span className="font-semibold text-foreground">{trade.team2}</span>
                                  <span className="text-muted-foreground"> gave:</span>
                                  <ul className="mt-1 space-y-0.5">
                                    {trade.gave2.map((item, j) => (
                                      <li key={j} className="text-green-500 text-xs flex items-center gap-1">
                                        <span>+</span> {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground italic border-t border-border pt-2">
                                {trade.impact}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notable Events */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="text-primary" size={18} />
                          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">
                            Notable Events
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {season.notableEvents.map((event, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-accent mt-1">•</span>
                              <span>{event}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Lore;
