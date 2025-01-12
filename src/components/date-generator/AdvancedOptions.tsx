import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Sunrise, Sun, Sunset } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { HobbiesSelector } from "./HobbiesSelector";
import { Slider } from "@/components/ui/slider";

const timeOptions = [
  { id: "morning", label: "Morning", icon: Sunrise },
  { id: "afternoon", label: "Afternoon", icon: Sun },
  { id: "evening", label: "Evening", icon: Sunset },
] as const;

const energyLevels = ["Very Low", "Low", "Medium", "High", "Very High"] as const;

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
        <FormField
          control={form.control}
          name="timeOfDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Preferred Time</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {timeOptions.map((time) => {
                  const Icon = time.icon;
                  const isSelected = field.value === time.id;
                  return (
                    <Button
                      key={time.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "w-full h-12 md:h-14 justify-start gap-2 border-2",
                        isSelected && "bg-primary text-primary-foreground border-black"
                      )}
                      onClick={() => field.onChange(time.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm md:text-base">{time.label}</span>
                    </Button>
                  );
                })}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="energyLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Energy Level</FormLabel>
              <div className="pt-2">
                <Slider
                  min={0}
                  max={4}
                  step={1}
                  value={[field.value ?? 2]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  {energyLevels.map((level, index) => (
                    <span key={level} className={cn(
                      "cursor-pointer",
                      field.value === index && "font-medium text-foreground"
                    )}>
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            </FormItem>
          )}
        />

        <HobbiesSelector form={form} />
      </CollapsibleContent>
    </Collapsible>
  );
}