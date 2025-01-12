import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Sunrise, Sunset } from "lucide-react";

const timeOptions = [
  { id: "morning", label: "Morning", icon: Sunrise },
  { id: "afternoon", label: "Afternoon", icon: Sun },
  { id: "evening", label: "Evening", icon: Sunset },
] as const;

export function TimeSelector({ form }: { form: any }) {
  return (
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
  );
}