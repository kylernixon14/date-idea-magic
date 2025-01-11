import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load fonts
    const loadFonts = async () => {
      await Promise.all([
        document.fonts.load('1rem "Plus Jakarta Sans"'),
        document.fonts.load('1rem "IBM Plex Mono"')
      ]);
      document.body.classList.add('fonts-loaded');
    };
    loadFonts();

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in, navigating to home");
        navigate("/");
      }
      
      if (event === "USER_UPDATED") {
        console.log("User updated event received");
      }

      if (event === "SIGNED_UP") {
        if (!session) {
          console.log("Signup error occurred");
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-custom-tan">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-12 w-12 text-custom-orange" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 font-jakarta">Welcome to DateGen</h2>
            <p className="mt-2 text-sm text-gray-600 font-jakarta">
              Sign in to your account or create a new one
            </p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#e45e41',
                    brandAccent: '#e45e41',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full px-4 py-2 rounded-md font-mono',
                input: 'w-full px-4 py-2 rounded-md border border-gray-300 font-jakarta',
                label: 'text-sm font-medium text-gray-700 font-jakarta',
                anchor: 'text-custom-orange font-jakarta',
              },
            }}
            theme="light"
            providers={[]}
          />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="/lovable-uploads/be1d6851-8a81-4468-812e-7dd1eb1005c6.png"
          alt="Happy couple"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;