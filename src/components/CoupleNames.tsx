import { cn } from "@/lib/utils";

interface CoupleNamesProps {
  name1: string;
  name2?: string | null;
  className?: string;
}

const CoupleNames = ({ name1, name2, className }: CoupleNamesProps) => {
  if (!name2) {
    return <span className={className}>{name1}</span>;
  }

  return (
    <span className={cn("inline-flex items-baseline justify-center gap-[0.25em] whitespace-nowrap", className)}>
      <span>{name1}</span>
      <span>&</span>
      <span>{name2}</span>
    </span>
  );
};

export default CoupleNames;
