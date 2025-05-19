
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { toast } = useToast();

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
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
      icon: (
        <svg className="w-12 h-12 text-neon-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17V7M12 7L9 10M12 7L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3V2M3 12H2M22 12H21M19.07 5L18.36 5.71M4.93 19.07L4.22 19.78M19.07 19.07L18.36 18.36M4.93 5L4.22 4.29" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      tryAction: () => {
        toast({
          title: "Brightness Control Activated",
          description: "Move your hand up or down to adjust brightness.",
        });
      },
    },
    {
      id: "volume",
      title: "Hand Slide Right/Left",
      description: "Increase or decrease volume with horizontal hand movements.",
      icon: (
        <svg className="w-12 h-12 text-neon-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      tryAction: () => {
        toast({
          title: "Volume Control Activated",
          description: "Move your hand left or right to adjust volume.",
        });
      },
    },
    {
      id: "openChrome",
      title: "Clap",
      description: "Open Chrome browser with a simple clap gesture.",
      icon: (
        <svg className="w-12 h-12 text-neon-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 10V8M15 13V11.5V10M4 17C4 17 6 15 8 15C10 15 13.5 17 16 17C18.5 17 20 15 20 15M12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      tryAction: () => {
        toast({
          title: "Chrome Launch Gesture Activated",
          description: "Clap to launch Chrome browser.",
        });
      },
    },
    {
      id: "closeWindow",
      title: "Peace Sign",
      description: "Close the currently active window with a peace sign.",
      icon: (
        <svg className="w-12 h-12 text-neon-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 13V7.5C7 6.67157 7.67157 6 8.5 6C9.32843 6 10 6.67157 10 7.5V11M10 11V5.5C10 4.67157 10.6716 4 11.5 4C12.3284 4 13 4.67157 13 5.5V11M10 11C10 11 10 11 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 11V8.5C13 7.67157 13.6716 7 14.5 7C15.3284 7 16 7.67157 16 8.5V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 9C20.1046 9 21 9.89543 21 11V13C21 16.866 17.866 20 14 20H10C6.13401 20 3 16.866 3 13V11C3 9.89543 3.89543 9 5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      tryAction: () => {
        toast({
          title: "Window Close Gesture Activated",
          description: "Make a peace sign to close the active window.",
        });
      },
    },
    {
      id: "screenshot",
      title: "Pinch",
      description: "Take a screenshot with a pinching gesture.",
      icon: (
        <svg className="w-12 h-12 text-neon-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L15 12M17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      tryAction: () => {
        toast({
          title: "Screenshot Gesture Activated",
          description: "Use pinch gesture to capture a screenshot.",
        });
      },
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent"></div>
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <Navigation />

        <div className="flex-1 flex flex-col items-center justify-center px-4 z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient glow">
                Control Your Device With Hand Gestures
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Manage your computer with simple hand movements. Adjust brightness, control volume,
                launch apps, and more without touching your keyboard.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity">
                    Get Started — It's Free
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5">
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
          className={`min-h-screen flex items-center justify-center relative ${
            index % 2 === 0 ? 'bg-black' : 'bg-black/90'
          }`}
        >
          <div className={`container mx-auto px-4 py-24 flex flex-col md:flex-row items-center ${
            index % 2 !== 0 ? 'md:flex-row-reverse' : ''
          }`}>
            <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <div className="mb-6">{section.icon}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">{section.title}</h2>
              <p className="text-xl text-gray-300 mb-8">{section.description}</p>
              <Button 
                onClick={() => {
                  if (!permissionGranted) {
                    requestCameraPermission();
                  } else {
                    section.tryAction();
                  }
                }}
                className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity"
              >
                Try This Gesture
              </Button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="glass-morphism rounded-xl w-full max-w-md aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <h3 className="text-xl font-semibold mb-4">Gesture Recognition Zone</h3>
                  <p className="text-gray-400">
                    {permissionGranted
                      ? "Camera access granted! Try the gesture."
                      : "Click 'Try This Gesture' to enable camera and test this gesture."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

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
              <Button size="lg" className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity">
                Sign Up Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5">
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
    </div>
  );
};

export default Index;
