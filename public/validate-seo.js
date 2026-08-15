/**
 * The Elegant Company - SEO Real-Time Validation Script
 * --------------------------------------------------
 * This script runs in the browser console. It audits all active SEO meta tags,
 * checks for duplicates, validates character count constraints, and listens to
 * react-helmet-async transitions dynamically during scroll/navigation.
 * 
 * HOW TO USE:
 * 1. Open your browser Developer Tools (F12 or Cmd+Option+I).
 * 2. Paste the contents of this script into the Console and press Enter.
 *    Alternatively, access it directly via: /validate-seo.js
 */

(() => {
  const brandStyle = 'color: #d4af37; font-weight: bold; font-family: serif; font-size: 14px;';
  const successStyle = 'color: #10b981; font-weight: bold;';
  const warningStyle = 'color: #f59e0b; font-weight: bold;';
  const errorStyle = 'color: #ef4444; font-weight: bold; text-decoration: underline;';
  const infoStyle = 'color: #3b82f6; font-weight: bold;';
  const labelStyle = 'color: #6b7280; font-weight: normal;';

  console.log('%c[The Elegant Company] SEO Validator Engine Initialized.', brandStyle);
  console.log('%cScroll through the page or navigate sections to see real-time SEO updates and transition validation.', 'color: #9ca3af; italic; font-size: 11px;');

  function runAudit() {
    console.clear();
    console.log('%c╔════════════════════════════════════════════════════════════════════╗', brandStyle);
    console.log('%c║               SEO META-TAG AUDIT & TRANSITION COMPLIANCE           ║', brandStyle);
    console.log('%c╚════════════════════════════════════════════════════════════════════╝', brandStyle);

    let issuesCount = 0;
    let warningsCount = 0;

    // Helper functions
    const getAll = (selector) => Array.from(document.querySelectorAll(selector));

    // 1. Audit Page Title
    const titles = getAll('title');
    console.group('%c1. Document Title Verification', infoStyle);
    if (titles.length === 0) {
      console.log('%c[ERROR] No <title> tag found in the document.', errorStyle);
      issuesCount++;
    } else if (titles.length > 1) {
      console.log(`%c[ERROR] Multiple <title> tags detected (${titles.length}). This causes index fragmentation!`, errorStyle);
      titles.forEach((t, i) => console.log(`   └─ Tag ${i + 1}: "${t.innerText}"`));
      issuesCount++;
    } else {
      const activeTitle = titles[0].innerText;
      console.log(`%c[PASS] Single <title> element: %c"${activeTitle}"`, successStyle, 'color: #fff; font-weight: bold;');
      if (activeTitle.length > 60) {
        console.log(`%c[WARN] Title length (${activeTitle.length} chars) exceeds the recommended limit of 60 characters.`, warningStyle);
        warningsCount++;
      }
    }
    console.groupEnd();

    // 2. Audit Meta Description
    const descriptions = getAll('meta[name="description"]');
    console.group('%c2. Meta Description Verification', infoStyle);
    if (descriptions.length === 0) {
      console.log('%c[ERROR] No <meta name="description"> tag found.', errorStyle);
      issuesCount++;
    } else if (descriptions.length > 1) {
      console.log(`%c[ERROR] Duplicate <meta name="description"> tags detected (${descriptions.length})!`, errorStyle);
      descriptions.forEach((d, i) => console.log(`   └─ Description ${i + 1}: "${d.getAttribute('content')}"`));
      issuesCount++;
    } else {
      const activeDesc = descriptions[0].getAttribute('content') || '';
      console.log(`%c[PASS] Single <meta description> element: %c"${activeDesc}"`, successStyle, 'color: #fff;');
      if (activeDesc.length > 160) {
        console.log(`%c[WARN] Meta description is too long (${activeDesc.length} chars). Best kept under 160 characters for high search snippet rendering.`, warningStyle);
        warningsCount++;
      } else if (activeDesc.length < 50) {
        console.log(`%c[WARN] Meta description is very short (${activeDesc.length} chars). Consider adding more details up to 150-160 chars.`, warningStyle);
        warningsCount++;
      }
    }
    console.groupEnd();

    // 3. Audit Canonical URL
    const canonicals = getAll('link[rel="canonical"]');
    console.group('%c3. Canonical URL Link Verification', infoStyle);
    if (canonicals.length === 0) {
      console.log('%c[ERROR] No canonical URL (<link rel="canonical">) found.', errorStyle);
      issuesCount++;
    } else if (canonicals.length > 1) {
      console.log(`%c[ERROR] Duplicate canonical links detected (${canonicals.length})!`, errorStyle);
      canonicals.forEach((c, i) => console.log(`   └─ Link ${i + 1}: "${c.getAttribute('href')}"`));
      issuesCount++;
    } else {
      const activeCanonical = canonicals[0].getAttribute('href') || '';
      console.log(`%c[PASS] Single canonical URL: %c"${activeCanonical}"`, successStyle, 'color: #3b82f6; text-decoration: underline;');
    }
    console.groupEnd();

    // 4. Audit Open Graph / Twitter Cards
    const ogTitles = getAll('meta[property="og:title"]');
    const ogDescs = getAll('meta[property="og:description"]');
    const ogUrls = getAll('meta[property="og:url"]');
    const ogImages = getAll('meta[property="og:image"]');
    const twitterCards = getAll('meta[name="twitter:card"]');

    console.group('%c4. Social Graph Meta Verification', infoStyle);
    if (ogTitles.length > 1) {
      console.log('%c[ERROR] Duplicate og:title tags found.', errorStyle);
      issuesCount++;
    } else if (ogTitles.length === 1) {
      console.log(`%c[PASS] OpenGraph Title: %c"${ogTitles[0].getAttribute('content')}"`, successStyle, 'color: #aaa;');
    }

    if (ogDescs.length > 1) {
      console.log('%c[ERROR] Duplicate og:description tags found.', errorStyle);
      issuesCount++;
    } else if (ogDescs.length === 1) {
      console.log(`%c[PASS] OpenGraph Description: %c"${ogDescs[0].getAttribute('content')}"`, successStyle, 'color: #aaa;');
    }

    if (ogUrls.length > 1) {
      console.log('%c[ERROR] Duplicate og:url tags found.', errorStyle);
      issuesCount++;
    } else if (ogUrls.length === 1) {
      console.log(`%c[PASS] OpenGraph URL: %c"${ogUrls[0].getAttribute('content')}"`, successStyle, 'color: #aaa;');
    }

    if (ogImages.length > 1) {
      console.log('%c[ERROR] Duplicate og:image tags found.', errorStyle);
      issuesCount++;
    } else if (ogImages.length === 1) {
      console.log(`%c[PASS] OpenGraph Image: %c"${ogImages[0].getAttribute('content')}"`, successStyle, 'color: #aaa;');
    }

    if (twitterCards.length === 1) {
      console.log(`%c[PASS] Twitter Card: %c"${twitterCards[0].getAttribute('content')}"`, successStyle, 'color: #aaa;');
    }
    console.groupEnd();

    // 5. Schema Markup Integration (JSON-LD)
    const schemas = getAll('script[type="application/ld+json"]');
    console.group('%c5. Structured Data & JSON-LD Local Business Schema', infoStyle);
    if (schemas.length === 0) {
      console.log('%c[INFO] No JSON-LD Schema markup active on this section.', labelStyle);
    } else {
      console.log(`%c[PASS] Found ${schemas.length} active structured JSON-LD data block(s).`, successStyle);
      schemas.forEach((s, idx) => {
        try {
          const parsed = JSON.parse(s.innerText);
          console.group(`Structured Data Block ${idx + 1} - Type: ${parsed['@type'] || 'Unknown'}`);
          console.dir(parsed);
          console.groupEnd();
        } catch (e) {
          console.log(`%c[ERROR] Structured Data Block ${idx + 1} is not valid JSON!`, errorStyle);
          issuesCount++;
        }
      });
    }
    console.groupEnd();

    // Summary block
    console.log('%c────────────────────────────────────────────────────────────────────', 'color: #4b5563;');
    if (issuesCount === 0 && warningsCount === 0) {
      console.log('%c✔ ALL SEO TRANSITIONS ARE 100% CLEAN AND OPTIMIZED. NO DUPLICATE TAGS OR CONFLICTS.', 'color: #10b981; font-weight: bold; font-size: 12px;');
    } else {
      console.log(`%cAudit Complete: %c${issuesCount} Critical Error(s)%c, %c${warningsCount} Performance Warning(s).`, 
        brandStyle, errorStyle, 'color: #fff;', warningStyle);
    }
    console.log('%c────────────────────────────────────────────────────────────────────', 'color: #4b5563;');
  }

  // Initial Check
  runAudit();

  // Watch for dynamic head modifications (react-helmet-async transition hook)
  let debounceTimeout;
  const observer = new MutationObserver((mutations) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log('%c[SEO Change Detected] react-helmet-async triggered transition update. Re-auditing tags...', 'color: #d4af37; italic;');
      runAudit();
    }, 150); // Small debounce to capture all batch updates from react-helmet
  });

  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['content', 'href']
  });

  // Export reference globally so users can stop observing or re-run manually
  window.TheElegantCompanySEO = {
    audit: runAudit,
    stopObserving: () => {
      observer.disconnect();
      console.log('%c[SEO Validator] Mutation observer disconnected.', warningStyle);
    }
  };
})();
