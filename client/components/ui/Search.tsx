'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';

export function Search() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative w-full max-w-md hidden md:block">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl leading-5 bg-background-hover text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm transition-all duration-200"
          placeholder="Search patients, records, or insights..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-block border border-border rounded px-2 py-0.5 text-[10px] font-medium text-text-muted">
            Ctrl K
          </kbd>
        </div>
      </div>
    </div>
  );
}
