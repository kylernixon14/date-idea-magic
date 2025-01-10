import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeOptions = [
  { value: "1-2 hours", label: "1-2 hours" },
  { value: "half-day", label: "Half day" },
  { value: "full-day", label: "Full day" },
  { value: "weekend", label: "Weekend" },
] as const;

export function TimeSelector({ form }: { form: any }) {
  return (
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
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}