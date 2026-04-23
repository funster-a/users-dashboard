"use client";

import { useQuery } from "@tanstack/react-query";
import { searchUsers, filterByGender, filterByHairColor } from "@/lib/api";
import type { GenderFilter } from "@/types/user";

export function useUserSearch(q: string) {
  return useQuery({
    queryKey: ["users", "search", q],
    queryFn: () => searchUsers(q),
    enabled: q.trim().length >= 1,
    staleTime: 1000 * 30,
  });
}

export function useFilterByGender(gender: GenderFilter) {
  return useQuery({
    queryKey: ["users", "filter", "gender", gender],
    queryFn: () => filterByGender(gender),
    enabled: !!gender,
    staleTime: 1000 * 60 * 2,
  });
}

export function useFilterByHairColor(color: string) {
  return useQuery({
    queryKey: ["users", "filter", "hairColor", color],
    queryFn: () => filterByHairColor(color),
    enabled: !!color,
    staleTime: 1000 * 60 * 2,
  });
}
