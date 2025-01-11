import { DateGenerator } from "@/components/DateGenerator";
import { Header } from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <DateGenerator />
      </main>
    </div>
  );
};

export default Index;