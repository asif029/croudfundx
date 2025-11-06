'use client';

import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { MatchCard } from '@/components/matches/match-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useMatches } from '@/hooks/use-matches';

export default function MatchesPage() {
  const { user } = useAuth();
  const { matches, loading } = useMatches(user?.uid);

  return (
    <DashboardShell
      title="My matches"
      actions={
        <Button
          as={Link}
          href="/matches/create"
          radius="lg"
          startContent={<Plus className="h-4 w-4" />}
          className="bg-brand-gradient text-white"
        >
          New match
        </Button>
      }
    >
      {loading ? (
        <ListSkeleton rows={4} />
      ) : matches.length ? (
        <div className="grid gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Plus}
          title="No matches found"
          description="Schedule a match to start scoring and share a public scoreboard with your supporters."
          action={
            <Button
              as={Link}
              href="/matches/create"
              radius="lg"
              startContent={<Plus className="h-4 w-4" />}
              className="bg-brand-gradient text-white"
            >
              Schedule match
            </Button>
          }
        />
      )}
    </DashboardShell>
  );
}
