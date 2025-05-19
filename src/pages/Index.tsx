
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { gestureDetection, GestureType } from "@/lib/gestureDetection";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Volume2, VolumeX, Chrome, AppWindow, 
  Clapperboard, Space, Pin, HandMetal, Settings
} from "lucide-react";

const Index = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [activeGesture, setActiveGesture] = useState<GestureType | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentBrightness, setCurrentBrightness] = useState(1);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
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
        
        // Clean up video streams
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [permissionGranted, videoStream]);

  // Handle gesture detection
  const handleGestureDetected = (gesture: GestureType) => {
    setActiveGesture(gesture);
    console.log("Gesture detected:", gesture);

    // Apply the corresponding action based on the detected gesture
    switch (gesture) {
      case 'slideUp':
        const brightnessUp = gestureDetection.adjustBrightness('up');
        setCurrentBrightness(brightnessUp);
        toast({
          title: "Brightness Increased",
          description: `Brightness set to ${Math.round(brightnessUp * 100)}%`,
        });
        break;
      case 'slideDown':
        const brightnessDown = gestureDetection.adjustBrightness('down');
        setCurrentBrightness(brightnessDown);
        toast({
          title: "Brightness Decreased",
          description: `Brightness set to ${Math.round(brightnessDown * 100)}%`,
        });
        break;
      case 'slideRight':
        const volumeUp = gestureDetection.adjustVolume('up');
        toast({
          title: "Volume Increased",
          description: `Volume set to ${Math.round(volumeUp * 100)}%`,
        });
        break;
      case 'slideLeft':
        const volumeDown = gestureDetection.adjustVolume('down');
        toast({
          title: "Volume Decreased",
          description: `Volume set to ${Math.round(volumeDown * 100)}%`,
        });
        break;
      case 'clap':
        gestureDetection.openChrome();
        toast({
          title: "Opening Chrome",
          description: "Launching Chrome browser",
        });
        break;
      case 'peace':
        gestureDetection.closeWindow();
        toast({
          title: "Window Close Gesture",
          description: "Close window gesture detected",
        });
        break;
      case 'pinch':
        gestureDetection.takeScreenshot();
        toast({
          title: "Screenshot Gesture",
          description: "Screenshot gesture detected",
        });
        break;
    }

    // Clear the active gesture state after a short delay
    setTimeout(() => {
      setActiveGesture(null);
    }, 2000);
  };

  const requestCameraPermission = async (sectionId: string) => {
    try {
      const stream = await gestureDetection.requestPermission();
      setPermissionGranted(true);
      setVideoStream(stream);
      
      // Display the stream in the video element
      if (videoRefs.current[sectionId] && stream) {
        videoRefs.current[sectionId].srcObject = stream;
      }
      
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
      gestureType: ['slideUp', 'slideDown']
    },
    {
      id: "volume",
      title: "Hand Slide Right/Left",
      description: "Increase or decrease volume with horizontal hand movements.",
      icon: <Volume2 className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('slideRight'),
      gestureType: ['slideLeft', 'slideRight']
    },
    {
      id: "openChrome",
      title: "Clap",
      description: "Open Chrome browser with a simple clap gesture.",
      icon: <Clapperboard className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('clap'),
      gestureType: ['clap']
    },
    {
      id: "closeWindow",
      title: "Peace Sign",
      description: "Close the currently active window with a peace sign.",
      icon: <Space className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('peace'),
      gestureType: ['peace']
    },
    {
      id: "screenshot",
      title: "Pinch",
      description: "Take a screenshot with a pinching gesture.",
      icon: <Pin className="w-12 h-12 text-neon-purple" />,
      gestureDemo: () => gestureDetection.simulateGestureDetection('pinch'),
      gestureType: ['pinch']
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
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent"></div>
        </div>

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
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gradient">
          Explore Gesture Controls
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-16">
          {gestureSections.map((section, index) => (
            <div 
              key={section.id}
              className="gesture-section bg-black/40 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-neon-purple/40"
              id={section.id}
            >
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <div className="mb-6 transform transition-transform duration-300 hover:scale-110">{section.icon}</div>
                  <h2 className="text-3xl font-bold mb-4 text-gradient">{section.title}</h2>
                  <p className="text-lg text-gray-300 mb-6">{section.description}</p>
                  <Button 
                    onClick={() => {
                      if (!permissionGranted) {
                        requestCameraPermission(section.id);
                      } else {
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
                
                <div className="w-full lg:w-1/2">
                  <div 
                    className={`gesture-recognition-zone rounded-xl w-full aspect-video flex items-center justify-center transition-all duration-500 ${
                      section.gestureType.includes(activeGesture as any) 
                        ? 'ring-4 ring-neon-purple scale-105 border-neon-purple' 
                        : 'border border-white/10'
                    }`}
                  >
                    {permissionGranted ? (
                      <>
                        <video
                          ref={el => videoRefs.current[section.id] = el}
                          className="w-full h-full rounded-xl object-cover"
                          autoPlay
                          playsInline
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center px-4 py-2 backdrop-blur-sm bg-black/50 rounded-lg">
                            {section.gestureType.includes(activeGesture as any) ? (
                              <span className="text-neon-purple font-bold animate-pulse">
                                {activeGesture?.charAt(0).toUpperCase() + activeGesture?.slice(1)} detected!
                              </span>
                            ) : (
                              <span>Try the {section.title} gesture</span>
                            )}
                            {section.id === 'brightness' && (
                              <div className="mt-2">
                                <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-neon-purple to-neon-pink h-full transition-all duration-300"
                                    style={{ width: `${currentBrightness * 100}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs mt-1 text-gray-300">
                                  Brightness: {Math.round(currentBrightness * 100)}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-8">
                        <h3 className="text-xl font-semibold mb-4">Gesture Recognition Zone</h3>
                        <p className="text-gray-400 mb-2">
                          Click 'Try This Gesture' to enable camera and test this gesture.
                        </p>
                        <div className="text-xs text-gray-500">
                          Camera access required for gesture detection
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Gesture Tool Section */}
      <div 
        id="custom-gestures"
        className="container mx-auto px-4 py-24"
      >
        <div className="max-w-4xl mx-auto bg-black/40 border border-white/10 rounded-xl p-8 transition-all duration-300 hover:border-neon-purple/40">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
                <Settings className="w-12 h-12 text-neon-purple" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gradient">Create Your Own Gesture Tool</h2>
              <p className="text-lg text-gray-300 mb-6">
                Define custom gestures and assign them to any action you want. Take control of your device like never before.
              </p>
              <Button 
                onClick={handleCustomGestureTool}
                className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-all transform hover:scale-105 duration-300"
              >
                Try Now
              </Button>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="border border-white/10 rounded-xl w-full aspect-video flex items-center justify-center transition-transform hover:scale-105 duration-300">
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

      {/* Add global styles */}
      <style>{`
        :root {
          --brightness: ${currentBrightness};
        }
        
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Animation for active gestures */
        .gesture-active {
          animation: pulse 2s infinite;
        }

        body {
          filter: brightness(var(--brightness));
          transition: filter 0.3s ease;
        }
        
        /* Gesture recognition zone styling */
        .gesture-recognition-zone {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }
        
        .gesture-section {
          scroll-margin-top: 100px;
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
