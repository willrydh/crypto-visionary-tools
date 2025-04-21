
import * as React from "react";
import { cn } from "@/lib/utils";

interface TransparentWhiteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const TransparentWhiteButton = React.forwardRef<HTMLButtonElement, TransparentWhiteButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "bg-transparent border border-white text-white rounded-lg px-6 py-2 font-semibold transition-colors duration-150 hover:bg-white/10 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70 whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

TransparentWhiteButton.displayName = "TransparentWhiteButton";
export default TransparentWhiteButton;
