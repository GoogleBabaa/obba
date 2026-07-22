export const floridaPaycheckSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/florida-paycheck-calculator#breadcrumb',
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
          name: 'Florida Paycheck Calculator',
          item: 'https://www.obbacalculators.com/florida-paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/florida-paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/florida-paycheck-calculator',
      name: 'Florida Paycheck Calculator - See Your Earnings Instantly',
      description: 'Estimate Florida paycheck net income instantly using federal tax withholding and FICA deductions, and plan monthly spending with accurate payroll projections.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/florida-paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/florida-paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/florida-paycheck-calculator#software',
      name: 'Florida Paycheck Calculator',
      url: 'https://www.obbacalculators.com/florida-paycheck-calculator',
      description: 'Estimate Florida paycheck net income instantly using federal tax withholding and FICA deductions, and plan monthly spending with accurate payroll projections.',
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
      '@id': 'https://www.obbacalculators.com/florida-paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a Florida Paycheck Calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Florida paycheck calculator estimates your take-home pay after federal income tax, Social Security, Medicare, and any deductions you select. Because Florida has no state income tax, the calculator focuses entirely on federal withholding, making the estimate simpler and more accurate than generic multi-state tools.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Florida have state income tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Florida is one of nine U.S. states with no personal state income tax, a rule set by the state constitution. Florida workers still pay federal income tax, Social Security, and Medicare - those are federal obligations that apply regardless of which state you work in.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I calculate my paycheck after taxes in Florida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Start with your gross pay, subtract federal income tax based on your W-4 and filing status, subtract 6.2% Social Security and 1.45% Medicare, then subtract any pre-tax or post-tax deductions you've elected. What remains is your net, or take-home, pay.",
          },
        },
        {
          '@type': 'Question',
          name: "Why is my Florida paycheck bigger than a friend's paycheck in another state?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "If you and your friend earn the same gross salary but they live in a state with income tax, their employer withholds an additional state tax that yours doesn't. That's the entire difference - Florida's federal withholding rules are identical to every other state.",
          },
        },
        {
          '@type': 'Question',
          name: 'Do Florida employers withhold any state or local taxes at all?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Florida has no state income tax and no local income taxes on wages, so the only taxes withheld from a Florida paycheck are federal: income tax, Social Security, and Medicare.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does overtime pay work in Florida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Florida follows the federal Fair Labor Standards Act, which requires non-exempt employees to be paid 1.5 times their regular hourly rate for any hours worked beyond 40 in a single workweek. Florida does not have its own separate overtime law or daily overtime rule.',
          },
        },
        {
          '@type': 'Question',
          name: "What's the difference between a W-4 and how it affects my Florida paycheck?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Your W-4 tells your employer your filing status, dependents, and any additional withholding, which directly determines how much federal income tax comes out of each check. Since Florida has no state withholding form, your W-4 is the only form that affects your paycheck's tax withholding.",
          },
        },
        {
          '@type': 'Question',
          name: 'How often can I expect to be paid in Florida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Florida law doesn't mandate a specific pay frequency, so it's set by your employer - typically weekly, biweekly, semi-monthly, or monthly. Federal rules only require that wages be paid on a regular, predictable schedule.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does the Florida minimum wage affect how I use this calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Florida's minimum wage is currently $14.00 per hour and is scheduled to rise to $15.00 per hour on September 30, 2026, under a voter-approved constitutional amendment. If you're an hourly worker, make sure the rate you enter reflects your actual pay, since it should be at or above the current state minimum.",
          },
        },
        {
          '@type': 'Question',
          name: 'Are bonuses and commissions taxed differently in Florida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes, at the federal level. The IRS treats bonuses and commissions as \"supplemental wages,\" which are often withheld at a flat federal rate rather than your regular bracket rate. Florida still doesn't add any state tax to supplemental wages, since it has no state income tax at all.",
          },
        },
      ],
    },
  ],
};
