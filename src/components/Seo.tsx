import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    name?: string;
    type?: string;
}

const Seo: React.FC<SeoProps> = ({
    title,
    description,
    keywords,
    canonicalUrl,
    name = 'Tool260',
    type = 'website'
}) => {
    const siteTitle = 'Tool260 - 260 Free Online Tools';
    const defaultDescription = '260 Free Online Tools — No Sign-Up, No Limits, Forever Free. Productivity, Finance, Health, File Converters, and more.';
    const defaultKeywords = 'tool260, online tools, file converter, image converter, pdf tools, developer tools, free tools, no signup';
    const siteUrl = 'https://tool260.com';

    const fullTitle = title ? `${title} | Tool260` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || defaultKeywords;
    const finalUrl = canonicalUrl || siteUrl;

    return (
        <Helmet>
            {/* Basic metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={name} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={finalUrl} />
            {/* <meta property="og:image" content={`${siteUrl}/og-image.jpg`} /> */}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            {/* <meta name="twitter:image" content={`${siteUrl}/og-image.jpg`} /> */}

            {/* Structured Data for WebApplication, BreadcrumbList, and Organization */}
            <script type="application/ld+json">
                {JSON.stringify([
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
                        "name": "Tool260",
                        "url": siteUrl,
                        "logo": `${siteUrl}/logo.png`, // Assuming logo exists or will exist
                        "sameAs": [] // specific social links if any
                    },
                    // Dynamic Breadcrumbs
                    // If we had passed breadcrumbs prop, we would map it here.
                    // For now, let's implement a basic structure that points Home > Page
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
                            // If it's a tool page, checking title to infer breadcrumb
                            ...(title ? [{
                                "@type": "ListItem",
                                "position": 2,
                                "name": title,
                                "item": finalUrl
                            }] : [])
                        ]
                    }
                ])}
            </script>
        </Helmet>
    );
};

export default Seo;
