import { cn } from "@/lib/utils";
import HeartInfinity from "./HeartInfinity";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
}

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

const iconSizes = {
  sm: "sm" as const,
  md: "md" as const,
  lg: "lg" as const,
};

export const Logo = ({ 
  className, 
  showIcon = true, 
  size = "md",
  variant = "default" 
}: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <HeartInfinity size={iconSizes[size]} animate={false} glow />
      )}
      <span className={cn(
        "font-display font-bold tracking-tight",
        variant === "default" ? "text-foreground" : "text-white",
        textSizes[size]
      )}>
        Pra<span className="text-gradient-primary">Sempre</span>
      </span>
    </div>
  );
};

export default Logo;
