import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [generationCount, setGenerationCount] = useState<number | null>(null);
  const [accessType, setAccessType] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: access } = await supabase
          .from('user_access')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (access) {
          setAccessType(access.access_type);
          if (access.access_type === 'free') {
            setShowUpgrade(true);
            setGenerationCount(access.date_generations_count || 0);
          } else if (access.access_type === 'lifetime') {
            setShowUpgrade(false);
            setGenerationCount(null);
          }
        }
      }
    };

    checkAccess();
  }, []);

  return (
    <div className="border-b">
      <header className="h-16">
        <div className="flex h-full items-center px-4 justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/4b7a973f-7bee-47af-9ea8-1d6599806289.png" 
              alt="DateGen Logo" 
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-4">
            {showUpgrade && (
              <>
                {accessType === 'free' && generationCount !== null && (
                  <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                    <Percent className="h-4 w-4" />
                    <span>{5 - generationCount} dates left</span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="hidden sm:inline-flex"
                >
                  <Link to="/upgrade">Upgrade</Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="sm:hidden"
                >
                  <Link to="/upgrade">
                    <ArrowUp className="h-4 w-4 text-custom-orange" />
                  </Link>
                </Button>
              </>
            )}
            <ProfileMenu />
          </div>
        </div>
      </header>
      {/* Mobile dates left indicator */}
      {showUpgrade && accessType === 'free' && generationCount !== null && (
        <div className="sm:hidden flex items-center justify-center gap-1 text-sm text-muted-foreground py-2 bg-muted/50">
          <Percent className="h-4 w-4" />
          <span>{5 - generationCount} dates left</span>
        </div>
      )}
    </div>
  );
}