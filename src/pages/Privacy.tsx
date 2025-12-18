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
            Cookies and Web Beacons
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Like any other website, Tool260 uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            Google DoubleClick DART Cookie
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:text-blue-500">https://policies.google.com/technologies/ads</a>
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-4">
            GDPR Data Protection Rights
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-600 dark:text-slate-400">
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
          </ul>

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

