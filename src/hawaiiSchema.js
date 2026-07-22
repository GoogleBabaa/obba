export const hawaiiPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/hawaii-paycheck-calculator#breadcrumb',
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
          name: 'Hawaii Paycheck Calculator',
          item: 'https://www.obbacalculators.com/hawaii-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/hawaii-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/hawaii-paycheck-calculator',
      name: 'Hawaii Paycheck Calculator - Estimate Your Take-Home Pay',
      description: 'Use this Hawaii Paycheck Calculator to estimate your take-home pay after federal tax, Hawaii progressive state income tax, and FICA deductions.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/hawaii-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/hawaii-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/hawaii-paycheck-calculator#software',
      name: 'Hawaii Paycheck Calculator',
      url: 'https://www.obbacalculators.com/hawaii-paycheck-calculator',
      description: 'Use this Hawaii Paycheck Calculator to estimate your take-home pay after federal tax, Hawaii progressive state income tax, and FICA deductions.',
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
      '@id': 'https://www.obbacalculators.com/hawaii-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Why does Hawaii have so many tax brackets?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Hawaii's twelve-bracket system was designed to apply gradually increasing rates in smaller increments rather than fewer, larger jumps, though the top rate of 11% remains among the highest in the country.",
          },
        },
        {
          '@type': 'Question',
          name: 'What is TDI and why is it being deducted from my paycheck?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Temporary Disability Insurance is a Hawaii-specific program that partially replaces wages if you're unable to work due to a non-work-related illness or injury. Employees may be charged up to 0.5% of weekly wages, capped at a set weekly maximum.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does Hawaii have local city income taxes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Hawaii does not impose separate city or county income taxes on top of the state system.',
          },
        },
        {
          '@type': 'Question',
          name: 'Will contributing to a 401(k) lower my Hawaii state tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Traditional pre-tax retirement contributions reduce your taxable income before both federal and Hawaii state tax are calculated.',
          },
        },
      ],
    },
  ],
};
