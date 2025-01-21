import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeDialog = ({ open, onOpenChange }: WelcomeDialogProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStart = async () => {
    setIsUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({ has_seen_welcome: true })
          .eq('id', session.user.id);
        onOpenChange(false);
        toast({
          title: "Welcome to DateGen!",
          description: "Let's create your first date idea.",
        });
      }
    } catch (error) {
      console.error('Error updating welcome status:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your preferences.",
        variant: "destructive",
      });
    }
    setIsUpdating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white sm:max-h-[90vh]">
        <ScrollArea className="p-8 max-h-[80vh]">
          <h1 className="text-3xl font-bold text-center text-custom-orange">
            Say buh-bye to boring dates!
          </h1>
          
          <div className="space-y-4 text-gray-700 mt-6">
            <p>Hey there!</p>
            
            <p>
              We're Britt & Kyler, the founders of{" "}
              <a 
                href="https://loveyourfirstyear.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-custom-orange hover:underline"
              >
                Love Your First Year
              </a>
              , and we wanted to welcome you to DateGen.
            </p>
            
            <p>As a couple, we love finding new and unique date ideas.</p>
            
            <p>
              DateGen allows you to answer a few simple questions and uses AI to generate 
              a completely custom, completely unique date... So you can finally say "buh-bye" 
              to boring and non-unique dates.
            </p>
            
            <p>
              To get started, you can generate 5 dates and will have access to all premium 
              features like bookmarking and advanced options.
            </p>
            
            <p>Then, if you'd like to upgrade:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>
                you can get unlimited LIFETIME access for just $39{" "}
                <Link to="/upgrade" className="text-custom-orange hover:underline">
                  (upgrade now)
                </Link>
              </li>
            </ul>
            
            <p>
              If you have any questions, issues, or features you'd like to see us add, 
              shoot us a DM on Instagram{" "}
              <a 
                href="https://instagram.com/loveyourfirstyear" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-custom-orange hover:underline"
              >
                @loveyourfirstyear
              </a>
              {" "}or an email at{" "}
              <a 
                href="mailto:hello@loveyourfirstyear.com"
                className="text-custom-orange hover:underline"
              >
                hello@loveyourfirstyear.com
              </a>
            </p>
            
            <p>Happy dating!</p>
            <p>-Britt & Kyler</p>
            
            <div className="flex justify-start">
              <img 
                src="/lovable-uploads/b7d1bdee-3221-45e6-a74e-63879cdd577c.png" 
                alt="Britt & Kyler" 
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              onClick={handleStart}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              Generate your first date
            </Button>
            <Link 
              to="/upgrade" 
              className="flex items-center gap-2 text-custom-orange hover:underline"
            >
              or upgrade now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};