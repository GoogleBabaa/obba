export const paycheckDocxSections = [
  {
    "id": "paycheck-paycheck-calculator",
    "title": "Paycheck Calculator",
    "level": 1,
    "blocks": [
      {
        "type": "p",
        "content": [
          "Turn your hours, overtime, and pay rate into a real paycheck number."
        ]
      },
      {
        "type": "p",
        "content": [
          "Your paycheck rarely matches a simple back-of-envelope calculation. Overtime is taxed differently than regular hours, a bonus doesn't get treated like the rest of your income, and even your pay stub can be hard to read at a glance. This calculator handles all of that — enter your hourly rate and hours (or your salary, if that's how you're paid), add any overtime or bonus, and"
        ]
      }
    ]
  },
  {
    "id": "paycheck-hourly-vs-salary-two-different-paycheck-calculations",
    "title": "Hourly vs. Salary: Two Different Paycheck Calculations",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "Not everyone's paycheck is built the same way, and this calculator handles both."
        ]
      },
      {
        "type": "p",
        "content": [
          "If you're paid hourly, your paycheck starts with your rate multiplied by the hours you actually worked in that pay period. That means your paycheck can change from one period to the next — more hours, more pay; fewer hours, less pay. Overtime, when it applies, gets added on top at a higher rate."
        ]
      },
      {
        "type": "p",
        "content": [
          "If you're salaried, your paycheck is your annual salary divided evenly across your pay periods, regardless of how many hours you actually put in that week. A salaried paycheck is more predictable, but it also means unpaid overtime isn't part of the equation the way it is for hourly workers."
        ]
      },
      {
        "type": "p",
        "content": [
          "The tax side of the calculation — federal tax, state tax, and FICA — works the same for both. What differs is how your gross pay for the period gets calculated in the first place."
        ]
      }
    ]
  },
  {
    "id": "paycheck-reading-your-pay-stub-what-each-line-actually-means",
    "title": "Reading Your Pay Stub: What Each Line Actually Means",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "A pay stub (also called a payslip) can look like a wall of numbers, but it follows a consistent pattern once you know what to look for:"
        ]
      },
      {
        "type": "table",
        "rows": [
          [
            [
              "Line item"
            ],
            [
              "What it means"
            ]
          ],
          [
            [
              "Gross pay"
            ],
            [
              "Your total earnings for the period, before anything is subtracted"
            ]
          ],
          [
            [
              "Federal tax withheld"
            ],
            [
              "Estimated federal income tax, based on your W-4"
            ]
          ],
          [
            [
              "State tax withheld"
            ],
            [
              "State income tax, if your state charges one"
            ]
          ],
          [
            [
              "FICA (Social Security + Medicare)"
            ],
            [
              "Your contribution toward these two federal programs"
            ]
          ],
          [
            [
              "Pre-tax deductions"
            ],
            [
              "401(k), health insurance, HSA — subtracted before tax is calculated"
            ]
          ],
          [
            [
              "Post-tax deductions"
            ],
            [
              "Roth contributions, garnishments — subtracted after tax"
            ]
          ],
          [
            [
              "Net pay"
            ],
            [
              "What's actually deposited into your account"
            ]
          ]
        ]
      },
      {
        "type": "p",
        "content": [
          "Our calculator produces this same breakdown for your entered numbers, so you can see exactly where each dollar of your gross pay goes before it becomes your take-home amount."
        ]
      }
    ]
  },
  {
    "id": "paycheck-how-overtime-pay-gets-calculated",
    "title": "How Overtime Pay Gets Calculated",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "If you're an hourly employee working more than 40 hours in a week, federal law generally requires overtime pay at 1.5× your normal rate — commonly known as time-and-a-half. Some states and situations call for double-time instead, usually for hours worked well beyond a standard shift or on specific days."
        ]
      },
      {
        "type": "p",
        "content": [
          "Overtime isn't taxed at a special rate the way a bonus is — it's simply added to your regular earnings for that pay period, which can occasionally push part of your income into a higher withholding bracket for that check specifically. That's often why an overtime-heavy paycheck feels like it's taxed unusually hard, even though your effective annual tax rate hasn't actually changed."
        ]
      }
    ]
  },
  {
    "id": "paycheck-how-bonus-pay-is-taxed-differently",
    "title": "How Bonus Pay Is Taxed Differently",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "If part of your paycheck includes a bonus, it's usually taxed using what the IRS calls the supplemental wage rate — a flat 22% federal withholding rate for most bonuses under $1 million, separate from your regular paycheck's bracket-based withholding. This is why a bonus can look like it's taxed unusually high on the check itself."
        ]
      },
      {
        "type": "p",
        "content": [
          "That flat rate is only how much gets withheld upfront — it isn't necessarily your final tax rate on that money. When you file your annual return, your bonus is combined with the rest of your income and taxed at your actual marginal rate, which can mean a refund if 22% ended up being more than what you actually owed on it."
        ]
      }
    ]
  },
  {
    "id": "paycheck-your-w-4-and-additional-withholding",
    "title": "Your W-4 and Additional Withholding",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "How much tax comes out of each paycheck is largely determined by the W-4 form you filled out with your employer. The current version asks for your filing status, whether you hold multiple jobs, a dollar amount for dependents, and any other income or adjustments — rather than the old system of numbered \"allowances.\""
        ]
      },
      {
        "type": "p",
        "content": [
          "If you consistently owe money at tax time, requesting additional withholding on your W-4 spreads that extra amount across your paychecks instead of hitting you with one large bill. On the other hand, if you're claiming exempt status — which only applies if you had no tax liability last year and expect none this year — no federal income tax is withheld at all, though FICA still applies."
        ]
      }
    ]
  },
  {
    "id": "paycheck-comparing-two-paycheck-scenarios",
    "title": "Comparing Two Paycheck Scenarios",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "Trying to decide between a raise with more hours, a switch from hourly to salary, or how a second job would affect your paycheck? Running the same numbers twice by hand gets tedious fast, and it's easy to miss how tax brackets interact between two scenarios."
        ]
      },
      {
        "type": "p",
        "content": [
          "Use our [Dual Scenario Paycheck Calculator] to compare two pay setups side by side — hourly vs. salary, before vs. after a raise, or with vs. without overtime — without recalculating everything manually."
        ]
      }
    ]
  },
  {
    "id": "paycheck-semi-monthly-vs-bi-weekly-why-these-get-confused",
    "title": "Semi-Monthly vs. Bi-Weekly: Why These Get Confused",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "These two pay schedules sound similar but land very differently over the course of a year:"
        ]
      },
      {
        "type": "p",
        "content": [
          "●      Bi-weekly means you're paid every two weeks, resulting in 26 paychecks a year — and occasionally 27 in a year with an extra pay date. Two months out of the year will have three paychecks instead of two."
        ]
      },
      {
        "type": "p",
        "content": [
          "●      Semi-monthly means you're paid twice a month on fixed dates, typically the 1st and 15th, resulting in exactly 24 paychecks a year, every year."
        ]
      },
      {
        "type": "p",
        "content": [
          "Because bi-weekly splits a fixed annual amount across more paychecks, each individual bi-weekly check is smaller than a semi-monthly one for the same salary — even though the yearly total is identical."
        ]
      }
    ]
  },
  {
    "id": "paycheck-your-state-changes-your-paycheck-too",
    "title": "Your State Changes Your Paycheck Too",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "Alongside federal tax and FICA, your paycheck is also affected by whatever your state (and sometimes city) charges in income tax. Since this varies significantly by location, check the calculator for your specific state for the most accurate figure:"
        ]
      },
      {
        "type": "p",
        "content": [
          {
            "text": "[California]",
            "href": "/california-paycheck-calculator"
          },
          " · ",
          {
            "text": "[Texas]",
            "href": "/texas-paycheck-calculator"
          },
          " · [New York] · ",
          {
            "text": "[Florida]",
            "href": "/florida-paycheck-calculator"
          },
          " · ",
          {
            "text": "[Illinois]",
            "href": "/illinois-paycheck-calculator"
          },
          " · [View all 50 states →]"
        ]
      }
    ]
  },
  {
    "id": "paycheck-frequently-asked-questions",
    "title": "Frequently Asked Questions",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "How is a paycheck calculated? Your gross pay for the period (hours × rate, or salary ÷ pay periods) has federal tax, state tax, FICA, and any deductions subtracted from it. What remains is your net pay — the amount actually deposited into your account."
        ]
      },
      {
        "type": "p",
        "content": [
          "Why is my paycheck less than my salary divided by my pay periods? Because taxes and deductions come out first. Your salary divided by pay periods gives you gross pay per paycheck, not net pay — federal tax, state tax, FICA, and any benefit deductions are subtracted from that figure before you're paid."
        ]
      },
      {
        "type": "p",
        "content": [
          "How do I calculate my hourly paycheck? Multiply your hourly rate by the number of hours worked in the pay period to get gross pay. If you worked overtime, add those hours at 1.5× (or your applicable overtime rate) before taxes are calculated on the total."
        ]
      },
      {
        "type": "p",
        "content": [
          "Does a paycheck calculator include overtime? This one does — enter your regular hours and overtime hours separately, and the calculator applies the correct overtime rate before running the tax calculation."
        ]
      },
      {
        "type": "p",
        "content": [
          "How do I fill out a W-4 to change my paycheck? Your W-4 tells your employer how much tax to withhold based on your filing status, dependents, and any other income. Submitting a new W-4 with your HR or payroll department updates your withholding starting with your next paycheck."
        ]
      },
      {
        "type": "p",
        "content": [
          "What's the difference between semi-monthly and bi-weekly pay? Semi-monthly pay happens twice a month on fixed dates (24 paychecks a year); bi-weekly pay happens every two weeks (26 paychecks a year, occasionally 27). Bi-weekly checks are slightly smaller since the same annual pay is split across more paychecks."
        ]
      },
      {
        "type": "p",
        "content": [
          "Is this the right calculator for freelance or 1099 income? No — this tool assumes an employer is withholding tax on your behalf. If you're a freelancer or contractor, use our [1099 / Self-Employment Tax Calculator] instead, since you're responsible for that withholding yourself."
        ]
      }
    ]
  }
];
