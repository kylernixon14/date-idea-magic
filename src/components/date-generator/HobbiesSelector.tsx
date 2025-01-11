import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Trophy, 
  Palette, 
  Mountain, 
  Dumbbell, 
  Music, 
  Utensils, 
  GamepadIcon, 
  Book, 
  Camera 
} from "lucide-react";

const hobbyOptions = [
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "art", label: "Art & Crafts", icon: Palette },
  { id: "hiking", label: "Hiking & Nature", icon: Mountain },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "music", label: "Music", icon: Music },
  { id: "cooking", label: "Cooking", icon: Utensils },
  { id: "games", label: "Games & Puzzles", icon: GamepadIcon },
  { id: "reading", label: "Reading", icon: Book },
  { id: "photography", label: "Photography", icon: Camera },
] as const;

export function HobbiesSelector({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="hobbies"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">What hobbies interest you both?</FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {hobbyOptions.map((hobby) => {
              const Icon = hobby.icon;
              const isSelected = field.value?.includes(hobby.id);
              return (
                <Button
                  key={hobby.id}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full h-12 md:h-14 justify-start gap-2 border-2",
                    isSelected && "bg-primary text-primary-foreground border-black"
                  )}
                  onClick={() => {
                    const value = field.value || [];
                    if (isSelected) {
                      field.onChange(value.filter((item: string) => item !== hobby.id));
                    } else {
                      field.onChange([...value, hobby.id]);
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm md:text-base">{hobby.label}</span>
                </Button>
              );
            })}
          </div>
        </FormItem>
      )}
    />
  );
}