import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SubscriptionPlans() {
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string) => {
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
        body: { priceId, mode: 'payment' }
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
    <div className="grid gap-6 sm:grid-cols-2 px-4 sm:px-0">
      <Card className="border-2 hover:border-custom-orange transition-colors">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Free Plan</CardTitle>
          <CardDescription className="text-sm md:text-base">Perfect for trying out the service</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl md:text-4xl font-bold mb-4">$0</p>
          <ul className="space-y-3 text-sm md:text-base">
            <li className="flex items-center">
              <span>Generate up to 5 date ideas</span>
            </li>
            <li className="flex items-center">
              <span>Basic features</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full py-6" 
            variant="outline" 
            disabled
          >
            Current Plan
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-2 border-custom-orange relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-custom-orange text-white px-4 py-1 rounded-full text-sm">
          Best Value
        </div>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Lifetime Access</CardTitle>
          <CardDescription className="text-sm md:text-base">One-time payment, forever access</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl md:text-4xl font-bold mb-4">$39</p>
          <ul className="space-y-3 text-sm md:text-base">
            <li className="flex items-center">
              <span>Unlimited date generations</span>
            </li>
            <li className="flex items-center">
              <span>Premium features</span>
            </li>
            <li className="flex items-center">
              <span>One-time payment</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full py-6 bg-custom-orange hover:bg-custom-orange/90"
            onClick={() => handleSubscribe('price_1Qg51FADvTv7NPPxP4PidneA')}
          >
            Get Lifetime Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}