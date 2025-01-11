import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Cloud, CloudRain, CloudSnow, Thermometer, Snowflake } from "lucide-react";

const weatherOptions = [
  { id: "sunny", label: "Sunny", icon: Sun, color: "#e45e4180" },
  { id: "cloudy", label: "Cloudy", icon: Cloud, color: "#c8d9ec80" },
  { id: "rainy", label: "Rainy", icon: CloudRain, color: "#bec69f80" },
  { id: "snowy", label: "Snowy", icon: CloudSnow, color: "#c8d9ec80" },
  { id: "hot", label: "Hot", icon: Thermometer, color: "#e45e4180" },
  { id: "cold", label: "Cold", icon: Snowflake, color: "#c8d9ec80" },
] as const;

export function WeatherSelector({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="weather"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">What's the weather like?</FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {weatherOptions.map((weather) => {
              const Icon = weather.icon;
              const isSelected = field.value === weather.id;
              return (
                <Button
                  key={weather.id}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full h-12 md:h-14 justify-start gap-2 border-2",
                    isSelected && {
                      'bg-[var(--weather-bg)]': true,
                      'border-[var(--weather-bg)]': true,
                      'text-black': true,
                    },
                    !isSelected && "hover:bg-gray-100"
                  )}
                  style={isSelected ? { '--weather-bg': weather.color } as React.CSSProperties : {}}
                  onClick={() => field.onChange(weather.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm md:text-base">{weather.label}</span>
                </Button>
              );
            })}
          </div>
        </FormItem>
      )}
    />
  );
}