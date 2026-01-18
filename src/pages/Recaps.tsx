import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { weeklyRecaps } from '@/data/leagueData';
import { Crown, Skull, Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Recaps = () => {
  const seasons = [...new Set(weeklyRecaps.map((r) => r.season))].sort((a, b) => b - a);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  const filteredRecaps =
    selectedSeason === 'all'
      ? weeklyRecaps
      : weeklyRecaps.filter((r) => r.season === parseInt(selectedSeason));

  const sortedRecaps = [...filteredRecaps].sort((a, b) => {
    if (a.season !== b.season) return b.season - a.season;
    return b.week - a.week;
  });

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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">HISTORIC RECAPS</h1>
            <p className="text-muted-foreground">
              The complete archive of weekly recaps. Filter by season to relive the glory.
            </p>
          </motion.div>

          {/* Season Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                {seasons.map((season) => (
                  <SelectItem key={season} value={season.toString()}>
                    {season} Season
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <div className="space-y-8">
            {sortedRecaps.map((recap, index) => (
              <motion.article
                key={recap.id}
                id={`week-${recap.season}-${recap.week}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * Math.min(index, 5) }}
                className="scroll-mt-24"
              >
                <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md hover-lift">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/90 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent text-accent-foreground text-xs font-display font-semibold uppercase tracking-wider rounded-full">
                        <Calendar size={12} />
                        Season {recap.season} • Week {recap.week}
                      </span>
                      {recap.featured && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold text-gold-foreground text-xs font-display font-semibold uppercase tracking-wider rounded-full">
                          Latest
                        </span>
                      )}
                      <span className="text-primary-foreground/60 text-sm ml-auto">
                        {new Date(recap.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
                      {recap.title}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    {/* The Lede */}
                    <p className="text-lg text-foreground mb-6 leading-relaxed first-letter:text-4xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                      {recap.lede}
                    </p>

                    {/* G.O.A.T. and goat */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="text-gold" size={18} />
                          <span className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                            G.O.A.T. of the Week
                          </span>
                        </div>
                        <p className="font-display font-bold text-gold mb-1">{recap.goatOfWeek.name}</p>
                        <p className="text-sm text-muted-foreground">{recap.goatOfWeek.description}</p>
                      </div>

                      <div className="bg-gradient-to-br from-loss/20 to-loss/5 border border-loss/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Skull className="text-loss" size={18} />
                          <span className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                            goat of the Week
                          </span>
                        </div>
                        <p className="font-display font-bold text-loss mb-1">{recap.goatLowercase.name}</p>
                        <p className="text-sm text-muted-foreground">{recap.goatLowercase.description}</p>
                      </div>
                    </div>

                    {/* 10 Things I Know, I Know */}
                    <div className="border-t border-border pt-6">
                      <h3 className="font-display text-lg font-bold mb-4">
                        <span className="text-accent">10 Things</span> I Know, I Know
                      </h3>
                      <ol className="grid gap-2">
                        {recap.tenThings.map((thing, thingIndex) => (
                          <li
                            key={thingIndex}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary font-display font-bold text-xs rounded-full flex items-center justify-center">
                              {thingIndex + 1}
                            </span>
                            <span className="pt-0.5">{thing}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Recaps;
