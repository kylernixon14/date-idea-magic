import { useEffect, useState } from "react";
import { DateGenerator } from "@/components/DateGenerator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  useEffect(() => {
    const checkWelcomeStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('has_seen_welcome')
            .eq('id', session.user.id)
            .single();
          
          setShowWelcome(profile?.has_seen_welcome === false);
        }
      } catch (error) {
        console.error('Error checking welcome status:', error);
        setShowWelcome(false);
      }
    };

    checkWelcomeStatus();
  }, []);

  if (showWelcome === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <DateGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;