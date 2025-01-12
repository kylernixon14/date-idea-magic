import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const options = [
  { value: "dating", label: "Dating" },
  { value: "engaged", label: "Engaged" },
  { value: "married", label: "Married" },
] as const;

export function RelationshipStatus({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="relationshipStatus"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="font-semibold">What's your relationship status?</FormLabel>
          <FormControl>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {options.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={field.value === option.value ? "default" : "outline"}
                  className={cn(
                    "w-full h-12 md:h-14 justify-center text-sm md:text-base",
                    field.value === option.value && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => field.onChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}