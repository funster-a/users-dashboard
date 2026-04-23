"use client";

import React from "react";
import Link from "next/link";
import type { User } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fullName } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/50">
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground">User</th>
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground hidden sm:table-cell">Username</th>
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground hidden md:table-cell">Email</th>
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground hidden lg:table-cell">Company</th>
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Role</th>
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground hidden md:table-cell">Age</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {users.map((user) => {
            const name = fullName(user.firstName, user.lastName);
            const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
            return (
              <tr
                key={user.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="py-3 px-4">
                  <Link
                    href={`/users/${user.id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={user.image} alt={name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground group-hover:text-indigo-500 transition-colors">
                      {name}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                  @{user.username}
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden md:table-cell truncate max-w-[180px]">
                  {user.email}
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                  <div className="truncate max-w-[160px]">
                    <span className="font-medium text-foreground">{user.company.name}</span>
                    <br />
                    <span className="text-xs">{user.company.title}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      user.role === "admin"
                        ? "admin"
                        : user.role === "moderator"
                        ? "moderator"
                        : "user"
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                  {user.age}
                </td>
                <td className="py-3 px-4">
                  <Link href={`/users/${user.id}`}>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
