export const overtimeCalculatorSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.obbacalculators.com/overtime#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.obbacalculators.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Overtime Calculator",
          "item": "https://www.obbacalculators.com/overtime"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://www.obbacalculators.com/overtime#webpage",
      "url": "https://www.obbacalculators.com/overtime",
      "name": "Overtime Calculator, Time and a Half & Double Time Pay | CheckYourPays",
      "description": "Calculate your overtime pay, time and a half, double time, and total gross pay — from your hourly rate and hours worked. Free, instant, no sign-up.",
      "isPartOf": {
        "@id": "https://www.obbacalculators.com/#website"
      },
      "breadcrumb": {
        "@id": "https://www.obbacalculators.com/overtime#breadcrumb"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://www.obbacalculators.com/share-card.png",
        "width": 1731,
        "height": 909
      },
      "mainEntity": {
        "@id": "https://www.obbacalculators.com/overtime#software"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.obbacalculators.com/overtime#software",
      "name": "Overtime Calculator",
      "url": "https://www.obbacalculators.com/overtime",
      "description": "Calculate your overtime pay, time and a half, double time, and total gross pay — from your hourly rate and hours worked. Free, instant, no sign-up.",
      "applicationCategory": "FinanceApplication",
      "applicationSubCategory": "Overtime Calculator",
      "operatingSystem": "Any (Web-based)",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@id": "https://www.obbacalculators.com/#organization"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.obbacalculators.com/overtime#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is time and a half?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Time and a half means being paid 1.5 times your regular hourly rate for overtime hours — the standard federal overtime rate once a non-exempt employee works more than 40 hours in a week."
          }
        },
        {
          "@type": "Question",
          "name": "What is double time pay?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Double time means being paid twice your regular hourly rate. It's not required under federal law in most cases, but some states — most notably California — mandate it for hours worked beyond a daily threshold."
          }
        },
        {
          "@type": "Question",
          "name": "Do salaried employees get overtime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It depends on whether the role is classified as exempt or non-exempt. Being salaried doesn't automatically exclude someone from overtime — both their pay level and their actual job duties determine their classification under the FLSA."
          }
        },
        {
          "@type": "Question",
          "name": "How many hours before overtime kicks in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Under federal law, overtime starts after 40 hours worked in a single workweek. Some states, like California and Alaska, also apply overtime after 8 hours worked in a single day, regardless of the weekly total."
          }
        },
        {
          "@type": "Question",
          "name": "Is overtime taxed differently than regular pay?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No — overtime is taxed using the same withholding rules as your regular wages. It can make a specific paycheck look more heavily taxed simply because the gross amount for that period is larger, but your overall tax rate for the year isn't affected by how the income was earned."
          }
        },
        {
          "@type": "Question",
          "name": "Does California have different overtime rules than other states?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. California requires daily overtime after 8 hours worked in a day and double time after 12 hours in a day or after 8 hours on a seventh consecutive workday — rules most other states don't have."
          }
        },
        {
          "@type": "Question",
          "name": "How is overtime calculated for a salaried employee who is non-exempt?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Their salary is first converted into an effective hourly rate — typically by dividing weekly salary by the standard number of hours it's meant to cover — and overtime is then calculated from that hourly figure using the same 1.5× or 2× multiplier as an hourly worker."
          }
        }
      ]
    }
  ]
};
