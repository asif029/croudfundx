import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react';
import { Users } from 'lucide-react';
import Link from 'next/link';

import type { Team } from '@/types';

type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card radius="lg" className="border border-border/40 bg-background/70">
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar
            size="md"
            src={team.logoUrl}
            name={team.name}
            classNames={{
              base: 'bg-brand/10 text-brand font-semibold',
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
            <p className="text-xs text-foreground/60">
              {new Intl.DateTimeFormat('en-IN', {
                dateStyle: 'medium',
              }).format(new Date(team.createdAt))}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip variant="bordered" startContent={<Users className="h-3 w-3" />}>
            {team.players.length} players
          </Chip>
          {team.color ? (
            <Chip
              variant="flat"
              className="capitalize"
              startContent={<span className="h-3 w-3 rounded-full" style={{ backgroundColor: team.color }} />}
            >
              Team colour
            </Chip>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button as={Link} href={`/teams/${team.id}`} radius="lg" variant="solid">
            Manage squad
          </Button>
          <Button as={Link} href={`/teams/${team.id}/edit`} radius="lg" variant="bordered">
            Edit team
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
