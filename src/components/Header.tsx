import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  variant?: "landing" | "minimal";
}

export const Header = ({ className, variant = "landing" }: HeaderProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size="sm" />
        </Link>

        {variant === "landing" && (
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a 
                href="#como-funciona" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Como funciona
              </a>
              <a 
                href="#planos" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Planos
              </a>
              <a 
                href="#faq" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </nav>
            <Link to="/criar">
              <Button variant="hero" size="default">
                Criar minha página
              </Button>
            </Link>
          </div>
        )}

        {variant === "minimal" && (
          <Link to="/criar">
            <Button variant="soft" size="sm">
              Criar sua página
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
