
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-900/10 to-transparent" />
      
      <div className="z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-neon-purple">
              <path
                fill="currentColor"
                d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"
              />
            </svg>
            <span className="text-xl font-bold text-gradient-purple">GestureFlow</span>
          </Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">Create an account</h1>
          <p className="text-gray-400">Sign up to get started with GestureFlow</p>
        </div>

        <div className="glass-morphism p-8 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-200">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-200">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-gray-400">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity"
            >
              {isLoading ? <Spinner size="sm" /> : "Sign Up"}
            </Button>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-neon-purple hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
