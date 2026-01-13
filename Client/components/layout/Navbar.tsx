'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  History, 
  TrendingUp, 
  Database, 
  Settings,
  Heart,
  Menu,
  Bell,
  User
} from 'lucide-react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Search } from '../ui/Search';
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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

        {/* Right Side Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <Search />
          
          <button className="relative rounded-full p-2 text-text-muted hover:bg-background-hover hover:text-text-primary transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-background" />
          </button>
          
          {/* Theme Toggle */}
          <ThemeToggle />

          <button className="rounded-full bg-background-hover p-1 ring-1 ring-border hover:ring-accent transition-all">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  // lazy client-side import to avoid SSR issues
  const { useTheme } = require("../../hooks/useTheme");
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full p-2 text-text-muted hover:bg-background-hover hover:text-text-primary transition-colors"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
