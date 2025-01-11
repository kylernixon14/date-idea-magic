import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Plus Jakarta Sans font
    const jakartaLink = document.createElement("link");
    jakartaLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    jakartaLink.rel = "stylesheet";
    document.head.appendChild(jakartaLink);

    // Load IBM Plex Mono font
    const plexMonoLink = document.createElement("link");
    plexMonoLink.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    plexMonoLink.rel = "stylesheet";
    document.head.appendChild(plexMonoLink);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in, navigating to home");
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
      document.head.removeChild(jakartaLink);
      document.head.removeChild(plexMonoLink);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#fbfaf8] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0L24.4903 15.5097L40 20L24.4903 24.4903L20 40L15.5097 24.4903L0 20L15.5097 15.5097L20 0Z" fill="#e45e41"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-2 font-jakarta">Welcome to DateGen</h1>
            <p className="text-gray-600 font-jakarta">Sign in to your account or create a new one</p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: '#e45e41',
                  borderRadius: '4px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  ':hover': {
                    background: '#d04e33',
                  }
                },
                input: {
                  borderRadius: '4px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                },
                label: {
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                },
                anchor: {
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: '#e45e41',
                },
              },
              variables: {
                default: {
                  colors: {
                    brand: '#e45e41',
                    brandAccent: '#d04e33',
                  },
                  fonts: {
                    bodyFontFamily: 'Plus Jakarta Sans, sans-serif',
                    buttonFontFamily: 'IBM Plex Mono, monospace',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/lovable-uploads/fefcff63-f014-454e-b2cb-5631e5d1b6cb.png"
          alt="Couple embracing"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;