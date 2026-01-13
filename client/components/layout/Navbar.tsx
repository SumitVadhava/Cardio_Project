'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, History, TrendingUp, Database, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'History', href: '/history', icon: History },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'Data', href: '/data', icon: Database },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile Menu Trigger */}
        <div className="mr-4 md:hidden">
          <MobileNav />
        </div>

        {/* Logo */}
        <div className="mr-8 flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="hidden font-heading text-lg font-bold text-text-primary sm:inline-block">
            CardioPredict
          </span>
        </div>

        {/* Desktop Navigation (centered) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-6 text-base md:text-lg font-semibold">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-text-primary",
                pathname === item.href ? "text-text-primary font-semibold" : "text-text-muted"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions (removed search/notifications/profile) */}
        <div className="flex items-center gap-4">
          {/* Intentionally left empty to remove icons */}
        </div>
      </div>
    </header>
  );
}
