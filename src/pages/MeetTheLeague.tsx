import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { owners, teams } from '@/data/leagueData';
import { User, Trophy, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

// Governor profiles with extended info
const governors = owners.map((owner) => {
  const team = teams.find((t) => t.name === owner.teamName);
  return {
    ...owner,
    shieldBio: `${owner.name} has been a stalwart of Men's League for ${owner.yearsActive} seasons, commanding the ${owner.teamName} with a blend of shrewd drafting and calculated risk-taking. Known for ${owner.championships > 0 ? 'clutch playoff performances' : 'building competitive rosters year after year'}.`,
    governorResponse: `"The Shield's bio is generous, but I'd add that my success comes from trusting the process and never panicking mid-season. Also, I've made some trades I'd rather forget."`,
    highestHigh: owner.championships > 0 
      ? `Winning the ${2024 - owner.championships + 1} Championship` 
      : `Making the playoffs in ${2024 - owner.playoffAppearances + 1}`,
    lowestLow: owner.worstFinish === 10 
      ? 'Finishing dead last and enduring The Toilet Bowl' 
      : `A disappointing ${owner.worstFinish}th place finish`,
    totalFantasyPoints: owner.avgPointsPerYear * owner.yearsActive,
    playoffPercentage: Math.round((owner.playoffAppearances / owner.yearsActive) * 100),
  };
});

const MeetTheLeague = () => {
  const [selectedGovernor, setSelectedGovernor] = useState(governors[0]);

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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">MEET THE LEAGUE</h1>
            <p className="text-muted-foreground">
              The Governors who shape the destiny of Men's League.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Sidebar - Governor List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:w-1/4"
            >
              <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
                <div className="bg-primary/10 px-4 py-3 border-b border-border">
                  <h2 className="font-display font-bold text-sm uppercase tracking-wider">
                    The Governors
                  </h2>
                </div>
                <nav className="divide-y divide-border">
                  {governors.map((governor) => (
                    <button
                      key={governor.id}
                      onClick={() => setSelectedGovernor(governor)}
                      className={`w-full text-left px-4 py-3 transition-colors hover:bg-accent/10 ${
                        selectedGovernor.id === governor.id
                          ? 'bg-accent/20 border-l-4 border-accent'
                          : ''
                      }`}
                    >
                      <span className="font-semibold block">{governor.name}</span>
                      <span className="text-sm text-muted-foreground">{governor.teamName}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Right Content - Governor Profile */}
            <div className="md:w-3/4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedGovernor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      {/* Avatar Placeholder */}
                      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-lg">
                        <User size={48} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">
                          {selectedGovernor.name}
                        </h2>
                        <p className="text-lg text-accent font-semibold mb-2">
                          {selectedGovernor.teamName}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-1 text-sm bg-background/50 px-3 py-1 rounded-full">
                            <Calendar size={14} />
                            {selectedGovernor.yearsActive} Seasons
                          </span>
                          {selectedGovernor.championships > 0 && (
                            <span className="inline-flex items-center gap-1 text-sm bg-gold/20 text-gold px-3 py-1 rounded-full">
                              <Trophy size={14} />
                              {selectedGovernor.championships}x Champion
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio Sections */}
                  <div className="p-6 md:p-8 space-y-6">
                    {/* Shield Bio */}
                    <div>
                      <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Official Shield Bio
                      </h3>
                      <p className="text-foreground leading-relaxed">
                        {selectedGovernor.shieldBio}
                      </p>
                    </div>

                    {/* Governor's Response */}
                    <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-accent">
                      <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Governor's Response to the Shield's Bio
                      </h3>
                      <p className="text-foreground italic leading-relaxed">
                        {selectedGovernor.governorResponse}
                      </p>
                    </div>

                    {/* Highs and Lows */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-500/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="text-green-500" size={20} />
                          <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                            Highest High
                          </h3>
                        </div>
                        <p className="text-foreground">{selectedGovernor.highestHigh}</p>
                      </div>
                      <div className="bg-red-500/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="text-red-500" size={20} />
                          <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                            Lowest Low
                          </h3>
                        </div>
                        <p className="text-foreground">{selectedGovernor.lowestLow}</p>
                      </div>
                    </div>

                    {/* Stats Table */}
                    <div>
                      <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                        Career Statistics
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 font-semibold">Record</th>
                              <th className="text-left py-2 px-3 font-semibold">Playoff %</th>
                              <th className="text-left py-2 px-3 font-semibold">Playoff Record</th>
                              <th className="text-left py-2 px-3 font-semibold">Avg PF/Year</th>
                              <th className="text-left py-2 px-3 font-semibold">Total PF</th>
                              <th className="text-left py-2 px-3 font-semibold">Titles</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2 px-3 font-mono">
                                {selectedGovernor.totalWins}-{selectedGovernor.totalLosses}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {selectedGovernor.playoffPercentage}%
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {selectedGovernor.playoffWins}-{selectedGovernor.playoffLosses}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {selectedGovernor.avgPointsPerYear.toFixed(1)}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {selectedGovernor.totalFantasyPoints.toFixed(0)}
                              </td>
                              <td className="py-2 px-3">
                                {selectedGovernor.championships > 0 ? (
                                  <span className="text-gold font-bold">
                                    {selectedGovernor.championships}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">0</span>
                                )}
                              </td>
                            </tr>
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

export default MeetTheLeague;
