"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MaskedFieldProps {
  label: string;
  maskedValue: string;
  plainValue: string;
  className?: string;
  mono?: boolean;
}

export function MaskedField({
  label,
  maskedValue,
  plainValue,
  className,
  mono = true,
}: MaskedFieldProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p
          className={cn(
            "text-sm text-foreground truncate",
            mono && "font-mono tracking-wide"
          )}
        >
          {revealed ? plainValue : maskedValue}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? "Hide value" : "Show value"}
      >
        {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
