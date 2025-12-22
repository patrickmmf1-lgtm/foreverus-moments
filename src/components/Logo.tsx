import { cn } from "@/lib/utils";
import HeartInfinity from "./HeartInfinity";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
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

export const Logo = ({ className, showIcon = true, size = "md" }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <HeartInfinity size={iconSizes[size]} animate={false} />
      )}
      <span className={cn(
        "font-serif font-semibold tracking-tight text-foreground",
        textSizes[size]
      )}>
        Forever<span className="text-primary">Us</span>
      </span>
    </div>
  );
};

export default Logo;
