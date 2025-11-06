'use client';

import { Button, Card, CardBody, Input, Select, SelectItem } from '@heroui/react';
import { ArrowLeft, Trash } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useAuth } from '@/hooks/use-auth';
import { useTeams } from '@/hooks/use-teams';
import { teamSchema, type TeamFormValues } from '@/lib/validators';

const PLAYER_ROLES = [
  { label: 'Batter', value: 'batter' },
  { label: 'Bowler', value: 'bowler' },
  { label: 'All-rounder', value: 'all-rounder' },
  { label: 'Wicket keeper', value: 'wicket-keeper' },
];

export default function TeamDetailsPage() {
  const params = useParams<{ teamId: string }>();
  const teamId = params?.teamId;
  const router = useRouter();
  const { user } = useAuth();
  const { teams, loading, updateTeam, deleteTeam } = useTeams(user?.uid);

  const team = useMemo(() => teams.find((item) => item.id === teamId), [teamId, teams]);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team?.name ?? '',
      color: team?.color ?? '#023344',
      logoUrl: team?.logoUrl ?? '',
      players: team?.players ?? [],
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const players = useWatch({ control: form.control, name: 'players' }) ?? [];

  useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        color: team.color ?? '#023344',
        logoUrl: team.logoUrl ?? '',
        players: team.players,
      });
    }
  }, [reset, team]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateTeam(teamId, values);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update team';
      setError('root', { message });
    }
  });

  const onDelete = async () => {
    if (!confirm('Delete this team? This action cannot be undone.')) return;
    await deleteTeam(teamId);
    router.replace('/teams');
  };

  if (!teamId) {
    notFound();
  }

  if (loading && !team) {
    return (
      <DashboardShell title="Team details">
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardBody className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 w-full animate-pulse rounded-2xl bg-border/40" />
            ))}
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  if (!team) {
    return (
      <DashboardShell title="Team not found">
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardBody className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-sm text-foreground/60">
              We could not find this team. It may have been deleted or you may not have access.
            </p>
            <Button as={Link} href="/teams" radius="lg" startContent={<ArrowLeft className="h-4 w-4" />}>
              Back to teams
            </Button>
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={team.name}
      actions={
        <div className="flex gap-2">
          <Button
            radius="lg"
            variant="bordered"
            startContent={<Trash className="h-4 w-4" />}
            color="danger"
            onPress={onDelete}
          >
            Delete team
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardBody className="grid gap-4 md:grid-cols-2">
            <Input
              {...register('name')}
              label="Team name"
              variant="bordered"
              radius="lg"
              isInvalid={Boolean(errors.name)}
              errorMessage={errors.name?.message}
            />
            <Input
              {...register('logoUrl')}
              label="Logo URL"
              variant="bordered"
              radius="lg"
              isInvalid={Boolean(errors.logoUrl)}
              errorMessage={errors.logoUrl?.message}
            />
            <Input
              {...register('color')}
              label="Primary colour"
              type="color"
              variant="bordered"
              radius="lg"
            />
          </CardBody>
        </Card>

        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardBody className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Players</h2>
            <div className="grid gap-3">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className="grid gap-3 rounded-2xl border border-border/40 bg-background/60 p-4 md:grid-cols-[2fr,1fr,1fr]"
                >
                  <Input
                    {...register(`players.${index}.name` as const)}
                    label="Player name"
                    variant="bordered"
                    radius="lg"
                    defaultValue={player.name}
                    isInvalid={Boolean(errors.players?.[index]?.name)}
                    errorMessage={errors.players?.[index]?.name?.message}
                  />
                  <Controller
                    control={form.control}
                    name={`players.${index}.role` as const}
                    render={({ field }) => (
                      <Select
                        label="Role"
                        radius="lg"
                        variant="bordered"
                        selectedKeys={[field.value]}
                        onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                        onBlur={field.onBlur}
                      >
                        {PLAYER_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value} className="capitalize">
                            {role.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Input
                    {...register(`players.${index}.jerseyNumber` as const)}
                    label="Jersey #"
                    variant="bordered"
                    radius="lg"
                    defaultValue={player.jerseyNumber}
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {errors.root ? (
          <p className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {errors.root.message}
          </p>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button as={Link} href="/teams" radius="lg" variant="light">
            Back
          </Button>
          <Button type="submit" radius="lg" isLoading={isSubmitting} className="bg-brand-gradient text-white">
            Save changes
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
