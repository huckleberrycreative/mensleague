import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  defaultSortKey?: keyof T | string;
  defaultSortAsc?: boolean;
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function SortableTable<T extends object>({
  data,
  columns,
  defaultSortKey,
  defaultSortAsc = false,
  className,
  rowClassName,
  onRowClick,
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | string | null>(defaultSortKey || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    defaultSortKey ? (defaultSortAsc ? 'asc' : 'desc') : null
  );

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey as keyof T];
      const bVal = b[sortKey as keyof T];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const getNestedValue = (obj: T, key: string): unknown => {
    return key.split('.').reduce((acc: unknown, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof T | string }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown size={14} className="text-muted-foreground/50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp size={14} className="text-accent" />;
    }
    return <ArrowDown size={14} className="text-accent" />;
  };

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  'px-4 py-3 font-display font-semibold uppercase tracking-wider text-xs',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sortable && 'cursor-pointer select-none hover:bg-primary/80 transition-colors',
                  column.className
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div
                  className={cn(
                    'flex items-center gap-2',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}
                >
                  {column.label}
                  {column.sortable && <SortIcon columnKey={column.key} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card">
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-border last:border-0 table-row-hover',
                onRowClick && 'cursor-pointer',
                typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName
              )}
            >
              {columns.map((column) => {
                const value = getNestedValue(row, String(column.key));
                return (
                  <td
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-3',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.className
                    )}
                  >
                    {column.render ? column.render(value, row) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
