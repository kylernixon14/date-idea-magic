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
    console.log("Setting up auth state change listener");
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
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to DateGen</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account or create a new one to start generating amazing date ideas
            </p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full px-4 py-2 rounded-md',
                input: 'w-full px-4 py-2 rounded-md border border-gray-300',
                label: 'text-sm font-medium text-gray-700',
              },
            }}
            theme="light"
            providers={[]}
          />
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden md:flex md:w-1/2 bg-primary/5 items-center justify-center p-8">
        <div className="max-w-md space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Why Choose DateGen?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Sparkles className="h-6 w-6 mr-2 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">AI-Powered Date Ideas</h4>
                  <p className="text-sm text-gray-600">Get personalized date suggestions based on your preferences and interests</p>
                </div>
              </li>
              <li className="flex items-start">
                <Sparkles className="h-6 w-6 mr-2 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Customizable Experience</h4>
                  <p className="text-sm text-gray-600">Tailor your date ideas based on budget, time, and preferences</p>
                </div>
              </li>
              <li className="flex items-start">
                <Sparkles className="h-6 w-6 mr-2 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Save Your Favorites</h4>
                  <p className="text-sm text-gray-600">Keep track of your favorite date ideas and plan future adventures</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;