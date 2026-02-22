import { cn } from "@/lib/utils";
import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "danger" | "warning";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "default", style, ...props }, ref) => {
  const variantStyles = {
    default: {
      backgroundColor: 'var(--surface-alt)',
      color: 'var(--text-secondary)'
    },
    success: {
      backgroundColor: 'var(--success-bg)',
      color: 'var(--success-text)'
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger-text)'
    },
    warning: {
      backgroundColor: 'var(--warning-bg)',
      color: 'var(--warning-text)'
    },
  };
  
  return (
    <span 
      ref={ref}
      className={cn("px-2 py-0.5 rounded-full text-xs font-medium", className)} 
      style={{ ...variantStyles[variant], ...style }}
      {...props} 
    />
  );
})
Badge.displayName = "Badge"

export { Badge };
