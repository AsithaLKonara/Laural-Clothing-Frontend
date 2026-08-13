import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
  };
}

export default function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  onRowClick,
  pagination 
}: DataTableProps<T>) {
  
  return (
    <div className="flex flex-col overflow-hidden w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-3.5 font-inter font-semibold text-[11px] uppercase tracking-wider text-stone-400 whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr 
                key={keyExtractor(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-stone-100 last:border-0 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-stone-50' : 'hover:bg-stone-50/50'
                } ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}`}
              >
                {columns.map((col, idx) => (
                  <td 
                    key={idx}
                    className={`px-6 py-4 font-inter text-sm text-stone-700 ${col.className || ''}`}
                  >
                    {typeof col.accessor === 'function' 
                      ? col.accessor(row) 
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <p className="text-stone-400 text-sm font-inter font-medium">No records found</p>
                  <p className="text-stone-300 text-xs font-inter mt-1">Try adjusting your filters or search term</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <span className="font-inter text-xs text-stone-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange?.(pagination.currentPage - 1)}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-white hover:border-stone-300 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => pagination.onPageChange?.(page)}
                className={`w-8 h-8 rounded-lg text-xs font-medium font-inter transition-all ${
                  page === pagination.currentPage
                    ? "bg-stone-900 text-white shadow-sm"
                    : "border border-stone-200 text-stone-600 hover:bg-white hover:border-stone-300"
                }`}
              >
                {page}
              </button>
            ))}
            {pagination.totalPages > 5 && (
              <span className="text-stone-400 text-xs">…{pagination.totalPages}</span>
            )}
            
            <button 
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange?.(pagination.currentPage + 1)}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-white hover:border-stone-300 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
