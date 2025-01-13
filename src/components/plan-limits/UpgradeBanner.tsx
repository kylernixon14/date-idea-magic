import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface UpgradeBannerProps {
  remainingDates: number;
}

export function UpgradeBanner({ remainingDates }: UpgradeBannerProps) {
  if (remainingDates <= 0) {
    return (
      <div className="flex flex-col items-center space-y-3 p-4 rounded-lg border bg-background/95 shadow-sm">
        <p className="text-sm text-muted-foreground text-center">
          No generations left :(
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/upgrade" className="flex items-center gap-2">
            Upgrade now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3 p-4 rounded-lg border bg-background/95 shadow-sm">
      <p className="text-sm text-muted-foreground text-center">
        Only {remainingDates} {remainingDates === 1 ? 'generation' : 'generations'} left
      </p>
      <Button asChild variant="outline" size="sm">
        <Link to="/upgrade" className="flex items-center gap-2">
          Upgrade now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}