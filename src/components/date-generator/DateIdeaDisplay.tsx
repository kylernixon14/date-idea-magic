import { Card, CardContent } from "@/components/ui/card";
import { DateActions } from "./actions/DateActions";
import { DateContent } from "./content/DateContent";

interface DateIdeaDisplayProps {
  dateIdea: string | null;
  isLoading: boolean;
}

export function DateIdeaDisplay({ dateIdea, isLoading }: DateIdeaDisplayProps) {
  return (
    <Card className="mt-6 md:mt-8">
      <CardContent className="pt-6">
        {dateIdea && <DateActions dateIdea={dateIdea} />}
        <DateContent dateIdea={dateIdea} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}