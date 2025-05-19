
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { gestureDetection, GestureType } from "@/lib/gestureDetection";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleTryGesture = async (gesture: GestureType) => {
    try {
      await gestureDetection.start({
        onGestureDetected: (detectedGesture) => {
          // In a real app, this would respond to actual detected gestures
          // Here we're just simulating detection with the same gesture that was requested
          toast({
            title: `${formatGestureName(detectedGesture)} detected!`,
            description: getGestureDescription(detectedGesture),
          });
          gestureDetection.stop();
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Camera access error",
            description: error.message,
          });
          gestureDetection.stop();
        }
      });
      
      // Simulate the gesture detection after a delay
      gestureDetection.simulateGestureDetection(gesture);
      
      toast({
        title: "Camera activated",
        description: "Detecting gesture...",
      });
    } catch (error) {
      console.error("Error starting gesture detection:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start gesture detection.",
      });
    }
  };
  
  const formatGestureName = (gesture: GestureType) => {
    switch (gesture) {
      case "slideUp": return "Hand Slide Up";
      case "slideDown": return "Hand Slide Down";
      case "slideLeft": return "Hand Slide Left";
      case "slideRight": return "Hand Slide Right";
      case "clap": return "Clap";
      case "peace": return "Peace Sign";
      case "pinch": return "Pinch";
      default: return gesture;
    }
  };
  
  const getGestureDescription = (gesture: GestureType) => {
    switch (gesture) {
      case "slideUp": return "Brightness increased!";
      case "slideDown": return "Brightness decreased!";
      case "slideLeft": return "Volume decreased!";
      case "slideRight": return "Volume increased!";
      case "clap": return "Opening Chrome...";
      case "peace": return "Window closed!";
      case "pinch": return "Screenshot taken!";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-section relative flex flex-col justify-center items-center px-4 text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-900/10 to-transparent" />
        
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="w-full max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/5 backdrop-blur border border-white/10">
              <p className="text-sm font-medium text-gray-300">
                Community support, live demos, thousands of users
              </p>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold mb-6 text-gradient glow">
              The Complete Hand Gesture Control Platform
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto">
              GestureFlow is an all-in-one platform for controlling your device with natural hand gestures.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button size="lg" className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity">
                  Get started - it's free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white/50"
          >
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </div>
      </section>
      
      {/* Hand Slide Up/Down Section */}
      <section 
        ref={(el) => (sectionRefs.current[0] = el)} 
        className="gesture-section flex items-center relative bg-gradient-to-b from-black to-purple-950/20 opacity-0"
      >
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-purple">
                Hand Slide Up/Down
              </h2>
              <p className="text-lg mb-6 text-gray-300">
                Control your screen brightness with natural up and down hand movements. Slide your hand up to increase brightness or down to decrease it.
              </p>
              <Button 
                onClick={() => handleTryGesture("slideUp")}
                className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity"
              >
                Try This Gesture
              </Button>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-700/20 to-pink-600/20 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-pulse-neon opacity-50" style={{ boxShadow: "0 0 40px 10px rgba(139, 92, 246, 0.3)" }}></div>
                <svg viewBox="0 0 24 24" className="w-24 h-24 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hand Slide Right/Left Section */}
      <section 
        ref={(el) => (sectionRefs.current[1] = el)} 
        className="gesture-section flex items-center relative bg-gradient-to-b from-purple-950/20 to-blue-950/20 opacity-0"
      >
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-700/20 to-purple-600/20 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-pulse-neon opacity-50" style={{ boxShadow: "0 0 40px 10px rgba(30, 174, 219, 0.3)" }}></div>
                <svg viewBox="0 0 24 24" className="w-24 h-24 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 8H3m18 8H3m12-4l4 4m0 0l4-4m-4 4V4"/>
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-blue">
                Hand Slide Right/Left
              </h2>
              <p className="text-lg mb-6 text-gray-300">
                Adjust your audio volume with horizontal hand movements. Slide your hand right to increase volume or left to decrease it.
              </p>
              <Button 
                onClick={() => handleTryGesture("slideRight")}
                className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity"
              >
                Try This Gesture
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Clap Section */}
      <section 
        ref={(el) => (sectionRefs.current[2] = el)} 
        className="gesture-section flex items-center relative bg-gradient-to-b from-blue-950/20 to-purple-950/20 opacity-0"
      >
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-purple">
                Clap Gesture
              </h2>
              <p className="text-lg mb-6 text-gray-300">
                Open your favorite browser instantly with a simple clap. No need to search for icons or use your mouse.
              </p>
              <Button 
                onClick={() => handleTryGesture("clap")}
                className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity"
              >
                Try This Gesture
              </Button>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-700/20 to-pink-600/20 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-pulse-neon opacity-50" style={{ boxShadow: "0 0 40px 10px rgba(139, 92, 246, 0.3)" }}></div>
                <svg viewBox="0 0 24 24" className="w-24 h-24 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8v.01M12 12v.01M12 16v.01M12 20h8.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C25 17.72 25 16.88 25 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C22.72 4 21.88 4 20.2 4H3.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C-1 6.28-1 7.12-1 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C1.28 20 2.12 20 3.8 20H12Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Peace Sign Section */}
      <section 
        ref={(el) => (sectionRefs.current[3] = el)} 
        className="gesture-section flex items-center relative bg-gradient-to-b from-purple-950/20 to-pink-950/20 opacity-0"
      >
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-pink-700/20 to-purple-600/20 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-pulse-neon opacity-50" style={{ boxShadow: "0 0 40px 10px rgba(217, 70, 239, 0.3)" }}></div>
                <svg viewBox="0 0 24 24" className="w-24 h-24 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11.5 3a16.989 16.989 0 0 0-4.648 12M12.5 3a16.989 16.989 0 0 1 4.648 12m-2.148 0h-5" />
                  <path d="M15 3h.01M9 3h.01" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-purple">
                Peace Sign
              </h2>
              <p className="text-lg mb-6 text-gray-300">
                Close the current window with a simple peace sign gesture. Multitask effortlessly without touching your keyboard.
              </p>
              <Button 
                onClick={() => handleTryGesture("peace")}
                className="bg-gradient-to-r from-neon-pink to-neon-purple hover:opacity-90 transition-opacity"
              >
                Try This Gesture
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pinch Section */}
      <section 
        ref={(el) => (sectionRefs.current[4] = el)} 
        className="gesture-section flex items-center relative bg-gradient-to-b from-pink-950/20 to-black opacity-0"
      >
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-blue">
                Pinch Gesture
              </h2>
              <p className="text-lg mb-6 text-gray-300">
                Capture and save screenshots with a simple pinch gesture. Share important information without navigating through complex menus.
              </p>
              <Button 
                onClick={() => handleTryGesture("pinch")}
                className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity"
              >
                Try This Gesture
              </Button>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-700/20 to-purple-600/20 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-pulse-neon opacity-50" style={{ boxShadow: "0 0 40px 10px rgba(30, 174, 219, 0.3)" }}></div>
                <svg viewBox="0 0 24 24" className="w-24 h-24 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3a6 6 0 0 0-6 6c0 2.83 4 8 6 9.5 2-1.5 6-6.67 6-9.5a6 6 0 0 0-6-6Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-t from-black to-black/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">
            Ready to Control Your Computer with Gestures?
          </h2>
          <p className="text-lg mb-10 text-gray-300 max-w-2xl mx-auto">
            Get started today with our free plan and unlock the power of gesture-based control.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity">
                Get started - it's free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5">
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-neon-purple">
                <path
                  fill="currentColor"
                  d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"
                />
              </svg>
              <span className="text-xl font-bold text-gradient-purple">GestureFlow</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} GestureFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
