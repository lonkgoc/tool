import { Link } from 'react-router-dom';
import AdUnit from './AdUnit';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/20 dark:border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b border-white/10 dark:border-slate-700/50 pb-12">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Popular</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/pdf-to-word" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">PDF to Word</Link></li>
              <li><Link to="/tools/image-compressor" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Image Compressor</Link></li>
              <li><Link to="/tools/remove-background" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Remove Background</Link></li>
              <li><Link to="/tools/youtube-thumbnail-downloader" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Thumbnail Downloader</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/search?category=File%20Converters%20%26%20Editors" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">PDF Tools</Link></li>
              <li><Link to="/search?category=Image%20%26%20Design%20Tools" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Image Tools</Link></li>
              <li><Link to="/search?category=Text%20%26%20Code%20Tools" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Developer Tools</Link></li>
              <li><Link to="/search?category=Health%20%26%20Fitness" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Health Calculators</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Home</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Disclaimer</Link></li>
              <li><a href="mailto:contact@tool260.com" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Legal</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Tool260 provides free online tools for everyone. No registration required. Secure and privacy-focused.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <AdUnit format="banner" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-slate-600 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Tool260 - Product of LONK. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

