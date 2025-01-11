import { useEffect } from "react";
import { DateGeneratorForm } from "./date-generator/DateGeneratorForm";
import { DateIdeaDisplay } from "./date-generator/DateIdeaDisplay";
import { useDateGenerator } from "@/hooks/useDateGenerator";

export function DateGenerator() {
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
  }, []);

  const { dateIdea, isLoading, generateDate } = useDateGenerator();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 space-y-8 font-jakarta text-black">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Date Night Generator</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Answer a few questions to get your perfect date idea
        </p>
      </div>

      <DateGeneratorForm onSubmit={generateDate} isLoading={isLoading} />

      {(dateIdea || isLoading) && (
        <DateIdeaDisplay dateIdea={dateIdea} isLoading={isLoading} />
      )}
    </div>
  );
}