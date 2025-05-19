
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-neon-purple">
        <path
          fill="currentColor"
          d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"
        />
      </svg>
      <span className="text-xl font-bold text-gradient-purple">GestureFlow</span>
    </Link>
  );
};

export default Logo;
