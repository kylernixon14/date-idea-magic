import { useState } from "react";
import { DateGeneratorForm } from "./date-generator/DateGeneratorForm";
import { DateIdeaDisplay } from "./date-generator/DateIdeaDisplay";
import { useDateGenerator } from "@/hooks/useDateGenerator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UsageProgressBar } from "./plan-limits/UsageProgressBar";
import { UpgradeBanner } from "./plan-limits/UpgradeBanner";
import { UsageLimitModal } from "./plan-limits/UsageLimitModal";

const MAX_FREE_GENERATIONS = 5;

export function DateGenerator() {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { dateIdea, generateDate, isLoading } = useDateGenerator();
  const { toast } = useToast();

  const { data: subscriptionData } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      return subscription;
    }
  });

  const generationsUsed = subscriptionData?.date_generations_count || 0;
  const remainingDates = MAX_FREE_GENERATIONS - generationsUsed;
  const isFreeUser = subscriptionData?.subscription_type === "free";
  const isLifetimeUser = subscriptionData?.subscription_type === "lifetime";

  const handleSubmit = async (values: any) => {
    if (isFreeUser && generationsUsed >= MAX_FREE_GENERATIONS) {
      toast({
        title: "Free Plan Limit Reached",
        description: "Please upgrade to generate more date ideas",
        variant: "destructive",
      });
      return;
    }

    if (isFreeUser && remainingDates <= 2) {
      setShowLimitModal(true);
    }

    await generateDate(values);

    if (isFreeUser && remainingDates === 1) {
      toast({
        title: "Last Generation Used!",
        description: "Upgrade now to continue generating amazing date ideas",
        variant: "destructive",
      });
    } else if (isFreeUser && remainingDates === 2) {
      toast({
        title: "Running Low!",
        description: "Only 2 generations remaining on your free plan",
        variant: "default",
      });
    }
  };

  return (
    <div className="container max-w-6xl py-4 md:py-8 px-4 md:px-8 space-y-6 md:space-y-8">
      <div className="max-w-xl mx-auto space-y-6 md:space-y-8">
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Generate Your Perfect Date</h1>
          <p className="text-sm md:text-base text-muted-foreground text-center px-4">
            Tell us about your relationship and we'll create a personalized date idea just for you.
          </p>
          {isFreeUser && (
            <div className="w-full max-w-xs mx-auto">
              <UsageProgressBar used={generationsUsed} total={MAX_FREE_GENERATIONS} />
            </div>
          )}
        </div>

        <DateGeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
        
        {isFreeUser && <UpgradeBanner remainingDates={remainingDates} />}
      </div>

      {dateIdea && <DateIdeaDisplay dateIdea={dateIdea} isLoading={isLoading} />}

      <UsageLimitModal 
        open={showLimitModal} 
        onOpenChange={setShowLimitModal}
        remainingDates={remainingDates}
      />
    </div>
  );
}