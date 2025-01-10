import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Compass, Heart, Coffee, Palette, Utensils, Globe } from "lucide-react";

const vibeOptions = [
  { id: "adventure", label: "Adventure", icon: Compass },
  { id: "romantic", label: "Romantic", icon: Heart },
  { id: "relaxing", label: "Relaxing", icon: Coffee },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "foodie", label: "Foodie", icon: Utensils },
  { id: "cultural", label: "Cultural", icon: Globe },
] as const;

export function VibeSelector({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="vibes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What's the vibe you're looking for?</FormLabel>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {vibeOptions.map((vibe) => {
              const Icon = vibe.icon;
              const isSelected = field.value?.includes(vibe.id);
              return (
                <Button
                  key={vibe.id}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => {
                    const value = field.value || [];
                    if (isSelected) {
                      field.onChange(value.filter((item: string) => item !== vibe.id));
                    } else {
                      field.onChange([...value, vibe.id]);
                    }
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {vibe.label}
                </Button>
              );
            })}
          </div>
        </FormItem>
      )}
    />
  );
}