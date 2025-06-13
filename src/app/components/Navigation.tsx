import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="bg-background border-b border-border mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              Buildy UI
            </Link>
            <div className="flex space-x-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 