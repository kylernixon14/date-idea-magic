import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";

const Upgrade = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Plus Jakarta Sans font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-jakarta">
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:bg-transparent hover:text-custom-orange"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Date Generator
        </Button>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Upgrade Your Plan</h1>
          <p className="text-center text-muted-foreground mb-8 md:mb-12 px-4">
            Get unlimited date ideas and premium features
          </p>
          <SubscriptionPlans />
        </div>
      </main>
    </div>
  );
};

export default Upgrade;