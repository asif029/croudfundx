'use client';

import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { TeamCard } from '@/components/teams/team-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useTeams } from '@/hooks/use-teams';

export default function TeamsPage() {
  const { user } = useAuth();
  const { teams, loading } = useTeams(user?.uid);

  return (
    <DashboardShell
      title="My teams"
      actions={
        <Button as={Link} href="/teams/new" radius="lg" startContent={<Plus className="h-4 w-4" />}>
          New team
        </Button>
      }
    >
      {loading ? (
        <ListSkeleton rows={4} />
      ) : teams.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Plus}
          title="No teams yet"
          description="Create your first team to manage players and sync line-ups across matches."
          action={
            <Button as={Link} href="/teams/new" radius="lg" startContent={<Plus className="h-4 w-4" />}>
              Create team
            </Button>
          }
        />
      )}
    </DashboardShell>
  );
}
