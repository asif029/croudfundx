'use client';

import { Button, Divider, Input } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '@/hooks/use-auth';
import { authRegisterSchema, type AuthRegisterValues } from '@/lib/validators';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, loading, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AuthRegisterValues>({
    resolver: zodResolver(authRegisterSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [router, user]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser(values);
      router.replace('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create account';
      setError('root', { message });
    }
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Create your Cric75 account</h1>
        <p className="text-sm text-foreground/60">Set up your scorer profile in less than a minute</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          {...register('displayName')}
          label="Display name"
          variant="bordered"
          radius="lg"
          isInvalid={Boolean(errors.displayName)}
          errorMessage={errors.displayName?.message}
          autoComplete="name"
          type="text"
          size="lg"
        />

        <Input
          {...register('email')}
          label="Email address"
          variant="bordered"
          radius="lg"
          isInvalid={Boolean(errors.email)}
          errorMessage={errors.email?.message}
          autoComplete="email"
          type="email"
          size="lg"
        />

        <Input
          {...register('password')}
          label="Password"
          variant="bordered"
          radius="lg"
          isInvalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          autoComplete="new-password"
          type="password"
          size="lg"
        />

        {errors.root ? (
          <p className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {errors.root.message}
          </p>
        ) : null}

        <Button
          type="submit"
          fullWidth
          size="lg"
          radius="lg"
          isLoading={loading}
          className="bg-brand-gradient text-white shadow-card"
        >
          Create account
        </Button>
      </form>

      <Divider className="bg-border/50" />

      <p className="text-center text-sm text-foreground/60">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
