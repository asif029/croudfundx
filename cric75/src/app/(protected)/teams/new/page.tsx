'use client';

import { Button, Card, CardBody, Input, Select, SelectItem } from '@heroui/react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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

export default function NewTeamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createTeam } = useTeams(user?.uid);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      color: '#023344',
      logoUrl: '',
      players: Array.from({ length: 4 }).map(() => ({
        id: crypto.randomUUID(),
        name: '',
        role: 'batter',
        jerseyNumber: '',
        isCaptain: false,
        isWicketKeeper: false,
      })),
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: 'players' });
  const playerCount = fields.length;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const id = await createTeam({
        ...values,
        players: values.players.map((player, index) => ({
          id: player.id ?? crypto.randomUUID(),
          ...player,
          jerseyNumber: player.jerseyNumber ?? '',
          isWicketKeeper: player.role === 'wicket-keeper' ? true : player.isWicketKeeper,
          isCaptain: index === 0 ? true : player.isCaptain,
        })),
      });

      router.replace(`/teams/${id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create team';
      setError('root', { message });
    }
  });

  const disabled = useMemo(() => isSubmitting, [isSubmitting]);

  return (
    <DashboardShell
      title="Create team"
      actions={
        <Button onPress={handleSubmit(onSubmit)} radius="lg" isLoading={disabled} className="bg-brand-gradient text-white">
          Save team
        </Button>
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
              placeholder="https://"
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

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Players</h2>
          <Button
            type="button"
            radius="lg"
            variant="bordered"
            startContent={<Plus className="h-4 w-4" />}
            onPress={() =>
              append({
                id: crypto.randomUUID(),
                name: '',
                role: 'batter',
                jerseyNumber: '',
                isCaptain: false,
                isWicketKeeper: false,
              })
            }
          >
            Add player
          </Button>
        </div>

        <div className="grid gap-4">
          {fields.map((field, index) => (
            <Card key={field.id} radius="lg" className="border border-border/40 bg-background/70">
              <CardBody className="grid gap-4 md:grid-cols-[2fr,1fr,1fr,0.5fr]">
                <Input
                  {...register(`players.${index}.name` as const)}
                  label="Player name"
                  variant="bordered"
                  radius="lg"
                  isInvalid={Boolean(errors.players?.[index]?.name)}
                  errorMessage={errors.players?.[index]?.name?.message}
                />

                <Controller
                  control={control}
                  name={`players.${index}.role` as const}
                  render={({ field }) => (
                    <Select
                      label="Role"
                      radius="lg"
                      variant="bordered"
                      selectedKeys={field.value ? [field.value] : []}
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
                  placeholder="07"
                />

                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="light"
                    radius="lg"
                    isDisabled={playerCount <= 4}
                    onPress={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {errors.root ? (
          <p className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {errors.root.message}
          </p>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button as={Link} href="/teams" radius="lg" variant="light">
            Cancel
          </Button>
          <Button type="submit" radius="lg" isLoading={disabled} className="bg-brand-gradient text-white">
            Save team
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
