import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";

export const formSchema = z.object({
  relationshipStatus: z.enum(["dating", "engaged", "married"]),
  budget: z.number().min(0).max(250),
  timeAvailable: z.enum(["1-2 hours", "half-day", "full-day", "weekend"]),
  vibes: z.array(z.string()).min(1, "Please select at least one vibe"),
  yourLoveLanguage: z.string(),
  partnerLoveLanguage: z.string(),
  weather: z.enum(["sunny", "cloudy", "rainy", "snowy", "hot", "cold"]),
});

export type DateGeneratorFormValues = z.infer<typeof formSchema>;

export function useDateGenerator() {
  const [dateIdea, setDateIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateDate = async (values: DateGeneratorFormValues) => {
    setIsLoading(true);
    setDateIdea(null);
    
    try {
      // Get user subscription status
      const { data: { session } } = await supabase.auth.getSession();
      let canGenerate = true;
      let subscriptionType = 'free';

      if (session?.user) {
        const { data: userSubscription } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (userSubscription) {
          subscriptionType = userSubscription.subscription_type;
          if (subscriptionType === 'free' && userSubscription.date_generations_count >= 5) {
            canGenerate = false;
          }
        }
      }

      if (!canGenerate) {
        throw new Error('You have reached the limit of 5 free date generations. Please upgrade to continue.');
      }

      console.log('Submitting form values:', values);

      const { data: generatedData, error } = await supabase.functions.invoke('generate-date', {
        body: { formData: values },
      });

      console.log('Response from generate-date:', { generatedData, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!generatedData?.dateIdea) {
        throw new Error('No date idea was generated');
      }

      // Update generation count for free users
      if (session?.user && subscriptionType === 'free') {
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({ 
            date_generations_count: (userSubscription?.date_generations_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', session.user.id);

        if (updateError) {
          console.error('Error updating generation count:', updateError);
        }
      }

      setDateIdea(generatedData.dateIdea);
      toast({
        title: "Success!",
        description: "Your perfect date idea has been generated.",
      });
    } catch (error) {
      console.error('Error generating date idea:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate date idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dateIdea,
    isLoading,
    generateDate,
  };
}