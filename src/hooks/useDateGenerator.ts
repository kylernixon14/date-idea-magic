import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useDateGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
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
        .single();
      
      return subscription;
    }
  });

  const generateDate = async (formData: any) => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && subscriptionData?.subscription_type === "free") {
        if ((subscriptionData?.date_generations_count || 0) >= 5) {
          toast({
            title: "Free limit reached",
            description: "Please upgrade to generate more dates",
            variant: "destructive",
          });
          return null;
        }
      }

      const response = await fetch("/api/generate-date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate date");
      }

      const data = await response.json();
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
      setIsGenerating(false);
    }
  };

  return {
    generateDate,
    isGenerating,
  };
};