
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { gestureDetection, GestureType } from "@/lib/gestureDetection";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Volume2, VolumeX, Chrome, MessageSquare, Camera,
  HandMetal, PanelLeft, Settings, CheckCircle, X
} from "lucide-react";

const Index = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [activeGesture, setActiveGesture] = useState<GestureType | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [gestureStatus, setGestureStatus] = useState<{[key: string]: string}>({});
  const [currentBrightness, setCurrentBrightness] = useState(1);
  const [currentVolume, setCurrentVolume] = useState(0.5);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cursorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  // Track mouse movement for cursor gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate cursor gradient
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.top = `${mousePosition.y}px`;
      cursorRef.current.style.left = `${mousePosition.x}px`;
    }
  }, [mousePosition]);

  // Stop gesture detection when component unmounts
  useEffect(() => {
    return () => {
      if (permissionGranted) {
        gestureDetection.stop();
      }
    };
  }, [permissionGranted]);

  // Update video stream if permission granted
  useEffect(() => {
    if (permissionGranted && videoRef.current && gestureDetection.stream) {
      videoRef.current.srcObject = gestureDetection.stream;
    }
  }, [permissionGranted]);

  // Handle gesture detection
  const handleGestureDetected = (gesture: GestureType) => {
    setActiveGesture(gesture);
    console.log("Gesture detected:", gesture);
    
    // Update status for the relevant gesture section
    let statusUpdate = "";

    // Apply the corresponding action based on the detected gesture
    switch (gesture) {
      case 'slideUp':
        const newBrightnessUp = Math.min(currentBrightness + 0.1, 1.5);
        setCurrentBrightness(newBrightnessUp);
        gestureDetection.adjustBrightness('up');
        statusUpdate = `Increasing brightness to ${Math.round(newBrightnessUp * 100)}%`;
        setGestureStatus(prev => ({...prev, brightness: statusUpdate}));
        toast({
          title: "Brightness Increased",
          description: `Brightness set to ${Math.round(newBrightnessUp * 100)}%`,
        });
        break;
      case 'slideDown':
        const newBrightnessDown = Math.max(currentBrightness - 0.1, 0.5);
        setCurrentBrightness(newBrightnessDown);
        gestureDetection.adjustBrightness('down');
        statusUpdate = `Decreasing brightness to ${Math.round(newBrightnessDown * 100)}%`;
        setGestureStatus(prev => ({...prev, brightness: statusUpdate}));
        toast({
          title: "Brightness Decreased",
          description: `Brightness set to ${Math.round(newBrightnessDown * 100)}%`,
        });
        break;
      case 'slideRight':
        const newVolumeUp = Math.min(currentVolume + 0.1, 1.0);
        setCurrentVolume(newVolumeUp);
        gestureDetection.adjustVolume('up');
        statusUpdate = `Increasing volume to ${Math.round(newVolumeUp * 100)}%`;
        setGestureStatus(prev => ({...prev, volume: statusUpdate}));
        toast({
          title: "Volume Increased",
          description: `Volume set to ${Math.round(newVolumeUp * 100)}%`,
        });
        break;
      case 'slideLeft':
        const newVolumeDown = Math.max(currentVolume - 0.1, 0.0);
        setCurrentVolume(newVolumeDown);
        gestureDetection.adjustVolume('down');
        statusUpdate = `Decreasing volume to ${Math.round(newVolumeDown * 100)}%`;
        setGestureStatus(prev => ({...prev, volume: statusUpdate}));
        toast({
          title: "Volume Decreased",
          description: `Volume set to ${Math.round(newVolumeDown * 100)}%`,
        });
        break;
      case 'clap':
        gestureDetection.openChrome();
        statusUpdate = "Opening Chrome browser";
        setGestureStatus(prev => ({...prev, openChrome: statusUpdate}));
        toast({
          title: "Opening Chrome",
          description: "Launching Chrome browser",
        });
        break;
      case 'peace':
        gestureDetection.closeWindow();
        statusUpdate = "Peace sign detected - would close window";
        setGestureStatus(prev => ({...prev, closeWindow: statusUpdate}));
        toast({
          title: "Window Close Gesture",
          description: "Close window gesture detected",
        });
        break;
      case 'pinch':
        gestureDetection.takeScreenshot();
        statusUpdate = "Pinch detected - would take screenshot";
        setGestureStatus(prev => ({...prev, screenshot: statusUpdate}));
        toast({
          title: "Screenshot Gesture",
          description: "Screenshot gesture detected",
        });
        break;
      case 'none':
        // No gesture detected
        break;
    }

    // Clear the active gesture state after a short delay
    setTimeout(() => {
      setActiveGesture(null);
    }, 2000);
  };

  const requestCameraPermission = async (sectionId: string) => {
    try {
      await gestureDetection.requestPermission();
      setPermissionGranted(true);
      setActiveVideoId(sectionId);
      toast({
        title: "Camera access granted",
        description: "You can now try the gesture controls.",
      });

      // Start gesture detection with callback
      gestureDetection.start({
        onGestureDetected: handleGestureDetected,
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Gesture Detection Error",
            description: error.message,
          });
        }
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to use gesture controls.",
      });
    }
  };

  const gestureSections = [
    {
      id: "brightness",
      title: "Hand Slide Up/Down",
      description: "Control screen brightness with a simple hand movement.",
      icon: <ArrowUp className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('slideUp'),
      gestureType: ['slideUp', 'slideDown'],
      status: gestureStatus.brightness || "Waiting for gesture...",
      value: currentBrightness
    },
    {
      id: "volume",
      title: "Hand Slide Right/Left",
      description: "Increase or decrease volume with horizontal hand movements.",
      icon: <Volume2 className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('slideRight'),
      gestureType: ['slideLeft', 'slideRight'],
      status: gestureStatus.volume || "Waiting for gesture...",
      value: currentVolume
    },
    {
      id: "openChrome",
      title: "Peace Sign",
      description: "Open Chrome browser with a peace sign gesture.",
      icon: <HandMetal className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('clap'),
      gestureType: ['clap'],
      status: gestureStatus.openChrome || "Waiting for gesture..."
    },
    {
      id: "closeWindow",
      title: "Clap",
      description: "Close the currently active window with a clap gesture.",
      icon: <PanelLeft className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('peace'),
      gestureType: ['peace'],
      status: gestureStatus.closeWindow || "Waiting for gesture..."
    },
    {
      id: "screenshot",
      title: "Pinch",
      description: "Take a screenshot with a pinching gesture.",
      icon: <Camera className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('pinch'),
      gestureType: ['pinch'],
      status: gestureStatus.screenshot || "Waiting for gesture..."
    },
  ];

  const handleCustomGestureTool = () => {
    if (!user) {
      navigate("/login");
      toast({
        title: "Login Required",
        description: "Please log in to create custom gestures.",
      });
    } else {
      // Scroll to pricing section
      pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Pricing plans data
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic gesture controls for personal use",
      features: [
        "5 built-in gestures",
        "Basic brightness and volume control",
        "Chrome browser integration",
        "Community support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
      recommended: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "monthly",
      description: "Advanced controls for power users",
      features: [
        "Everything in Free",
        "Custom gesture creation",
        "Advanced application control",
        "Priority support",
        "Multiple device profiles"
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "default",
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      description: "Custom solutions for organizations",
      features: [
        "Everything in Pro",
        "Custom integration development",
        "Team management",
        "Dedicated account manager",
        "Training sessions"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Custom cursor gradient - always visible */}
      <div 
        ref={cursorRef} 
        className="fixed pointer-events-none w-64 h-64 rounded-full bg-gradient-radial from-neon-purple/30 to-transparent -translate-x-1/2 -translate-y-1/2 z-0 blur-lg"
      />

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        <Navigation scrollToPricing={scrollToPricing} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6 transition-all transform hover:scale-105 duration-300">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient glow">
                Control Your Device With Hand Gestures
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Manage your computer with simple hand movements. Adjust brightness, control volume,
                launch apps, and more without touching your keyboard.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity transform hover:scale-105 duration-300">
                    Get Started — It's Free
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/10 hover:bg-white/5 transform hover:scale-105 duration-300"
                  onClick={scrollToPricing}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Gesture Control Sections with consistent spacing and glow effect */}
      {gestureSections.map((section, index) => (
        <div 
          key={section.id}
          className="min-h-screen flex items-center justify-center relative bg-black scroll-mt-16 py-24 px-4"
          id={section.id}
        >
          <div 
            className={`container mx-auto flex flex-col md:flex-row items-center ${
              index % 2 !== 0 ? 'md:flex-row-reverse' : ''
            } gap-16`}
          >
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
              <div className="mb-6 transform hover:scale-110 transition-transform duration-300">{section.icon}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient text-center md:text-left">{section.title}</h2>
              <p className="text-xl text-gray-300 mb-8 text-center md:text-left">{section.description}</p>
              <Button 
                onClick={() => {
                  if (!permissionGranted) {
                    requestCameraPermission(section.id);
                  } else {
                    setActiveVideoId(section.id);
                    section.gestureDemo();
                  }
                }}
                className={`bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-all transform hover:scale-105 duration-300 ${
                  section.gestureType.includes(activeGesture as any) ? 'ring-4 ring-neon-purple' : ''
                }`}
              >
                Try This Gesture
              </Button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div 
                className={`feature-box neo-blur rounded-xl w-full max-w-md aspect-video flex items-center justify-center transition-all duration-500 ${
                  section.gestureType.includes(activeGesture as any) ? 'ring-4 ring-neon-purple scale-105' : ''
                }`}
              >
                <div className="text-center p-8 w-full">
                  <h3 className="text-xl font-semibold mb-4">Gesture Recognition Zone</h3>
                  {permissionGranted && activeVideoId === section.id ? (
                    <div className="relative zoom-in">
                      <video 
                        ref={videoRef}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                        autoPlay
                        playsInline
                        muted
                      />
                      <div className="mb-3 text-white bg-black/50 p-2 rounded">
                        <p className="font-mono text-sm">
                          {section.status}
                        </p>
                      </div>
                      {'value' in section && (
                        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                          <div 
                            className="bg-gradient-to-r from-neon-purple to-neon-pink h-full rounded-full"
                            style={{ width: `${Math.round(section.value * 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">
                      Click 'Try This Gesture' to enable camera and test this gesture.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Custom Gesture Tool Section */}
      <div 
        id="custom-gestures"
        className="min-h-screen flex items-center justify-center relative bg-black scroll-mt-16 py-24 px-4"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
              <Settings className="w-12 h-12 text-neon-purple" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient text-center md:text-left">Create Your Own Gesture Tool</h2>
            <p className="text-xl text-gray-300 mb-8 text-center md:text-left">
              Define custom gestures and assign them to any action you want. Take control of your device like never before.
            </p>
            <Button 
              onClick={handleCustomGestureTool}
              className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-all transform hover:scale-105 duration-300"
            >
              Try Now
            </Button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="feature-box neo-blur rounded-xl w-full max-w-md aspect-video flex items-center justify-center transition-transform hover:scale-105 duration-300">
              <div className="text-center p-8">
                <h3 className="text-xl font-semibold mb-4">Custom Gesture Creator</h3>
                <p className="text-gray-400">
                  Design your perfect workflow with personalized hand gestures tailored to your needs.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <HandMetal className="w-8 h-8 text-neon-purple" />
                  <ArrowRight className="w-8 h-8 text-gray-500" />
                  <Settings className="w-8 h-8 text-neon-purple" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div 
        id="pricing" 
        ref={pricingSectionRef}
        className="min-h-screen flex items-center justify-center relative bg-black scroll-mt-16 py-24 px-4"
      >
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient glow">Pricing Plans</h2>
            <p className="text-xl text-gray-300">
              Choose the plan that suits your needs and unlock the full potential of gesture controls
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`feature-box neo-blur rounded-xl p-8 flex flex-col h-full transition-all duration-300 hover:scale-105 ${
                  plan.recommended ? 'border-neon-purple ring-2 ring-neon-purple/50 relative' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-neon-purple to-neon-pink px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">/{plan.period}</span>}
                </div>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <div className="mb-8 flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-neon-purple mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant={plan.buttonVariant as "outline" | "default"}
                  className={`w-full ${plan.buttonVariant === "default" ? "bg-gradient-to-r from-neon-purple to-neon-pink" : "border-white/20"}`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 to-transparent opacity-60"></div>
        <div className="container mx-auto text-center relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient glow">
            Ready to Control Your Device with Gestures?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get started for free today and experience the future of human-computer interaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-all transform hover:scale-105 duration-300">
                Sign Up Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 transform hover:scale-105 duration-300">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo className="mb-6 md:mb-0" />
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} GestureFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Add global styles for the brightness filter */}
      <style>{`
        :root {
          --brightness: ${currentBrightness};
        }
      `}</style>
    </div>
  );
};

export default Index;
