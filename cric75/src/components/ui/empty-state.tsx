import { Card, CardBody } from '@heroui/react';
import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card radius="lg" className="border border-border/40 bg-background/60">
      <CardBody className="flex flex-col items-center gap-4 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Icon className="h-6 w-6" />
        </span>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-foreground/60">{description}</p>
        </div>
        {action}
      </CardBody>
    </Card>
  );
}
