import { DateGenerator } from "@/components/DateGenerator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
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