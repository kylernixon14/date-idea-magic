import html2pdf from 'html2pdf.js';

interface PdfGeneratorOptions {
  dateIdea: string;
}

export function generateDatePdf({ dateIdea }: PdfGeneratorOptions) {
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
}