import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { coachingHistory, TeamCoachHistory, Coach } from '@/data/leagueData';
import { ChevronLeft, ChevronRight, Trophy, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const CoachingCarousel = () => {
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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">COACHING CAROUSEL</h1>
            <p className="text-muted-foreground">
              The complete head coaching history for every franchise. Navigate through the eras.
            </p>
          </motion.div>

          <div className="space-y-8">
            {coachingHistory.map((team, index) => (
              <motion.div
                key={team.teamName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
              >
                <TeamCoachCard team={team} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

interface TeamCoachCardProps {
  team: TeamCoachHistory;
}

const TeamCoachCard = ({ team }: TeamCoachCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCoach = team.coaches[currentIndex];
  const hasMultipleCoaches = team.coaches.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, team.coaches.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md">
      {/* Team Header */}
      <div className="bg-primary px-6 py-4">
        <h2 className="font-display text-xl font-bold text-primary-foreground">
          {team.teamName}
        </h2>
      </div>

      {/* Coach Display */}
      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Navigation Arrow - Previous (older) */}
          {hasMultipleCoaches && (
            <button
              onClick={goToPrevious}
              disabled={currentIndex === team.coaches.length - 1}
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all',
                currentIndex === team.coaches.length - 1
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-secondary hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label="Previous coach"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Coach Cards Row */}
          <div className="flex-1 flex items-center gap-4 overflow-hidden">
            <AnimatePresence mode="wait">
              {team.coaches.map((coach, idx) => {
                const isActive = idx === currentIndex;
                const isVisible = idx >= currentIndex && idx <= currentIndex + 2;

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={coach.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.5,
                      x: 0,
                      scale: isActive ? 1 : 0.9,
                    }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex-shrink-0 transition-all duration-300',
                      isActive ? 'w-full md:w-2/3' : 'w-24 md:w-32 hidden md:block'
                    )}
                  >
                    <CoachProfile coach={coach} isActive={isActive} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Arrow - Next (newer) */}
          {hasMultipleCoaches && (
            <button
              onClick={goToNext}
              disabled={currentIndex === 0}
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all',
                currentIndex === 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-secondary hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label="Next coach"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Timeline Indicator */}
        {hasMultipleCoaches && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {team.coaches.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  idx === currentIndex
                    ? 'bg-accent w-6'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to coach ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CoachProfileProps {
  coach: Coach;
  isActive: boolean;
}

const CoachProfile = ({ coach, isActive }: CoachProfileProps) => {
  if (!isActive) {
    // Compact view for non-active coaches
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-2 opacity-50">
          <User size={24} className="text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground truncate">{coach.name}</p>
      </div>
    );
  }

  // Full view for active coach
  const totalGames = coach.wins + coach.losses;
  const winPct = totalGames > 0 ? ((coach.wins / totalGames) * 100).toFixed(1) : '0.0';
  const playoffGames = coach.playoffWins + coach.playoffLosses;
  const playoffWinPct = playoffGames > 0 ? ((coach.playoffWins / playoffGames) * 100).toFixed(1) : '-';

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Headshot */}
      <div className={cn(
        'flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 flex items-center justify-center',
        coach.isCurrent ? 'border-accent' : 'border-muted'
      )}>
        <User size={48} className={coach.isCurrent ? 'text-accent' : 'text-muted-foreground'} />
      </div>

      {/* Coach Info */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
          <h3 className="font-display text-2xl font-bold">{coach.name}</h3>
          {coach.isCurrent && (
            <span className="inline-block px-2 py-0.5 bg-accent text-accent-foreground text-xs font-display font-semibold uppercase tracking-wider rounded">
              Current
            </span>
          )}
        </div>
        <p className="text-muted-foreground mb-4">{coach.yearsActive}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Record</p>
            <p className="font-mono font-bold">
              <span className="text-win">{coach.wins}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-loss">{coach.losses}</span>
            </p>
            <p className="text-xs text-muted-foreground">{winPct}%</p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Playoff</p>
            <p className="font-mono font-bold">
              <span className="text-win">{coach.playoffWins}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-loss">{coach.playoffLosses}</span>
            </p>
            <p className="text-xs text-muted-foreground">{playoffWinPct}%</p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy size={12} className="text-gold" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Titles</p>
            </div>
            <p className={cn(
              'font-mono text-2xl font-bold',
              coach.championships > 0 ? 'text-gold' : 'text-muted-foreground'
            )}>
              {coach.championships}
            </p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target size={12} className="text-accent" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Playoffs</p>
            </div>
            <p className="font-mono text-2xl font-bold text-accent">
              {coach.playoffWins + coach.playoffLosses > 0 ? '✓' : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingCarousel;
