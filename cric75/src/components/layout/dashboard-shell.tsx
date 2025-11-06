'use client';

import { Button } from '@heroui/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/navigation/sidebar';

type DashboardShellProps = {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
};

export function DashboardShell({ children, title, actions }: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className={cn('hidden md:flex md:w-[260px] md:flex-none')}>
        <Sidebar />
      </div>

      <div className="flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-md md:hidden">
          <Button
            isIconOnly
            variant="light"
            radius="lg"
            onPress={() => setOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {title ? <h1 className="text-lg font-semibold text-foreground">{title}</h1> : null}
          <span className="w-9" />
        </header>

        <main className="relative flex flex-col gap-6 px-4 py-6 md:px-8">
          {title ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
                <p className="text-sm text-foreground/60">
                  Manage your cricket journey with live insights.
                </p>
              </div>
              {actions ? <div className="hidden md:block">{actions}</div> : null}
            </div>
          ) : null}

          {actions ? <div className="md:hidden">{actions}</div> : null}

          {children}
        </main>
      </div>

      {open ? (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div className="h-full w-[260px]">
            <Sidebar className="rounded-r-3xl border border-border/40 bg-card shadow-card" />
          </div>
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
