import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RelationshipStatus } from "./RelationshipStatus";
import { BudgetSlider } from "./BudgetSlider";
import { TimeSelector } from "./TimeSelector";
import { VibeSelector } from "./VibeSelector";
import { LoveLanguageSelector } from "./LoveLanguageSelector";
import { WeatherSelector } from "./WeatherSelector";
import { useState } from "react";
import { formSchema, type DateGeneratorFormValues } from "@/hooks/useDateGenerator";

interface DateGeneratorFormProps {
  onSubmit: (values: DateGeneratorFormValues) => void;
  isLoading: boolean;
}

export function DateGeneratorForm({ onSubmit, isLoading }: DateGeneratorFormProps) {
  const [sliderValue, setSliderValue] = useState([50]);
  
  const form = useForm<DateGeneratorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 50,
      vibes: [],
      weather: "sunny",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 md:space-y-8">
          <RelationshipStatus form={form} />
          <BudgetSlider 
            form={form} 
            sliderValue={sliderValue} 
            setSliderValue={setSliderValue} 
          />
          <TimeSelector form={form} />
          <VibeSelector form={form} />
          <WeatherSelector form={form} />
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
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base mt-8" 
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Date Idea"}
        </Button>
      </form>
    </Form>
  );
}