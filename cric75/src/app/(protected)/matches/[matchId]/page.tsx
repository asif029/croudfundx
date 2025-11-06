'use client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { ArrowLeft, ChevronRight, MinusCircle, PauseCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useMatch } from '@/hooks/use-match';
import { useTeams } from '@/hooks/use-teams';
import { cn, formatDate, formatOvers } from '@/lib/utils';

const RUN_OPTIONS = [0, 1, 2, 3, 4, 6];

export default function MatchScoringPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params?.matchId;
  const { user } = useAuth();
  const { match, loading, scoring, recordEvent, selectStriker, selectNonStriker, selectBowler, swapStrike } =
    useMatch(matchId);
  const { teams, loading: teamsLoading } = useTeams(user?.uid);

  const innings = match?.innings[match?.currentInnings ? match.currentInnings - 1 : 0];

  const battingTeamPlayers = useMemo(() => {
    if (!innings) return [];
    return teams.find((team) => team.id === innings.teamId)?.players ?? [];
  }, [innings, teams]);

  const bowlingTeamPlayers = useMemo(() => {
    if (!match || !innings) return [];
    const opponentId = match.teamA.id === innings.teamId ? match.teamB.id : match.teamA.id;
    return teams.find((team) => team.id === opponentId)?.players ?? [];
  }, [innings, match, teams]);

  if (!matchId) {
    return (
      <DashboardShell title="Match not found">
        <EmptyState
          icon={ArrowLeft}
          title="No match selected"
          description="Choose a match from your schedule to start scoring."
          action={
            <Button as={Link} href="/matches" radius="lg" startContent={<ArrowLeft className="h-4 w-4" />}>
              Back to matches
            </Button>
          }
        />
      </DashboardShell>
    );
  }

  if (loading && !match) {
    return (
      <DashboardShell title="Scoring">
        <ListSkeleton rows={6} />
      </DashboardShell>
    );
  }

  if (!match || !innings) {
    return (
      <DashboardShell title="Match unavailable">
        <EmptyState
          icon={PauseCircle}
          title="Unable to load match"
          description="The match may have been deleted or you do not have permission to view it."
          action={
            <Button as={Link} href="/matches" radius="lg" startContent={<ArrowLeft className="h-4 w-4" />}>
              Back to matches
            </Button>
          }
        />
      </DashboardShell>
    );
  }

  const handleRun = async (runs: number) => {
    if (!scoring.strikerId) {
      toastMissingSelection('Select a striker before scoring runs');
      return;
    }

    await recordEvent({
      type: 'run',
      runs,
      batterId: scoring.strikerId,
      bowlerId: scoring.bowlerId,
      batterName: getPlayerName(battingTeamPlayers, scoring.strikerId),
      bowlerName: getPlayerName(bowlingTeamPlayers, scoring.bowlerId),
      description: `${getPlayerName(battingTeamPlayers, scoring.strikerId)} • ${runs}`,
    });

    if (runs % 2 === 1) {
      swapStrike();
    }
  };

  const handleExtra = async (type: 'wide' | 'no-ball' | 'bye' | 'leg-bye') => {
    await recordEvent({
      type,
      runs: type === 'wide' || type === 'no-ball' ? 1 : 0,
      batterId: scoring.strikerId,
      bowlerId: scoring.bowlerId,
      batterName: getPlayerName(battingTeamPlayers, scoring.strikerId),
      bowlerName: getPlayerName(bowlingTeamPlayers, scoring.bowlerId),
      description: `${type.toUpperCase()}`,
    });
  };

  const handleWicket = async () => {
    if (!scoring.bowlerId) {
      toastMissingSelection('Select a bowler before recording wickets');
      return;
    }

    await recordEvent({
      type: 'wicket',
      runs: 0,
      batterId: scoring.strikerId,
      bowlerId: scoring.bowlerId,
      batterName: getPlayerName(battingTeamPlayers, scoring.strikerId),
      bowlerName: getPlayerName(bowlingTeamPlayers, scoring.bowlerId),
      description: 'Wicket',
    });
  };

  const timeline = [...innings.timeline].slice(-12).reverse();

  return (
    <DashboardShell
      title={match.title}
      actions={
        <Button as={Link} href={`/match/${match.id}`} radius="lg" variant="bordered" endContent={<ChevronRight className="h-4 w-4" />}>
          View public page
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader className="items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Scoreboard</h2>
              <p className="text-sm text-foreground/60">
                {innings.teamName} • {match.matchType} • {match.overs} overs
              </p>
            </div>
            <Chip color={match.status === 'live' ? 'warning' : match.status === 'completed' ? 'success' : 'default'} variant="flat">
              {match.status === 'live' ? 'Live' : match.status === 'completed' ? 'Completed' : 'Upcoming'}
            </Chip>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground/60">Total</p>
                <p className="text-4xl font-bold text-foreground">
                  {innings.totalRuns}/{innings.wickets}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground/60">Overs</p>
                <p className="text-2xl font-semibold text-foreground">{formatOvers(innings.balls)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground/60">Run rate</p>
                <p className="text-2xl font-semibold text-foreground">{innings.runRate}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Select
                label="Striker"
                placeholder={teamsLoading ? 'Loading players…' : 'Select batter'}
                radius="lg"
                variant="bordered"
                selectedKeys={scoring.strikerId ? [scoring.strikerId] : []}
                onSelectionChange={(keys) => selectStriker(Array.from(keys)[0]?.toString() ?? '')}
              >
                {battingTeamPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Non-striker"
                placeholder="Select batter"
                radius="lg"
                variant="bordered"
                selectedKeys={scoring.nonStrikerId ? [scoring.nonStrikerId] : []}
                onSelectionChange={(keys) => selectNonStriker(Array.from(keys)[0]?.toString() ?? '')}
              >
                {battingTeamPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Bowler"
                placeholder="Select bowler"
                radius="lg"
                variant="bordered"
                selectedKeys={scoring.bowlerId ? [scoring.bowlerId] : []}
                onSelectionChange={(keys) => selectBowler(Array.from(keys)[0]?.toString() ?? '')}
              >
                {bowlingTeamPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
              <Table aria-label="Batter stats">
                <TableHeader>
                  <TableColumn>Batter</TableColumn>
                  <TableColumn>R</TableColumn>
                  <TableColumn>B</TableColumn>
                  <TableColumn>4s</TableColumn>
                  <TableColumn>6s</TableColumn>
                  <TableColumn>SR</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Add batters to begin">
                  {innings.batters.map((batter) => (
                    <TableRow key={batter.playerId} className={cn(scoring.strikerId === batter.playerId && 'bg-brand/10')}>
                      <TableCell>{batter.playerName}</TableCell>
                      <TableCell>{batter.runs}</TableCell>
                      <TableCell>{batter.balls}</TableCell>
                      <TableCell>{batter.fours}</TableCell>
                      <TableCell>{batter.sixes}</TableCell>
                      <TableCell>{batter.strikeRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Card radius="lg" className="border border-border/40 bg-background/70">
                <CardBody className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-foreground/60">This over</p>
                  <div className="flex flex-wrap gap-2">
                    {innings.currentOver.length === 0 ? (
                      <span className="text-xs text-foreground/50">No balls recorded yet</span>
                    ) : (
                      innings.currentOver.map((delivery) => (
                        <span
                          key={delivery.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand"
                        >
                          {delivery.type === 'run' ? delivery.runs : delivery.type === 'wicket' ? 'W' : delivery.type === 'wide' ? 'Wd' : delivery.type === 'no-ball' ? 'Nb' : delivery.type === 'bye' ? 'B' : 'LB'}
                        </span>
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>

        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Scoring controls</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {RUN_OPTIONS.map((runs) => (
                <Button key={runs} radius="lg" size="lg" className="bg-brand/10 text-brand" onPress={() => handleRun(runs)}>
                  {runs}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button radius="lg" variant="light" onPress={() => handleExtra('wide')}>
                Wide
              </Button>
              <Button radius="lg" variant="light" onPress={() => handleExtra('no-ball')}>
                No ball
              </Button>
              <Button radius="lg" variant="light" onPress={() => handleExtra('bye')}>
                Bye
              </Button>
              <Button radius="lg" variant="light" onPress={() => handleExtra('leg-bye')}>
                Leg bye
              </Button>
              <Button radius="lg" variant="bordered" color="danger" startContent={<MinusCircle className="h-4 w-4" />} onPress={handleWicket}>
                Wicket
              </Button>
              <Button radius="lg" variant="bordered" startContent={<RotateCcw className="h-4 w-4" />} onPress={swapStrike}>
                Swap strike
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {timeline.length === 0 ? (
              <p className="text-sm text-foreground/60">No balls recorded yet.</p>
            ) : (
              timeline.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{delivery.description ?? delivery.type}</p>
                    <p className="text-xs text-foreground/50">Over {delivery.over}</p>
                  </div>
                  <Chip color="primary" variant="flat">
                    {delivery.type === 'run' ? `+${delivery.runs}` : delivery.type === 'wicket' ? 'W' : delivery.type === 'wide' ? 'Wd' : delivery.type === 'no-ball' ? 'Nb' : delivery.type === 'bye' ? 'B' : 'LB'}
                  </Chip>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Match metadata</h2>
          </CardHeader>
          <CardBody className="space-y-3 text-sm text-foreground/70">
            <p>
              <span className="font-semibold text-foreground">Teams:</span> {match.teamA.name} vs {match.teamB.name}
            </p>
            {match.venue ? (
              <p>
                <span className="font-semibold text-foreground">Venue:</span> {match.venue}
              </p>
            ) : null}
            {match.summary.lastUpdated ? (
              <p>
                <span className="font-semibold text-foreground">Updated:</span> {formatDate(match.summary.lastUpdated)}
              </p>
            ) : null}
          </CardBody>
        </Card>
      </section>
    </DashboardShell>
  );
}

function getPlayerName(players: { id: string; name: string }[], playerId?: string) {
  if (!playerId) return 'Batter';
  return players.find((player) => player.id === playerId)?.name ?? 'Batter';
}

function toastMissingSelection(message: string) {
  if (typeof window === 'undefined') return;
  import('react-hot-toast').then(({ toast }) => toast.error(message));
}
