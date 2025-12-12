import Layout from '../components/Layout';

export default function Privacy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto card space-y-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-600 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Tool260 is a 100% frontend application. We do not collect, store, or transmit any personal information.
            All processing happens locally in your browser.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Third-Party Services
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            We use Google AdSense to display advertisements. Google may use cookies and similar technologies to provide
            personalized ads. You can opt out of personalized advertising by visiting Google's Ad Settings.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Local Storage
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            We use browser localStorage to save your dark/light mode preference. This data never leaves your device.
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            If you have questions about this Privacy Policy, please contact us at: <a href="mailto:lonkgoc@gmail.com" className="text-blue-600 hover:text-blue-500">lonkgoc@gmail.com</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

