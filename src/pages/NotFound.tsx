
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-900/10 to-transparent" />
      
      <div className="z-10 text-center">
        <h1 className="text-8xl font-bold text-gradient-purple mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
          We couldn't find the page you were looking for. The gesture to access this page might not exist yet.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
