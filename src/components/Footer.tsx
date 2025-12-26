import { Link } from "react-router-dom";
import Logo from "./Logo";
import HeartInfinity from "./HeartInfinity";
import { Instagram, Music2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Crie uma página que eterniza seu amor – contador de tempo + atividades 
              para vocês fazerem juntos, para sempre.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Feito com</span>
              <HeartInfinity size="sm" animate glow />
              <span>para casais apaixonados</span>
            </div>
            
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
              >
                <Music2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Links</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#como-funciona" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Como funciona
                </a>
              </li>
              <li>
                <a 
                  href="#planos" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Planos e preços
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Perguntas frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/termos" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacidade" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link 
                  to="/suporte" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ForeverUs. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
