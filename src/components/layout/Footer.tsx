import { Copyright } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#4c7766] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-center">
          <div className="flex items-center gap-1">
            <Copyright className="h-4 w-4" />
            <span>{currentYear} Love Your First Year.</span>
          </div>
          <span className="hidden sm:inline">|</span>
          <a 
            href="https://www.loveyourfirstyear.com/dategen-terms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-custom-tan transition-colors"
          >
            Terms of Use
          </a>
          <span className="hidden sm:inline">|</span>
          <div className="flex flex-col sm:flex-row items-center gap-1">
            <span>Questions? Contact us at</span>
            <a 
              href="mailto:hello@loveyourfirstyear.com"
              className="hover:text-custom-tan transition-colors"
            >
              hello@loveyourfirstyear.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};