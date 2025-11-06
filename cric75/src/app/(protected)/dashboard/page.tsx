'use client';

import { Button, Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import { Plus, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { MatchCard } from '@/components/matches/match-card';
import { TeamCard } from '@/components/teams/team-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useMatches } from '@/hooks/use-matches';
import { useTeams } from '@/hooks/use-teams';

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { teams, loading: teamsLoading } = useTeams(user?.uid);
  const { matches, loading: matchesLoading } = useMatches(user?.uid);

  return (
    <DashboardShell
      title={profile ? `Hello, ${profile.displayName}` : 'Cric75 Dashboard'}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button as={Link} href="/teams/new" radius="lg" startContent={<Users className="h-4 w-4" />}>
            New team
          </Button>
          <Button
            as={Link}
            href="/matches/create"
            radius="lg"
            className="bg-brand-gradient text-white shadow-card"
            startContent={<Plus className="h-4 w-4" />}
          >
            Create match
          </Button>
        </div>
      }
    >
      <section className="grid gap-6 md:grid-cols-3">
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader className="items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-foreground/60">Active teams</p>
              <p className="text-xl font-semibold text-foreground">{teams.length}</p>
            </div>
          </CardHeader>
        </Card>
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader className="items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-foreground/60">Matches scheduled</p>
              <p className="text-xl font-semibold text-foreground">
                {matches.filter((match) => match.status === 'upcoming').length}
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardHeader className="items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-foreground/60">Live / ongoing</p>
              <p className="text-xl font-semibold text-foreground">
                {matches.filter((match) => match.status === 'live').length}
              </p>
            </div>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent matches</h2>
            <Button as={Link} href="/matches" variant="light" radius="lg">
              View all
            </Button>
          </div>

          {matchesLoading ? (
            <ListSkeleton rows={3} />
          ) : matches.length ? (
            <div className="grid gap-4">
              {matches.slice(0, 3).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Trophy}
              title="No matches yet"
              description="Create your first match to start live scoring and share public dashboards."
              action={
                <Button as={Link} href="/matches/create" radius="lg" startContent={<Plus className="h-4 w-4" />}>
                  Create match
                </Button>
              }
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your teams</h2>
            <Button as={Link} href="/teams" variant="light" radius="lg">
              Manage teams
            </Button>
          </div>

          {teamsLoading ? (
            <Card radius="lg" className="border border-border/40 bg-background/60">
              <CardBody className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-2xl" />
                ))}
              </CardBody>
            </Card>
          ) : teams.length ? (
            <div className="grid gap-4">
              {teams.slice(0, 3).map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No teams created"
              description="Define your squad list so scorers can select players instantly during match setup."
              action={
                <Button as={Link} href="/teams/new" radius="lg" startContent={<Plus className="h-4 w-4" />}>
                  New team
                </Button>
              }
            />
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
