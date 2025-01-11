import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RelationshipStatus } from "./date-generator/RelationshipStatus";
import { BudgetSlider } from "./date-generator/BudgetSlider";
import { TimeSelector } from "./date-generator/TimeSelector";
import { VibeSelector } from "./date-generator/VibeSelector";
import { LoveLanguageSelector } from "./date-generator/LoveLanguageSelector";
import { SeasonSelector } from "./date-generator/SeasonSelector";
import { DateIdeaDisplay } from "./date-generator/DateIdeaDisplay";

const formSchema = z.object({
  relationshipStatus: z.enum(["dating", "engaged", "married"]),
  budget: z.number().min(0).max(250),
  timeAvailable: z.enum(["1-2 hours", "half-day", "full-day", "weekend"]),
  vibes: z.array(z.string()).min(1, "Please select at least one vibe"),
  yourLoveLanguage: z.string(),
  partnerLoveLanguage: z.string(),
  season: z.enum(["summer", "fall", "winter", "spring"]),
});

export function DateGenerator() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [dateIdea, setDateIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'Plus Jakarta Sans',
        'url(https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NSg.woff2)'
      );
      try {
        await font.load();
        document.fonts.add(font);
        console.log('Plus Jakarta Sans font loaded successfully');
      } catch (error) {
        console.error('Error loading Plus Jakarta Sans font:', error);
      }
    };
    loadFont();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 50,
      vibes: [],
      season: "summer",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

      const { error: insertError } = await supabase
        .from('date_generations')
        .insert([{ ip_address: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip) }]);

      if (insertError) {
        console.error('Error recording date generation:', insertError);
        throw insertError;
      }

      const { data, error } = await supabase.functions.invoke('generate-date', {
        body: { formData: values },
      });

      console.log('Response from generate-date:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data?.dateIdea) {
        throw new Error('No date idea was generated');
      }

      setDateIdea(data.dateIdea);
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
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 font-jakarta text-black">
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
          <SeasonSelector form={form} />
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

      {(dateIdea || isLoading) && (
        <DateIdeaDisplay dateIdea={dateIdea} isLoading={isLoading} />
      )}
    </div>
  );
}