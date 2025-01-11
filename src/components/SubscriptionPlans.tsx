import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SubscriptionPlans() {
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string, mode: 'payment' | 'subscription') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to subscribe",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, mode }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');

      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-3 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Free Plan</CardTitle>
          <CardDescription>Perfect for trying out the service</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$0</p>
          <ul className="mt-4 space-y-2">
            <li>Generate up to 5 date ideas</li>
            <li>Basic features</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline" disabled>
            Current Plan
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Premium</CardTitle>
          <CardDescription>For regular date planners</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$5<span className="text-sm font-normal">/month</span></p>
          <ul className="mt-4 space-y-2">
            <li>Unlimited date generations</li>
            <li>Premium features</li>
            <li>Cancel anytime</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleSubscribe('price_1Qg51FADvTv7NPPxP4PidneA', 'subscription')}
          >
            Subscribe Monthly
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifetime Access</CardTitle>
          <CardDescription>Best value for long-term use</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$39</p>
          <ul className="mt-4 space-y-2">
            <li>Unlimited date generations</li>
            <li>Premium features</li>
            <li>One-time payment</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => handleSubscribe('price_1Qg51FADvTv7NPPxP4PidneA', 'payment')}
          >
            Get Lifetime Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}