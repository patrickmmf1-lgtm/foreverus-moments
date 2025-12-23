import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  className?: string;
  variant?: "landing" | "minimal";
}

export const Header = ({ className, variant = "landing" }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-xl bg-background/70 border-b border-border/30",
        className
      )}
    >
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size="sm" />
        </Link>

        {variant === "landing" && (
          <>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                <a 
                  href="#como-funciona" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Como funciona
                </a>
                <a 
                  href="#planos" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Planos
                </a>
                <a 
                  href="#depoimentos" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Depoimentos
                </a>
                <a 
                  href="#faq" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border md:hidden">
                <nav className="flex flex-col p-4 gap-4">
                  <a 
                    href="#como-funciona" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Como funciona
                  </a>
                  <a 
                    href="#planos" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Planos
                  </a>
                  <a 
                    href="#depoimentos" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Depoimentos
                  </a>
                  <a 
                    href="#faq" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    FAQ
                  </a>
                  <Link to="/criar" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="hero" className="w-full mt-2">
                      Criar minha página
                    </Button>
                  </Link>
                </nav>
              </div>
            )}
          </>
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
