import { useEffect, useState } from "react";
import { DateGenerator } from "@/components/DateGenerator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(false);

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
      }
    };

    checkWelcomeStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <DateGenerator />
      </main>
      <Footer />
      <WelcomeDialog 
        open={showWelcome} 
        onOpenChange={setShowWelcome}
      />
    </div>
  );
};

export default Index;