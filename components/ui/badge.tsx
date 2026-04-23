import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
        admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
        moderator: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
        user: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
        male: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
        female: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
