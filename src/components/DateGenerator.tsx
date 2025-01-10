import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { RelationshipStatus } from "./date-generator/RelationshipStatus";
import { BudgetSlider } from "./date-generator/BudgetSlider";
import { TimeSelector } from "./date-generator/TimeSelector";
import { VibeSelector } from "./date-generator/VibeSelector";
import { LoveLanguageSelector } from "./date-generator/LoveLanguageSelector";
import html2pdf from 'html2pdf.js';
import { Download } from "lucide-react";

const formSchema = z.object({
  relationshipStatus: z.enum(["dating", "engaged", "married"]),
  budget: z.number().min(0).max(250),
  timeAvailable: z.enum(["1-2 hours", "half-day", "full-day", "weekend"]),
  vibes: z.array(z.string()).min(1, "Please select at least one vibe"),
  yourLoveLanguage: z.string(),
  partnerLoveLanguage: z.string(),
});

export function DateGenerator() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [dateIdea, setDateIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load font
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 50,
      vibes: [],
    },
  });

  const handleDownloadPDF = () => {
    const content = document.getElementById('date-idea-content');
    if (!content) return;

    // Create a wrapper div for the PDF content
    const pdfContent = document.createElement('div');
    
    // Add the header image
    const headerImg = document.createElement('img');
    headerImg.src = '/lovable-uploads/e3bf33d1-9a32-48aa-b380-008f0f5b9562.png';
    headerImg.style.width = '100%';
    headerImg.style.maxWidth = '700px';
    headerImg.style.height = 'auto';
    headerImg.style.marginBottom = '20px';
    pdfContent.appendChild(headerImg);

    // Add the date idea content
    pdfContent.appendChild(content.cloneNode(true));

    // Add the footer text
    const footer = document.createElement('div');
    footer.style.marginTop = '20px';
    footer.style.textAlign = 'center';
    footer.style.color = 'rgba(0, 0, 0, 0.5)';
    footer.style.fontSize = '12px';
    footer.textContent = 'loveyourfirstyear.com';
    pdfContent.appendChild(footer);

    const opt = {
      margin: 1,
      filename: 'your-perfect-date.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(pdfContent).save();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDateIdea(null);
    
    try {
      console.log('Submitting form values:', values);
      const { data, error } = await supabase.functions.invoke('generate-date', {
        body: { formData: values },
      });

      console.log('Response from generate-date:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data?.dateIdea) {
        throw new Error('No date idea was generated');
      }

      setDateIdea(data.dateIdea);
      toast({
        title: "Success!",
        description: "Your perfect date idea has been generated.",
      });
    } catch (error) {
      console.error('Error generating date idea:', error);
      toast({
        title: "Error",
        description: "Failed to generate date idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 font-jakarta text-black">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Date Night Generator</h1>
        <p className="text-muted-foreground">
          Answer a few questions to get your perfect date idea
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <RelationshipStatus form={form} />
          <BudgetSlider 
            form={form} 
            sliderValue={sliderValue} 
            setSliderValue={setSliderValue} 
          />
          <TimeSelector form={form} />
          <VibeSelector form={form} />
          <LoveLanguageSelector 
            form={form} 
            label="What's your love language?" 
            name="yourLoveLanguage" 
          />
          <LoveLanguageSelector 
            form={form} 
            label="What's your partner's love language?" 
            name="partnerLoveLanguage" 
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Date Idea"}
          </Button>
        </form>
      </Form>

      {(dateIdea || isLoading) && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Perfect Date Idea</h2>
              {dateIdea && (
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="bg-custom-orange text-white hover:bg-custom-orange/90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download your date
                </Button>
              )}
            </div>
            {isLoading ? (
              <p className="text-muted-foreground">Generating your perfect date idea...</p>
            ) : (
              <div 
                id="date-idea-content"
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: dateIdea || '' }}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}