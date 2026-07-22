export const overtimeCalculatorSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/overtime#breadcrumb',
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
          name: 'Overtime Calculator',
          item: 'https://www.obbacalculators.com/overtime',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/overtime#webpage',
      url: 'https://www.obbacalculators.com/overtime',
      name: 'Use the No Tax on Overtime Calculator to Maximize Earnings',
      description: 'Use our No Tax on Overtime Calculator to estimate federal overtime deductions, understand FLSA overtime rules, plan take-home pay, and optimize tax strategy under 2025-2028 OBBBA limits.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/overtime#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/overtime#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/overtime#software',
      name: 'No Tax on Overtime Calculator',
      url: 'https://www.obbacalculators.com/overtime',
      description: 'Use our No Tax on Overtime Calculator to estimate federal overtime deductions, understand FLSA overtime rules, plan take-home pay, and optimize tax strategy under 2025-2028 OBBBA limits.',
      applicationCategory: 'FinanceApplication',
      applicationSubCategory: 'Overtime Calculator',
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
      '@id': 'https://www.obbacalculators.com/overtime#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is overtime pay calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Overtime pay equals your overtime hours multiplied by 1.5 times your regular hourly rate, for every hour worked beyond 40 in a workweek, under the FLSA.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is the "no tax on overtime" deduction calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "It's calculated on the overtime premium only - the extra half of time-and-a-half, not your entire overtime paycheck - up to $12,500 (single) or $25,000 (married filing jointly), phasing out above $150,000/$300,000 in modified adjusted gross income.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does the overtime deduction apply to 2025 taxes or 2026 taxes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Both, and 2027 and 2028 as well. It applies to qualified overtime compensation earned from January 1, 2025, through December 31, 2028, unless Congress extends it.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do salaried employees qualify for the overtime deduction?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Only if they're classified as non-exempt under the FLSA and actually receive FLSA-required overtime pay. Most exempt salaried employees (many managers, professionals, and administrative roles) do not qualify.",
          },
        },
        {
          '@type': 'Question',
          name: 'Will this deduction increase my paycheck right now?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Not automatically. It reduces the tax you owe when you file your return. To see the benefit in your paycheck sooner, you'd need to submit an updated W-4 to your employer to adjust withholding.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is overtime pay still subject to Social Security and Medicare tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The deduction only applies to federal income tax - FICA taxes are withheld on your full overtime pay regardless of this deduction.',
          },
        },
      ],
    },
  ],
};
