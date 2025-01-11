import { SubscriptionPlans } from "@/components/SubscriptionPlans";

const Upgrade = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Upgrade Your Plan</h1>
          <p className="text-center text-muted-foreground mb-12">
            Get unlimited date ideas and premium features
          </p>
          <SubscriptionPlans />
        </div>
      </main>
    </div>
  );
};

export default Upgrade;