import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [generationCount, setGenerationCount] = useState<number | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!subscription || subscription?.subscription_type === 'free') {
          setShowUpgrade(true);
          setGenerationCount(subscription?.date_generations_count || 0);
        }
      }
    };

    checkSubscription();
  }, []);

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/4b7a973f-7bee-47af-9ea8-1d6599806289.png" 
            alt="DateGen Logo" 
            className="h-8"
          />
        </Link>
        <div className="flex items-center gap-4">
          {showUpgrade && (
            <>
              {generationCount !== null && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Percent className="h-4 w-4" />
                  <span>{5 - generationCount} dates left</span>
                </div>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link to="/upgrade">Upgrade</Link>
              </Button>
            </>
          )}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};