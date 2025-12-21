import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import Layout from '../components/Layout';
import { getToolBySlug } from '../data/tools';
import ToolWrapper from '../components/ToolWrapper';
import { getToolComponent } from '../tools/index';

import Seo from '../components/Seo';
import RelatedTools from '../components/RelatedTools';
import ContentGenerator from '../components/ContentGenerator';

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <Layout>
        <Seo title="Tool Not Found" />
        <div className="card text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Tool Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400">
            The tool you're looking for doesn't exist.
          </p>
        </div>
      </Layout>
    );
  }

  const ToolComponent = getToolComponent(tool.slug);

  return (
    <Layout
      showBreadcrumb
      toolName={tool.name}
      category={tool.category}
      affiliateLinks={tool.affiliateLinks}
    >
      <Seo
        title={tool.name}
        description={tool.description}
        keywords={`${tool.name}, ${tool.category}, free online tool, ${tool.name} online, free ${tool.name}`}
        canonicalUrl={`https://tool260.com/tools/${tool.slug}`}
      />
      <ToolWrapper title={tool.name} description={tool.description}>
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-slate-500">Loading tool...</p>
          </div>
        }>
          <ToolComponent />
        </Suspense>

        <ContentGenerator
          toolName={tool.name}
          category={tool.category}
          description={tool.description}
          longDescription={tool.longDescription}
          howToSteps={tool.howToSteps}
          features={tool.features}
          faqs={tool.faqs}
        />
        <RelatedTools currentToolSlug={tool.slug} category={tool.category} />
      </ToolWrapper>
    </Layout>
  );
}
