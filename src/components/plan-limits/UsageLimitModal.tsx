import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UsageLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remainingDates: number;
}

export function UsageLimitModal({ 
  open, 
  onOpenChange, 
  remainingDates 
}: UsageLimitModalProps) {
  const navigate = useNavigate();

  if (remainingDates > 2) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Running Low on Generations</AlertDialogTitle>
          <AlertDialogDescription>
            You have {remainingDates} date {remainingDates === 1 ? 'generation' : 'generations'} remaining on your free plan. 
            Upgrade now to unlock unlimited date ideas and premium features!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Maybe Later</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => navigate("/upgrade")}
            className="bg-[#e45e41] hover:bg-[#e45e41]/90"
          >
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}