import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Bookmark } from "lucide-react";
import html2pdf from 'html2pdf.js';
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DateIdeaDisplayProps {
  dateIdea: string | null;
  isLoading: boolean;
}

export function DateIdeaDisplay({ dateIdea, isLoading }: DateIdeaDisplayProps) {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    const content = document.getElementById('date-idea-content');
    if (!content) return;

    const pdfContent = document.createElement('div');
    
    const headerImg = document.createElement('img');
    headerImg.src = '/lovable-uploads/e3bf33d1-9a32-48aa-b380-008f0f5b9562.png';
    headerImg.style.width = '100%';
    headerImg.style.maxWidth = '700px';
    headerImg.style.height = 'auto';
    headerImg.style.marginBottom = '20px';
    pdfContent.appendChild(headerImg);

    pdfContent.appendChild(content.cloneNode(true));

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

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const { error } = await supabase
        .from('bookmarked_dates')
        .insert([{ date_idea: dateIdea }]);

      if (error) throw error;

      toast({
        title: "Date bookmarked!",
        description: "You can find it in your bookmarked dates.",
      });
    } catch (error) {
      console.error('Error bookmarking date:', error);
      toast({
        title: "Error bookmarking date",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        {dateIdea && (
          <div className="flex justify-end gap-2 mb-4">
            <Button
              onClick={handleBookmark}
              variant="ghost"
              disabled={isBookmarking}
              className="hover:bg-transparent"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="ghost"
              className="hover:bg-transparent"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
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
  );
}