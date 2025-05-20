import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { gestureDetection, GestureType } from "@/lib/gestureDetection";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUp, Volume2, Chrome, Camera, HandMetal, Settings, CheckCircle } from "lucide-react";
import { ThumbsLeft } from "@/components/icons/ThumbsLeft";
import { ThumbsRight } from "@/components/icons/ThumbsRight";
import BrightnessSlider from "@/components/BrightnessSlider";
import AudioPlayer from "@/components/AudioPlayer";
import AudioAnimation from "@/components/AudioAnimation";

const Index = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [activeGesture, setActiveGesture] = useState<GestureType | null>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [scrollY, setScrollY] = useState(0);
  const [gestureStatus, setGestureStatus] = useState<{
    [key: string]: string;
  }>({});
  
  // Initialize brightness to 100%
  const [currentBrightness, setCurrentBrightness] = useState(100);
  const [currentVolume, setCurrentVolume] = useState(0.5);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [trackBrightnessWithCursor, setTrackBrightnessWithCursor] = useState(false);
  const [thumbColor, setThumbColor] = useState("#FFFFFF");
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const cursorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);
  const brightnessContainerRef = useRef<HTMLDivElement>(null);

  // Track mouse movement for cursor gradient effect and brightness control
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });

      // Update brightness based on cursor position if tracking is enabled
      if (trackBrightnessWithCursor && brightnessContainerRef.current) {
        const container = brightnessContainerRef.current;
        const containerRect = container.getBoundingClientRect();

        // Calculate relative position within the container height (inverted because Y increases downward)
        const containerHeight = containerRect.height;
        const relativeY = containerRect.bottom - e.clientY;

        // Map to brightness range (10% to 100%)
        let newBrightnessPercent = Math.max(10, Math.min(100, relativeY / containerHeight * 90 + 10));
        
        // Only update if there's a significant change to avoid constant updates
        if (Math.abs(newBrightnessPercent - currentBrightness) > 0.5) {
          setCurrentBrightness(newBrightnessPercent);

          // Calculate color between white and dark purple based on position
          // Map brightness from 10-100 range to colors
          const colorIntensity = Math.max(0, Math.min(255, (newBrightnessPercent - 10) * 2.83));
          const newColor = `rgb(${colorIntensity}, ${colorIntensity}, ${colorIntensity})`;
          setThumbColor(newColor);

          // Update status
          const statusDirection = newBrightnessPercent > currentBrightness ? "Increasing" : "Decreasing";
          const statusUpdate = `${statusDirection} brightness to ${Math.round(newBrightnessPercent)}%`;
          setGestureStatus(prev => ({
            ...prev,
            brightness: statusUpdate
          }));
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [trackBrightnessWithCursor, currentBrightness, brightnessContainerRef]);

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

    // Check if we're in a specific feature mode and only process relevant gestures
    if (activeFeature === "brightness") {
      if (["slideUp", "slideDown", "thumbRight", "thumbLeft"].includes(gesture)) {
        handleBrightnessGesture(gesture);
      }
    } else if (activeFeature === "volume") {
      if (["slideRight", "slideLeft"].includes(gesture)) {
        handleVolumeGesture(gesture);
      }
    } else if (activeFeature === "screenshot") {
      if (["pinch"].includes(gesture)) {
        handleScreenshotGesture();
      }
    } else {
      // If no specific feature is active, process all gestures
      switch (gesture) {
        case 'slideUp':
        case 'thumbRight': 
          handleBrightnessGesture(gesture);
          break;
        case 'slideDown':
        case 'thumbLeft': 
          handleBrightnessGesture(gesture);
          break;
        case 'slideRight':
        case 'slideLeft':
          handleVolumeGesture(gesture);
          break;
        case 'clap':
          handleChromeLaunchGesture();
          break;
        case 'peace':
          handleWindowCloseGesture();
          break;
        case 'pinch':
          handleScreenshotGesture();
          break;
        case 'none':
          // No gesture detected
          break;
      }
    }

    // Clear the active gesture state after a short delay
    setTimeout(() => {
      setActiveGesture(null);
    }, 2000);
  };
  
  // Gesture handler functions
  const handleBrightnessGesture = (gesture: GestureType) => {
    switch (gesture) {
      case 'slideUp':
      case 'thumbRight': 
        const newBrightnessUp = Math.min(currentBrightness + 10, 100);
        setCurrentBrightness(newBrightnessUp);
        const statusUpdateUp = `Increasing brightness to ${Math.round(newBrightnessUp)}%`;
        setGestureStatus(prev => ({
          ...prev,
          brightness: statusUpdateUp
        }));
        toast({
          title: "Brightness Increased",
          description: `Brightness set to ${Math.round(newBrightnessUp)}%`
        });
        break;
      case 'slideDown':
      case 'thumbLeft': 
        // Ensure brightness doesn't go below 10%
        const newBrightnessDown = Math.max(currentBrightness - 10, 10);
        setCurrentBrightness(newBrightnessDown);
        const statusUpdateDown = `Decreasing brightness to ${Math.round(newBrightnessDown)}%`;
        setGestureStatus(prev => ({
          ...prev,
          brightness: statusUpdateDown
        }));
        toast({
          title: "Brightness Decreased",
          description: `Brightness set to ${Math.round(newBrightnessDown)}%`
        });
        break;
    }
  };

  const handleVolumeGesture = (gesture: GestureType) => {
    switch (gesture) {
      case 'slideRight':
        const newVolumeUp = Math.min(currentVolume + 0.1, 1.0);
        setCurrentVolume(newVolumeUp);
        gestureDetection.adjustVolume('up');
        const statusUpdateUp = `Increasing volume to ${Math.round(newVolumeUp * 100)}%`;
        setGestureStatus(prev => ({
          ...prev,
          volume: statusUpdateUp
        }));
        toast({
          title: "Volume Increased",
          description: `Volume set to ${Math.round(newVolumeUp * 100)}%`
        });
        break;
      case 'slideLeft':
        const newVolumeDown = Math.max(currentVolume - 0.1, 0.0);
        setCurrentVolume(newVolumeDown);
        gestureDetection.adjustVolume('down');
        const statusUpdateDown = `Decreasing volume to ${Math.round(newVolumeDown * 100)}%`;
        setGestureStatus(prev => ({
          ...prev,
          volume: statusUpdateDown
        }));
        toast({
          title: "Volume Decreased",
          description: `Volume set to ${Math.round(newVolumeDown * 100)}%`
        });
        break;
    }
  };

  const handleScreenshotGesture = () => {
    gestureDetection.takeScreenshot();
    const statusUpdate = "Pinch detected - would take screenshot";
    setGestureStatus(prev => ({
      ...prev,
      screenshot: statusUpdate
    }));
    toast({
      title: "Screenshot Gesture",
      description: "Screenshot gesture detected"
    });
  };

  const handleChromeLaunchGesture = () => {
    gestureDetection.openChrome();
    const statusUpdate = "Opening Chrome browser";
    setGestureStatus(prev => ({
      ...prev,
      openChrome: statusUpdate
    }));
    toast({
      title: "Opening Chrome",
      description: "Launching Chrome browser"
    });
  };

  const handleWindowCloseGesture = () => {
    gestureDetection.closeWindow();
    const statusUpdate = "Peace sign detected - would close window";
    setGestureStatus(prev => ({
      ...prev,
      closeWindow: statusUpdate
    }));
    toast({
      title: "Window Close Gesture",
      description: "Close window gesture detected"
    });
  };
  
  const requestCameraPermission = async (sectionId: string) => {
    try {
      await gestureDetection.requestPermission();
      setPermissionGranted(true);
      setActiveVideoId(sectionId);
      setActiveFeature(sectionId); // Set active feature to restrict gestures

      toast({
        title: "Camera access granted",
        description: "You can now try the gesture controls."
      });

      // Start gesture detection with callback
      gestureDetection.start({
        onGestureDetected: handleGestureDetected,
        onError: error => {
          toast({
            variant: "destructive",
            title: "Gesture Detection Error",
            description: error.message
          });
        }
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to use gesture controls."
      });
    }
  };
  
  // Gesture sections 
  const gestureSections = [{
    id: "brightness",
    title: "Change Brightness",
    description: "Control Screen Brightness with Hand Gestures. Move your hand left and right to adjust brightness levels.",
    icon: <ArrowRight className="w-12 h-12 text-neon-purple" />,
    gestureDemo: () => {
      // Only simulate gesture if this feature is active
      if (activeFeature === "brightness") {
        gestureDetection.simulateGestureDetection('thumbRight');
      }
    },
    gestureType: ['slideUp', 'slideDown', 'thumbLeft', 'thumbRight'],
    status: gestureStatus.brightness || "Waiting for gesture...",
    value: currentBrightness,
    instructions: "Move hand left/right to adjust brightness"
  }, {
    id: "volume",
    title: "Change Audio",
    description: "Control your audio experience with simple hand gestures. Swipe left or right to adjust volume.",
    icon: <Volume2 className="w-12 h-12 text-neon-purple" />,
    gestureDemo: () => {
      // Only simulate gesture if this feature is active
      if (activeFeature === "volume") {
        gestureDetection.simulateGestureDetection('slideRight');
      }
    },
    gestureType: ['slideLeft', 'slideRight'],
    status: gestureStatus.volume || "Waiting for gesture...",
    value: currentVolume
  }, {
    id: "screenshot",
    title: "Take Screenshot",
    description: "Take a screenshot with a pinching gesture.",
    icon: <Camera className="w-12 h-12 text-neon-purple" />,
    gestureDemo: () => {
      // Only simulate gesture if this feature is active
      if (activeFeature === "screenshot") {
        gestureDetection.simulateGestureDetection('pinch');
      }
    },
    gestureType: ['pinch'],
    status: gestureStatus.screenshot || "Waiting for gesture..."
  }];

  const handleCustomGestureTool = () => {
    if (!user) {
      navigate("/login");
      toast({
        title: "Login Required",
        description: "Please log in to create custom gestures."
      });
    } else {
      // Scroll to pricing section
      pricingSectionRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    pricingSectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // Pricing plans data
  const pricingPlans = [{
    name: "Free",
    price: "$0",
    description: "Basic gesture controls for personal use",
    features: ["5 built-in gestures", "Basic brightness and volume control", "Chrome browser integration", "Community support"],
    buttonText: "Get Started",
    buttonVariant: "outline",
    recommended: false
  }, {
    name: "Pro",
    price: "$9.99",
    period: "monthly",
    description: "Advanced controls for power users",
    features: ["Everything in Free", "Custom gesture creation", "Advanced application control", "Priority support", "Multiple device profiles"],
    buttonText: "Upgrade Now",
    buttonVariant: "default",
    recommended: true
  }, {
    name: "Enterprise",
    price: "Contact Us",
    description: "Custom solutions for organizations",
    features: ["Everything in Pro", "Custom integration development", "Team management", "Dedicated account manager", "Training sessions"],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    recommended: false
  }];
  
  // Camera display component - redesigned to be at the center bottom
  const CameraFeed = () => {
    if (!permissionGranted) return null;
    
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <div className="bg-transparent p-4 rounded-t-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-64 aspect-video rounded-lg overflow-hidden border border-neon-purple/30">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover rounded-lg"
              />
              {activeGesture && (
                <div className="absolute top-2 right-2 bg-neon-purple text-white px-2 py-1 rounded text-xs">
                  {activeGesture}
                </div>
              )}
            </div>
            
            {activeVideoId === "screenshot" && (
              <div className="w-64 aspect-video rounded-lg">
                <div className="h-full w-full flex items-center justify-center rounded-lg border border-neon-purple/30">
                  <p className="text-gray-500 text-sm">Make pinch gesture to capture</p>
                  {activeGesture === 'pinch' && (
                    <div className="absolute inset-0 animate-flash">
                      <div className="w-full h-full bg-white opacity-50"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => {
                setPermissionGranted(false);
                setActiveFeature(null);
                gestureDetection.stop();
              }} 
              className="bg-gradient-to-r from-neon-purple to-neon-pink"
            >
              Stop Camera
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Custom cursor gradient - always visible */}
      <div ref={cursorRef} className="fixed pointer-events-none w-64 h-64 rounded-full bg-gradient-radial from-neon-purple/30 to-transparent -translate-x-1/2 -translate-y-1/2 z-0 blur-lg" />

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
                <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 transform hover:scale-105 duration-300" onClick={scrollToPricing}>
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

      {/* Gesture Control Sections with updated interactive components */}
      {gestureSections.map((section, index) => (
        <div key={section.id} id={section.id} className="min-h-screen flex items-center justify-center relative scroll-mt-16 md:px-8 px-[80px] py-[61px] my-0">
          <div className="container mx-auto rounded-xl py-5 feature-box-container hover:feature-box-glow">
            <div className={`flex flex-col md:flex-row items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} gap-16 p-8`}>
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
                <div className="mb-6 transform hover:scale-110 transition-transform duration-300">{section.icon}</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient text-center md:text-left">{section.title}</h2>
                <p className="text-xl text-gray-300 mb-8 text-center md:text-left">{section.description}</p>
                <Button onClick={() => {
                  if (!permissionGranted) {
                    requestCameraPermission(section.id);
                  } else {
                    setActiveVideoId(section.id);
                    setActiveFeature(section.id);
                    section.gestureDemo();
                  }
                }} className={`bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-all transform hover:scale-105 duration-300 ${activeFeature === section.id ? 'ring-4 ring-neon-purple' : ''}`}>
                  {activeFeature === section.id ? "Active" : "Try This Gesture"}
                </Button>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                {section.id === "brightness" ? (
                  <div ref={brightnessContainerRef} className={`feature-box neo-blur rounded-xl w-full max-w-md aspect-video flex items-center justify-center transition-all duration-500 relative overflow-hidden ${section.gestureType.includes(activeGesture as any) ? 'ring-4 ring-neon-purple scale-105' : ''}`}
                    style={{
                      filter: `brightness(${currentBrightness / 100})`,
                      transition: 'filter 0.3s ease'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-black/20 to-black/40 transition-opacity duration-500" style={{
                      opacity: currentBrightness / 100,
                      background: `linear-gradient(to bottom, rgba(139, 92, 246, ${0.1 * currentBrightness / 100}), rgba(0, 0, 0, ${0.4 - 0.2 * currentBrightness / 100}))`
                    }}></div>
                    
                    <div className="relative z-10 flex items-center justify-center h-full w-full">
                      <BrightnessSlider 
                        value={currentBrightness} 
                        min={10} 
                        max={100} 
                        onChange={(newValue) => {
                          // Only update if this feature is active
                          if (activeFeature === "brightness") {
                            // Ensure brightness doesn't go below 10%
                            const adjustedValue = Math.max(newValue, 10);
                            setCurrentBrightness(adjustedValue);
                            
                            // Update status
                            const statusUpdate = `${adjustedValue > currentBrightness ? 'Increasing' : 'Decreasing'} brightness to ${Math.round(adjustedValue)}%`;
                            setGestureStatus(prev => ({
                              ...prev,
                              brightness: statusUpdate
                            }));
                          }
                        }}
                        isActive={section.gestureType.includes(activeGesture as any)}
                      />
                    </div>
                    
                    {(activeGesture && section.gestureType.includes(activeGesture as any)) && (
                      <div className="absolute bottom-2 left-0 right-0 text-center bg-black/50 py-1 px-2 mx-2 rounded text-sm">
                        {section.status}
                      </div>
                    )}
                  </div>
                ) : section.id === "volume" ? (
                  <div className={`feature-box neo-blur rounded-xl w-full max-w-md aspect-video flex items-center justify-center transition-all duration-500 ${section.gestureType.includes(activeGesture as any) ? 'ring-4 ring-neon-purple scale-105' : ''}`}>
                    <AudioAnimation 
                      isActive={activeFeature === "volume"} 
                      currentVolume={currentVolume}
                      gesture={activeGesture}
                      status={section.status}
                    />
                  </div>
                ) : (
                  <div className={`feature-box neo-blur rounded-xl w-full max-w-md aspect-video flex items-center justify-center transition-all duration-500 ${section.gestureType.includes(activeGesture as any) ? 'ring-4 ring-neon-purple scale-105' : ''}`}>
                    <div className="text-center p-8 w-full">
                      <h3 className="text-xl font-semibold mb-4">Gesture Animation</h3>
                      
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <Camera className={`w-16 h-16 text-neon-purple ${section.gestureType.includes(activeGesture as any) ? 'animate-ping' : ''}`} />
                          {section.gestureType.includes(activeGesture as any) && (
                            <div className="absolute inset-0 border-2 border-neon-purple rounded-lg animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <p className={`text-lg font-medium ${section.gestureType.includes(activeGesture as any) ? 'text-neon-purple' : 'text-gray-400'}`}>
                            {section.gestureType.includes(activeGesture as any) ? 'Screenshot Captured!' : 'Make a pinch gesture to capture'}
                          </p>
                        </div>
                      </div>
                      
                      {section.gestureType.includes(activeGesture as any) && (
                        <div className="mt-4 bg-black/50 p-2 rounded text-sm">
                          {section.status}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Camera feed at the center bottom of screen */}
      {permissionGranted && <CameraFeed />}

      {/* Custom Gesture Tool Section */}
      <div id="custom-gestures" className="min-h-screen flex items-center justify-center relative scroll-mt-16 py-24 px-4 md:px-8 bg-transparent">
        <div className="container mx-auto rounded-xl py-5 feature-box-container hover:feature-box-glow">
          <div className="flex flex-col md:flex-row items-center gap-16 p-8">
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
              <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
                <Settings className="w-12 h-12 text-neon-purple" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient text-center md:text-left">Create Your Own Gesture Tool</h2>
              <p className="text-xl text-gray-300 mb-8 text-center md:text-left">
                Define custom gestures and assign them to any action you want. Take control of your device like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleCustomGestureTool} className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-all transform hover:scale-105 duration-300">
                  Try Now
                </Button>
                <a href="#pricing" onClick={scrollToPricing} className="inline-flex items-center text-neon-purple hover:text-neon-pink transition-colors">
                  View more &rarr;
                </a>
              </div>
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
      </div>

      {/* Pricing Section */}
      <div id="pricing" ref={pricingSectionRef} className="min-h-screen flex items-center justify-center relative scroll-mt-16 py-24 px-4 md:px-8 bg-transparent">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gradient glow my-0 py-[7px] md:text-5xl">Pricing Plans</h2>
            <p className="text-xl text-gray-300">
              Choose the plan that suits your needs and unlock the full potential of gesture controls
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => <div key={index} className={`feature-box neo-blur rounded-xl p-8 flex flex-col h-full transition-all duration-300 hover:feature-box-glow hover:scale-105 ${plan.recommended ? 'border-neon-purple ring-2 ring-neon-purple/50 relative' : ''}`}>
                {plan.recommended && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-neon-purple to-neon-pink px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">/{plan.period}</span>}
                </div>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <div className="mb-8 flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-neon-purple mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </div>
                <Button variant={plan.buttonVariant as "outline" | "default"} className={`w-full ${plan.buttonVariant === "default" ? "bg-gradient-to-r from-neon-purple to-neon-pink" : "border-white/20"}`}>
                  {plan.buttonText}
                </Button>
              </div>)}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-20 px-4 relative">
        <div className="bg-transparent"></div>
        <div className="container mx-auto text-center relative z-10 max-w-3xl bg-transparent">
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
        /* Custom styles for the horizontal brightness slider */
        .brightness-slider .radix-slider-thumb {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }
        .brightness-slider .radix-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.9), 0 0 5px rgba(139, 92, 246, 0.8);
        }

        /* Add animation for the glowing tube effect */
        @keyframes tubeGlow {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
          100% { filter: brightness(1); }
        }

        /* Add animation for thumbs pulse */
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.1); opacity: 1; }
        }
        
        /* Add animation for screenshot flash */
        @keyframes flash {
          0% { opacity: 0; }
          25% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 0; }
        }
        
        .animate-flash {
          animation: flash 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Index;
