"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SortOption {
  value: string;
  label: string;
}

const defaultSortOptions: SortOption[] = [
  { value: "latest", label: "Latest" },
  { value: "highest-value", label: "Highest Value" },
  { value: "az", label: "A – Z" },
];

export function WinnersFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  sortOptions = defaultSortOptions,
}: {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort: string | null;
  onSortChange: (value: string | null) => void;
  sortOptions?: SortOption[];
}) {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-xl border-b border-black/10 p-5 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={cn(
                "relative pb-2 text-xs font-bold tracking-wide uppercase transition-colors",
                isActive ? "text-[#0D0C0C]" : "text-black/40 hover:text-black/70"
              )}
            >
              {category}
              {isActive ? (
                <span className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-brand-gradient" />
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/30" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search winners"
            className="h-10 w-44 rounded-lg border-black/10 bg-black/3 pl-9 text-xs sm:w-56"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wide text-black/40 uppercase">
            Sort by
          </span>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="h-10 w-33 rounded-lg border-black/10 bg-black/3 text-xs font-semibold uppercase">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>   
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}