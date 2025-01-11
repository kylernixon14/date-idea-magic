import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loveLanguages = [
  { value: "words", label: "Words of Affirmation" },
  { value: "acts", label: "Acts of Service" },
  { value: "gifts", label: "Receiving Gifts" },
  { value: "time", label: "Quality Time" },
  { value: "touch", label: "Physical Touch" },
] as const;

export function LoveLanguageSelector({ 
  form, 
  label, 
  name 
}: { 
  form: any;
  label: string;
  name: "yourLoveLanguage" | "partnerLoveLanguage";
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="h-12 md:h-14 text-base">
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loveLanguages.map((language) => (
                <SelectItem 
                  key={language.value} 
                  value={language.value}
                  className="h-12 md:h-14 text-base"
                >
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}