import { Copyright } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#4c7766] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Copyright className="h-4 w-4" />
          <span>{currentYear} Love Your First Year.</span>
          <span className="mx-1">Terms of Use.</span>
          <span>|</span>
          <span>Questions? Contact us at</span>
          <a 
            href="mailto:hello@loveyourfirstyear.com"
            className="hover:text-custom-tan transition-colors"
          >
            hello@loveyourfirstyear.com
          </a>
        </div>
      </div>
    </footer>
  );
};