'use client';

import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useAuth } from '@/hooks/use-auth';
import { useMatches } from '@/hooks/use-matches';
import { useTeams } from '@/hooks/use-teams';
import { matchSchema, type MatchFormValues } from '@/lib/validators';

const MATCH_TYPES = [
  { label: 'T20 (20 overs)', value: 'T20', defaultOvers: 20 },
  { label: 'One Day (50 overs)', value: 'ODI', defaultOvers: 50 },
  { label: 'Test (90 overs per day)', value: 'Test', defaultOvers: 90 },
];

export default function CreateMatchPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createMatch } = useMatches(user?.uid);
  const { teams, loading: teamsLoading } = useTeams(user?.uid);

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      title: '',
      venue: '',
      matchType: 'T20',
      overs: 20,
      teamA: undefined,
      teamB: undefined,
      tossWinnerId: '',
      electedTo: 'bat',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    setError,
  } = form;

  const selectedTeamA = useWatch({ control, name: 'teamA' });
  const selectedTeamB = useWatch({ control, name: 'teamB' });

  const onSubmit = handleSubmit(async (values) => {
    if (!values.teamA || !values.teamB) {
      setError('root', { message: 'Select both teams' });
      return;
    }

    try {
      const matchId = await createMatch({
        title: values.title,
        venue: values.venue,
        matchType: values.matchType,
        overs: Number(values.overs),
        teamA: values.teamA,
        teamB: values.teamB,
        tossWinnerId: values.tossWinnerId,
        electedTo: values.electedTo,
      });

      router.replace(`/matches/${matchId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create match';
      setError('root', { message });
    }
  });

  return (
    <DashboardShell
      title="Create match"
      actions={
        <Button radius="lg" isLoading={isSubmitting} onPress={handleSubmit(onSubmit)} className="bg-brand-gradient text-white">
          Save match
        </Button>
      }
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardBody className="grid gap-4 md:grid-cols-2">
            <Input
              {...register('title')}
              label="Match title"
              variant="bordered"
              radius="lg"
              placeholder="Titans vs Warriors"
              isInvalid={Boolean(errors.title)}
              errorMessage={errors.title?.message}
            />
            <Input
              {...register('venue')}
              label="Venue"
              variant="bordered"
              radius="lg"
              placeholder="Eden Gardens, Kolkata"
            />
            <Controller
              control={control}
              name="matchType"
              render={({ field }) => (
                <Select
                  label="Match type"
                  radius="lg"
                  variant="bordered"
                  selectedKeys={[field.value]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    field.onChange(value);
                    const defaults = MATCH_TYPES.find((item) => item.value === value);
                    if (defaults) {
                      setValue('overs', defaults.defaultOvers);
                    }
                  }}
                >
                  {MATCH_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Input
              {...register('overs', { valueAsNumber: true })}
              type="number"
              min={1}
              max={540}
              label="Overs"
              variant="bordered"
              radius="lg"
              isInvalid={Boolean(errors.overs)}
              errorMessage={errors.overs?.message?.toString()}
            />
          </CardBody>
        </Card>

        <Card radius="lg" className="border border-border/40 bg-background/70">
          <CardBody className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="teamA"
              render={({ field }) => (
                <Select
                  label="Team A"
                  placeholder={teamsLoading ? 'Loading teams…' : 'Select home team'}
                  radius="lg"
                  variant="bordered"
                  selectedKeys={field.value ? [field.value.id] : []}
                  onSelectionChange={(keys) => {
                    const selectedId = Array.from(keys)[0];
                    const selected = teams.find((team) => team.id === selectedId);
                    field.onChange(selected ? { id: selected.id, name: selected.name } : undefined);
                  }}
                >
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              control={control}
              name="teamB"
              render={({ field }) => (
                <Select
                  label="Team B"
                  placeholder={teamsLoading ? 'Loading teams…' : 'Select away team'}
                  radius="lg"
                  variant="bordered"
                  selectedKeys={field.value ? [field.value.id] : []}
                  onSelectionChange={(keys) => {
                    const selectedId = Array.from(keys)[0];
                    const selected = teams.find((team) => team.id === selectedId);
                    field.onChange(selected ? { id: selected.id, name: selected.name } : undefined);
                  }}
                >
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              control={control}
              name="tossWinnerId"
              render={({ field }) => (
                <Select
                  label="Toss winner"
                  radius="lg"
                  variant="bordered"
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                >
                  {[selectedTeamA, selectedTeamB].filter(Boolean).map((team) => (
                    <SelectItem key={team!.id} value={team!.id}>
                      {team!.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              control={control}
              name="electedTo"
              render={({ field }) => (
                <Select
                  label="Elected to"
                  radius="lg"
                  variant="bordered"
                  selectedKeys={[field.value]}
                  onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                >
                  <SelectItem key="bat" value="bat">
                    Bat first
                  </SelectItem>
                  <SelectItem key="bowl" value="bowl">
                    Bowl first
                  </SelectItem>
                </Select>
              )}
            />
          </CardBody>
        </Card>

        {errors.root ? (
          <p className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {errors.root.message}
          </p>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button radius="lg" variant="light" onPress={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" radius="lg" isLoading={isSubmitting} className="bg-brand-gradient text-white">
            Save match
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
