import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import html2pdf from 'html2pdf.js';

interface DateIdeaDisplayProps {
  dateIdea: string | null;
  isLoading: boolean;
}

export function DateIdeaDisplay({ dateIdea, isLoading }: DateIdeaDisplayProps) {
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

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Your Perfect Date Idea</h2>
          {dateIdea && (
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="w-full sm:w-auto bg-custom-orange text-white hover:bg-custom-orange/90"
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
  );
}