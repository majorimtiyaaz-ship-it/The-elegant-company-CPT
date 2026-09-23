import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/images/hero-kitchen.webp', // TODO: replace with a purpose-made 1200x630 social share image
  canonical,
  type = 'website',
}) => {
  // TODO: update to the real purchased domain once available (currently the live Vercel URL)
  const productionDomain = 'https://the-elegant-company-cpt.vercel.app';
  
  // Resolve canonical URL: prioritize explicitly passed canonical prop, then build from current route or fallback
  const resolvedCanonical = canonical 
    ? (canonical.startsWith('http') ? canonical : `${productionDomain}${canonical}`)
    : productionDomain;

  const resolvedImage = image.startsWith('http') ? image : `${productionDomain}${image}`;

  return (
    <Helmet htmlAttributes={{ lang: 'en' }}>
      {/* 1. Page Title */}
      <title>{title}</title>

      {/* 2. Standard Metadata */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="The Elegant Company" />
      <meta name="theme-color" content="#111111" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* 3. Search Engine Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* 4. Canonical URL Link */}
      <link rel="canonical" href={resolvedCanonical} />

      {/* 5. Open Graph Meta Tags (Facebook, LinkedIn, Slack, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:site_name" content="The Elegant Company" />

      {/* 6. Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
    </Helmet>
  );
};
