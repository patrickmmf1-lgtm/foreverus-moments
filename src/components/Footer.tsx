import { Link } from "react-router-dom";
import Logo from "./Logo";
import HeartInfinity from "./HeartInfinity";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground max-w-sm">
              Crie uma página especial para celebrar o amor do seu casal. 
              Contador de tempo juntos + atividades para se escolher todo dia.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Feito com</span>
              <HeartInfinity size="sm" animate />
              <span>para casais apaixonados</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-foreground">Links</h4>
            <ul className="space-y-2">
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
            <h4 className="font-serif font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
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

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ForeverUs. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
