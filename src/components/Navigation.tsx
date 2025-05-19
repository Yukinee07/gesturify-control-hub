
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const Navigation = () => {
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-lg bg-black/50 dark:bg-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/"
              className={`text-sm font-medium transition-colors hover:text-white dark:hover:text-black ${
                location.pathname === '/' ? 'text-white dark:text-black' : 'text-gray-400 dark:text-gray-600'
              }`}
            >
              Home
            </Link>
            <button 
              onClick={() => scrollToSection("pricing")}
              className={`text-sm font-medium transition-colors hover:text-white dark:hover:text-black ${
                location.pathname === '/pricing' ? 'text-white dark:text-black' : 'text-gray-400 dark:text-gray-600'
              }`}
            >
              Pricing
            </button>
            {user ? (
              <>
                <Link 
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-white dark:hover:text-black ${
                    location.pathname === '/dashboard' ? 'text-white dark:text-black' : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-white dark:hover:text-black"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={`text-sm font-medium transition-colors hover:text-white dark:hover:text-black ${
                    location.pathname === '/login' ? 'text-white dark:text-black' : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  className={`text-sm font-medium transition-colors hover:text-white dark:hover:text-black ${
                    location.pathname === '/signup' ? 'text-white dark:text-black' : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
            <ThemeToggle />
          </nav>
          
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="ml-2 border border-white/10">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="sm" className="ml-2 bg-gradient-to-r from-neon-purple to-neon-pink">
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
