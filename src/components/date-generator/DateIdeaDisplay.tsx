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
    pdfContent.style.padding = '20px';
    pdfContent.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
    
    // Add header image
    const headerImg = document.createElement('img');
    headerImg.src = '/lovable-uploads/8d683fb8-c6e4-4323-b55c-49cf29ec063e.png';
    headerImg.style.width = '100%';
    headerImg.style.maxWidth = '700px';
    headerImg.style.height = 'auto';
    headerImg.style.marginBottom = '30px';
    pdfContent.appendChild(headerImg);

    // Add date idea content with proper styling
    const dateContent = document.createElement('div');
    dateContent.style.fontSize = '14px';
    dateContent.style.lineHeight = '1.6';
    dateContent.style.whiteSpace = 'pre-line';
    dateContent.style.marginBottom = '30px';
    dateContent.innerHTML = content.innerHTML;
    pdfContent.appendChild(dateContent);

    // Add footer
    const footer = document.createElement('div');
    footer.style.marginTop = '30px';
    footer.style.textAlign = 'center';
    footer.style.color = 'rgba(0, 0, 0, 0.5)';
    footer.style.fontSize = '12px';
    footer.textContent = 'mydategen.com';
    pdfContent.appendChild(footer);

    const opt = {
      margin: [0.5, 0.75, 0.5, 0.75],
      filename: 'your-perfect-date.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        putOnlyUsedFonts: true
      },
    };

    html2pdf().set(opt).from(pdfContent).save();
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to bookmark dates.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('bookmarked_dates')
        .insert([{ 
          date_idea: dateIdea,
          user_id: session.user.id
        }]);

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
    <Card className="mt-6 md:mt-8">
      <CardContent className="pt-6">
        {dateIdea && (
          <div className="flex justify-end gap-3 mb-4">
            <Button
              onClick={handleBookmark}
              variant="ghost"
              disabled={isBookmarking}
              className="hover:bg-transparent h-12 w-12"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="ghost"
              className="hover:bg-transparent h-12 w-12"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        )}
        {isLoading ? (
          <p className="text-muted-foreground">Generating your perfect date idea...</p>
        ) : (
          <div 
            id="date-idea-content"
            className="prose max-w-none text-base md:text-lg whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: dateIdea || '' }}
          />
        )}
      </CardContent>
    </Card>
  );
}