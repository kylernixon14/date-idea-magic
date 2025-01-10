import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { RelationshipStatus } from "./date-generator/RelationshipStatus";
import { BudgetSlider } from "./date-generator/BudgetSlider";
import { TimeSelector } from "./date-generator/TimeSelector";
import { VibeSelector } from "./date-generator/VibeSelector";
import { LoveLanguageSelector } from "./date-generator/LoveLanguageSelector";

const formSchema = z.object({
  relationshipStatus: z.enum(["dating", "engaged", "married"]),
  budget: z.number().min(0).max(250),
  timeAvailable: z.enum(["1-2 hours", "half-day", "full-day", "weekend"]),
  vibes: z.array(z.string()).min(1, "Please select at least one vibe"),
  yourLoveLanguage: z.string(),
  partnerLoveLanguage: z.string(),
});

export function DateGenerator() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [dateIdea, setDateIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 50,
      vibes: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-date', {
        body: { formData: values },
      });

      if (error) throw error;
      setDateIdea(data.dateIdea);
    } catch (error) {
      console.error('Error generating date idea:', error);
      toast({
        title: "Error",
        description: "Failed to generate date idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Date Night Generator</h1>
        <p className="text-muted-foreground">
          Answer a few questions to get your perfect date idea
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <RelationshipStatus form={form} />
          <BudgetSlider 
            form={form} 
            sliderValue={sliderValue} 
            setSliderValue={setSliderValue} 
          />
          <TimeSelector form={form} />
          <VibeSelector form={form} />
          <LoveLanguageSelector 
            form={form} 
            label="What's your love language?" 
            name="yourLoveLanguage" 
          />
          <LoveLanguageSelector 
            form={form} 
            label="What's your partner's love language?" 
            name="partnerLoveLanguage" 
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Date Idea"}
          </Button>
        </form>
      </Form>

      {dateIdea && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Your Perfect Date Idea</h2>
            <div className="whitespace-pre-wrap">{dateIdea}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}