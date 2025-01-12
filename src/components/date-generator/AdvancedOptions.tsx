import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { HobbiesSelector } from "./HobbiesSelector";
import { Slider } from "@/components/ui/slider";

const timeOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
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
        <div className="grid grid-cols-1 gap-6">
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
        </div>

        <HobbiesSelector form={form} />
      </CollapsibleContent>
    </Collapsible>
  );
}