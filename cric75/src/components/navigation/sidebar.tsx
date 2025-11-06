'use client';

import { Avatar, Button } from '@heroui/react';
import { CalendarRange, Home, LogOut, Shield, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'My Teams', href: '/teams', icon: Users },
  { label: 'My Matches', href: '/matches', icon: Trophy },
  { label: 'Schedule', href: '/schedule', icon: CalendarRange },
  { label: 'Profile', href: '/profile', icon: Shield },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();

  return (
    <aside
      className={cn(
        'flex h-full w-full max-w-[260px] flex-col gap-6 border-r border-border/40 bg-card/90 px-4 py-6 backdrop-blur-lg',
        className,
      )}
    >
      <Logo showTagline className="px-2" />

      <nav className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className="w-full">
              <Button
                fullWidth
                variant={isActive ? 'solid' : 'light'}
                radius="lg"
                className={cn(
                  'justify-start gap-3 border border-transparent font-medium transition-all',
                  isActive
                    ? 'bg-brand-gradient text-white shadow-card'
                    : 'text-foreground/70 hover:border-border/50 hover:bg-white/10 hover:text-foreground',
                )}
                startContent={<Icon className="h-4 w-4" />}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-4 border-t border-border/40 pt-4">
        <ThemeToggle className="justify-center" />
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-background/60 px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar
              size="sm"
              classNames={{
                base: 'bg-brand/20 text-brand font-semibold',
              }}
              name={profile?.displayName ?? 'User'}
              src={profile?.photoURL}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {profile?.displayName ?? 'Guest scorer'}
              </span>
              <span className="text-xs text-foreground/60">{profile?.email}</span>
            </div>
          </div>

          <Button
            isIconOnly
            variant="light"
            radius="lg"
            onPress={async () => {
              await logout();
              router.push('/login');
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
