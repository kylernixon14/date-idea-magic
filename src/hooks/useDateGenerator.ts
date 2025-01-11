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
      console.log('Submitting form values:', values);

      const { count } = await supabase
        .from('date_generations')
        .select('*', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (count && count >= 100) {
        throw new Error('You have reached the limit of 100 date ideas per 24 hours. Please try again later.');
      }

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

      const { error: insertError } = await supabase
        .from('date_generations')
        .insert([{ 
          ip_address: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip),
          content: generatedData.dateIdea
        }]);

      if (insertError) {
        console.error('Error recording date generation:', insertError);
        throw insertError;
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