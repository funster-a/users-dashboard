"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api";

export function useUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id && !isNaN(id),
  });
}
