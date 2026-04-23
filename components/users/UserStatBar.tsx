"use client";

import React, { useMemo } from "react";
import { useAllUsers } from "@/hooks/useUsers";
import { Users, TrendingUp, Palette, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}

function StatCard({ icon, label, value, sub, color }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4">
      <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function UserStatBar() {
  const { data, isLoading } = useAllUsers();

  const stats = useMemo(() => {
    if (!data) return null;
    const users = data.users;
    const total = data.total;
    const males = users.filter((u) => u.gender === "male").length;
    const females = users.filter((u) => u.gender === "female").length;
    const malePct = total > 0 ? Math.round((males / total) * 100) : 0;
    const femalePct = total > 0 ? Math.round((females / total) * 100) : 0;
    const avgAge =
      users.length > 0
        ? Math.round(users.reduce((sum, u) => sum + u.age, 0) / users.length)
        : 0;

    const hairCount: Record<string, number> = {};
    for (const u of users) {
      const color = u.hair?.color ?? "Unknown";
      hairCount[color] = (hairCount[color] ?? 0) + 1;
    }
    const topHair = Object.entries(hairCount).sort((a, b) => b[1] - a[1])[0];

    return { total, malePct, femalePct, avgAge, topHair };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={<Users className="h-5 w-5 text-indigo-600" />}
        label="Total Users"
        value={stats.total.toLocaleString()}
        color="bg-indigo-50 dark:bg-indigo-950/50"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
        label="Gender Split"
        value={`${stats.malePct}% / ${stats.femalePct}%`}
        sub={`Male / Female`}
        color="bg-emerald-50 dark:bg-emerald-950/50"
      />
      <StatCard
        icon={<Palette className="h-5 w-5 text-amber-600" />}
        label="Top Hair Color"
        value={stats.topHair?.[0] ?? "—"}
        sub={`${stats.topHair?.[1] ?? 0} users`}
        color="bg-amber-50 dark:bg-amber-950/50"
      />
      <StatCard
        icon={<Calendar className="h-5 w-5 text-rose-600" />}
        label="Average Age"
        value={`${stats.avgAge} yrs`}
        color="bg-rose-50 dark:bg-rose-950/50"
      />
    </div>
  );
}
