'use client';

import { cn } from '@/lib/utils';
import { Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-error" />;
      default:
        return <Activity className="h-4 w-4 text-accent" />;
    }
  };

  const getBgColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-accent/10 border-accent/20';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative pl-6 pb-4 last:pb-0">
          {/* Timeline Line */}
          {index !== items.length - 1 && (
            <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />
          )}
          
          {/* Timeline Dot */}
          <div className={cn(
            "absolute left-0 top-1 h-6 w-6 rounded-full border flex items-center justify-center",
            getBgColor(item.type)
          )}>
            {getIcon(item.type)}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-text-primary">{item.title}</h4>
              <span className="flex items-center text-xs text-text-muted">
                <Clock className="mr-1 h-3 w-3" />
                {item.timestamp}
              </span>
            </div>
            <p className="text-sm text-text-secondary">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
