'use client';

import { Card, CardBody } from '@heroui/react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden h-full flex-col items-center justify-center bg-brand-gradient px-12 py-16 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)] opacity-30" />
        <div className="relative space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            Cric75 for scorers
          </span>
          <h1 className="text-4xl font-bold leading-tight">
            The fastest way to capture every ball and share live cricket insights.
          </h1>
          <p className="max-w-lg text-sm text-white/80">
            Cric75 blends real-time scoring, Firestore sync, and HeroUI dashboards so your leagues and clubs stay ahead with professional-grade analytics.
          </p>
          <Card radius="lg" className="border border-white/20 bg-white/10 backdrop-blur-lg">
            <CardBody className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                Trusted scoring workflow
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm text-white/80">
                <li>Firebase Auth with granular Firestore security rules</li>
                <li>Socket.io presence for live match dashboards</li>
                <li>Offline friendly with automatic sync</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
