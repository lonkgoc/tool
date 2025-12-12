import { Link } from 'react-router-dom';
import AdUnit from './AdUnit';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/20 dark:border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <AdUnit format="banner" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Tool260 - Product of LONK. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/disclaimer"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

