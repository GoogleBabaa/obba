export const homePageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.obbacalculators.com/#organization',
      name: 'OBBA Calculators',
      url: 'https://www.obbacalculators.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/logo.png',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.obbacalculators.com/#website',
      url: 'https://www.obbacalculators.com/',
      name: 'OBBA Calculators',
      publisher: {
        '@id': 'https://www.obbacalculators.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.obbacalculators.com/?s={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/#webpage',
      url: 'https://www.obbacalculators.com/',
      name: 'Best Paycheck & Tax Calculators 2026 | OBBA',
      description: 'See your real take-home pay in seconds with OBBA Calculators - paycheck, salary, overtime, state taxes, and money-saving tools in one modern view.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      about: {
        '@id': 'https://www.obbacalculators.com/#organization',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.png',
        width: 1731,
        height: 909,
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'ItemList',
      '@id': 'https://www.obbacalculators.com/#calculator-list',
      name: 'OBBA Paycheck & Tax Calculators',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          url: 'https://www.obbacalculators.com/salary-calculator',
          item: {
            '@type': 'SoftwareApplication',
            name: 'Salary Calculator',
            url: 'https://www.obbacalculators.com/salary-calculator',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          url: 'https://www.obbacalculators.com/paycheck-calculator',
          item: {
            '@type': 'SoftwareApplication',
            name: 'Paycheck Calculator',
            url: 'https://www.obbacalculators.com/paycheck-calculator',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          url: 'https://www.obbacalculators.com/overtime',
          item: {
            '@type': 'SoftwareApplication',
            name: 'Overtime Calculator',
            url: 'https://www.obbacalculators.com/overtime',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          url: 'https://www.obbacalculators.com/texas-paycheck-calculator',
          item: {
            '@type': 'SoftwareApplication',
            name: 'Texas Paycheck Calculator',
            url: 'https://www.obbacalculators.com/texas-paycheck-calculator',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
        },
      ],
    },
  ],
};
