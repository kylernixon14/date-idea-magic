const Upgrade = () => {
  return (
    <div className="min-h-screen flex flex-col">
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