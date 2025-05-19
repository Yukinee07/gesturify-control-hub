
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { gestureDetection, GestureType } from "@/lib/gestureDetection";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const { user, isSubscribed, subscriptionTier } = useAuth();
  const { toast } = useToast();
  const [activeGestures, setActiveGestures] = useState({
    slideUp: true,
    slideDown: true,
    slideLeft: true,
    slideRight: true,
    clap: true,
    peace: true,
    pinch: true,
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [customGestures, setCustomGestures] = useState<{id: string, name: string, action: string}[]>([]);
  const [lastDetectedGesture, setLastDetectedGesture] = useState<GestureType | null>(null);
  
  useEffect(() => {
    // Load any saved gesture preferences from localStorage
    const savedGestures = localStorage.getItem('activeGestures');
    if (savedGestures) {
      setActiveGestures(JSON.parse(savedGestures));
    }
    
    // Load custom gestures from localStorage or could come from Supabase in a real app
    const savedCustomGestures = localStorage.getItem('customGestures');
    if (savedCustomGestures) {
      setCustomGestures(JSON.parse(savedCustomGestures));
    }
    
    return () => {
      // Clean up gesture detection when component unmounts
      if (isDetecting) {
        stopGestureDetection();
      }
    };
  }, []);
  
  const startGestureDetection = async () => {
    try {
      await gestureDetection.start({
        onGestureDetected: (gesture) => {
          // In a real app, we would perform the actual system action here
          setLastDetectedGesture(gesture);
          toast({
            title: `${formatGestureName(gesture)} detected!`,
            description: getGestureDescription(gesture),
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Camera access error",
            description: error.message,
          });
          setIsDetecting(false);
        }
      });
      
      setIsDetecting(true);
      toast({
        title: "Gesture detection started",
        description: "Try using hand gestures to control your system.",
      });
    } catch (error) {
      console.error("Error starting gesture detection:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start gesture detection.",
      });
      setIsDetecting(false);
    }
  };
  
  const stopGestureDetection = () => {
    gestureDetection.stop();
    setIsDetecting(false);
    toast({
      title: "Gesture detection stopped",
      description: "Hand gesture controls have been deactivated.",
    });
  };
  
  const toggleGestureDetection = async () => {
    if (isDetecting) {
      stopGestureDetection();
    } else {
      await startGestureDetection();
    }
  };
  
  const handleGestureToggle = (gesture: keyof typeof activeGestures) => {
    const updatedGestures = {
      ...activeGestures,
      [gesture]: !activeGestures[gesture]
    };
    setActiveGestures(updatedGestures);
    localStorage.setItem('activeGestures', JSON.stringify(updatedGestures));
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
  
  const simulateGesture = (gesture: GestureType) => {
    if (!isDetecting) {
      toast({
        variant: "destructive",
        title: "Gesture detection is not active",
        description: "Please start gesture detection first.",
      });
      return;
    }
    
    gestureDetection.simulateGestureDetection(gesture);
  };
  
  const isPremiumFeature = (feature: string) => {
    return feature === "custom" && (!isSubscribed || subscriptionTier === "Basic");
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/50 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-neon-purple">
              <path
                fill="currentColor"
                d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"
              />
            </svg>
            <span className="text-lg font-bold text-gradient-purple">GestureFlow</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSubscribed ? (
              <span className="text-xs bg-neon-purple/20 text-neon-purple py-1 px-2 rounded-full">
                {subscriptionTier} Plan
              </span>
            ) : (
              <span className="text-xs bg-white/10 text-gray-300 py-1 px-2 rounded-full">
                Free Plan
              </span>
            )}
            <span className="text-sm text-gray-300">
              {user?.email}
            </span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Gesture Control Dashboard</h1>
            <p className="text-gray-400">Manage and customize your hand gesture controls</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="gesture-detection"
                checked={isDetecting}
                onCheckedChange={toggleGestureDetection}
                className="data-[state=checked]:bg-neon-purple"
              />
              <Label htmlFor="gesture-detection">
                {isDetecting ? "Detection Active" : "Detection Off"}
              </Label>
            </div>
            
            {isDetecting && (
              <div className="flex items-center space-x-2 bg-green-900/20 text-green-400 text-xs py-1 px-3 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Camera Active</span>
              </div>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="gestures" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="gestures">Gesture Controls</TabsTrigger>
            <TabsTrigger value="custom" disabled={isPremiumFeature("custom")}>
              Custom Gestures
              {isPremiumFeature("custom") && (
                <svg className="ml-1.5 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gestures" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Brightness Control Card */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Brightness Control</CardTitle>
                    <div className="flex gap-2">
                      <Switch
                        id="brightness-control"
                        checked={activeGestures.slideUp && activeGestures.slideDown}
                        onCheckedChange={() => {
                          handleGestureToggle("slideUp");
                          handleGestureToggle("slideDown");
                        }}
                        className="data-[state=checked]:bg-neon-purple"
                      />
                    </div>
                  </div>
                  <CardDescription>Control screen brightness with hand movements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-neon-blue" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                        Hand Slide Up
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => simulateGesture("slideUp")}
                      >
                        Test
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-neon-pink" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        Hand Slide Down
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => simulateGesture("slideDown")}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Volume Control Card */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Volume Control</CardTitle>
                    <div className="flex gap-2">
                      <Switch
                        id="volume-control"
                        checked={activeGestures.slideLeft && activeGestures.slideRight}
                        onCheckedChange={() => {
                          handleGestureToggle("slideLeft");
                          handleGestureToggle("slideRight");
                        }}
                        className="data-[state=checked]:bg-neon-purple"
                      />
                    </div>
                  </div>
                  <CardDescription>Adjust audio volume with horizontal gestures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-neon-blue" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        Hand Slide Right
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => simulateGesture("slideRight")}
                      >
                        Test
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-neon-pink" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Hand Slide Left
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => simulateGesture("slideLeft")}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* App Control Card */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>App Control</CardTitle>
                    <div className="flex gap-2">
                      <Switch
                        id="app-control"
                        checked={activeGestures.clap && activeGestures.peace}
                        onCheckedChange={() => {
                          handleGestureToggle("clap");
                          handleGestureToggle("peace");
                        }}
                        className="data-[state=checked]:bg-neon-purple"
                      />
                    </div>
                  </div>
                  <CardDescription>Control applications with gestures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-neon-blue" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 11.5C14 13.9853 11.9853 16 9.5 16C7.01472 16 5 13.9853 5 11.5C5 9.01472 7.01472 7 9.5 7C11.9853 7 14 9.01472 14 11.5Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11.5C19 13.9853 16.9853 16 14.5 16C12.0147 16 10 13.9853 10 11.5C10 9.01472 12.0147 7 14.5 7C16.9853 7 19 9.01472 19 11.5Z" />
                        </svg>
                        Clap
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => simulateGesture("clap")}
                      >
                        Test
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-neon-pink" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14.5M11.9999 6.5V14.5M11.9999 6.5L7 6.5M11.9999 6.5L17 6.5M17 11.5V14.5" />
                        </svg>
                        Peace Sign
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => simulateGesture("peace")}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Screenshot Card */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Screenshot</CardTitle>
                    <div className="flex gap-2">
                      <Switch
                        id="screenshot-control"
                        checked={activeGestures.pinch}
                        onCheckedChange={() => handleGestureToggle("pinch")}
                        className="data-[state=checked]:bg-neon-purple"
                      />
                    </div>
                  </div>
                  <CardDescription>Take screenshots with a pinch gesture</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-neon-purple" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v.01M17.66 7.34l-.01.01M21 12h-.01M17.66 16.66l-.01.01M12 20v-.01M7.34 16.66l.01.01M4 12h.01M7.34 7.34l.01.01" />
                      </svg>
                      Pinch
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/10 hover:bg-white/5"
                      onClick={() => simulateGesture("pinch")}
                    >
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {lastDetectedGesture && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Last Detected Gesture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold">{formatGestureName(lastDetectedGesture)}</p>
                      <p className="text-sm text-gray-400">{getGestureDescription(lastDetectedGesture)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            {isPremiumFeature("custom") ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white/5 border border-white/10 rounded-lg">
                <svg className="w-12 h-12 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Custom gestures are available on Pro and Enterprise plans.
                  Upgrade to create and manage your own gesture commands.
                </p>
                <Button className="bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity">
                  Upgrade Plan
                </Button>
              </div>
            ) : (
              <>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle>Custom Gestures</CardTitle>
                    <CardDescription>Create and manage your own gesture commands</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        Custom gestures allow you to map specific hand movements to actions of your choice.
                      </p>
                      <Button className="bg-neon-purple hover:bg-neon-purple/90">
                        Add New Gesture
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customGestures.length > 0 ? (
                    customGestures.map(gesture => (
                      <Card key={gesture.id} className="bg-white/5 border-white/10">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{gesture.name}</CardTitle>
                            <Switch defaultChecked className="data-[state=checked]:bg-neon-purple" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-400">Action:</span>
                              <span className="ml-2">{gesture.action}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
                                Edit
                              </Button>
                              <Button size="sm" variant="destructive">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-gray-400 mb-4">
                        You haven't created any custom gestures yet.
                      </p>
                      <Button className="bg-neon-purple hover:bg-neon-purple/90">
                        Create Your First Custom Gesture
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure how GestureFlow operates on your system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="start-with-system">Start with system</Label>
                    <Switch id="start-with-system" className="data-[state=checked]:bg-neon-purple" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Launch GestureFlow automatically when you start your computer
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-notifications">Show notifications</Label>
                    <Switch id="show-notifications" defaultChecked className="data-[state=checked]:bg-neon-purple" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Display notifications when gestures are detected
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-feedback">Sound feedback</Label>
                    <Switch id="sound-feedback" defaultChecked className="data-[state=checked]:bg-neon-purple" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Play a sound when a gesture is detected
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sensitivity">Gesture sensitivity</Label>
                    <div className="w-24">
                      <select 
                        id="sensitivity" 
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Adjust how sensitive the gesture detection is
                  </p>
                </div>
                
                <Button className="bg-neon-purple hover:bg-neon-purple/90">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
