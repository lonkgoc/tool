import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    name?: string;
    type?: string;
    // New props for structured data
    howToSteps?: string[];
    faqs?: { question: string; answer: string }[];
}

const Seo: React.FC<SeoProps> = ({
    title,
    description,
    keywords,
    canonicalUrl,
    name = 'Tool 260',
    type = 'website',
    howToSteps,
    faqs
}) => {
    const siteTitle = 'Tool 260 - 260 Free Online Tools';
    const defaultDescription = 'Tool 260 - 260 Free Online Tools — No Sign-Up, No Limits, Forever Free. Productivity, Finance, Health, File Converters, and more.';
    const defaultKeywords = [
        // Brand keywords (MUST DOMINATE)
        "tool 260", "tool260", "tool260.com", "tool 260 com", "260 tools",
        "tool 260 online", "tool260 free", "tool 260 tools", "tool260 converter",

        // PDF tools (High traffic)
        "pdf tools", "pdf editor online", "pdf converter free", "compress pdf online",
        "merge pdf free", "split pdf online", "best pdf tools", "pdf editor without watermark",
        "pdf to word", "word to pdf", "pdf to jpg", "jpg to pdf", "combine pdf",

        // Image tools
        "compress image", "image compressor", "resize image online", "remove background",
        "background remover", "image converter", "png to jpg", "jpg to png",

        // File converters
        "file converter", "online converter", "free file converter", "document converter",
        "video converter", "audio converter", "mp4 to mp3", "convert files online",

        // Finance & Calculators
        "EMI calculator", "SIP calculator", "loan calculator", "mortgage calculator",
        "compound interest calculator", "gst calculator", "tax calculator",

        // Developer tools
        "json formatter", "json validator", "code beautifier", "base64 encoder",

        // SEO tools
        "SEO tools free", "meta tag generator", "sitemap generator", "seo checker",

        // Utilities
        "word counter", "character counter", "password generator", "qr code generator",

        // Fun tools
        "yes or no wheel", "spin the wheel", "random name picker", "coin flip",

        // Competitor keywords (grabs traffic - meta only)
        "ilovepdf", "smallpdf", "tinypng", "convertio", "zamzar", "cloudconvert",
        "pdf24", "sejda", "remove.bg", "canva", "freeconvert"
    ].join(', '); const siteUrl = 'https://tool260.com';

    const fullTitle = title ? `${title} | Tool 260` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || defaultKeywords;
    const finalUrl = canonicalUrl || siteUrl;

    // Build schema array
    const schemas: any[] = [
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": fullTitle,
            "url": finalUrl,
            "description": finalDescription,
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Tool 260",
            "url": siteUrl,
            "logo": `${siteUrl}/logo.png`
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": siteUrl
                },
                ...(title ? [{
                    "@type": "ListItem",
                    "position": 2,
                    "name": title,
                    "item": finalUrl
                }] : [])
            ]
        }
    ];

    // Add HowTo schema if steps exist
    if (howToSteps && howToSteps.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to use ${title || name}`,
            "description": finalDescription,
            "step": howToSteps.map((step, index) => ({
                "@type": "HowToStep",
                "position": index + 1,
                "text": step,
                "name": `Step ${index + 1}`
            }))
        });
    }

    // Add FAQ schema if faqs exist
    if (faqs && faqs.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        });
    }

    return (
        <Helmet>
            {/* Basic metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={name} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={finalUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />

            <script type="application/ld+json">
                {JSON.stringify(schemas)}
            </script>
        </Helmet>
    );
};

export default Seo;
