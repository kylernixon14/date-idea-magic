import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

export function BudgetSlider({ form, sliderValue, setSliderValue }: { 
  form: any;
  sliderValue: number[];
  setSliderValue: (value: number[]) => void;
}) {
  return (
    <FormField
      control={form.control}
      name="budget"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">What's your budget?</FormLabel>
          <FormControl>
            <div className="space-y-3">
              <Slider
                min={0}
                max={250}
                step={10}
                value={sliderValue}
                onValueChange={(value) => {
                  setSliderValue(value);
                  field.onChange(value[0]);
                }}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Free</span>
                <span className="text-center font-medium text-foreground">
                  ${sliderValue[0]}
                </span>
                <span>$250+</span>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}