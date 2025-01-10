import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

const vibeOptions = [
  { id: "adventure", label: "Adventure" },
  { id: "romantic", label: "Romantic" },
  { id: "relaxing", label: "Relaxing" },
  { id: "creative", label: "Creative" },
  { id: "foodie", label: "Foodie" },
  { id: "cultural", label: "Cultural" },
] as const;

const loveLanguages = [
  { value: "words", label: "Words of Affirmation" },
  { value: "acts", label: "Acts of Service" },
  { value: "gifts", label: "Receiving Gifts" },
  { value: "time", label: "Quality Time" },
  { value: "touch", label: "Physical Touch" },
] as const;

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
        <p className="text-muted-foreground">Answer a few questions to get your perfect date idea</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="relationshipStatus"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>What's your relationship status?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="dating" />
                      </FormControl>
                      <FormLabel className="font-normal">Dating</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="engaged" />
                      </FormControl>
                      <FormLabel className="font-normal">Engaged</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="married" />
                      </FormControl>
                      <FormLabel className="font-normal">Married</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's your budget?</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={250}
                      step={10}
                      value={sliderValue}
                      onValueChange={(value) => {
                        setSliderValue(value);
                        field.onChange(value[0]);
                      }}
                    />
                    <div className="text-center text-muted-foreground">
                      ${sliderValue[0]}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeAvailable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How much time do you have?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time available" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                    <SelectItem value="half-day">Half day</SelectItem>
                    <SelectItem value="full-day">Full day</SelectItem>
                    <SelectItem value="weekend">Weekend</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vibes"
            render={() => (
              <FormItem>
                <FormLabel>What's the vibe you're looking for?</FormLabel>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {vibeOptions.map((vibe) => (
                    <FormField
                      key={vibe.id}
                      control={form.control}
                      name="vibes"
                      render={({ field }) => (
                        <FormItem
                          key={vibe.id}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(vibe.id)}
                              onCheckedChange={(checked) => {
                                const value = field.value || [];
                                if (checked) {
                                  field.onChange([...value, vibe.id]);
                                } else {
                                  field.onChange(
                                    value.filter((item) => item !== vibe.id)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {vibe.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yourLoveLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's your love language?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your love language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loveLanguages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partnerLoveLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's your partner's love language?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your partner's love language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loveLanguages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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
