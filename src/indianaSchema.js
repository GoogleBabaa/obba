export const indianaPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/indiana-paycheck-calculator#breadcrumb',
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
          name: 'Indiana Paycheck Calculator',
          item: 'https://www.obbacalculators.com/indiana-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/indiana-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/indiana-paycheck-calculator',
      name: 'Indiana Paycheck Calculator - Estimate Your Take-Home Pay',
      description: 'Use this Indiana Paycheck Calculator to estimate your take-home pay after federal tax, Indiana flat 3.05% state income tax, and FICA deductions.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/indiana-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.png',
        width: 1731,
        height: 909,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/indiana-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/indiana-paycheck-calculator#software',
      name: 'Indiana Paycheck Calculator',
      url: 'https://www.obbacalculators.com/indiana-paycheck-calculator',
      description: 'Use this Indiana Paycheck Calculator to estimate your take-home pay after federal tax, Indiana flat 3.05% state income tax, and FICA deductions.',
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
      '@id': 'https://www.obbacalculators.com/indiana-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does Indiana have a progressive income tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Indiana uses a flat state income tax rate applied uniformly to taxable income, unlike states that scale the rate up as earnings increase.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are county taxes the same everywhere in Indiana?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Each Indiana county sets its own local income tax rate, so your county of residence directly affects your paycheck.',
          },
        },
        {
          '@type': 'Question',
          name: 'Will pre-tax deductions lower my Indiana state tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Contributions like traditional 401(k) deferrals reduce your taxable wages before both federal and Indiana state tax are calculated.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often should I update my W-4?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Anytime your household income, marital status, or number of dependents changes, it's worth reviewing your withholding to avoid under- or over-paying throughout the year.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does overtime get taxed differently in Indiana?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Overtime pay is generally taxed the same way as regular wages, though it can push your total paycheck for that period into a higher withholding amount simply because the total gross pay is larger.',
          },
        },
      ],
    },
  ],
};
