import { Link } from "react-router";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-destructive" />
        </div>

        <h1
          className="text-6xl font-bold text-foreground tracking-wider mb-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          404
        </h1>
        <h2
          className="text-xl font-bold uppercase text-muted-foreground tracking-wider mb-4"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
        >
          Page Not Found
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
          Check the URL or head back to the homepage.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
