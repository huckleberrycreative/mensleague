import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Scroll, Quote, Feather, BookOpen } from 'lucide-react';

const Manifesto = () => {
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Scroll className="mx-auto text-gold mb-4" size={48} />
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">THE MANIFESTO</h1>
            <p className="text-muted-foreground">
              The origin story and guiding principles of Men's League.
            </p>
          </motion.div>

          {/* Origin Story */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-invert max-w-none"
          >
            <div className="bg-card rounded-lg border border-border p-8 md:p-12 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="text-accent" size={24} />
                <h2 className="font-display text-2xl font-bold m-0">The Origin</h2>
              </div>
              
              <div className="space-y-4 text-foreground/90 leading-relaxed">
                <p>
                  In the autumn of 2020, as the world grappled with unprecedented challenges, ten friends 
                  scattered across the country found themselves seeking connection. What began as a simple 
                  group text about fantasy football evolved into something far more significant—a brotherhood 
                  bound by competition, camaraderie, and an unwavering commitment to excellence.
                </p>
                <p>
                  The founders—each bringing their own expertise, perspective, and competitive fire—gathered 
                  virtually to draft not just players, but the very framework of what would become Men's League. 
                  That first startup draft lasted fourteen hours, fueled by pizza, debate, and dreams of dynasty glory.
                </p>
                <p>
                  From day one, this was never meant to be an ordinary fantasy league. The Constitution was 
                  drafted with the reverence of founding fathers, each article carefully considered to balance 
                  competition with fairness, tradition with innovation. The salary cap system, the practice squad 
                  rules, the franchise tag mechanics—all were designed to reward strategic thinking and long-term planning.
                </p>
              </div>
            </div>

            {/* Core Beliefs */}
            <div className="bg-card rounded-lg border border-border p-8 md:p-12 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Feather className="text-accent" size={24} />
                <h2 className="font-display text-2xl font-bold m-0">Our Core Beliefs</h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-gold pl-4">
                  <h3 className="font-display font-bold text-lg mb-2">I. Competition Is Sacred</h3>
                  <p className="text-foreground/90">
                    Every matchup matters. Every trade has consequences. We believe that true competition 
                    brings out the best in each Governor, pushing us to study harder, think deeper, and 
                    execute with precision.
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-display font-bold text-lg mb-2">II. Brotherhood Above All</h3>
                  <p className="text-foreground/90">
                    While we compete fiercely on the digital gridiron, our bonds extend far beyond fantasy 
                    points. We celebrate each other's victories, support each other through defeats, and 
                    maintain friendships that transcend the standings.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-display font-bold text-lg mb-2">III. Tradition Meets Innovation</h3>
                  <p className="text-foreground/90">
                    We honor the traditions that define us—the weekly recaps, the annual draft, the 
                    championship trophy—while remaining open to innovations that enhance our league. 
                    Evolution, not revolution.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-display font-bold text-lg mb-2">IV. Excellence Is Expected</h3>
                  <p className="text-foreground/90">
                    Mediocrity has no place in Men's League. We expect every Governor to set their lineup, 
                    make their picks, and engage with the league throughout the season. Complacency is the 
                    enemy of greatness.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-display font-bold text-lg mb-2">V. The Journey Is the Reward</h3>
                  <p className="text-foreground/90">
                    While we all chase the championship trophy, we recognize that the true value of Men's 
                    League lies in the journey—the draft day excitement, the trade deadline drama, the 
                    playoff chaos, and the memories we create along the way.
                  </p>
                </div>
              </div>
            </div>

            {/* Founder's Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-gold/10 to-accent/10 rounded-lg border border-gold/30 p-8 md:p-12 text-center"
            >
              <Quote className="mx-auto text-gold mb-4" size={36} />
              <blockquote className="font-display text-xl md:text-2xl italic text-foreground mb-4">
                "We didn't just create a fantasy football league. We created a legacy—a tradition that will 
                outlast any single season, any single championship, any single Governor. This is Men's League. 
                This is forever."
              </blockquote>
              <p className="text-muted-foreground font-semibold">
                — The Founding Governors, 2020
              </p>
            </motion.div>

            {/* Closing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <p className="text-muted-foreground italic">
                Five seasons later, the legacy continues. New rivalries form, new champions emerge, but the 
                spirit of Men's League—competition, brotherhood, excellence—remains unchanged.
              </p>
              <p className="mt-4 font-display font-bold text-accent">
                Welcome to Men's League. May the best Governor win.
              </p>
            </motion.div>
          </motion.article>
        </div>
      </section>
    </Layout>
  );
};

export default Manifesto;
