import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { practiceSquadRosters, teams, PracticeSquadRoster } from '@/data/leagueData';
import { SortableTable, Column } from '@/components/SortableTable';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface FlattenedRoster {
  fantasyTeam: string;
  player1Name: string;
  player1Salary: number;
  player2Name: string;
  player2Salary: number;
  player3Name: string;
  player3Salary: number;
  totalSalary: number;
}

const PracticeSquad = () => {
  const { toast } = useToast();
  const [localRosters, setLocalRosters] = useState<PracticeSquadRoster[]>(practiceSquadRosters);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [action, setAction] = useState<'add' | 'drop'>('add');
  const [playerName, setPlayerName] = useState('');
  const [salary, setSalary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeam || !playerName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (action === 'add' && !salary) {
      toast({
        title: "Missing Salary",
        description: "Please enter a salary for the player.",
        variant: "destructive",
      });
      return;
    }

    setLocalRosters(prevRosters => {
      return prevRosters.map(roster => {
        if (roster.fantasyTeam !== selectedTeam) return roster;

        if (action === 'add') {
          // Check if roster is full (max 3 players)
          if (roster.players.length >= 3) {
            toast({
              title: "Roster Full",
              description: `${selectedTeam}'s practice squad is full. Drop a player first.`,
              variant: "destructive",
            });
            return roster;
          }
          return {
            ...roster,
            players: [...roster.players, { name: playerName.trim(), salary: parseInt(salary) }]
          };
        } else {
          // Drop player
          const playerIndex = roster.players.findIndex(
            p => p.name.toLowerCase() === playerName.trim().toLowerCase()
          );
          if (playerIndex === -1) {
            toast({
              title: "Player Not Found",
              description: `${playerName} is not on ${selectedTeam}'s practice squad.`,
              variant: "destructive",
            });
            return roster;
          }
          return {
            ...roster,
            players: roster.players.filter((_, i) => i !== playerIndex)
          };
        }
      });
    });

    toast({
      title: action === 'add' ? "Player Added" : "Player Dropped",
      description: `${playerName} has been ${action === 'add' ? 'added to' : 'dropped from'} ${selectedTeam}'s practice squad.`,
    });

    // Reset form
    setSelectedTeam('');
    setPlayerName('');
    setSalary('');
    setAction('add');
  };

  // Flatten roster data for table display
  const flattenedRosters: FlattenedRoster[] = localRosters.map((roster) => ({
    fantasyTeam: roster.fantasyTeam,
    player1Name: roster.players[0]?.name || '-',
    player1Salary: roster.players[0]?.salary || 0,
    player2Name: roster.players[1]?.name || '-',
    player2Salary: roster.players[1]?.salary || 0,
    player3Name: roster.players[2]?.name || '-',
    player3Salary: roster.players[2]?.salary || 0,
    totalSalary: roster.players.reduce((sum, p) => sum + p.salary, 0),
  }));

  const columns: Column<FlattenedRoster>[] = [
    {
      key: 'fantasyTeam',
      label: 'Fantasy Team',
      sortable: true,
      render: (value) => <span className="font-semibold">{value as string}</span>,
    },
    {
      key: 'player1Name',
      label: 'Player #1',
      sortable: true,
      render: (value) => <span className="text-sm">{value as string}</span>,
    },
    {
      key: 'player1Salary',
      label: 'Salary',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-mono text-sm text-accent">
          ${value as number}
        </span>
      ),
    },
    {
      key: 'player2Name',
      label: 'Player #2',
      sortable: true,
      render: (value) => <span className="text-sm">{value as string}</span>,
    },
    {
      key: 'player2Salary',
      label: 'Salary',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-mono text-sm text-accent">
          ${value as number}
        </span>
      ),
    },
    {
      key: 'player3Name',
      label: 'Player #3',
      sortable: true,
      render: (value) => <span className="text-sm">{value as string}</span>,
    },
    {
      key: 'player3Salary',
      label: 'Salary',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-mono text-sm text-accent">
          ${value as number}
        </span>
      ),
    },
    {
      key: 'totalSalary',
      label: 'Total',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-mono font-bold text-gold">
          ${value as number}
        </span>
      ),
    },
  ];

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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">PRACTICE SQUAD</h1>
            <p className="text-muted-foreground">
              Each team's developmental roster stashes. Players on the practice squad are protected from waivers.
            </p>
          </motion.div>

          {/* Submission Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 p-4 bg-card rounded-lg border border-border"
          >
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4">
              Add or Drop a Player
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Fantasy Team</label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Action</label>
                <Select value={action} onValueChange={(val) => setAction(val as 'add' | 'drop')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <span className="flex items-center gap-2">
                        <UserPlus size={14} /> Add
                      </span>
                    </SelectItem>
                    <SelectItem value="drop">
                      <span className="flex items-center gap-2">
                        <UserMinus size={14} /> Drop
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Player Name</label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter player name"
                />
              </div>
              {action === 'add' && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Salary ($)</label>
                  <Input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="1"
                    min="1"
                  />
                </div>
              )}
              <Button type="submit" className={action === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
                {action === 'add' ? (
                  <><UserPlus size={16} className="mr-2" /> Add Player</>
                ) : (
                  <><UserMinus size={16} className="mr-2" /> Drop Player</>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 p-4 bg-card rounded-lg border border-border"
          >
            <div className="flex items-start gap-3">
              <Users size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-1">
                  Practice Squad Rules
                </h3>
                <p className="text-sm text-muted-foreground">
                  Each team may stash up to 3 players on their practice squad. Players on the practice squad 
                  do not count against your salary cap but cannot be started in weekly lineups. Practice squad 
                  players may be promoted to the active roster at any time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Practice Squad Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SortableTable
              data={flattenedRosters}
              columns={columns}
              defaultSortKey="fantasyTeam"
              className="shadow-md"
            />
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-accent">Salary</span>
              <span>Contract value when promoted to active roster</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-gold font-bold">Total</span>
              <span>Combined practice squad value</span>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PracticeSquad;
