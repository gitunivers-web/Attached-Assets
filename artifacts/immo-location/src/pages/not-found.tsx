import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-primary/50 mx-auto mb-6" />
          <h1 className="text-6xl font-serif font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-4">Page Introuvable</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            La page que vous recherchez semble avoir été déplacée ou n'existe plus.
          </p>
          <Link href="/" className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
