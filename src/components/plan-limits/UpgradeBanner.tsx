import { ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UpgradeBannerProps {
  remainingDates: number;
}

export function UpgradeBanner({ remainingDates }: UpgradeBannerProps) {
  const navigate = useNavigate();

  if (remainingDates > 2) return null;

  return (
    <div className="w-full p-4 bg-orange-50 border border-[#e45e41] rounded-lg mt-4">
      <div className="flex items-center gap-3">
        <ArrowUpCircle className="h-5 w-5 text-[#e45e41]" />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {remainingDates === 1 ? (
              "Last generation remaining!"
            ) : (
              "Only 2 generations left"
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            Join hundreds of couples who've upgraded for unlimited date ideas
          </p>
        </div>
        <Button
          onClick={() => navigate("/upgrade")}
          className="bg-[#e45e41] hover:bg-[#e45e41]/90"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
}