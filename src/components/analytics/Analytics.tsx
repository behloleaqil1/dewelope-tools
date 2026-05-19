import Script from 'next/script';

/**
 * Analytics — loads Google Analytics 4 if NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * To enable, add to .env.local:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *
 * Site-verification for Google Search Console / Bing Webmaster Tools is wired
 * up via the `verification` field in `src/app/layout.tsx` metadata — paste your
 * codes there to claim ownership and start receiving search-performance data.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
