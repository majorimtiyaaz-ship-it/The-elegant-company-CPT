// Build-time entry (server side only). Used by scripts/prerender.mjs to save finished HTML.
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { ServicePage } from './components/ServicePage';
import { GROUPS } from './components/FAQ';
import { SERVICE_PAGES, SITE_URL } from './lib/servicePages';

export { SERVICE_PAGES, SITE_URL };

export function renderService(slug: string): string {
  const page = SERVICE_PAGES.find((p) => p.slug === slug)!;
  return renderToString(<ServicePage page={page} />);
}

// Plain, link-rich text version of the home page content, placed in <noscript> so it never
// changes what visitors see but is available to crawlers that do not run JavaScript.
export function renderHomeSnapshot(): string {
  return renderToStaticMarkup(
    <section>
      <h2>Our services</h2>
      <ul>
        {SERVICE_PAGES.map((p) => (
          <li key={p.slug}>
            <a href={`/${p.slug}/`}>{p.h1}</a>: {p.seoDescription}
          </li>
        ))}
      </ul>
      <h2>Frequently asked questions</h2>
      {GROUPS.map((g) => (
        <div key={g.title}>
          <h3>{g.title}</h3>
          <dl>
            {g.items.map((i) => (
              <React.Fragment key={i.q}>
                <dt>{i.q}</dt>
                <dd>{i.a}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      ))}
    </section>,
  );
}
