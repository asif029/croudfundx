import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { ArrowRight, Radio, UsersRound } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';

const FEATURES = [
  {
    title: 'Ball-by-ball scoring',
    description:
      'Record every delivery with intuitive scoring controls that automatically update batting and bowling stats.',
    icon: Radio,
  },
  {
    title: 'Team & player management',
    description:
      'Build squads, manage player roles, and keep your team sheet ready for every match format.',
    icon: UsersRound,
  },
  {
    title: 'Share live dashboards',
    description:
      'Spectators get a real-time, read-only scoreboard with milestones, partnerships, and match insights.',
    icon: ArrowRight,
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-brand-gradient opacity-10" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 md:py-20 lg:px-8">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Button as={Link} href="/login" variant="light" radius="lg">
              Sign in
            </Button>
            <Button
              as={Link}
              href="/register"
              radius="lg"
              className="bg-brand-gradient text-white shadow-card"
              endContent={<ArrowRight className="h-4 w-4" />}
            >
              Get started
            </Button>
          </div>
        </header>

        <main className="mt-16 flex flex-1 flex-col gap-16 md:mt-24">
          <section className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                Cric75 Platform
              </span>
              <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Live cricket scoring engineered for professional insights.
              </h1>
              <p className="text-lg text-foreground/70 md:text-xl">
                Cric75 is the modern scoring companion for clubs, leagues, and scorers. Capture ball-by-ball data, manage squads, and share live dashboards with fans in seconds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  as={Link}
                  href="/register"
                  radius="lg"
                  size="lg"
                  className="bg-brand-gradient text-white shadow-card"
                >
                  Start scoring for free
                </Button>
                <Button
                  as={Link}
                  href="/match/demo"
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  className="border-brand/30 text-brand hover:bg-brand/10"
                >
                  Watch live demo
                </Button>
              </div>
            </div>

            <Card radius="lg" shadow="lg" className="border border-white/10 bg-card/70 p-4 backdrop-blur-xl">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Live scoreboard</h3>
                  <p className="text-xs text-foreground/60">Cric75 Premier League • T20</p>
                </div>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                  Live
                </span>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-background/60 p-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-foreground/60">Titans</p>
                    <p className="text-2xl font-bold text-foreground">172/4</p>
                    <p className="text-xs text-foreground/60">Overs 18.3</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-foreground/60">Warriors</p>
                    <p className="text-2xl font-bold text-foreground">168/8</p>
                    <p className="text-xs text-foreground/60">Target 173</p>
                  </div>
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/70 px-4 py-3">
                    <span className="font-semibold text-foreground">P. Sharma</span>
                    <span className="text-xs text-foreground/60">63 (38)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/70 px-4 py-3">
                    <span className="font-semibold text-foreground">R. Singh</span>
                    <span className="text-xs text-foreground/60">32 (18)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/70 px-4 py-3">
                    <span className="font-semibold text-foreground">Last over</span>
                    <span className="text-xs text-foreground/60">1 • 4 • 6 • 1 • W • 2</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  radius="lg"
                  className="border border-border/40 bg-background/60 shadow-card-sm backdrop-blur-md"
                >
                  <CardBody className="space-y-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-foreground/60">{feature.description}</p>
                  </CardBody>
                </Card>
              );
            })}
          </section>

          <section className="rounded-3xl border border-brand/20 bg-brand-gradient p-8 text-white shadow-card">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3 max-w-xl">
                <h2 className="text-2xl font-semibold">Ready to modernise your scoring setup?</h2>
                <p className="text-sm text-white/80">
                  Launch Cric75 for your next tournament in minutes. Deploy on Vercel or Firebase Hosting with zero backend maintenance.
                </p>
              </div>
              <Button
                as={Link}
                href="/register"
                size="lg"
                radius="lg"
                className="bg-white/90 text-brand hover:bg-white"
              >
                Create your Cric75 account
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
