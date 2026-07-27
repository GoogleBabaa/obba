# OBBA Page Publishing Rule

Every public page, calculator page, state page, category page, and blog page must be readable in the initial HTML source.

Do not ship React-only article content. Googlebot and `Ctrl+U` must see the full page body, including headings, paragraphs, FAQs, tables, and important internal links before client-side JavaScript runs.

When adding or changing a page:

1. Add the route in `src/App.jsx`.
2. Add SEO metadata for the exact public path in `src/seoConfig.js`.
3. Keep blog routes generated from `src/blogData.js` so each blog slug is included in SEO/prerender output.
4. Run `npm run build`; the build must prerender full HTML for the page.
5. Test the clean URL with `npm run preview:prerendered`, then open `view-source:http://127.0.0.1:4180/page-path`.
6. Confirm the source HTML is not only `<div id="root"></div>` and includes the real article text, FAQs, tables, canonical tag, robots tag, and JSON-LD.

Internal links should stay dofollow. External links should open in a new tab and use `rel="nofollow noopener noreferrer"`.

Do not touch calculator formulas, tax values, or calculation logic when only page content, layout, SEO, or prerender behavior is requested.
