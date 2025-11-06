'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  showTagline?: boolean;
};

export function Logo({ className, showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 text-brand', className)}>
      <div className="relative flex h-10 w-10 items-center justify-center">
        <motion.span
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 12 }}
          className="absolute inset-0 rounded-2xl bg-brand-gradient shadow-card"
        />
        <span className="relative text-lg font-semibold tracking-[0.2em] text-white">75</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-wide text-foreground">Cric75</span>
        {showTagline ? (
          <span className="text-xs font-medium uppercase tracking-widest text-foreground/60">
            Live cricket scoring
          </span>
        ) : null}
      </div>
    </Link>
  );
}
