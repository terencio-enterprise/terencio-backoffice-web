import { cn } from "@/lib/utils"
import * as React from "react"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("border rounded-xl", className)} 
    style={{
      backgroundColor: 'var(--surface)',
      borderColor: 'var(--border)',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }}
    {...props} 
  />
))
Card.displayName = "Card"

export { Card }
