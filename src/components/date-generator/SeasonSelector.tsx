import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Cloud, Sun, Leaf, Snowflake } from "lucide-react";

const seasonOptions = [
  { id: "summer", label: "Summer", icon: Sun, color: "#e45e4180" },
  { id: "fall", label: "Fall", icon: Leaf, color: "#c6a05980" },
  { id: "winter", label: "Winter", icon: Snowflake, color: "#c8d9ec80" },
  { id: "spring", label: "Spring", icon: Cloud, color: "#bec69f80" },
] as const;

export function SeasonSelector({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="season"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">What season is it?</FormLabel>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {seasonOptions.map((season) => {
              const Icon = season.icon;
              const isSelected = field.value === season.id;
              return (
                <Button
                  key={season.id}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start gap-2 border-2",
                    isSelected && {
                      'bg-[var(--season-bg)]': true,
                      'border-[var(--season-bg)]': true,
                      'text-black': true,
                    },
                    !isSelected && "hover:bg-gray-100"
                  )}
                  style={isSelected ? { '--season-bg': season.color } as React.CSSProperties : {}}
                  onClick={() => field.onChange(season.id)}
                >
                  <Icon className="h-4 w-4" />
                  {season.label}
                </Button>
              );
            })}
          </div>
        </FormItem>
      )}
    />
  );
}