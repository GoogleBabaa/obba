export const texasPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/texas-paycheck-calculator#breadcrumb',
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
          name: 'Texas Paycheck Calculator',
          item: 'https://www.obbacalculators.com/texas-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/texas-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/texas-paycheck-calculator',
      name: 'Texas Paycheck Calculator - Texas Pay Calculator & Take Home Pay',
      description: 'Estimate Texas take-home pay with federal withholding and FICA deductions, compare gross vs net income, and plan monthly payroll budget accurately.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/texas-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/texas-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/texas-paycheck-calculator#software',
      name: 'Texas Paycheck Calculator',
      url: 'https://www.obbacalculators.com/texas-paycheck-calculator',
      description: 'Estimate Texas take-home pay with federal withholding and FICA deductions, compare gross vs net income, and plan monthly payroll budget accurately.',
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
      '@id': 'https://www.obbacalculators.com/texas-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a Texas paycheck calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "A Texas paycheck calculator estimates your take-home pay by applying federal income tax and FICA taxes to your gross earnings. Since Texas has no state income tax, it's a simpler calculation than in most other states.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does Texas have state income tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "No. Texas does not tax wages at the state level. Employees still pay federal income tax and FICA taxes, but there's no additional state withholding line on a Texas paycheck.",
          },
        },
        {
          '@type': 'Question',
          name: 'How do I calculate my Texas paycheck after taxes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Subtract pre-tax deductions from gross pay, apply federal withholding based on your W-4, then subtract Social Security and Medicare. The result is your estimated net pay.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is my take-home pay lower than I expected?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pre-tax deductions, updated tax withholding, benefit enrollment, or additional W-4 withholding can all reduce your paycheck below your gross pay estimate.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is overtime taxed at a higher rate in Texas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Overtime pay is taxed the same way as regular wages; it simply increases your total taxable income for that pay period, which can shift you into higher withholding for that check only.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is a bonus taxed differently from regular pay?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Bonuses are often withheld at a flat supplemental federal rate rather than your regular paycheck's withholding formula, though your total tax liability is settled when you file your return.",
          },
        },
        {
          '@type': 'Question',
          name: "What's the difference between biweekly and semi-monthly pay?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Biweekly pay happens every two weeks (26 times a year), while semi-monthly pay happens twice a month on fixed dates (24 times a year).',
          },
        },
        {
          '@type': 'Question',
          name: 'Do pre-tax deductions actually save me money?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Pre-tax deductions like a 401(k) or health insurance reduce your taxable income, lowering the amount of federal tax withheld from your paycheck.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens if I claim the wrong filing status on my W-4?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It can result in too much or too little tax withheld throughout the year, which may lead to a larger refund or a balance due when you file your federal return.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are freelancers able to use this calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Freelancers don't have employer withholding, but this calculator can estimate what an equivalent W-2 paycheck would look like for comparison purposes.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does Social Security tax apply to all of my income?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Social Security tax applies only up to an annual wage base limit set by the Social Security Administration, after which no more Social Security tax is withheld for the rest of the year.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can my employer withhold extra federal tax if I request it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can request additional withholding on your W-4 form if you want a larger refund or need to cover other tax obligations.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is this calculator accurate for every situation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It provides a close estimate for most standard situations, but complex tax scenarios, multiple jobs, or unusual deductions may require a review from a qualified tax professional.',
          },
        },
      ],
    },
  ],
};
