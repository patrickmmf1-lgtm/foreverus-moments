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
  sm: "h-7",
  md: "h-9",
  lg: "h-11",
};

export const Logo = ({ 
  className, 
  size = "md",
  iconOnly = false
}: LogoProps) => {
  if (iconOnly) {
    // Show only the icon portion for small spaces
    return (
      <div className={cn("flex items-center", className)}>
        <img 
          src={logoImage} 
          alt="PraSempre" 
          className={cn(
            "object-contain object-left",
            imageSizes[size],
            "max-w-[40px]"
          )}
          style={{ objectPosition: "left center" }}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src={logoImage} 
        alt="PraSempre" 
        className={cn(
          "object-contain",
          imageSizes[size]
        )}
      />
    </div>
  );
};

export default Logo;
