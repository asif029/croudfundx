'use client';

import { Avatar, Button, Card, CardBody, Input, Textarea } from '@heroui/react';
import { LogOut, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useAuth } from '@/hooks/use-auth';
import { profileSchema, type ProfileFormValues } from '@/lib/validators';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, logout } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.displayName ?? '',
      bio: profile?.bio ?? '',
      photoURL: profile?.photoURL ?? '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName,
        bio: profile.bio ?? '',
        photoURL: profile.photoURL ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProfile(values);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      setError('root', { message });
    }
  });

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <DashboardShell
      title="Profile"
      actions={
        <Button radius="lg" variant="bordered" startContent={<LogOut className="h-4 w-4" />} onPress={handleLogout}>
          Sign out
        </Button>
      }
    >
      <Card radius="lg" className="border border-border/40 bg-background/70">
        <CardBody className="space-y-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Avatar
              size="lg"
              name={profile?.displayName ?? 'Scorer'}
              src={profile?.photoURL}
              classNames={{
                base: 'h-20 w-20 text-xl bg-brand/10 text-brand',
              }}
            />
            <div>
              <h2 className="text-xl font-semibold text-foreground">{profile?.displayName}</h2>
              <p className="text-sm text-foreground/60">{profile?.email}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Input
              {...register('displayName')}
              label="Display name"
              variant="bordered"
              radius="lg"
              isInvalid={Boolean(errors.displayName)}
              errorMessage={errors.displayName?.message}
            />
            <Input
              {...register('photoURL')}
              label="Photo URL"
              variant="bordered"
              radius="lg"
              placeholder="https://"
              isInvalid={Boolean(errors.photoURL)}
              errorMessage={errors.photoURL?.message}
            />
            <Textarea
              {...register('bio')}
              label="Bio"
              minRows={4}
              variant="bordered"
              radius="lg"
              className="md:col-span-2"
              isInvalid={Boolean(errors.bio)}
              errorMessage={errors.bio?.message}
            />

            {errors.root ? (
              <p className="md:col-span-2 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                {errors.root.message}
              </p>
            ) : null}

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="submit" radius="lg" isLoading={isSubmitting} className="bg-brand-gradient text-white">
                Save profile
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card radius="lg" className="border border-danger/20 bg-danger/5">
        <CardBody className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-danger">Danger zone</h3>
          <p className="text-sm text-danger/80">
            Deleting your Cric75 account removes all teams and matches permanently. This action cannot be undone.
          </p>
          <Button radius="lg" color="danger" variant="bordered" startContent={<Trash className="h-4 w-4" />}>
            Request account deletion
          </Button>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
