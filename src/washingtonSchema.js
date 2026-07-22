export const washingtonPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/washington-paycheck-calculator#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.obbacalculators.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Washington Paycheck Calculator',
          item: 'https://www.obbacalculators.com/washington-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/washington-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/washington-paycheck-calculator',
      name: 'Washington Paycheck Calculator - Complete Guide to Wages, Taxes, and Deductions',
      description: 'Use this Washington Paycheck Calculator guide to understand wages, taxes, deductions, net pay, and take-home pay.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/washington-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/washington-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/washington-paycheck-calculator#software',
      name: 'Washington Paycheck Calculator',
      url: 'https://www.obbacalculators.com/washington-paycheck-calculator',
      description: 'Use this Washington Paycheck Calculator guide to understand wages, taxes, deductions, net pay, and take-home pay.',
      applicationCategory: 'FinanceApplication',
      applicationSubCategory: 'Paycheck Calculator',
      operatingSystem: 'Any (Web-based)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@id': 'https://www.obbacalculators.com/#organization',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.obbacalculators.com/washington-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does Washington really have no state income tax at all?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Correct. Washington is one of nine states with no personal income tax on wages, though it does apply payroll premiums for PFML and WA Cares that other no-income-tax states don't have.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is the WA Cares Fund premium mandatory for everyone?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For most employees, yes, though certain groups such as some visa holders, military spouses, and people with an approved prior exemption may not be required to pay it.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the PFML premium stop once I hit a certain income?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The PFML premium is capped at the annual Social Security wage base, so once your year-to-date wages cross that threshold, the deduction stops for the rest of the year.',
          },
        },
        {
          '@type': 'Question',
          name: "Why does my Washington paycheck still have several deductions if there's no income tax?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Federal income tax, Social Security, Medicare, PFML, and WA Cares are all separate from state income tax and apply regardless of which state you work in or whether that state taxes income.',
          },
        },
      ],
    },
  ],
};
