import { LogOut, User, Bookmark, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const ProfileMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('subscription_type')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        setSubscriptionType(subscription?.subscription_type || null);
      }
    };

    checkSubscription();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (!error.message.includes("user_not_found")) {
          console.error("Error in signOut:", error);
          throw error;
        }
      }
      
      console.log("Successfully signed out");
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
      
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel subscription');
      }

      toast({
        title: "Subscription Cancellation Scheduled",
        description: "Your subscription will be canceled at the end of the billing period",
        duration: 5000,
      });

      // Refresh subscription status
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('subscription_type')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      setSubscriptionType(subscription?.subscription_type || null);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/bookmarked-dates")}>
          <Bookmark className="mr-2 h-4 w-4" />
          <span>Bookmarked Dates</span>
        </DropdownMenuItem>
        {subscriptionType === 'premium' && (
          <DropdownMenuItem onClick={handleCancelSubscription}>
            <Ban className="mr-2 h-4 w-4" />
            <span>Cancel Subscription</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};