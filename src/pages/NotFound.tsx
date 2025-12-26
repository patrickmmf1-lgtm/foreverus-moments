import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import HeartInfinity from "@/components/HeartInfinity";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <HeartInfinity size="xl" className="mx-auto opacity-50" />
        <h1 className="text-6xl font-display font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Essa página não existe ou expirou. Mas você ainda pode criar a sua.
        </p>
        <Link to="/criar">
          <Button variant="hero" size="lg">
            Quero criar minha página agora
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
