'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Search, 
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKey?: keyof T;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  searchable = true,
  searchKey,
  className 
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter((item) => {
    if (!searchKey || !searchTerm) return true;
    const value = item[searchKey];
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background-hover border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button className="p-2 text-text-muted hover:text-text-primary hover:bg-background-hover rounded-lg transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden bg-background-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-background-hover/50 border-b border-border">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={String(column.key)}
                    className={cn(
                      "px-6 py-4 font-medium",
                      column.sortable && "cursor-pointer hover:text-text-primary transition-colors"
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && (
                        <span className="text-text-muted/50">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="h-3 w-3 text-accent" />
                            ) : (
                              <ChevronDown className="h-3 w-3 text-accent" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedData.length > 0 ? (
                sortedData.map((item) => (
                  <tr 
                    key={item.id}
                    className="bg-background-card hover:bg-background-hover/50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-6 py-4 text-text-primary">
                        {column.render 
                          ? column.render(item[column.key], item)
                          : String(item[column.key])
                        }
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <button className="text-text-muted hover:text-text-primary transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-text-muted">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
