"use client";

import React from "react";
import type { User } from "@/types/user";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MaskedField } from "@/components/users/MaskedField";
import {
  maskCardNumber,
  maskIBAN,
  maskSSN,
  maskEIN,
  maskString,
  fullName,
} from "@/lib/utils";
import {
  User as UserIcon,
  MapPin,
  CreditCard,
  Shield,
  Mail,
  Phone,
  Droplet,
  Eye,
  Ruler,
  Weight,
  Globe,
  Building2,
  Landmark,
} from "lucide-react";

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-border/40 last:border-0">
      {icon && (
        <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-all">{value}</p>
      </div>
    </div>
  );
}

interface UserDetailTabsProps {
  user: User;
}

export function UserDetailTabs({ user }: UserDetailTabsProps) {
  const name = fullName(user.firstName, user.lastName);
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div>
      {/* Hero header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50">
        <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-background shadow-lg">
          <AvatarImage src={user.image} alt={name} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground">{name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <div className="flex flex-wrap gap-2 mt-2">
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
            <Badge variant={user.gender === "male" ? "male" : "female"}>
              {user.gender}
            </Badge>
            <Badge variant="outline">Age {user.age}</Badge>
            <Badge variant="outline">{user.bloodGroup}</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="w-full sm:w-auto bg-muted/50 border border-border/60 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-1.5">
            <UserIcon className="h-3.5 w-3.5" />
            <span>Personal</span>
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>Address</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Financial</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>Account</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Personal ─────────────────────────────────────────────── */}
        <TabsContent value="personal">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                Identity
              </h3>
              <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Full Name" value={name} />
              <InfoRow label="Maiden Name" value={user.maidenName || "—"} />
              <InfoRow label="Birth Date" value={user.birthDate} />
              <InfoRow label="Blood Group" value={user.bloodGroup} />
              <InfoRow icon={<Droplet className="h-4 w-4" />} label="Eye Color" value={user.eyeColor} />
              <InfoRow label="Hair Color" value={`${user.hair.color} (${user.hair.type})`} />
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                Physical & Contact
              </h3>
              <InfoRow icon={<Ruler className="h-4 w-4" />} label="Height" value={`${user.height} cm`} />
              <InfoRow icon={<Weight className="h-4 w-4" />} label="Weight" value={`${user.weight} kg`} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone} />
              <InfoRow icon={<Globe className="h-4 w-4" />} label="IP Address" value={user.ip} />
              <InfoRow label="University" value={user.university} />
            </div>
          </div>
        </TabsContent>

        {/* ── Address ──────────────────────────────────────────────── */}
        <TabsContent value="address">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <MapPin className="h-4 w-4" />Home Address
              </h3>
              <InfoRow label="Street" value={user.address.address} />
              <InfoRow label="City" value={user.address.city} />
              <InfoRow label="State" value={`${user.address.state} (${user.address.stateCode})`} />
              <InfoRow label="Postal Code" value={user.address.postalCode} />
              <InfoRow label="Country" value={user.address.country} />
              <InfoRow
                label="Coordinates"
                value={`${user.address.coordinates.lat}, ${user.address.coordinates.lng}`}
              />
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Building2 className="h-4 w-4" />Company
              </h3>
              <InfoRow label="Company" value={user.company.name} />
              <InfoRow label="Department" value={user.company.department} />
              <InfoRow label="Title" value={user.company.title} />
              <InfoRow label="Street" value={user.company.address.address} />
              <InfoRow label="City" value={user.company.address.city} />
              <InfoRow label="State" value={user.company.address.state} />
              <InfoRow label="Country" value={user.company.address.country} />
            </div>
          </div>
        </TabsContent>

        {/* ── Financial ────────────────────────────────────────────── */}
        <TabsContent value="financial">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <CreditCard className="h-4 w-4" />Bank Card
              </h3>
              <MaskedField
                label="Card Number"
                maskedValue={maskCardNumber(user.bank.cardNumber)}
                plainValue={user.bank.cardNumber}
              />
              <InfoRow label="Card Type" value={user.bank.cardType} />
              <InfoRow label="Expiry" value={user.bank.cardExpire} />
              <InfoRow label="Currency" value={user.bank.currency} />
              <MaskedField
                label="IBAN"
                maskedValue={maskIBAN(user.bank.iban)}
                plainValue={user.bank.iban}
              />
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Landmark className="h-4 w-4" />Crypto
              </h3>
              <InfoRow label="Coin" value={user.crypto.coin} />
              <InfoRow label="Network" value={user.crypto.network} />
              <MaskedField
                label="Wallet Address"
                maskedValue={maskString(user.crypto.wallet, 6)}
                plainValue={user.crypto.wallet}
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Account ──────────────────────────────────────────────── */}
        <TabsContent value="account">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Shield className="h-4 w-4" />Account Details
            </h3>
            <div className="space-y-1">
              <InfoRow label="Role" value={user.role} />
              <MaskedField
                label="SSN"
                maskedValue={maskSSN(user.ssn)}
                plainValue={user.ssn}
                mono
              />
              <MaskedField
                label="EIN"
                maskedValue={maskEIN(user.ein)}
                plainValue={user.ein}
                mono
              />
              <InfoRow label="MAC Address" value={user.macAddress} />
            </div>
            <div className="mt-4 pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground mb-1">User Agent</p>
              <p className="text-xs text-foreground break-all leading-relaxed bg-muted/50 rounded p-2">
                {user.userAgent}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
