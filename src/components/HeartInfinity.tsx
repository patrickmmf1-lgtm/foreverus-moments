import { cn } from "@/lib/utils";

interface HeartInfinityProps {
  className?: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
}

const sizes = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

export const HeartInfinity = ({ 
  className, 
  animate = false, 
  size = "md",
  glow = false 
}: HeartInfinityProps) => {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        sizes[size],
        animate && "heart-pulse",
        glow && "infinity-glow",
        className
      )}
    >
      <defs>
        <linearGradient id="heartGradientNew" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(330, 85%, 60%)" />
          <stop offset="50%" stopColor="hsl(280, 80%, 55%)" />
          <stop offset="100%" stopColor="hsl(330, 85%, 65%)" />
        </linearGradient>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(330, 100%, 70%)" />
          <stop offset="50%" stopColor="hsl(280, 100%, 75%)" />
          <stop offset="100%" stopColor="hsl(330, 100%, 70%)" />
        </linearGradient>
        <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <path
        d="M30 20 C30 12, 22 8, 15 12 C8 16, 8 26, 15 32 L30 45 L45 32 C52 26, 52 16, 45 12 C38 8, 30 12, 30 20Z"
        fill="url(#heartGradientNew)"
        filter={glow ? "url(#glowFilter)" : undefined}
      />
      
      <path
        d="M90 20 C90 12, 82 8, 75 12 C68 16, 68 26, 75 32 L90 45 L105 32 C112 26, 112 16, 105 12 C98 8, 90 12, 90 20Z"
        fill="url(#heartGradientNew)"
        filter={glow ? "url(#glowFilter)" : undefined}
      />
      
      <path
        d="M30 30 Q45 45, 60 30 Q75 15, 90 30"
        stroke="url(#glowGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter={glow ? "url(#glowFilter)" : undefined}
      />
      
      <path
        d="M90 30 Q75 45, 60 30 Q45 15, 30 30"
        stroke="url(#glowGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter={glow ? "url(#glowFilter)" : undefined}
      />
    </svg>
  );
};

export default HeartInfinity;
