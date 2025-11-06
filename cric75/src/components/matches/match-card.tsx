import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Eye, PlayCircle, SquarePen } from 'lucide-react';
import Link from 'next/link';

import { formatDate } from '@/lib/utils';
import type { MatchListItem } from '@/types';

type MatchCardProps = {
  match: MatchListItem;
};

const STATUS_COLOR: Record<MatchListItem['status'], 'success' | 'warning' | 'default'> = {
  completed: 'success',
  upcoming: 'default',
  live: 'warning',
};

export function MatchCard({ match }: MatchCardProps) {
  const statusLabel =
    match.status === 'live' ? 'Live now' : match.status === 'completed' ? 'Completed' : 'Scheduled';

  return (
    <Card radius="lg" className="border border-border/40 bg-background/70">
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{match.title}</h3>
            <p className="text-xs uppercase tracking-wide text-foreground/60">{match.matchType}</p>
          </div>
          <Chip color={STATUS_COLOR[match.status]} variant="flat" radius="lg" size="sm">
            {statusLabel}
          </Chip>
        </div>

        <div className="grid gap-2 text-sm text-foreground/60">
            <p>
              <span className="font-semibold text-foreground">Summary:</span>{' '}
              {match.summary.totalRuns}/{match.summary.wickets} • {match.summary.overs.toFixed(1)} overs
            </p>
          {match.summary.topPerformer ? (
            <p>
              <span className="font-semibold text-foreground">Top performer:</span>{' '}
              {match.summary.topPerformer}
            </p>
          ) : null}
          {match.startedAt ? (
            <p>
              <span className="font-semibold text-foreground">Started:</span> {formatDate(match.startedAt)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {match.status !== 'completed' ? (
            <Button
              as={Link}
              href={`/matches/${match.id}`}
              radius="lg"
              variant="solid"
              startContent={<PlayCircle className="h-4 w-4" />}
            >
              {match.status === 'live' ? 'Continue scoring' : 'Start scoring'}
            </Button>
          ) : (
            <Button
              as={Link}
              href={`/matches/${match.id}`}
              radius="lg"
              variant="light"
              startContent={<Eye className="h-4 w-4" />}
            >
              View report
            </Button>
          )}
          <Button
            as={Link}
            href={`/matches/${match.id}/edit`}
            radius="lg"
            variant="bordered"
            startContent={<SquarePen className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            as={Link}
            href={`/match/${match.id}`}
            radius="lg"
            variant="bordered"
            startContent={<Eye className="h-4 w-4" />}
          >
            Public view
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
