import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-glow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent hover:bg-card hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-card hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // ForeverUs custom variants - Dark theme
        hero: "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-neon hover:scale-[1.02] active:scale-[0.98] text-base font-bold",
        "hero-outline": "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-glow transition-all",
        gold: "bg-gradient-gold text-gold-foreground shadow-soft hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98] font-bold",
        neon: "bg-gradient-cta text-primary-foreground shadow-neon hover:shadow-[0_0_80px_hsl(var(--primary)/0.5)] hover:scale-[1.02] active:scale-[0.98] font-bold",
        soft: "bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30",
        glass: "bg-card/50 backdrop-blur-md border border-border/50 text-foreground hover:bg-card/70 hover:border-primary/30",
        activity: "bg-rose text-primary-foreground hover:bg-rose-dark shadow-soft hover:shadow-glow",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-6 text-base",
        xl: "h-14 rounded-2xl px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
