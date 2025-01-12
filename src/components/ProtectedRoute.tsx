import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing protected route");
    
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Session check result:", session ? "Session exists" : "No session");
        
        if (error) {
          console.error("Session check error:", error);
          toast({
            title: "Authentication Error",
            description: "Please sign in again.",
            variant: "destructive",
          });
          setSession(null);
          setLoading(false);
          navigate("/login", { replace: true });
          return;
        }

        setSession(session);
        setLoading(false);
        
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setLoading(false);
        setSession(null);
        navigate("/login", { replace: true });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in protected route:", event);
      
      if (event === 'SIGNED_OUT') {
        console.log("Session ended, redirecting to login");
        setSession(null);
        navigate("/login", { replace: true });
        return;
      }
      
      setSession(session);
    });

    return () => {
      console.log("Cleaning up protected route listeners");
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return session ? <>{children}</> : null;
};

export default ProtectedRoute;