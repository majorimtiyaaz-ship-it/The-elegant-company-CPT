import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  type?: string;
  showSchema?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  canonical,
  type = 'website',
  showSchema = false,
}) => {
  const productionDomain = 'https://theelegantcompany.co.za';
  
  // Resolve canonical URL: prioritize explicitly passed canonical prop, then build from current route or fallback
  const resolvedCanonical = canonical 
    ? (canonical.startsWith('http') ? canonical : `${productionDomain}${canonical}`)
    : productionDomain;

  const resolvedImage = image.startsWith('http') ? image : `${productionDomain}${image}`;

  // Local Business JSON-LD Structured Data Markup
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    'name': 'The Elegant Company',
    'description': 'Handcrafted bespoke kitchens, luxury cabinetry, custom solid wood furniture, and home improvement solutions.',
    'url': productionDomain,
    'logo': `${productionDomain}/logo.png`, // Placeholder for company logo
    'telephone': '+27-XX-XXX-XXXX', // Placeholder for telephone
    'email': 'info@theelegantcompany.co.za', // Placeholder for email
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Placeholder Street Address', // Placeholder for address street
      'addressLocality': 'Cape Town',
      'addressRegion': 'Western Cape',
      'postalCode': '8000',
      'addressCountry': 'ZA'
    },
    'areaServed': {
      '@type': 'AdministrativeArea',
      'name': 'Cape Town'
    },
    'sameAs': [
      'https://www.facebook.com/theelegantcompany', // Placeholder for Facebook
      'https://www.instagram.com/theelegantcompany' // Placeholder for Instagram
    ],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Bespoke Craftsmanship Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Custom Furniture'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Kitchen Installations'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Built-in Cupboards'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Bedroom Cabinets'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'TV Units'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Wardrobes'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Furniture Restoration'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Home Improvements'
          }
        }
      ]
    }
  };

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

      {/* 7. Local Business Structured Data (JSON-LD) */}
      {showSchema && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
    </Helmet>
  );
};
