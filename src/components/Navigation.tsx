
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";

interface NavigationProps {
  scrollToPricing?: (e: React.MouseEvent) => void;
}

const Navigation = ({ scrollToPricing }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-lg bg-black/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/"
              className={`text-sm font-medium transition-colors hover:text-white ${
                location.pathname === '/' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Home
            </Link>
            <a 
              href="#pricing"
              onClick={scrollToPricing}
              className="text-sm font-medium transition-colors hover:text-white text-gray-400"
            >
              Pricing
            </a>
            {user ? (
              <>
                <Link 
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    location.pathname === '/login' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    location.pathname === '/signup' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex md:hidden">
            {user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="border border-white/10">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-to-r from-neon-purple to-neon-pink">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
