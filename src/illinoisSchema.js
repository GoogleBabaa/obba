export const illinoisPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/illinois-paycheck-calculator#breadcrumb',
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
          name: 'Illinois Paycheck Calculator',
          item: 'https://www.obbacalculators.com/illinois-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/illinois-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/illinois-paycheck-calculator',
      name: 'Illinois Paycheck Calculator - Estimate Your Take-Home Pay',
      description: 'Use this Illinois Paycheck Calculator to estimate your take-home pay after federal tax, Illinois flat 4.95% state income tax, and FICA deductions.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/illinois-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/illinois-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/illinois-paycheck-calculator#software',
      name: 'Illinois Paycheck Calculator',
      url: 'https://www.obbacalculators.com/illinois-paycheck-calculator',
      description: 'Use this Illinois Paycheck Calculator to estimate your take-home pay after federal tax, Illinois flat 4.95% state income tax, and FICA deductions.',
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
      '@id': 'https://www.obbacalculators.com/illinois-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the Illinois income tax rate for 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Illinois has a flat state income tax rate of 4.95% that applies to all taxable income, regardless of how much you earn.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Illinois have a standard deduction?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Illinois does not use a standard deduction. Instead, it reduces taxable income through personal exemptions - $2,925 per taxpayer and dependent for the 2026 tax year, plus an extra $1,000 for filers who are 65+ or blind.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is retirement income taxed in Illinois?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Illinois exempts Social Security, pensions, and qualified retirement account distributions from state income tax, making it one of the more retirement-friendly states for income tax purposes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are there local or city income taxes in Illinois?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Illinois does not permit local governments to impose their own income tax, so your paycheck deduction is limited to the flat 4.95% state rate plus federal taxes.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Illinois compare to a neighboring state like Indiana or Wisconsin?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Illinois's 4.95% rate is higher than Indiana's roughly 3.05% flat rate but can be lower than Wisconsin's top progressive rate of 7.65%, depending on income level - the comparison depends heavily on how much you earn.",
          },
        },
      ],
    },
  ],
};
