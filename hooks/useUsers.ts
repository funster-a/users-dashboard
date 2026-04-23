"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers, getAllUsers } from "@/lib/api";
import type { SortField, SortOrder } from "@/types/user";

interface UseUsersOptions {
  page: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
}

export function useUsers({ page, sortField, sortOrder }: UseUsersOptions) {
  return useQuery({
    queryKey: ["users", page, sortField, sortOrder],
    queryFn: () => getUsers({ page, sortField, sortOrder }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 5,
  });
}
