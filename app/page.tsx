"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import type {
  GenderFilter,
  SortField,
  SortOrder,
  ViewMode,
} from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useFilterByGender } from "@/hooks/useUserSearch";
import { useFilterByHairColor } from "@/hooks/useUserSearch";
import { UserCard } from "@/components/users/UserCard";
import { UserTable } from "@/components/users/UserTable";
import { UserStatBar } from "@/components/users/UserStatBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  LayoutGrid,
  Table2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

const HAIR_COLORS = ["Black", "Blond", "Brown", "Chestnut", "Auburn", "Gray", "White", "Red"];
const PAGE_SIZE = 30;

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <div className="bg-muted/50 p-4 grid grid-cols-5 gap-4">
        {["User", "Username", "Email", "Role", "Age"].map((h) => (
          <Skeleton key={h} className="h-4 w-20" />
        ))}
      </div>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="border-t border-border/40 p-4 grid grid-cols-5 gap-4 items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [gender, setGender] = useState<GenderFilter>("");
  const [hairColor, setHairColor] = useState("");
  const [sortField, setSortField] = useState<SortField>("firstName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, gender, hairColor]);

  const isSearching = debouncedSearch.trim().length >= 1;
  const isFilteringGender = !isSearching && !!gender;
  const isFilteringHair = !isSearching && !gender && !!hairColor;
  const isPaginated = !isSearching && !isFilteringGender && !isFilteringHair;

  const paginatedQuery = useUsers({
    page,
    sortField: isPaginated ? sortField : undefined,
    sortOrder: isPaginated ? sortOrder : undefined,
  });
  const searchQuery = useUserSearch(debouncedSearch);
  const genderQuery = useFilterByGender(isFilteringGender ? gender : "");
  const hairQuery = useFilterByHairColor(isFilteringHair ? hairColor : "");

  const activeQuery = isSearching
    ? searchQuery
    : isFilteringGender
    ? genderQuery
    : isFilteringHair
    ? hairQuery
    : paginatedQuery;

  // Client-side sort for filtered results
  const displayedUsers = useMemo<User[]>(() => {
    if (!activeQuery.data) return [];
    let users = [...activeQuery.data.users];
    if (!isPaginated) {
      users = users.sort((a, b) => {
        if (sortField === "firstName") {
          return sortOrder === "asc"
            ? a.firstName.localeCompare(b.firstName)
            : b.firstName.localeCompare(a.firstName);
        }
        return sortOrder === "asc" ? a.age - b.age : b.age - a.age;
      });
    }
    return users;
  }, [activeQuery.data, isPaginated, sortField, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil((paginatedQuery.data?.total ?? PAGE_SIZE) / PAGE_SIZE)
  );

  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
    },
    [sortField]
  );

  const hasActiveFilters = !!search || !!gender || !!hairColor;

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setGender("");
    setHairColor("");
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Users Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse, search, and manage all users.
        </p>
      </div>

      {/* Stats */}
      <UserStatBar />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="search-users"
            className="pl-9"
            placeholder="Search users by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={gender || "all"}
            onValueChange={(v) => setGender(v === "all" ? "" : (v as GenderFilter))}
          >
            <SelectTrigger className="w-36" id="filter-gender">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={hairColor || "all"}
            onValueChange={(v) => setHairColor(v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-40" id="filter-hair">
              <SelectValue placeholder="Hair color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All hair colors</SelectItem>
              {HAIR_COLORS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => toggleSort(sortField)}
            id="sort-toggle"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortField === "firstName" ? "Name" : "Age"}
            {sortOrder === "asc" ? " ↑" : " ↓"}
          </Button>

          <Select
            value={sortField}
            onValueChange={(v) => setSortField(v as SortField)}
          >
            <SelectTrigger className="w-32" id="sort-field">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstName">Name</SelectItem>
              <SelectItem value="age">Age</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border/60 p-0.5 bg-muted/50">
            <button
              id="view-grid"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              id="view-table"
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "table"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Table view"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {activeQuery.isError && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg font-semibold text-destructive">
            Failed to load users
          </p>
          <p className="text-sm text-muted-foreground">
            {activeQuery.error instanceof Error
              ? activeQuery.error.message
              : "An unexpected error occurred."}
          </p>
          <Button onClick={() => activeQuery.refetch()} variant="outline">
            Retry
          </Button>
        </div>
      )}

      {/* Loading */}
      {activeQuery.isLoading &&
        (viewMode === "grid" ? <GridSkeleton /> : <TableSkeleton />)}

      {/* Empty state */}
      {!activeQuery.isLoading && !activeQuery.isError && displayedUsers.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-lg font-semibold">No users found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Results */}
      {!activeQuery.isLoading && !activeQuery.isError && displayedUsers.length > 0 && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <UserTable users={displayedUsers} />
          )}

          {/* Pagination (paginated mode only) */}
          {isPaginated && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ·{" "}
                {paginatedQuery.data?.total ?? 0} total users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  id="prev-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  id="next-page"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
