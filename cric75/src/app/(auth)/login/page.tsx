'use client';

import { Button, Divider, Input } from '@heroui/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '@/hooks/use-auth';
import { authLoginSchema, type AuthLoginValues } from '@/lib/validators';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') ?? '/dashboard';
  const { login, loading, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AuthLoginValues>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.replace(next);
    }
  }, [next, router, user]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      router.replace(next);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in';
      setError('root', { message });
    }
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-sm text-foreground/60">Sign in to continue scoring with Cric75</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
          autoComplete="current-password"
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
          Sign in
        </Button>
      </form>

      <Divider className="bg-border/50" />

      <p className="text-center text-sm text-foreground/60">
        New to Cric75?{' '}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
