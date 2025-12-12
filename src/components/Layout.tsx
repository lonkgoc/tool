import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import AdUnit from './AdUnit';
import AffiliateCorner from './AffiliateCorner';
import { useSidebar } from '../contexts/SidebarContext';

interface LayoutProps {
  children: ReactNode;
  showBreadcrumb?: boolean;
  toolName?: string;
  category?: string;
  affiliateLinks?: { name: string; url: string; description: string }[];
}

export default function Layout({ children, showBreadcrumb = false, toolName, category, affiliateLinks }: LayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Use CSS grid so columns resize smoothly when sidebar toggles.
          The grid becomes: [sidebar | content | ad] on xl screens so the ad
          column stays pinned to the far right while the center content
          can be centered within its column. */}
      <div
        className={`grid grid-cols-1 flex-1 pt-16 transition-all duration-300 ${isOpen
            ? 'lg:grid-cols-[16rem_1fr] xl:grid-cols-[16rem_1fr_20rem]'
            : 'lg:grid-cols-[0_1fr] xl:grid-cols-[0_1fr_20rem]'
          }`}
      >
        <Sidebar />

        {/* Center content column - keep inner max width so content stays centered */}
        <main className={`p-4 lg:p-8 w-full transition-all duration-300`}>
          <div className="max-w-7xl mx-auto w-full">
            {showBreadcrumb && <Breadcrumb toolName={toolName} category={category} />}
            <div className="flex gap-6">
              <div className="flex-1">{children}</div>
            </div>
          </div>
        </main>

        {/* Right ad column - exists on xl and stays at far right */}
        <aside className="hidden xl:block w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <AdUnit format="rectangle" />
            <AdUnit format="rectangle" />
          </div>
        </aside>
      </div>
      <Footer />
      <AffiliateCorner affiliateLinks={affiliateLinks} />
    </div>
  );
}

