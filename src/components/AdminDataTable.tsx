import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export interface ColumnDef<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface AdminDataTableProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: string;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  actions?: {
    view?: (item: T) => void;
    edit?: (item: T) => void;
    delete?: (item: T) => void;
  };
}

type SortDirection = 'asc' | 'desc' | null;

export const AdminDataTable = <T extends Record<string, any>>({
  data = [],
  columns,
  loading = false,
  error,
  title,
  description,
  searchPlaceholder = 'جستجو...',
  onRefresh,
  onExport,
  itemsPerPageOptions = [10, 25, 50, 100],
  defaultItemsPerPage = 25,
  actions,
}: AdminDataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (searchTerm) {
        const searchableText = columns
          .map((col) => String(item[col.key] || ''))
          .join(' ')
          .toLowerCase();
        if (!searchableText.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Column filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && String(item[key] || '').toLowerCase() !== value.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;
      
      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(prev => 
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      );
      if (sortDirection === 'desc') {
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) return <ArrowUpDown className="w-4 h-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortColumn, sortDirection]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-md border border-red-200/20 shadow-xl">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-black">{title}</CardTitle>}
          {description && <p className="text-sm text-black/70">{description}</p>}
        </CardHeader>
      )}
      
      <CardContent>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 border-red-200 focus:border-lime-400 focus:ring-lime-400/20 bg-white/80"
            />
          </div>
          
          <div className="flex gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 border-red-200 text-black hover:bg-lime-50 hover:border-lime-300 hover:text-lime-700 transition-all duration-200"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                بروزرسانی
              </Button>
            )}

            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex items-center gap-2 border-red-200 text-black hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                خروجی
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="text-sm text-black/70">
            نمایش {paginatedData.length} از {sortedData.length} مورد
            {data.length !== sortedData.length && ` (از کل ${data.length} مورد)`}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-black/70">تعداد در هر صفحه:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-20 border-red-200 bg-white/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-red-200/20 rounded-lg bg-white/60 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`text-${column.align || 'right'} ${column.width || ''} bg-red-50/50 text-black border-b border-red-200/20`}
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(column.key)}
                        className="h-auto p-0 hover:bg-transparent flex items-center gap-2"
                      >
                        {column.title}
                        {getSortIcon(column.key)}
                      </Button>
                    ) : (
                      column.title
                    )}
                  </TableHead>
                ))}
                {actions && <TableHead className="text-center">عملیات</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        <Skeleton className="h-8 w-20 mx-auto" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center py-8 text-slate-500"
                  >
                    موردی یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id || index}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={`text-${column.align || 'right'}`}
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key] || '-'}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          {actions.view && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => actions.view!(item)}
                              className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-lime-50 hover:border-lime-300 hover:text-lime-700 transition-all duration-200"
                            >
                              <ExternalLink className="w-3 h-3" />
                              مشاهده
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDataTable;
