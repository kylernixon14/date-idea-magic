import { useEffect, useState } from "react";
import { DateGeneratorForm } from "./date-generator/DateGeneratorForm";
import { DateIdeaDisplay } from "./date-generator/DateIdeaDisplay";
import { SubscriptionPlans } from "./SubscriptionPlans";
import { useDateGenerator } from "@/hooks/useDateGenerator";
import { supabase } from "@/integrations/supabase/client";

export function DateGenerator() {
  const [showSubscription, setShowSubscription] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'Plus Jakarta Sans',
        'url(https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NSg.woff2)'
      );
      try {
        await font.load();
        document.fonts.add(font);
        console.log('Plus Jakarta Sans font loaded successfully');
      } catch (error) {
        console.error('Error loading Plus Jakarta Sans font:', error);
      }
    };
    loadFont();

    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (subscription?.subscription_type === 'free' && subscription?.date_generations_count >= 5) {
          setShowSubscription(true);
        }
        setGenerationCount(subscription?.date_generations_count || 0);
      }
    };

    checkSubscription();
  }, []);

  const { dateIdea, isLoading, generateDate } = useDateGenerator();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 font-jakarta text-black">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Date Night Generator</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Answer a few questions to get your perfect date idea
        </p>
        {generationCount > 0 && generationCount < 5 && (
          <p className="text-sm text-muted-foreground">
            You have used {generationCount} of your 5 free generations
          </p>
        )}
      </div>

      {showSubscription ? (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Upgrade Your Plan</h2>
            <p className="text-muted-foreground">
              You've used all your free generations. Upgrade to continue generating amazing date ideas!
            </p>
          </div>
          <SubscriptionPlans />
        </div>
      ) : (
        <>
          <DateGeneratorForm onSubmit={generateDate} isLoading={isLoading} />
          {(dateIdea || isLoading) && (
            <DateIdeaDisplay dateIdea={dateIdea} isLoading={isLoading} />
          )}
        </>
      )}
    </div>
  );
}