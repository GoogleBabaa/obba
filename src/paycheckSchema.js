export const paycheckCalculatorSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.obbacalculators.com/paycheck-calculator#breadcrumb',
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
          name: 'Paycheck Calculator',
          item: 'https://www.obbacalculators.com/paycheck-calculator',
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.obbacalculators.com/paycheck-calculator#webpage',
      url: 'https://www.obbacalculators.com/paycheck-calculator',
      name: 'Salary Paycheck Calculator - Estimate Your Take-Home Pay',
      description: 'A Salary Paycheck Calculator estimates take-home pay after federal taxes, state taxes, FICA, and deductions. Enter salary, pay frequency, and filing status for a clear net pay estimate.',
      isPartOf: {
        '@id': 'https://www.obbacalculators.com/#website',
      },
      breadcrumb: {
        '@id': 'https://www.obbacalculators.com/paycheck-calculator#breadcrumb',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://www.obbacalculators.com/share-card.jpg',
        width: 1200,
        height: 630,
      },
      mainEntity: {
        '@id': 'https://www.obbacalculators.com/paycheck-calculator#software',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.obbacalculators.com/paycheck-calculator#software',
      name: 'Salary Paycheck Calculator',
      url: 'https://www.obbacalculators.com/paycheck-calculator',
      description: 'A Salary Paycheck Calculator estimates take-home pay after federal taxes, state taxes, FICA, and deductions. Enter salary, pay frequency, and filing status for a clear net pay estimate.',
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
      '@id': 'https://www.obbacalculators.com/paycheck-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do you calculate a paycheck?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start with gross pay (salary / pay periods, or hourly wage x hours worked), subtract pre-tax deductions to get taxable income, then subtract federal tax, state tax, FICA, and post-tax deductions. What remains is your net pay.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much tax is taken out of my paycheck?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It depends on your gross income, filing status, state, and deductions, but a typical paycheck sees federal tax, state tax (if applicable), and FICA (7.65% combined for Social Security and Medicare) withheld.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is gross pay?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gross pay is your total earnings before any taxes or deductions are subtracted - your full salary or hourly wages plus overtime, bonus, or commission.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is net pay?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Net pay is your take-home pay - what's left after all federal, state, and FICA taxes and any deductions have been subtracted from your gross pay.",
          },
        },
        {
          '@type': 'Question',
          name: 'What is take home pay?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Take-home pay is another term for net pay: the actual amount deposited into your bank account after every tax and deduction is applied.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is paycheck tax calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Federal and state tax are calculated using tax brackets applied to your taxable income (gross pay minus pre-tax deductions), based on your filing status and W-4 withholding elections.',
          },
        },
        {
          '@type': 'Question',
          name: 'How are payroll taxes calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Payroll taxes include FICA (Social Security and Medicare), calculated as a fixed percentage of gross wages, along with federal and state income tax withheld based on IRS and state withholding tables.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is FICA tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'FICA stands for the Federal Insurance Contributions Act and refers to the combined Social Security tax and Medicare tax withheld from every paycheck.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Medicare tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Medicare tax is a payroll tax that funds the Medicare program, withheld at a fixed rate from all earned wages with no annual wage cap.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Social Security tax?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Social Security tax funds retirement, disability, and survivor benefits and is withheld at a fixed rate up to an annual wage base limit set each year.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is federal withholding?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Federal withholding is the portion of your paycheck sent to the IRS based on your W-4 elections, filing status, and taxable income, applied toward your annual federal income tax liability.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is state withholding?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "State withholding is income tax withheld from your paycheck by your state, calculated using that state's tax brackets or flat rate, if your state charges income tax at all.",
          },
        },
        {
          '@type': 'Question',
          name: 'How does overtime affect my paycheck?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Overtime hours are typically paid at 1.5 times your regular hourly wage, increasing your gross pay for that period and, in turn, the taxes withheld - though your withholding rate itself doesn't change.",
          },
        },
        {
          '@type': 'Question',
          name: 'What are pre-tax deductions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pre-tax deductions, like 401(k) contributions and health insurance premiums, are subtracted from gross pay before taxes are calculated, lowering your taxable income.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are post-tax deductions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Post-tax deductions, like Roth contributions or wage garnishments, are subtracted after taxes are calculated, so they reduce your take-home pay but not your taxable income.',
          },
        },
      ],
    },
  ],
};
