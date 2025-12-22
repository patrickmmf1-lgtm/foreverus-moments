import { cn } from "@/lib/utils";

interface HeartInfinityProps {
  className?: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export const HeartInfinity = ({ 
  className, 
  animate = true, 
  size = "md" 
}: HeartInfinityProps) => {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        sizes[size],
        animate && "heart-pulse",
        className
      )}
    >
      {/* Infinity symbol made of two hearts */}
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(345, 55%, 40%)" />
          <stop offset="50%" stopColor="hsl(345, 55%, 32%)" />
          <stop offset="100%" stopColor="hsl(345, 50%, 25%)" />
        </linearGradient>
        <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(40, 60%, 50%)" />
          <stop offset="100%" stopColor="hsl(40, 50%, 45%)" />
        </linearGradient>
      </defs>
      
      {/* Left heart of infinity */}
      <path
        d="M25 20
           C15 20 8 27 8 35
           C8 45 18 52 25 58
           C32 52 42 45 42 35
           C42 27 35 20 25 20Z"
        fill="url(#heartGradient)"
      />
      
      {/* Right heart of infinity */}
      <path
        d="M75 20
           C85 20 92 27 92 35
           C92 45 82 52 75 58
           C68 52 58 45 58 35
           C58 27 65 20 75 20Z"
        fill="url(#heartGradient)"
      />
      
      {/* Connection / infinity loop */}
      <path
        d="M25 58
           C32 52 42 45 50 35
           C58 45 68 52 75 58"
        stroke="url(#goldAccent)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Top connection */}
      <path
        d="M25 20
           C32 26 42 30 50 30
           C58 30 68 26 75 20"
        stroke="url(#goldAccent)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
};

export default HeartInfinity;
