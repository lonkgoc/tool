import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getToolBySlug } from '../data/tools';
import ToolWrapper from '../components/ToolWrapper';
import { getToolComponent } from '../tools/index';

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <Layout>
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
      <ToolWrapper title={tool.name} description={tool.description}>
        <ToolComponent />
      </ToolWrapper>
    </Layout>
  );
}

