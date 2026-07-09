export const overtimeDocMeta = {
  "title": "No Tax on Overtime Calculator | Estimate Your Savings",
  "description": "Free no tax on overtime calculator. See how much of your overtime pay qualifies for the OBBBA deduction, your savings cap, and phase-out limits for 2025."
};

export const overtimeDocSections = [
  {
    "id": "overtime-doc-use-the-no-tax-on-overtime-calculator-to-maximize-your-take-home-pay",
    "title": "Use the No Tax on Overtime Calculator to Maximize Your Take-Home Pay",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "If you regularly work more than 40 hours a week, the One Big Beautiful Bill Act (OBBBA) now lets you deduct a portion of your overtime pay from federal income tax for tax years 2025 through 2028. Our no tax on overtime calculator estimates that deduction in seconds, but the number it gives you will make a lot more sense if you understand what's actually being calculated,so this page walks through the real mechanics: how overtime pay itself is calculated under federal law, exactly how much of it qualifies for the new deduction, and where the limits and phase-outs kick in."
        ]
      },
      {
        "type": "p",
        "content": [
          "This isn't a marketing page for the calculator — it's the reference we'd want if we were trying to figure out our own overtime tax deduction by hand."
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-how-to-use-the-no-tax-on-overtime-calculator",
    "title": "How to Use the No Tax on Overtime Calculator",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "You don't need any tax knowledge to get an accurate estimate, just three numbers from a recent pay stub or your annual pay details:"
        ]
      },
      {
        "type": "numbered",
        "items": [
          [
            "Enter your filing status. Choose single, head of household, or married filing jointly. This determines which deduction cap ($12,500 or $25,000) and which phase-out threshold applies to you."
          ],
          [
            "Enter your total overtime pay for the year (or per pay period). This is the overtime amount that already appears on your pay stub or W-2 — not your regular wages, just the overtime portion. If you only have a weekly or monthly figure, the calculator can annualize it for you."
          ],
          [
            "Enter your regular hourly rate (or let the calculator work it out). This is needed to split your overtime pay into the straight-time portion and the actual \"premium\" portion, since only the premium is deductible. If you're not sure what your regular rate works out to once bonuses or shift differentials are included, our ",
            {
              "text": "Salary Calculator",
              "href": "/salary-calculator"
            },
            " can help you figure that out first."
          ],
          [
            "Enter your estimated total income (MAGI). This checks whether you fall under the phase-out threshold, and if you're above it, how much of the deduction you still get."
          ],
          [
            "Get your results instantly. The calculator shows your qualified overtime deduction amount, an estimate of the federal tax saved, and a reminder of what the deduction does not affect (FICA and state tax, covered below)."
          ]
        ]
      },
      {
        "type": "p",
        "content": [
          "Because the calculator separates the straight-time and premium portions automatically, you avoid the single biggest mistake people make when estimating this deduction by hand: assuming the whole overtime paycheck qualifies."
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-why-use-this-calculator",
    "title": "Why Use This Calculator",
    "level": 2,
    "blocks": [
      {
        "type": "list",
        "items": [
          [
            "Avoids the most common overestimation error — most people assume their entire overtime paycheck is deductible. This calculator applies the actual IRS rule (premium-only) so your estimate isn't inflated."
          ],
          [
            "Applies the correct cap and phase-out automatically based on your filing status, instead of you having to look up and apply the $12,500/$25,000 limits and the $150,000/$300,000 MAGI thresholds yourself."
          ],
          [
            "Free and instant — no sign-up, no need to wait for tax software or a preparer to model this one provision for you."
          ],
          [
            "Useful for planning ahead, not just filing season. Since the deduction doesn't change your paycheck automatically, seeing the estimated savings now can help you decide whether to adjust your W-4 withholding during the year instead of waiting for a refund."
          ],
          [
            "Built specifically around the new OBBBA rule — general paycheck or payroll calculators weren't built with the 2025–2028 overtime deduction in mind, so they can't estimate this specific tax benefit accurately."
          ]
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-how-overtime-pay-is-calculated-before-any-tax-deduction",
    "title": "How Overtime Pay Is Calculated (Before Any Tax Deduction)",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "Before you can calculate the tax break, you need the overtime pay itself. Under the ",
          {
            "text": "Fair Labor Standards Act (FLSA)",
            "href": "https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay"
          },
          ", covered non-exempt employees must be paid at least one-and-a-half times their regular rate of pay for every hour worked beyond 40 in a single workweek. There's no cap on how many hours someone can work in a week — the FLSA only sets the minimum overtime premium once 40 hours is exceeded."
        ]
      },
      {
        "type": "p",
        "content": [
          "The formula is straightforward:"
        ]
      },
      {
        "type": "p",
        "content": [
          "Overtime pay = Overtime hours × Regular rate × 1.5"
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
              "Description"
            ],
            [
              "Example ($22/hr, 48 hrs worked)"
            ]
          ],
          [
            [
              "1. Regular rate"
            ],
            [
              "Hourly pay before overtime"
            ],
            [
              "$22.00/hr"
            ]
          ],
          [
            [
              "2. Straight-time pay"
            ],
            [
              "40 hrs × regular rate"
            ],
            [
              "40 × $22 = $880.00"
            ]
          ],
          [
            [
              "3. Overtime hours"
            ],
            [
              "Hours worked beyond 40"
            ],
            [
              "8 hours"
            ]
          ],
          [
            [
              "4. Overtime rate"
            ],
            [
              "Regular rate × 1.5"
            ],
            [
              "$22 × 1.5 = $33.00/hr"
            ]
          ],
          [
            [
              "5. Overtime pay"
            ],
            [
              "Overtime hours × overtime rate"
            ],
            [
              "8 × $33 = $264.00"
            ]
          ],
          [
            [
              "Total weekly pay"
            ],
            [
              "Straight-time + overtime"
            ],
            [
              "$1,144.00"
            ]
          ]
        ]
      },
      {
        "type": "p",
        "content": [
          "If your pay includes non-hourly compensation (bonuses, shift differentials, commissions), the \"regular rate\" used for the overtime calculation is a weighted average of all your earnings for the week divided by total hours worked — not just your base hourly wage. That's the detail most simple overtime calculators skip, and it's exactly why our tool asks for total compensation, not just base pay."
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-what-no-tax-on-overtime-actually-deducts",
    "title": "What \"No Tax on Overtime\" Actually Deducts",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "Here's the part most people get wrong when they search for an \"overtime tax calculator\": the deduction does not apply to your entire overtime paycheck. It only applies to the overtime premium — the extra half (the \".5\" in \"time-and-a-half\") that federal law required your employer to pay beyond your regular rate."
        ]
      },
      {
        "type": "p",
        "content": [
          "Going back to the example above: of that $264.00 in overtime pay, $176.00 (8 hrs × $22) is just your normal hourly rate paid for those hours — that portion was never overtime-specific and isn't part of the deduction. Only the remaining $88.00 (8 hrs × $11, which is half the regular rate) is \"qualified overtime compensation\" under the law."
        ]
      },
      {
        "type": "table",
        "rows": [
          [
            [
              "Overtime pay component"
            ],
            [
              "Amount"
            ],
            [
              "Deductible?"
            ]
          ],
          [
            [
              "Straight-time portion of OT hours (8 × $22)"
            ],
            [
              "$176.00"
            ],
            [
              "No — this is regular wages"
            ]
          ],
          [
            [
              "Overtime premium (8 × $11, the \"half\")"
            ],
            [
              "$88.00"
            ],
            [
              "Yes — this is the deductible amount"
            ]
          ],
          [
            [
              "Total overtime pay"
            ],
            [
              "$264.00"
            ],
            [
              "Only 33% of it qualifies"
            ]
          ]
        ]
      },
      {
        "type": "p",
        "content": [
          "This is confirmed directly by the IRS: qualified overtime compensation is the pay \"that exceeds their regular rate of pay... required by the Fair Labor Standards Act.\" Our calculator automatically separates these two amounts so you're not accidentally claiming the full overtime paycheck as deductible."
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-deduction-limits-and-phase-out-thresholds",
    "title": "Deduction Limits and Phase-Out Thresholds",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "The deduction has an annual cap, and it phases out at higher incomes. These figures come directly from the IRS and apply for tax years 2025–2028:"
        ]
      },
      {
        "type": "table",
        "rows": [
          [
            [
              "Filing status"
            ],
            [
              "Maximum annual deduction"
            ],
            [
              "Phase-out begins at (MAGI)"
            ]
          ],
          [
            [
              "Single / Head of Household"
            ],
            [
              "$12,500"
            ],
            [
              "$150,000"
            ]
          ],
          [
            [
              "Married Filing Jointly"
            ],
            [
              "$25,000"
            ],
            [
              "$300,000"
            ]
          ]
        ]
      },
      {
        "type": "p",
        "content": [
          "Above these ",
          {
            "text": "MAGI thresholds",
            "href": "https://www.investopedia.com/terms/m/magi.asp"
          },
          ", the deduction is reduced — it doesn't disappear all at once. The deduction is available whether you itemize or take the standard deduction, and every taxpayer claiming it must have a valid Social Security number (married taxpayers must file jointly to claim it)."
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-who-actually-qualifies",
    "title": "Who Actually Qualifies",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "This deduction is narrower than the \"no tax on overtime\" headlines suggest. You generally qualify if:"
        ]
      },
      {
        "type": "list",
        "items": [
          [
            "You're a W-2 employee classified as non-exempt under the FLSA (hourly workers are almost always non-exempt; many salaried managers, executives, and professionals are exempt and don't qualify)."
          ],
          [
            "Your overtime is required by the FLSA — overtime paid only because of a state law (like California's daily overtime rule), a union contract, or a company policy, above and beyond what federal law requires, does not count toward the federal deduction."
          ],
          [
            "Your overtime is properly reported to the IRS on your W-2, 1099, or another qualifying statement."
          ]
        ]
      },
      {
        "type": "p",
        "content": [
          "You generally do not qualify if you're self-employed with no W-2 overtime structure, work as an independent contractor, or are FLSA-exempt (many salaried roles). Railroad workers under the Railroad Retirement Tax Act are also excluded."
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-what-the-deduction-does-not-change",
    "title": "What the Deduction Does Not Change",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "This is the most common misconception behind searches like \"tax free overtime\" or \"no overtime tax calculator\": the deduction reduces your federal income tax bill when you file your return — it does not stop tax withholding during the year, and it doesn't touch these:"
        ]
      },
      {
        "type": "list",
        "items": [
          [
            "Social Security and Medicare (FICA) taxes — still withheld on 100% of your overtime pay, no exception."
          ],
          [
            "State income tax — this is a federal deduction only. Whether your state also exempts overtime depends entirely on your state's own tax code; most states have not adopted a matching rule, so check your state department of revenue before assuming your state return gets the same benefit."
          ],
          [
            "Your paycheck itself — employers continue withholding federal income tax on overtime as usual throughout the year. The deduction shows up as savings when you file, not as a bigger paycheck today (unless you adjust your W-4 withholding to account for it in advance). If you want to see how your take-home pay looks after all withholdings, run your numbers through our ",
            {
              "text": "Salary Paycheck Calculator",
              "href": "/paycheck-calculator"
            },
            " for the full picture."
          ]
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-overtime-calculators-by-state",
    "title": "Overtime Calculators by State",
    "level": 2,
    "blocks": [
      {
        "type": "p",
        "content": [
          "A lot of searches for this topic are state-specific (California, Texas, Florida, and others), because overtime rules aren't purely federal. If you're comparing your earnings with a ",
          {
            "text": "California Paycheck Calculator",
            "href": "/california-paycheck-calculator"
          },
          ", keep in mind that states like California require overtime after 8 hours in a single day, not just after 40 hours in a week — and that daily-overtime portion is not \"qualified overtime\" for the federal deduction, even though it's real overtime pay under state law. In no-income-tax states (Florida, Texas, Nevada, Washington, Tennessee, and a handful of others), the federal deduction is the only overtime tax break that applies to you, since there's no state income tax to begin with. In states with income tax, always confirm separately whether your state conforms to the federal overtime deduction — most currently don't. "
        ]
      }
    ]
  },
  {
    "id": "overtime-doc-frequently-asked-questions",
    "title": "Frequently Asked Questions",
    "level": 2,
    "blocks": [
      {
        "type": "faq",
        "question": [
          "How is overtime pay calculated?"
        ],
        "answer": [
          "Overtime pay equals your overtime hours multiplied by 1.5 times your regular hourly rate, for every hour worked beyond 40 in a workweek, under the FLSA."
        ]
      },
      {
        "type": "faq",
        "question": [
          "How is the \"no tax on overtime\" deduction calculated?"
        ],
        "answer": [
          "It's calculated on the overtime premium only — the extra half of time-and-a-half, not your entire overtime paycheck — up to $12,500 (single) or $25,000 (married filing jointly), phasing out above $150,000/$300,000 in modified adjusted gross income."
        ]
      },
      {
        "type": "faq",
        "question": [
          "Does the overtime deduction apply to 2025 taxes or 2026 taxes?"
        ],
        "answer": [
          "Both, and 2027 and 2028 as well. It applies to qualified overtime compensation earned from January 1, 2025, through December 31, 2028, unless Congress extends it."
        ]
      },
      {
        "type": "faq",
        "question": [
          "Do salaried employees qualify for the overtime deduction?"
        ],
        "answer": [
          "Only if they're classified as non-exempt under the FLSA and actually receive FLSA-required overtime pay. Most exempt salaried employees (many managers, professionals, and administrative roles) do not qualify."
        ]
      },
      {
        "type": "faq",
        "question": [
          "Will this deduction increase my paycheck right now?"
        ],
        "answer": [
          "Not automatically. It reduces the tax you owe when you file your return. To see the benefit in your paycheck sooner, you'd need to submit an updated W-4 to your employer to adjust withholding."
        ]
      },
      {
        "type": "faq",
        "question": [
          "Is overtime pay still subject to Social Security and Medicare tax?"
        ],
        "answer": [
          "Yes. The deduction only applies to federal income tax — FICA taxes are withheld on your full overtime pay regardless of this deduction."
        ]
      }
    ]
  }
];
