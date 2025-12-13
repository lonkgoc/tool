import Layout from '../components/Layout';

export default function Disclaimer() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto card space-y-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Disclaimer</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            General Information
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Tool260 provides free online tools for informational and convenience purposes only. While we strive to
            ensure accuracy, we make no warranties or representations about the accuracy, completeness, or suitability
            of the tools for any particular purpose.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            No Liability
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Tool260 shall not be liable for any damages arising from the use or inability to use our tools. All
            tools are provided "as is" without warranty of any kind.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Affiliate Links
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Some tools may contain affiliate links. We may earn a commission if you make a purchase through these links.
            This does not affect the price you pay or our editorial independence.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Professional Advice
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Our tools are not a substitute for professional advice. Always consult with qualified professionals for
            financial, health, legal, or other important decisions.
          </p>
        </div>
      </div>
    </Layout>
  );
}

