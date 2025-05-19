import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isSubscribed, subscriptionTier, checkSubscription } = useAuth();
  const { toast } = useToast();

  const handleSubscription = async (priceId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to subscribe to a plan.",
      });
      return;
    }
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      toast({
        variant: "destructive",
        title: "Supabase not configured",
        description: "Please connect to Supabase using the green button in the top-right corner.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to initiate checkout.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      name: "Free",
      description: "Basic gesture controls for individuals.",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "5 basic hand gestures",
        "Control brightness & volume",
        "Community support",
      ],
      cta: "Get Started",
      priceId: null
    },
    {
      name: "Pro",
      description: "Enhanced controls for power users.",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        "All Free features",
        "10 advanced gestures",
        "Custom gesture mapping",
        "Priority support",
      ],
      cta: "Subscribe",
      priceId: "price_pro" // This would be the actual Stripe price ID in production
    },
    {
      name: "Enterprise",
      description: "Complete solution for businesses.",
      monthlyPrice: 24.99,
      annualPrice: 249.99,
      features: [
        "All Pro features",
        "Unlimited custom gestures",
        "Multiple device support",
        "Dedicated support",
        "Team management",
      ],
      cta: "Subscribe",
      priceId: "price_enterprise" // This would be the actual Stripe price ID in production
    }
  ];

  const handleManageSubscription = async () => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      toast({
        variant: "destructive",
        title: "Supabase not configured",
        description: "Please connect to Supabase using the green button in the top-right corner.",
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No customer portal URL received.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to open customer portal.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient glow">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan to enhance your gesture control experience.
          </p>
          
          <div className="flex items-center justify-center mt-8 space-x-4">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              className="data-[state=checked]:bg-neon-purple"
            />
            <span className={`text-sm ${annual ? 'text-white' : 'text-gray-400'}`}>
              Annual <span className="text-xs text-neon-purple">(Save 20%)</span>
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = isSubscribed && subscriptionTier === plan.name;
            
            return (
              <div 
                key={plan.name} 
                className={`glass-morphism rounded-xl p-8 transition-all ${
                  isCurrentPlan ? 'border-neon-purple glow-border' : ''
                }`}
              >
                {isCurrentPlan && (
                  <div className="bg-neon-purple text-white text-xs font-bold py-1 px-3 rounded-full mb-4 inline-block">
                    Your Plan
                  </div>
                )}
                
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-400 mb-4 min-h-[3rem]">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-gray-400 ml-1">
                      /{annual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg className="w-5 h-5 text-neon-purple mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {isCurrentPlan ? (
                  <Button
                    onClick={handleManageSubscription}
                    disabled={isProcessing}
                    className="w-full bg-white/10 hover:bg-white/20"
                  >
                    {isProcessing ? <Spinner size="sm" /> : "Manage Subscription"}
                  </Button>
                ) : (
                  plan.priceId ? (
                    <Button
                      onClick={() => handleSubscription(plan.priceId!)}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90"
                    >
                      {isProcessing ? <Spinner size="sm" /> : plan.cta}
                    </Button>
                  ) : (
                    <Link to={user ? "/dashboard" : "/signup"}>
                      <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90">
                        {plan.cta}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Contact our sales team for custom solutions tailored to your specific needs.
          </p>
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            Contact Sales
          </Button>
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

export default Pricing;
