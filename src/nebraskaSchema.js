export const nebraskaPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/nebraska-paycheck-calculator#breadcrumb',
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
          name: 'Nebraska Paycheck Calculator',
          item: 'https://www.obbacalculators.com/nebraska-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/nebraska-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/nebraska-paycheck-calculator',
      name: 'Nebraska Paycheck Calculator - Estimate Your Take-Home Pay',
      description: 'Use this Nebraska Paycheck Calculator to estimate your take-home pay after federal tax, Nebraska progressive state income tax, and FICA deductions.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/nebraska-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/nebraska-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/nebraska-paycheck-calculator#software',
      name: 'Nebraska Paycheck Calculator',
      url: 'https://www.obbacalculators.com/nebraska-paycheck-calculator',
      description: 'Use this Nebraska Paycheck Calculator to estimate your take-home pay after federal tax, Nebraska progressive state income tax, and FICA deductions.',
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
      '@id': 'https://www.obbacalculators.com/nebraska-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: "Is Nebraska's income tax flat or graduated?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Graduated. Nebraska applies increasing marginal rates as taxable income rises into higher brackets, and the top rate has been decreasing in stages under ongoing tax reform.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Nebraska have local or city income taxes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Nebraska does not permit cities or counties to levy a separate personal income tax; the state-level graduated rate is the only income tax that applies.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Social Security income taxed in Nebraska?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nebraska has moved to fully exempt Social Security benefits from state income tax, though federal taxation of those benefits may still apply depending on total income.',
          },
        },
        {
          '@type': 'Question',
          name: 'Will pre-tax 401(k) contributions lower my Nebraska state tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Traditional pre-tax retirement contributions reduce your taxable wages before both federal and Nebraska state tax are calculated.',
          },
        },
      ],
    },
  ],
};
