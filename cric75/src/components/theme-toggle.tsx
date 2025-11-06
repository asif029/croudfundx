'use client';

import { Button } from '@heroui/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = useMemo(() => (resolvedTheme ?? theme) === 'dark', [resolvedTheme, theme]);

  return (
    <Button
      variant="light"
      radius="lg"
      className={cn('flex items-center gap-2 text-foreground', className)}
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      startContent={isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    >
      <span className="text-xs font-semibold uppercase tracking-wide">
        {isDark ? 'Light' : 'Dark'} mode
      </span>
    </Button>
  );
}
