import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-jakarta font-semibold text-lg">DateGen</h3>
            <p className="text-sm text-muted-foreground">
              Creating magical date experiences for couples everywhere.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-jakarta font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-custom-orange transition-colors">
                Home
              </Link>
              <Link to="/upgrade" className="text-sm text-muted-foreground hover:text-custom-orange transition-colors">
                Upgrade
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-jakarta font-semibold text-lg">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Questions? Reach out to us at support@dategen.com
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} DateGen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};