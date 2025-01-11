import { Progress } from "@/components/ui/progress";

interface UsageProgressBarProps {
  used: number;
  total: number;
}

export function UsageProgressBar({ used, total }: UsageProgressBarProps) {
  const percentage = (used / total) * 100;
  
  const getProgressColor = () => {
    if (used >= total - 1) return "bg-red-500";
    if (used >= total - 2) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full space-y-1">
      <Progress 
        value={percentage} 
        className={`h-2 ${getProgressColor()}`}
      />
      <p className="text-xs text-muted-foreground text-center">
        {used}/{total} generations used
      </p>
    </div>
  );
}