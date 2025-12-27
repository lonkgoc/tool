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
        "tool 260",
        "tool260",
        "i love pdf",
        "small pdf",
        "ilovepdf",
        "smallpdf",
        "file converters",
        "pdf tools",
        "free online tools",
        "online converters",
        "file converter",
        "online tools",
        "free converters",
        "best online tools",
        "web utilities"
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
