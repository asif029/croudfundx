'use client';

import { Card, CardBody, CardHeader, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Logo } from '@/components/logo';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import { useMatch } from '@/hooks/use-match';
import { formatDate, formatOvers } from '@/lib/utils';

export default function PublicMatchPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params?.matchId;
  const { match, loading } = useMatch(matchId);
  const innings = match?.innings?.[match?.currentInnings ? match.currentInnings - 1 : 0];

  if (!matchId) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <Logo />
        <EmptyState
          icon={ArrowLeft}
          title="Match not found"
          description="Share a valid Cric75 link to view a live or completed match."
          action={
            <Link href="/" className="text-sm font-semibold text-brand">
              Go home
            </Link>
          }
        />
      </div>
    );
  }

  if (loading && !match) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <Logo />
        <ListSkeleton rows={6} />
      </div>
    );
  }

  if (!match || !innings) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <Logo />
        <EmptyState
          icon={ArrowLeft}
          title="Match unavailable"
          description="This match is not public or has been removed."
          action={
            <Link href="/" className="text-sm font-semibold text-brand">
              Go home
            </Link>
          }
        />
      </div>
    );
  }

  const timeline = [...innings.timeline].slice(-10).reverse();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <Chip color={match.status === 'live' ? 'warning' : match.status === 'completed' ? 'success' : 'default'} variant="flat">
          {match.status === 'live' ? 'Live' : match.status === 'completed' ? 'Completed' : 'Scheduled'}
        </Chip>
      </header>

      <main className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader className="items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{match.title}</h1>
              <p className="text-sm text-foreground/60">
                {match.teamA.name} vs {match.teamB.name}
                {match.venue ? ` • ${match.venue}` : ''}
              </p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground/60">Score</p>
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

            <Table aria-label="Batting scorecard">
              <TableHeader>
                <TableColumn>Batter</TableColumn>
                <TableColumn>R</TableColumn>
                <TableColumn>B</TableColumn>
                <TableColumn>4s</TableColumn>
                <TableColumn>6s</TableColumn>
                <TableColumn>SR</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Awaiting batters">
                {innings.batters.map((batter) => (
                  <TableRow key={batter.playerId}>
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
          </CardBody>
        </Card>

        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Latest over</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {innings.currentOver.length === 0 ? (
                <span className="text-sm text-foreground/50">Awaiting deliveries</span>
              ) : (
                innings.currentOver.map((delivery) => (
                  <span key={delivery.id} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                    {delivery.type === 'run' ? delivery.runs : delivery.type === 'wicket' ? 'W' : delivery.type === 'wide' ? 'Wd' : delivery.type === 'no-ball' ? 'Nb' : delivery.type === 'bye' ? 'B' : 'LB'}
                  </span>
                ))
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Recent deliveries</h3>
              <div className="space-y-2">
                {timeline.length === 0 ? (
                  <p className="text-sm text-foreground/60">No events recorded yet.</p>
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
              </div>
            </div>
          </CardBody>
        </Card>
      </main>

      <footer className="flex flex-col gap-2 border-t border-border/40 pt-6 text-sm text-foreground/60">
        <p>Updated {match.summary.lastUpdated ? formatDate(match.summary.lastUpdated) : 'just now'}.</p>
        <p>
          Powered by <span className="font-semibold text-brand">Cric75</span>. Create your own live scoring room on{' '}
          <Link href="/" className="font-semibold text-brand">
            cric75.app
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
