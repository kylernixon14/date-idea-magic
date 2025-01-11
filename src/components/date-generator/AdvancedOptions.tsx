import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const timeOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Late Night" },
] as const;

const locationOptions = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "both", label: "Both" },
] as const;

const energyLevels = [
  { value: "low", label: "Low Energy" },
  { value: "medium", label: "Medium Energy" },
  { value: "high", label: "High Energy" },
] as const;

export function AdvancedOptions({ form }: { form: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-12"
        >
          {isOpen ? (
            <>
              <ChevronUp className="h-4 w-4" />
              <span>Show Less Options</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>Show More Options</span>
            </>
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="timeOfDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Preferred Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 md:h-14">
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="h-12 md:h-14"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Location Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 md:h-14">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="h-12 md:h-14"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Energy Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 md:h-14">
                      <SelectValue placeholder="Select energy level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {energyLevels.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="h-12 md:h-14"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}