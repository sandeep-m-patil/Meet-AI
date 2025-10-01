"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SearchIcon, XIcon, FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AgentsFiltersProps {
  onFiltersChange?: (filters: {
    search: string | null;
  }) => void;
}

export const AgentsFilters = ({ onFiltersChange }: AgentsFiltersProps) => {
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    const searchValue = value.trim() || "";
    setSearch(searchValue);
    onFiltersChange?.({
      search: searchValue || null,
    });
  };

  const handleActiveChange = (value: boolean) => {
    const activeValue = value ? true : null;
    onFiltersChange?.({
      search: search || null,
    });
  };


  const clearAllFilters = () => {
    setSearch("");
   
    onFiltersChange?.({
      search: null,
    });
  };


  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search agents by name..."
          value={search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>
    </div>
  );
};
