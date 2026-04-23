"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { UserDetailTabs } from "@/components/users/UserDetailTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";

interface UserDetailClientProps {
  id: number;
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-36" />
      <div className="flex items-center gap-4 p-6 rounded-2xl border border-border/60">
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function UserDetailClient({ id }: UserDetailClientProps) {
  const { data: user, isLoading, isError, error, refetch } = useUser(id);

  if (isNaN(id) || id <= 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-lg font-semibold">Invalid user ID</p>
        <Button asChild variant="outline">
          <Link href="/">← Back to users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
        <Link href="/">
          <ChevronLeft className="h-4 w-4" />
          All Users
        </Link>
      </Button>

      {isLoading && <DetailSkeleton />}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-lg font-semibold text-destructive">Failed to load user</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "An error occurred."}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      )}

      {user && <UserDetailTabs user={user} />}
    </div>
  );
}
