'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/components/auth-provider';
import { SocketProvider } from '@/components/socket-provider';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push} locale="en-IN">
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <SocketProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgb(var(--card))',
                color: 'rgb(var(--card-foreground))',
                border: '1px solid rgb(var(--border))',
                boxShadow: '0 20px 40px -24px rgba(2, 51, 68, 0.4)',
              },
            }}
          />
        </SocketProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
