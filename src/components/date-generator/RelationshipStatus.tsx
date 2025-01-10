import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, GemRing, Home } from "lucide-react";

const options = [
  { value: "dating", label: "Dating", icon: Heart },
  { value: "engaged", label: "Engaged", icon: GemRing },
  { value: "married", label: "Married", icon: Home },
] as const;

export function RelationshipStatus({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="relationshipStatus"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>What's your relationship status?</FormLabel>
          <FormControl>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={field.value === option.value ? "default" : "outline"}
                    className={cn(
                      "w-full justify-start gap-2",
                      field.value === option.value && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => field.onChange(option.value)}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}