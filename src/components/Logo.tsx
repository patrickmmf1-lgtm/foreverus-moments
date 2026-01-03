import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
  iconOnly?: boolean;
}

const imageSizes = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

export const Logo = ({ 
  className, 
  showIcon = true, 
  size = "md",
  variant = "default",
  iconOnly = false
}: LogoProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src={logoImage} 
        alt="PraSempre" 
        className={cn(
          "object-contain",
          imageSizes[size],
          iconOnly ? "max-w-[40px]" : "max-w-[180px]"
        )}
      />
    </div>
  );
};

export default Logo;
