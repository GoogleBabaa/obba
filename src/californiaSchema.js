export const californiaPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/california-paycheck-calculator#breadcrumb',
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
          name: 'California Paycheck Calculator',
          item: 'https://www.obbacalculators.com/california-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/california-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/california-paycheck-calculator',
      name: 'California Paycheck Calculator | Estimate Take-Home Pay',
      description: 'Use this California Paycheck Calculator to estimate your take-home pay after federal tax, California income tax, SDI, FICA, and payroll deductions.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/california-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/california-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/california-paycheck-calculator#software',
      name: 'California Paycheck Calculator',
      url: 'https://www.obbacalculators.com/california-paycheck-calculator',
      description: 'Use this California Paycheck Calculator to estimate your take-home pay after federal tax, California income tax, SDI, FICA, and payroll deductions.',
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
      '@id': 'https://www.obbacalculators.com/california-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: "Why is my California paycheck smaller than a coworker's in another state, even at the same salary?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "California combines a high progressive income tax (up to 13.3% at the top) with an uncapped SDI tax that most other states don't have, so more is withheld before you ever see the money.",
          },
        },
        {
          '@type': 'Question',
          name: 'What is CASDI on my pay stub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "CASDI stands for California State Disability Insurance. It's a mandatory 1.3% payroll deduction (2026 rate) that funds short-term disability and Paid Family Leave benefits - separate from your state income tax.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does California tax Social Security benefits?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. California does not tax Social Security retirement benefits, even though the federal government may tax a portion depending on your total income.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is overtime calculated differently in California than under federal law?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Federal law only requires overtime after 40 hours in a week. California also requires overtime after 8 hours in a single day and double time after 12 hours in a day, which can result in more overtime pay than the federal minimum alone.',
          },
        },
        {
          '@type': 'Question',
          name: "What's the California standard deduction for 2026?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "California's standard deduction is significantly lower than the federal standard deduction - a few thousand dollars for single filers versus $15,000+ federally - which is one reason California taxable income is often higher than federal taxable income for the same person.",
          },
        },
      ],
    },
  ],
};
