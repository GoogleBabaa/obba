export const californiaDocMeta = {
  "title": "California Paycheck Calculator | 2026 Take-Home Pay",
  "description": "Free California paycheck calculator for 2026. Estimate your take-home pay after federal tax, CA state tax, SDI, and daily overtime rules."
};

export const californiaDocSections = [
  {
    "id": "california-doc-california-paycheck-calculator-see-your-real-take-home-pay-for-2026",
    "title": "California Paycheck Calculator: See Your Real Take-Home Pay for 2026",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "California has the most complicated paycheck math of any state in the country — nine progressive income tax brackets, an uncapped disability insurance tax, and overtime rules that kick in daily, not just weekly. Our California Paycheck Calculator runs all of it at once, so the number you see is your actual net pay, not a rough estimate based on a flat percentage. This guide explains exactly what's being calculated and why California paychecks look different from paychecks in almost every other state."
        ]
      }
    ]
  },
  {
    "id": "california-doc-how-to-use-the-california-paycheck-calculator",
    "title": "How to Use the California Paycheck Calculator",
    "level": 2,
    "blocks": [
      {
        "type": "numbered",
        "items": [
          [
            "Enter your gross pay and pay frequency. Weekly, biweekly, semi-monthly, or monthly — the calculator annualizes it correctly either way, which matters in California because SDI and bracket calculations are annual by design. If you're starting with an annual income instead of a paycheck amount, you'll first need to ",
            {
              "text": "calculate salary",
              "href": "/salary-calculator"
            },
            " before estimating your take-home pay. "
          ],
          [
            "Select your filing status. Single, married filing jointly, married filing separately, or head of household. California brackets are not simply \"double\" between single and joint filers the way federal brackets are, so this step changes your result meaningfully."
          ],
          [
            "Add pre-tax deductions. 401(k) contributions, health insurance premiums, and HSA/FSA contributions all reduce the wages that both federal and California tax brackets apply to — enter them for an accurate number, not an inflated one."
          ],
          [
            "Enter your DE-4 allowances (or use the default). This is California's version of the W-4 and directly affects how much state tax your employer withholds each pay period."
          ],
          [
            "Review your full breakdown. You'll see federal income tax, California state income tax, State Disability Insurance (SDI), Social Security, and Medicare listed separately — not lumped into one \"taxes\" line, so you know exactly where each dollar goes."
          ]
        ]
      }
    ]
  },
  {
    "id": "california-doc-why-california-paychecks-are-different-from-every-other-state",
    "title": "Why California Paychecks Are Different From Every Other State",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "Most paycheck calculators are built for states with a single flat tax or simple bracket structure. California needs its own dedicated tool for three reasons. If you're comparing paycheck taxes and withholding across different locations, ",
          {
            "text": "All States Calculators",
            "href": "/states"
          },
          " can help explain how payroll rules vary from state to state. "
        ]
      },
      {
        "type": "list",
        "items": [
          [
            "Nine income tax brackets, not four or five. California's rates run from 1% up to 12.3%, with an additional 1% Mental Health Services Tax on income above $1 million — for a top combined rate of 13.3%, the highest of any U.S. state."
          ],
          [
            "SDI has no wage cap. In 2024, California removed the taxable wage limit on State Disability Insurance, meaning every dollar of wages — not just the first $150,000 or so — is subject to the SDI rate. High earners in particular are often surprised by this line item."
          ],
          [
            "Daily overtime, not just weekly. Unlike the federal 40-hour rule, California requires overtime pay after 8 hours in a single workday, plus double time after 12 hours in a day or after 8 hours on a seventh consecutive workday. A generic calculator built around federal rules alone will understate what a California employee is legally owed."
          ]
        ]
      }
    ]
  },
  {
    "id": "california-doc-how-your-california-paycheck-is-calculated",
    "title": "How Your California Paycheck Is Calculated",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "Here's the order of operations your employer's payroll system actually follows:"
        ]
      },
      {
        "type": "table",
        "rows": [
          [
            [
              "Step"
            ],
            [
              "What happens"
            ],
            [
              "Notes"
            ]
          ],
          [
            [
              "1. Gross pay"
            ],
            [
              "Hours × rate, or salary ÷ pay periods"
            ],
            [
              "Includes overtime, bonuses, commissions"
            ]
          ],
          [
            [
              "2. Pre-tax deductions"
            ],
            [
              "Subtract 401(k), HSA, qualifying health premiums"
            ],
            [
              "Reduces taxable wages for both federal and CA tax"
            ]
          ],
          [
            [
              "3. Federal income tax"
            ],
            [
              "Applied using IRS withholding tables and your W-4"
            ],
            [
              "Based on 2026 federal brackets"
            ]
          ],
          [
            [
              "4. Social Security"
            ],
            [
              "6.2% up to the annual wage base"
            ],
            [
              "Employer matches this amount"
            ]
          ],
          [
            [
              "5. Medicare"
            ],
            [
              "1.45% on all wages (plus 0.9% above $200,000 single/$250,000 joint)"
            ],
            [
              "No wage cap"
            ]
          ],
          [
            [
              "6. California SDI"
            ],
            [
              "1.3% of all wages, no cap"
            ],
            [
              "Funds disability insurance and Paid Family Leave"
            ]
          ],
          [
            [
              "7. California state income tax"
            ],
            [
              "Applied using the 9-bracket schedule and your DE-4"
            ],
            [
              "See table below"
            ]
          ],
          [
            [
              "Net pay"
            ],
            [
              "Gross pay minus all of the above"
            ],
            [
              "What actually hits your bank account"
            ]
          ]
        ]
      }
    ]
  },
  {
    "id": "california-doc-california-state-income-tax-brackets-2026-single-filers",
    "title": "California State Income Tax Brackets (2026, Single Filers)",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "California's brackets are progressive — you only pay the higher rate on the portion of income within that bracket, not your entire income."
        ]
      },
      {
        "type": "table",
        "rows": [
          [
            [
              "Taxable income"
            ],
            [
              "Rate"
            ]
          ],
          [
            [
              "$0 – $10,412"
            ],
            [
              "1%"
            ]
          ],
          [
            [
              "$10,413 – $24,684"
            ],
            [
              "2%"
            ]
          ],
          [
            [
              "$24,685 – $38,959"
            ],
            [
              "4%"
            ]
          ],
          [
            [
              "$38,960 – $54,081"
            ],
            [
              "6%"
            ]
          ],
          [
            [
              "$54,082 – $68,350"
            ],
            [
              "8%"
            ]
          ],
          [
            [
              "$68,351 – $349,137"
            ],
            [
              "9.3%"
            ]
          ],
          [
            [
              "$349,138 – $418,961"
            ],
            [
              "10.3%"
            ]
          ],
          [
            [
              "$418,962 – $698,271"
            ],
            [
              "11.3%"
            ]
          ],
          [
            [
              "$698,272+"
            ],
            [
              "12.3%"
            ]
          ],
          [
            [
              "Over $1,000,000"
            ],
            [
              "+1% Mental Health Services Tax"
            ]
          ]
        ]
      },
      {
        "type": "p",
        "content": [
          "Married filing jointly brackets use roughly double these thresholds at each level. These figures come from the California Franchise Tax Board and are indexed annually for inflation."
        ]
      }
    ]
  },
  {
    "id": "california-doc-understanding-sdi-on-your-pay-stub",
    "title": "Understanding SDI on Your Pay Stub",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "State Disability Insurance is separate from your California income tax and shows up as its own line — often labeled \"",
          {
            "text": "CASDI",
            "href": "https://orangehrm.com/resources/hr-dictionary/casdi"
          },
          "\" or \"SDI\" on your stub. For 2026, the rate is 1.3% of all wages with no cap, according to the ",
          {
            "text": "California Employment Development Department",
            "href": "https://edd.ca.gov/"
          },
          " (EDD). SDI funds two programs: short-term Disability Insurance if you can't work due to illness, injury, or pregnancy, and Paid Family Leave if you need time off to care for a family member or bond with a new child. It is not refunded or credited against your state income tax — it's a separate mandatory contribution."
        ]
      }
    ]
  },
  {
    "id": "california-doc-daily-overtime-california-s-biggest-paycheck-difference",
    "title": "Daily Overtime: California's Biggest Paycheck Difference",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "If you're comparing your California paycheck to a job offer in another state, this is the rule that trips people up most. Under California labor law:"
        ]
      },
      {
        "type": "table",
        "rows": [
          [
            [
              "Hours worked"
            ],
            [
              "Pay rate"
            ]
          ],
          [
            [
              "Up to 8 hours/day, up to 40 hours/week"
            ],
            [
              "Regular rate"
            ]
          ],
          [
            [
              "Over 8 hours in a single day"
            ],
            [
              "1.5× regular rate"
            ]
          ],
          [
            [
              "Over 40 hours in a week"
            ],
            [
              "1.5× regular rate"
            ]
          ],
          [
            [
              "Over 12 hours in a single day"
            ],
            [
              "2× regular rate (double time)"
            ]
          ],
          [
            [
              "First 8 hours on the 7th consecutive workday"
            ],
            [
              "1.5× regular rate"
            ]
          ],
          [
            [
              "Over 8 hours on the 7th consecutive workday"
            ],
            [
              "2× regular rate"
            ]
          ]
        ]
      },
      {
        "type": "p",
        "content": [
          "This means two employees working the same 40 hours in a week can be owed different pay depending on how those hours were distributed across days, making ",
          {
            "text": "overtime calculations ",
            "href": "/overtime"
          },
          "especially important in California. "
        ]
      }
    ]
  },
  {
    "id": "california-doc-frequently-asked-questions",
    "title": "Frequently Asked Questions",
    "level": 2,
    "blocks": [
      {
        "type": "faq",
        "question": [
          "Why is my California paycheck smaller than a coworker's in another state, even at the same salary?"
        ],
        "answer": [
          "California combines a high progressive income tax (up to 13.3% at the top) with an uncapped SDI tax that most other states don't have, so more is withheld before you ever see the money."
        ]
      },
      {
        "type": "faq",
        "question": [
          "What is CASDI on my pay stub?"
        ],
        "answer": [
          "CASDI stands for California State Disability Insurance. It's a mandatory 1.3% payroll deduction (2026 rate) that funds short-term disability and Paid Family Leave benefits — separate from your state income tax."
        ]
      },
      {
        "type": "faq",
        "question": [
          "Does California tax Social Security benefits?"
        ],
        "answer": [
          "No. California does not tax Social Security retirement benefits, even though the federal government may tax a portion depending on your total income."
        ]
      },
      {
        "type": "faq",
        "question": [
          "Is overtime calculated differently in California than under federal law?"
        ],
        "answer": [
          "Yes. Federal law only requires overtime after 40 hours in a week. California also requires overtime after 8 hours in a single day and double time after 12 hours in a day, which can result in more overtime pay than the federal minimum alone."
        ]
      },
      {
        "type": "faq",
        "question": [
          "What's the California standard deduction for 2026?"
        ],
        "answer": [
          "California's standard deduction is significantly lower than the federal standard deduction — a few thousand dollars for single filers versus $15,000+ federally — which is one reason California taxable income is often higher than federal taxable income for the same person."
        ]
      }
    ]
  }
];
