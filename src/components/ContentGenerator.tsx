
import React from 'react';

interface ContentGeneratorProps {
    toolName: string;
    category: string;
    description: string;
}

export default function ContentGenerator({ toolName, category, description }: ContentGeneratorProps) {
    // Generate content based on category
    const getFeatures = () => {
        switch (category) {
            case "File Converters & Editors":
                return [
                    "Zero server-side processing - your files stay safe on your device",
                    "Fast and efficient client-side conversion",
                    "No file size limits or upload restrictions",
                    "Work offline after the page loads",
                    "Free to use forever with no registration"
                ];
            case "Finance & Calculators":
            case "Health & Fitness":
                return [
                    "Instant and accurate calculations",
                    "Privacy-focused: no data is sent to servers",
                    "Clean interface for easy data entry",
                    "Mobile-friendly design for on-the-go usage",
                    "Ad-free calculation results"
                ];
            case "Image & Design Tools":
                return [
                    "High-quality image processing",
                    "Maintain transparency (PNG/WebP support)",
                    "Real-time preview of changes",
                    "Batch processing capabilities",
                    "No watermark on your output"
                ];
            default:
                return [
                    "Simple and intuitive user interface",
                    "Fast performance with no lag",
                    "Works on all modern devices (Mobile, Tablet, Desktop)",
                    "No sign-up or credit card required",
                    "100% free and open for everyone"
                ];
        }
    };

    const getSteps = () => {
        if (category.includes("Converter") || category.includes("Editor")) {
            return [
                "Select or drag & drop your files into the designated area.",
                "Adjust any available settings or options to your preference.",
                `Click the 'Convert' or 'Process' button to start the ${toolName.toLowerCase()} task.`,
                "Wait a moment for the process to complete locally in your browser.",
                "Download your processed files instantly."
            ];
        } else if (category.includes("Calculator") || category.includes("Generator")) {
            return [
                "Enter your values into the input fields.",
                "Review the settings to ensure accuracy.",
                "The tool will automatically calculate or generate results as you type.",
                "View the detailed breakdown or visual output.",
                "Copy or save the results for your records."
            ];
        } else {
            return [
                `Locate the ${toolName} interface on the page.`,
                "Interact with the tool using the provided controls.",
                "View the real-time results immediately.",
                "Use the copy or download buttons if applicable.",
                "Bookmark this page to use it again later."
            ];
        }
    };

    return (
        <article className="mt-12 space-y-12 animate-fade-in text-left">
            {/* About Section */}
            <section className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    About {toolName}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    The <strong>{toolName}</strong> is a powerful, free online utility designed to help you with
                    {description.toLowerCase()}. Whether you are a professional or a casual user, this tool provides
                    a seamless experience directly in your browser. {category.includes("Converter") ? "Unlike other tools that upload your files to a server, this tool processes everything locally on your device for maximum privacy and speed." : "It runs entirely on client-side technology, ensuring your data remains private and secure."}
                </p>
            </section>

            {/* How to Use */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                    How to Use {toolName}
                </h2>
                <div className="space-y-4">
                    {getSteps().map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {index + 1}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 pt-1">
                                {step}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFeatures().map((feature, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <p className="text-slate-700 dark:text-slate-300 font-medium">{feature}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            Is {toolName} free to use?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Yes, {toolName} is 100% free to use. There are no hidden charges, subscriptions, or limits on usage. You can use it as many times as you like.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            Is my data safe when using {toolName}?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Absolutely. We prioritize your privacy. All processing for {toolName} happens locally within your browser.
                            {category.includes("Converter") || category.includes("Editor") ? " Your files are never uploaded to our servers." : " No data is transmitted to any external server."}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            Can I use {toolName} on mobile?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Yes, our website is fully responsive. You can access and use {toolName} seamlessly on smartphones, tablets, and desktop computers.
                        </p>
                    </div>
                </div>
            </section>
        </article>
    );
}
