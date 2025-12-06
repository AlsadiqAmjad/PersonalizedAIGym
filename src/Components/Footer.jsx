import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-40">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-bold text-xl">The Rec</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Transform your body and mind with our expert coaching and personalized fitness programs.
            </p>
          </div>


          {/* Contact */}
          <div className="md:col-start-4 justify-self-end text-left">
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>+966 (123) 456-789</li>
              <li>Dhahran, KFUPM 31261</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>© 2025 The Rec. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
