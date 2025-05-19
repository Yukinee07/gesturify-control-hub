
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { gestureDetection, GestureType } from "@/lib/gestureDetection";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Volume2, VolumeX, Chrome, HandMetal, Camera, 
  Minimize, Settings, Hand
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const Index = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [activeGesture, setActiveGesture] = useState<GestureType | null>(null);
  const [activeGestureSection, setActiveGestureSection] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [gestureStatus, setGestureStatus] = useState<{[key: string]: string}>({});
  const [gestureProgress, setGestureProgress] = useState<{[key: string]: number}>({});
  const [currentBrightness, setCurrentBrightness] = useState(1);
  const [currentVolume, setCurrentVolume] = useState(0.5);
  const [isGestureDialogOpen, setIsGestureDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cursorRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({});

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
      gestureDetection.stop();
    };
  }, []);

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
      case 'peace':
        gestureDetection.openChrome();
        statusUpdate = "Peace sign detected - opening Chrome browser";
        setGestureStatus(prev => ({...prev, openChrome: statusUpdate}));
        toast({
          title: "Opening Chrome",
          description: "Launching Chrome browser",
        });
        break;
      case 'clap':
        gestureDetection.closeWindow();
        statusUpdate = "Clap gesture detected - would close window";
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

  const handleGestureProgress = (gesture: GestureType, progress: number) => {
    // Map the gesture to the corresponding section
    let sectionId = "";
    switch (gesture) {
      case 'slideUp':
      case 'slideDown':
        sectionId = "brightness";
        break;
      case 'slideLeft':
      case 'slideRight':
        sectionId = "volume";
        break;
      case 'peace':
        sectionId = "openChrome";
        break;
      case 'clap':
        sectionId = "closeWindow";
        break;
      case 'pinch':
        sectionId = "screenshot";
        break;
      default:
        return;
    }
    
    // Update progress for this section
    setGestureProgress(prev => ({...prev, [sectionId]: progress}));
    
    // Update status message
    const action = {
      'slideUp': 'Increasing brightness',
      'slideDown': 'Decreasing brightness',
      'slideLeft': 'Decreasing volume',
      'slideRight': 'Increasing volume',
      'peace': 'Detecting peace sign',
      'clap': 'Detecting clap',
      'pinch': 'Detecting pinch'
    }[gesture];
    
    setGestureStatus(prev => ({
      ...prev, 
      [sectionId]: `${action} - ${Math.round(progress * 100)}% complete`
    }));
  };

  const requestCameraPermission = async (sectionId: string) => {
    try {
      // If we're already active in another section, stop that one
      if (activeGestureSection && activeGestureSection !== sectionId) {
        gestureDetection.stop();
      }
      
      setActiveGestureSection(sectionId);
      
      // Start gesture detection with callback
      gestureDetection.start({
        onGestureDetected: handleGestureDetected,
        onGestureProgress: handleGestureProgress,
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Gesture Detection Error",
            description: error.message,
          });
        }
      }, videoRefs.current[sectionId] || undefined);
      
      setPermissionGranted(true);
      toast({
        title: "Camera access granted",
        description: "You can now try the gesture controls.",
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
      gestureDemo: () => gestureDetection.simulateGestureDetection('slideUp', 1000, videoRefs.current.brightness || undefined),
      gestureType: ['slideUp', 'slideDown'],
      status: gestureStatus.brightness || "Waiting for gesture...",
      value: currentBrightness,
      progress: gestureProgress.brightness || 0
    },
    {
      id: "volume",
      title: "Hand Slide Right/Left",
      description: "Increase or decrease volume with horizontal hand movements.",
      icon: <Volume2 className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('slideRight', 1000, videoRefs.current.volume || undefined),
      gestureType: ['slideLeft', 'slideRight'],
      status: gestureStatus.volume || "Waiting for gesture...",
      value: currentVolume,
      progress: gestureProgress.volume || 0
    },
    {
      id: "openChrome",
      title: "Peace Gesture",
      description: "Open Chrome browser with a peace sign.",
      icon: <Hand className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('peace', 1000, videoRefs.current.openChrome || undefined),
      gestureType: ['peace'],
      status: gestureStatus.openChrome || "Waiting for gesture...",
      progress: gestureProgress.openChrome || 0
    },
    {
      id: "closeWindow",
      title: "Clap Gesture",
      description: "Close the currently active window with a clap gesture.",
      icon: <HandMetal className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('clap', 1000, videoRefs.current.closeWindow || undefined),
      gestureType: ['clap'],
      status: gestureStatus.closeWindow || "Waiting for gesture...",
      progress: gestureProgress.closeWindow || 0
    },
    {
      id: "screenshot",
      title: "Pinch Gesture",
      description: "Take a screenshot with a pinch gesture.",
      icon: <Minimize className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('pinch', 1000, videoRefs.current.screenshot || undefined),
      gestureType: ['pinch'],
      status: gestureStatus.screenshot || "Waiting for gesture...",
      progress: gestureProgress.screenshot || 0
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
      navigate("/pricing");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Custom cursor gradient */}
      <div 
        ref={cursorRef} 
        className="fixed pointer-events-none w-64 h-64 rounded-full bg-gradient-radial from-neon-purple/30 to-transparent -translate-x-1/2 -translate-y-1/2 z-0 blur-lg"
      />

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        <Navigation />

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
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 transform hover:scale-105 duration-300">
                    View Pricing
                  </Button>
                </Link>
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

      {/* Gesture Control Sections */}
      {gestureSections.map((section, index) => (
        <div 
          key={section.id}
          className="min-h-screen flex items-center justify-center relative scroll-mt-16"
          id={section.id}
        >
          <div className="container mx-auto px-4 py-24 flex flex-col items-center">
            <div className="text-center max-w-3xl mb-16">
              <div className="mb-6 transform hover:scale-110 transition-transform duration-300 flex justify-center">{section.icon}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">{section.title}</h2>
              <p className="text-xl text-gray-300 mb-8">{section.description}</p>
              <Button 
                onClick={() => {
                  requestCameraPermission(section.id);
                  section.gestureDemo();
                }}
                className={`bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-all transform hover:scale-105 duration-300 ${
                  section.gestureType.includes(activeGesture as any) ? 'ring-4 ring-neon-purple' : ''
                }`}
              >
                Try This Gesture
              </Button>
            </div>
            
            <div className="w-full max-w-3xl">
              <div 
                className={`glass-morphism rounded-xl w-full aspect-video flex items-center justify-center transition-all duration-500 ${
                  section.gestureType.includes(activeGesture as any) ? 'ring-4 ring-neon-purple scale-105' : ''
                } ${activeGestureSection === section.id ? 'animate-fade-in' : ''}`}
              >
                <div className="text-center p-8 w-full h-full flex flex-col">
                  <h3 className="text-xl font-semibold mb-4">Gesture Recognition Zone</h3>
                  <div className="relative flex-grow flex flex-col justify-center items-center">
                    {activeGestureSection === section.id ? (
                      <>
                        <div className="relative w-full h-full">
                          <video 
                            ref={(el) => { videoRefs.current[section.id] = el }}
                            className="w-full h-full object-cover rounded-lg mb-3"
                            autoPlay
                            playsInline
                            muted
                          />
                          <div className="absolute bottom-0 left-0 right-0 mb-3 text-white bg-black/70 p-2 rounded">
                            <p className="font-mono text-sm">
                              {section.status}
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress bar for gesture detection */}
                        <div className="w-full mt-4">
                          <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div 
                              className="bg-gradient-to-r from-neon-purple to-neon-pink h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.round(section.progress * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Value indicator for brightness/volume */}
                        {'value' in section && (
                          <div className="w-full mt-2">
                            <div className="w-full bg-gray-700 h-2 rounded-full">
                              <div 
                                className="bg-gradient-to-r from-neon-blue to-neon-purple h-full rounded-full"
                                style={{ width: `${Math.round(section.value * 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-right mt-1">
                              {Math.round(section.value * 100)}%
                            </p>
                          </div>
                        )}
                      </>
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
        </div>
      ))}

      {/* Custom Gesture Tool Section */}
      <div 
        id="custom-gestures"
        className="min-h-screen flex items-center justify-center relative bg-black scroll-mt-16"
      >
        <div className="container mx-auto px-4 py-24 flex flex-col items-center">
          <div className="text-center max-w-3xl">
            <div className="mb-6 transform hover:scale-110 transition-transform duration-300 flex justify-center">
              <Settings className="w-12 h-12 text-neon-purple" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">Create Your Own Gesture Tool</h2>
            <p className="text-xl text-gray-300 mb-8">
              Define custom gestures and assign them to any action you want. Take control of your device like never before.
            </p>
            <Button 
              onClick={handleCustomGestureTool}
              className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-all transform hover:scale-105 duration-300"
            >
              Try Now
            </Button>
            
            <div className="glass-morphism rounded-xl w-full max-w-3xl aspect-video flex items-center justify-center transition-transform hover:scale-105 duration-300 mt-16 mx-auto">
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

      {/* CTA Section */}
      <div className="py-20 px-4 relative">
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
      <footer className="py-12 border-t border-white/5">
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

      {/* Add global styles for the brightness filter */}
      <style>{`
        :root {
          --brightness: ${currentBrightness};
        }
        
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }

        /* Hover animation for interactive elements */
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }

        /* Animation for active gestures */
        .gesture-active {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(155, 89, 182, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(155, 89, 182, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(155, 89, 182, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
