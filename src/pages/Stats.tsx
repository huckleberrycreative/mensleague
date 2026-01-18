import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SortableTable, Column } from '@/components/SortableTable';
import { owners, Owner } from '@/data/leagueData';
import { Trophy, Medal, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const Stats = () => {
  const columns: Column<Owner>[] = [
    {
      key: 'name',
      label: 'Owner',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-semibold">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.teamName}</p>
        </div>
      ),
    },
    {
      key: 'yearsActive',
      label: 'Years',
      sortable: true,
      align: 'center',
      render: (value) => <span className="font-mono">{value as number}</span>,
    },
    {
      key: 'record',
      label: 'W-L',
      sortable: true,
      align: 'center',
      render: (_, row) => (
        <span className="font-mono">
          <span className="text-win">{row.totalWins}</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-loss">{row.totalLosses}</span>
        </span>
      ),
    },
    {
      key: 'winPct',
      label: 'Win %',
      sortable: true,
      align: 'center',
      render: (_, row) => {
        const total = row.totalWins + row.totalLosses;
        const pct = total > 0 ? (row.totalWins / total) * 100 : 0;
        return <span className="font-mono">{pct.toFixed(1)}%</span>;
      },
    },
    {
      key: 'championships',
      label: 'Champs',
      sortable: true,
      align: 'center',
      render: (value) => {
        const champs = value as number;
        return (
          <div className="flex items-center justify-center gap-1">
            {champs > 0 && <Trophy size={14} className="text-gold" />}
            <span className={cn('font-mono font-bold', champs > 0 && 'text-gold')}>
              {champs}
            </span>
          </div>
        );
      },
    },
    {
      key: 'playoffAppearances',
      label: 'Playoffs',
      sortable: true,
      align: 'center',
      render: (value) => {
        const apps = value as number;
        return (
          <div className="flex items-center justify-center gap-1">
            {apps > 0 && <Target size={14} className="text-accent" />}
            <span className="font-mono">{apps}</span>
          </div>
        );
      },
    },
    {
      key: 'playoffRecord',
      label: 'Playoff W-L',
      sortable: true,
      align: 'center',
      render: (_, row) => (
        <span className="font-mono">
          <span className="text-win">{row.playoffWins}</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-loss">{row.playoffLosses}</span>
        </span>
      ),
    },
    {
      key: 'avgPointsPerYear',
      label: 'Avg Pts/Yr',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-mono">{(value as number).toFixed(1)}</span>
      ),
    },
    {
      key: 'avgFinish',
      label: 'Avg Finish',
      sortable: true,
      align: 'center',
      render: (value) => {
        const avg = value as number;
        return (
          <span className={cn(
            'font-mono font-semibold',
            avg <= 3 && 'text-win',
            avg >= 7 && 'text-loss'
          )}>
            {avg.toFixed(1)}
          </span>
        );
      },
    },
    {
      key: 'bestFinish',
      label: 'Best',
      sortable: true,
      align: 'center',
      render: (value) => {
        const best = value as number;
        return (
          <div className="flex items-center justify-center gap-1">
            {best === 1 && <Trophy size={12} className="text-gold" />}
            {best === 2 && <Medal size={12} className="text-muted-foreground" />}
            {best === 3 && <Medal size={12} className="text-amber-700" />}
            <span className={cn('font-mono', best <= 3 && 'text-gold')}>{best}</span>
          </div>
        );
      },
    },
    {
      key: 'worstFinish',
      label: 'Worst',
      sortable: true,
      align: 'center',
      render: (value) => (
        <span className="font-mono text-muted-foreground">{value as number}</span>
      ),
    },
  ];

  // Add computed fields for sorting
  const ownersWithComputed = owners.map((owner) => ({
    ...owner,
    record: owner.totalWins - owner.totalLosses,
    winPct: owner.totalWins + owner.totalLosses > 0 
      ? owner.totalWins / (owner.totalWins + owner.totalLosses) 
      : 0,
    playoffRecord: owner.playoffWins - owner.playoffLosses,
  }));

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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">OWNER STATS</h1>
            <p className="text-muted-foreground">
              Historical performance data for all league owners. Click any column to sort.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SortableTable
              data={ownersWithComputed}
              columns={columns}
              defaultSortKey="championships"
              className="shadow-md"
            />
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-gold" />
              <span>Championship Winner</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} className="text-accent" />
              <span>Playoff Appearances</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-win">W</span>
              <span>Wins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-loss">L</span>
              <span>Losses</span>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Stats;
