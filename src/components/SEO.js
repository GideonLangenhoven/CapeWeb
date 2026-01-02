import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = "" }) {
  const domain = "https://capeweb.co.za";
  const fullTitle = `${title} | Web Design Cape Town`;

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={`${domain}${path}`} />

      {/* Social Media (WhatsApp/Facebook) */}
      <meta property="og:type" content="business.business" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${domain}${path}`} />
      <meta property="og:image" content={`${domain}/social-share.jpg`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Location Tags for Local SEO */}
      <meta name="geo.region" content="ZA-WC" />
      <meta name="geo.placename" content="Cape Town" />
      <meta name="geo.position" content="-33.9249;18.4241" />
      <meta name="ICBM" content="-33.9249, 18.4241" />
    </Helmet>
  );
}
