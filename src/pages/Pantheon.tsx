import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Trophy, Crown, Star, Award, Medal, Sparkles } from 'lucide-react';

interface HallOfFamer {
  name: string;
  team: string;
  inductionYear: number;
  championships: number;
  keyStats: string;
  legacy: string;
  tier: 'apex' | 'elite' | 'notable';
}

const hallOfFamers: HallOfFamer[] = [
  {
    name: 'Mike Johnson',
    team: 'Gridiron Giants',
    inductionYear: 2024,
    championships: 2,
    keyStats: '67-45 Record • 6 Playoff Appearances • 8-4 Playoff Record',
    legacy: 'The architect of the league\'s first dynasty. Johnson\'s back-to-back titles in 2020-2021 set the standard for excellence.',
    tier: 'apex',
  },
  {
    name: 'Sarah Williams',
    team: 'TD Titans',
    inductionYear: 2024,
    championships: 1,
    keyStats: '62-50 Record • 5 Playoff Appearances • 5-4 Playoff Record',
    legacy: 'The most consistent governor in league history. Williams has never finished below 6th place in any season.',
    tier: 'elite',
  },
  {
    name: 'Alex Thompson',
    team: 'Fantasy Phenoms',
    inductionYear: 2023,
    championships: 1,
    keyStats: '52-60 Record • 3 Playoff Appearances • 3-2 Playoff Record',
    legacy: 'Proof that patience pays off. Thompson\'s 2022 title after years of rebuilding inspired a generation of tanking strategies.',
    tier: 'elite',
  },
  {
    name: 'James Chen',
    team: 'Blitz Brigade',
    inductionYear: 2024,
    championships: 1,
    keyStats: '48-36 Record • 4 Playoff Appearances • 4-3 Playoff Record',
    legacy: 'The Trade Whisperer. Chen\'s ability to extract value in trades is unmatched, turning future picks into present contention.',
    tier: 'elite',
  },
  {
    name: 'Emma Davis',
    team: 'Pigskin Predators',
    inductionYear: 2024,
    championships: 0,
    keyStats: '55-57 Record • 4 Playoff Appearances • 2-4 Playoff Record',
    legacy: 'The Bridesmaid. Davis has reached the championship game twice without a title, representing heartbreak and persistence.',
    tier: 'notable',
  },
  {
    name: 'Chris Martinez',
    team: 'End Zone Elite',
    inductionYear: 2024,
    championships: 0,
    keyStats: '35-35 Record • 2 Playoff Appearances • 1-2 Playoff Record',
    legacy: 'The Rookie of the Year in 2020 who continues to build toward their first championship run.',
    tier: 'notable',
  },
];

const apexTier = hallOfFamers.filter((h) => h.tier === 'apex');
const eliteTier = hallOfFamers.filter((h) => h.tier === 'elite');
const notableTier = hallOfFamers.filter((h) => h.tier === 'notable');

// Decorative corner component
const OrnateCorner = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path
      d="M0 40V30C0 13.4315 13.4315 0 30 0H40"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="30" cy="10" r="3" fill="currentColor" />
    <circle cx="10" cy="30" r="3" fill="currentColor" />
  </svg>
);

const Pantheon = () => {
  return (
    <Layout>
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Header with ornate styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center relative"
          >
            {/* Decorative line above */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <Sparkles className="text-gold" size={20} />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-wider">
              <span className="bg-gradient-to-b from-gold via-gold/90 to-gold/70 bg-clip-text text-transparent drop-shadow-lg">
                THE PANTHEON
              </span>
            </h1>

            {/* Subtitle with decorative elements */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent/40 to-accent/60" />
              <Crown className="text-gold" size={16} />
              <div className="h-px w-24 bg-gradient-to-l from-transparent via-accent/40 to-accent/60" />
            </div>

            <p className="text-muted-foreground max-w-2xl mx-auto italic text-lg">
              "Immortalized forever in the annals of Men's League history"
            </p>

            {/* Decorative line below */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-32 bg-gradient-to-r from-transparent to-gold/30" />
              <div className="w-2 h-2 rotate-45 bg-gold/50" />
              <div className="h-px w-32 bg-gradient-to-l from-transparent to-gold/30" />
            </div>
          </motion.div>

          {/* Pyramid Layout */}
          <div className="space-y-12">
            {/* Apex Tier - Top of Pyramid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              {/* Tier Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-gold" />
                <Crown className="text-gold animate-pulse" size={28} />
                <h2 className="font-display text-2xl font-bold text-gold uppercase tracking-[0.2em]">
                  The Apex
                </h2>
                <Crown className="text-gold animate-pulse" size={28} />
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-gold" />
              </div>

              <div className="space-y-6">
                {apexTier.map((member) => (
                  <div
                    key={member.name}
                    className="relative group"
                  >
                    {/* Ornate corners */}
                    <OrnateCorner className="absolute -top-1 -left-1 text-gold/60" />
                    <OrnateCorner className="absolute -top-1 -right-1 text-gold/60 rotate-90" />
                    <OrnateCorner className="absolute -bottom-1 -left-1 text-gold/60 -rotate-90" />
                    <OrnateCorner className="absolute -bottom-1 -right-1 text-gold/60 rotate-180" />

                    {/* Card */}
                    <div className="bg-gradient-to-b from-gold/20 via-gold/10 to-gold/5 rounded-lg border-2 border-gold/50 p-8 text-center relative overflow-hidden">
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      {/* Inner decorative border */}
                      <div className="absolute inset-3 border border-gold/20 rounded pointer-events-none" />

                      {/* Trophy icon with glow */}
                      <div className="relative mx-auto mb-5 w-24 h-24">
                        <div className="absolute inset-0 bg-gold/30 rounded-full blur-xl" />
                        <div className="relative w-full h-full rounded-full bg-gradient-to-b from-gold/30 to-gold/10 border-2 border-gold/50 flex items-center justify-center">
                          <Trophy className="text-gold drop-shadow-lg" size={44} />
                        </div>
                      </div>

                      <h3 className="font-display text-3xl font-bold mb-2 bg-gradient-to-r from-foreground via-gold/80 to-foreground bg-clip-text text-transparent">
                        {member.name}
                      </h3>
                      <p className="text-accent font-semibold text-lg mb-3">{member.team}</p>

                      {/* Decorative divider */}
                      <div className="flex items-center justify-center gap-2 my-4">
                        <div className="h-px w-12 bg-gold/40" />
                        <div className="w-1.5 h-1.5 rotate-45 bg-gold" />
                        <div className="h-px w-12 bg-gold/40" />
                      </div>

                      <p className="text-sm font-mono text-gold/80 mb-4">{member.keyStats}</p>
                      <p className="text-base leading-relaxed italic">{member.legacy}</p>

                      {/* Championship trophies */}
                      <div className="mt-5 flex items-center justify-center gap-3">
                        {[...Array(member.championships)].map((_, i) => (
                          <div key={i} className="relative">
                            <div className="absolute inset-0 bg-gold/50 blur-md rounded-full" />
                            <Trophy className="relative text-gold drop-shadow-lg" size={24} />
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-gold/60 mt-4 tracking-widest uppercase">
                        Inducted {member.inductionYear}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Elite Tier - Middle of Pyramid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              {/* Tier Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-accent/60" />
                <Star className="text-accent" size={22} />
                <h2 className="font-display text-xl font-bold text-accent uppercase tracking-[0.15em]">
                  The Elite
                </h2>
                <Star className="text-accent" size={22} />
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-accent/60" />
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {eliteTier.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="relative group"
                  >
                    {/* Decorative top accent */}
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />

                    <div className="bg-gradient-to-b from-card via-card to-card/80 rounded-lg border border-accent/40 p-6 text-center hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 relative overflow-hidden h-full">
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
                        backgroundSize: '10px 10px'
                      }} />

                      <div className="relative w-18 h-18 mx-auto mb-4">
                        <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg" />
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-accent/20 to-accent/5 border border-accent/40 flex items-center justify-center mx-auto">
                          <Award className="text-accent" size={32} />
                        </div>
                      </div>

                      <h3 className="font-display text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-accent text-sm font-semibold mb-3">{member.team}</p>

                      {/* Mini divider */}
                      <div className="flex items-center justify-center gap-1.5 my-3">
                        <div className="h-px w-6 bg-accent/30" />
                        <div className="w-1 h-1 rotate-45 bg-accent/50" />
                        <div className="h-px w-6 bg-accent/30" />
                      </div>

                      <p className="text-xs font-mono text-muted-foreground mb-3">{member.keyStats}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{member.legacy}</p>

                      {member.championships > 0 && (
                        <div className="mt-4 flex items-center justify-center gap-2">
                          {[...Array(member.championships)].map((_, i) => (
                            <Trophy key={i} className="text-gold" size={16} />
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground/60 mt-3 tracking-wider uppercase">
                        {member.inductionYear}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Notable Tier - Base of Pyramid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              {/* Tier Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-muted-foreground/40" />
                <Medal className="text-muted-foreground" size={18} />
                <h2 className="font-display text-base font-bold text-muted-foreground uppercase tracking-[0.1em]">
                  Notable Mentions
                </h2>
                <Medal className="text-muted-foreground" size={18} />
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-muted-foreground/40" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {notableTier.map((member) => (
                  <div
                    key={member.name}
                    className="bg-gradient-to-r from-card/80 to-card/60 rounded-lg border border-border hover:border-muted-foreground/40 transition-colors p-5 flex items-start gap-4 relative overflow-hidden group"
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-muted-foreground/20 via-muted-foreground/40 to-muted-foreground/20" />

                    <div className="w-14 h-14 rounded-full bg-muted flex-shrink-0 flex items-center justify-center border border-border group-hover:border-muted-foreground/40 transition-colors">
                      <Medal className="text-muted-foreground" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-bold">{member.name}</h3>
                      <p className="text-sm text-accent">{member.team}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">{member.keyStats}</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{member.legacy}</p>
                      <p className="text-xs text-muted-foreground/50 mt-2 tracking-wider uppercase">{member.inductionYear}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Legend with ornate styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-3 bg-card/50 rounded-full border border-border">
              <div className="flex items-center gap-2">
                <Trophy className="text-gold" size={16} />
                <span className="text-sm text-muted-foreground">= Championship Won</span>
              </div>
            </div>

            {/* Bottom flourish */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold/20" />
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rotate-45 bg-gold/30" />
                <div className="w-1.5 h-1.5 rotate-45 bg-gold/50" />
                <div className="w-1.5 h-1.5 rotate-45 bg-gold/30" />
              </div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold/20" />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Pantheon;
