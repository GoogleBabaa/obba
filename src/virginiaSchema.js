export const virginiaPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/virginia-paycheck-calculator#breadcrumb',
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
          name: 'Virginia Paycheck Calculator',
          item: 'https://www.obbacalculators.com/virginia-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/virginia-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/virginia-paycheck-calculator',
      name: 'Virginia Paycheck Calculator - Estimate Your Take-Home Pay',
      description: 'Use this Virginia Paycheck Calculator to estimate your take-home pay after federal tax, Virginia progressive state income tax, and FICA deductions.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/virginia-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.png',
        width: 1731,
        height: 909,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/virginia-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/virginia-paycheck-calculator#software',
      name: 'Virginia Paycheck Calculator',
      url: 'https://www.obbacalculators.com/virginia-paycheck-calculator',
      description: 'Use this Virginia Paycheck Calculator to estimate your take-home pay after federal tax, Virginia progressive state income tax, and FICA deductions.',
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
      '@id': 'https://www.obbacalculators.com/virginia-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: "Is Virginia's income tax flat or progressive?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Progressive. Virginia applies increasing tax rates as your taxable income rises into higher brackets, rather than a single flat percentage.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Virginia have local income taxes like some other states?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Virginia does not impose separate municipal or county income taxes, though local cost of living still varies significantly across the state.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does contributing to a 401(k) lower my Virginia state tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Pre-tax retirement contributions reduce your taxable wages before both federal and Virginia state income tax are applied.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why did my Social Security withholding stop partway through the year?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Social Security tax only applies up to an annual wage base limit, so once your year-to-date earnings cross that threshold, this deduction stops for the rest of the year.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does overtime pay affect which Virginia tax bracket I fall into?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It can. Since overtime increases your gross pay for that period, it may push some of that additional income into a higher marginal bracket, though only the portion above the threshold is taxed at the higher rate.',
          },
        },
      ],
    },
  ],
};
