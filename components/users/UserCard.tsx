"use client";

import React from "react";
import Link from "next/link";
import type { User } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Building2, MapPin } from "lucide-react";
import { fullName } from "@/lib/utils";

interface UserCardProps {
  user: User;
}

const roleVariantMap: Record<
  User["role"],
  "admin" | "moderator" | "user"
> = {
  admin: "admin",
  moderator: "moderator",
  user: "user",
};

export function UserCard({ user }: UserCardProps) {
  const name = fullName(user.firstName, user.lastName);
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <Link href={`/users/${user.id}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden border-border/60 group-hover:border-indigo-400/60 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-200">
        <CardContent className="flex flex-col gap-3 p-5 h-full">
          {/* Header row */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-offset-background ring-indigo-400/40">
              <AvatarImage src={user.image} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground truncate leading-tight">
                {name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{user.username}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <Badge variant={roleVariantMap[user.role]}>{user.role}</Badge>
                <Badge variant={user.gender === "male" ? "male" : "female"}>
                  {user.gender}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Age {user.age}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1.5 text-sm mt-auto">
            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {user.company.name} · {user.company.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {user.address.city}, {user.address.state}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
