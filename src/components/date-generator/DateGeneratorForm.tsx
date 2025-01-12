import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RelationshipStatus } from "./RelationshipStatus";
import { BudgetSlider } from "./BudgetSlider";
import { VibeSelector } from "./VibeSelector";
import { LoveLanguageSelector } from "./LoveLanguageSelector";
import { WeatherSelector } from "./WeatherSelector";
import { AdvancedOptions } from "./AdvancedOptions";
import { useState } from "react";
import { formSchema, type DateGeneratorFormValues } from "@/hooks/useDateGenerator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

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
      weather: undefined,
      timeOfDay: undefined,
      energyLevel: undefined,
      hobbies: [],
      timeAvailable: undefined,
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
          <FormField
            control={form.control}
            name="timeAvailable"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">How much time do you have?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-12 md:h-14">
                    <SelectValue placeholder="Select time available" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 hours</SelectItem>
                    <SelectItem value="2-4">2-4 hours</SelectItem>
                    <SelectItem value="4-6">4-6 hours</SelectItem>
                    <SelectItem value="6+">6+ hours</SelectItem>
                    <SelectItem value="full-day">Full day</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
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
          <AdvancedOptions form={form} />
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