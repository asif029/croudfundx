'use client';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { CalendarCheck, Plus } from 'lucide-react';
import Link from 'next/link';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useMatches } from '@/hooks/use-matches';
import { formatDate } from '@/lib/utils';

export default function SchedulePage() {
  const { user } = useAuth();
  const { matches, loading } = useMatches(user?.uid);

  const upcoming = matches.filter((match) => match.status === 'upcoming');

  return (
    <DashboardShell
      title="Schedule"
      actions={
        <Button as={Link} href="/matches/create" radius="lg" startContent={<Plus className="h-4 w-4" />}>
          New match
        </Button>
      }
    >
      {loading ? (
        <ListSkeleton rows={4} />
      ) : upcoming.length ? (
        <div className="grid gap-4">
          {upcoming.map((match) => (
            <Card key={match.id} radius="lg" className="border border-border/40 bg-background/70">
              <CardHeader className="justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{match.title}</h3>
                  <p className="text-sm text-foreground/60">{match.matchType}</p>
                </div>
                <span className="text-xs text-foreground/50">{match.startedAt ? formatDate(match.startedAt) : 'TBD'}</span>
              </CardHeader>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-foreground/70">
                  <p>
                    <span className="font-semibold text-foreground">Versus:</span> {match.summary.topPerformer ?? 'Awaiting team sheet'}
                  </p>
                </div>
                <Button as={Link} href={`/matches/${match.id}`} radius="lg" variant="bordered">
                  Open scorer
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="No matches scheduled"
          description="Create a match to populate your Cric75 scoring calendar."
          action={
            <Button as={Link} href="/matches/create" radius="lg" startContent={<Plus className="h-4 w-4" />}>
              Schedule match
            </Button>
          }
        />
      )}
    </DashboardShell>
  );
}
