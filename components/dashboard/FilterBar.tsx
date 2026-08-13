import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  placeholder?: string;
  filters?: React.ReactNode;
}

export default function FilterBar({ placeholder = "Search...", filters }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-stone-200 mb-6 shadow-sm">
      
      {/* Search */}
      <div className="flex-1 w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-stone-400" />
        </div>
        <input 
          type="text"
          placeholder={placeholder}
          className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 pl-10 pr-4 text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all"
        />
      </div>

      {/* Filters (Dropdowns, Tabs, etc.) */}
      {filters && (
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 text-stone-500 mr-2 md:hidden">
            <Filter size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
          </div>
          {filters}
        </div>
      )}

    </div>
  );
}
