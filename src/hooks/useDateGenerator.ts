import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const formSchema = z.object({
  relationshipStatus: z.string(),
  budget: z.number().min(0),
  timeAvailable: z.string(),
  vibes: z.array(z.string()),
  yourLoveLanguage: z.string().optional(), // Made optional
  partnerLoveLanguage: z.string().optional(), // Made optional
  weather: z.string(),
  timeOfDay: z.string().optional(),
  energyLevel: z.number().min(0).max(4).optional(),
  hobbies: z.array(z.string()).default([]),
});

export type DateGeneratorFormValues = z.infer<typeof formSchema>;

export const useDateGenerator = () => {
  const [dateIdea, setDateIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { data: accessData } = useQuery({
    queryKey: ["userAccess"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { data: access, error } = await supabase
        .from("user_access")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching access:", error);
        return null;
      }
      
      return access || { 
        access_type: 'free', 
        date_generations_count: 0 
      };
    }
  });

  const generateDate = async (formData: DateGeneratorFormValues) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && accessData?.access_type === "free") {
        if ((accessData?.date_generations_count || 0) >= 5) {
          toast({
            title: "Free limit reached",
            description: "Please upgrade to generate more dates",
            variant: "destructive",
          });
          return null;
        }
      }

      console.log('Calling generate-date function with formData:', formData);
      
      // First, insert the date generation record
      const { error: insertError } = await supabase
        .from('date_generations')
        .insert({
          relationship_status: formData.relationshipStatus,
          budget: formData.budget,
          time_available: formData.timeAvailable,
          vibes: formData.vibes,
          your_love_language: formData.yourLoveLanguage,
          partner_love_language: formData.partnerLoveLanguage,
          weather: formData.weather,
          time_of_day: formData.timeOfDay,
          energy_level: formData.energyLevel,
          hobbies: formData.hobbies,
          ip_address: '0.0.0.0', // This is required but we're using a placeholder
        });

      if (insertError) {
        console.error('Error inserting date generation:', insertError);
        throw new Error("Failed to save date generation");
      }

      // Then call the generate-date function
      const { data, error } = await supabase.functions.invoke('generate-date', {
        body: { formData }
      });

      if (error) {
        console.error('Error from generate-date function:', error);
        throw new Error("Failed to generate date");
      }

      console.log('Response from generate-date function:', data);
      setDateIdea(data.dateIdea);
      
      // Only update generation count for free users
      if (session?.user && accessData?.access_type === "free") {
        const { error: updateError } = await supabase
          .from("user_access")
          .update({ 
            date_generations_count: (accessData?.date_generations_count || 0) + 1 
          })
          .eq("user_id", session.user.id);
          
        if (updateError) {
          console.error('Error updating generation count:', updateError);
        }
      }

      return data;
    } catch (error) {
      console.error("Error generating date:", error);
      toast({
        title: "Error",
        description: "Failed to generate date idea. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dateIdea,
    generateDate,
    isLoading,
  };
};