'use client';

import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function FAB({ 
  icon = <Plus className="h-6 w-6" />, 
  label, 
  position = 'bottom-right', 
  className,
  ...props 
}: FABProps) {
  return (
    <button
      className={cn(
        "fixed z-40 flex items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 hover:bg-accent-light hover:scale-105 active:scale-95 transition-all duration-200",
        position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6',
        label ? 'px-4 py-3 gap-2' : 'h-14 w-14',
        className
      )}
      {...props}
    >
      {icon}
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
}
