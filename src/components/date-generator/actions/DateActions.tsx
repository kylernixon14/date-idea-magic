import { Button } from "@/components/ui/button";
import { Download, Bookmark } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateDatePdf } from "../pdf/PdfGenerator";

interface DateActionsProps {
  dateIdea: string;
}

export function DateActions({ dateIdea }: DateActionsProps) {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const { toast } = useToast();

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to bookmark dates.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('bookmarked_dates')
        .insert([{ 
          date_idea: dateIdea,
          user_id: session.user.id
        }]);

      if (error) throw error;

      toast({
        title: "Date bookmarked!",
        description: "You can find it in your bookmarked dates.",
      });
    } catch (error) {
      console.error('Error bookmarking date:', error);
      toast({
        title: "Error bookmarking date",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="flex justify-end gap-3 mb-4">
      <Button
        onClick={handleBookmark}
        variant="ghost"
        disabled={isBookmarking}
        className="hover:bg-transparent h-12 w-12"
      >
        <Bookmark className="h-5 w-5" />
      </Button>
      <Button
        onClick={() => generateDatePdf({ dateIdea })}
        variant="ghost"
        className="hover:bg-transparent h-12 w-12"
      >
        <Download className="h-5 w-5" />
      </Button>
    </div>
  );
}