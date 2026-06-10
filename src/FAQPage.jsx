import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage({ isDark }) {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqData = [
    {
      category: 'Paycheck Calculator - General',
      questions: [
        {
          q: 'What is a paycheck calculator and how does it work?',
          a: "A paycheck calculator is a tool that estimates your take-home pay after taxes. It takes your gross salary (before taxes) and subtracts federal income tax, Social Security tax (6.2%), Medicare tax (1.45%), and any other deductions you specify. The paycheck calculator shows you exactly how much money you'll receive on each paycheck based on your pay frequency (weekly, bi-weekly, monthly). Our paycheck calculator uses 2026 IRS tax brackets and current tax withholding rules."
        },
        {
          q: 'How accurate is your paycheck calculator?',
          a: 'Our paycheck calculator is highly accurate for federal tax estimates. It uses the current 2026 IRS tax brackets, standard deductions, and accurate FICA calculations (Social Security and Medicare). However, accuracy depends on the information you provide. If you enter incorrect income or withholding information, the paycheck calculator results will be inaccurate. For official tax advice, consult a CPA or tax professional. Our paycheck calculator provides estimates for planning purposes.'
        },
        {
          q: 'Do I need to sign up or create an account to use the paycheck calculator?',
          a: 'No. You do not need to create an account or sign up to use our paycheck calculator. Simply open the tool and enter your information. No email, password, or personal data is required. The paycheck calculator runs completely in your browser with zero data collection. Use the paycheck calculator anonymously, as many times as you want, completely free.'
        },
        {
          q: 'Is the paycheck calculator completely free?',
          a: 'Yes, the paycheck calculator is 100% free. There are no hidden charges, subscription fees, or premium versions. All of our calculators—the paycheck calculator, salary calculator, overtime calculator, and state-specific paycheck calculators (Texas paycheck calculator, Florida paycheck calculator)—are completely free to use.'
        },
        {
          q: 'Can I use the paycheck calculator on my phone or tablet?',
          a: 'Yes. The paycheck calculator works on all devices: phones, tablets, and computers. The paycheck calculator adapts to any screen size and works through any modern web browser. Calculate your paycheck on the go with full functionality on mobile devices.'
        },
        {
          q: 'What information do I need to use the paycheck calculator?',
          a: 'To use the paycheck calculator, you need: (1) Your annual salary or hourly wage, (2) Your filing status (Single, Married Filing Jointly, Head of Household), (3) Your pay frequency (weekly, bi-weekly, monthly), (4) Any extra deductions or withholding amounts. Optional: W-4 allowances, retirement contributions (401k, IRA), or state information if using the Texas paycheck calculator or Florida paycheck calculator.'
        }
      ]
    },
    {
      category: 'Salary Calculator',
      questions: [
        {
          q: "What's the difference between a salary calculator and a paycheck calculator?",
          a: 'A salary calculator estimates your annual take-home pay based on your gross salary. A paycheck calculator takes that information and breaks it down by individual paycheck (weekly, bi-weekly, monthly). The salary calculator shows annual and monthly totals. The paycheck calculator shows what you\'ll receive on each paycheck. Both use the same tax calculations but present the information differently. Our salary calculator pairs well with the paycheck calculator for complete income planning.'
        },
        {
          q: 'How does the salary calculator calculate net pay?',
          a: 'The salary calculator works by: (1) Taking your gross annual salary, (2) Subtracting federal income tax using 2026 IRS tax brackets, (3) Subtracting FICA taxes (Social Security 6.2% and Medicare 1.45%), (4) Subtracting any pre-tax deductions (401k contributions, health insurance), (5) Subtracting any extra withholding you specify. The result is your net pay. The salary calculator shows this for annual, monthly, bi-weekly, weekly, and hourly rates.'
        },
        {
          q: 'Does the salary calculator include state income taxes?',
          a: "The salary calculator estimates federal taxes only. State income taxes vary by location and are not included in the salary calculator. If you need state tax estimates, use our Texas paycheck calculator (which includes Texas tax rules) or Florida paycheck calculator (which shows Florida has no state income tax). For other states, consult your state's tax authority or a tax professional."
        },
        {
          q: 'Can the salary calculator show the impact of bonuses?',
          a: 'The salary calculator calculates based on your annual salary. For bonus impact, use our bonus calculator tool, which estimates how taxes affect supplemental income. The salary calculator provides a baseline. For comprehensive income planning, combine the salary calculator with the bonus calculator and paycheck calculator.'
        },
        {
          q: 'What if my income changes during the year? Does the salary calculator update?',
          a: 'Yes. The salary calculator updates instantly when you change your annual salary. If your income changes during the year (raise, job change, second job), re-enter your new salary into the salary calculator to see updated estimates. The salary calculator recalculates immediately. Keep in mind that the salary calculator provides estimates based on the information you enter.'
        }
      ]
    },
    {
      category: 'Overtime Calculator',
      questions: [
        {
          q: 'What does the no tax on overtime calculator do?',
          a: 'The no tax on overtime calculator estimates your federal tax savings from the OBBBA (One Big Beautiful Bill Act) overtime deduction. This law allows W-2 employees to deduct the overtime premium portion (0.5x your hourly rate) from federal taxable income. The overtime calculator shows: (1) Your annual overtime premium amount, (2) The deductible portion after MAGI phase-outs and caps, (3) Your estimated federal tax savings. The overtime calculator applies to overtime worked in 2025, 2026, 2027, and 2028.'
        },
        {
          q: 'Who can use the no tax on overtime calculator?',
          a: "The overtime calculator is for W-2 employees who work overtime hours beyond 40 hours per week. You must work for an employer who reports overtime on your W-2 (Box 14 or Box 12 with code 'TT'). Self-employed people and 1099 contractors cannot use the overtime calculator. The overtime calculator deduction applies if you earned FLSA-qualified overtime pay during the tax year."
        },
        {
          q: "What's the maximum deduction shown in the overtime calculator?",
          a: "The overtime calculator enforces these deduction limits: Single filers can deduct up to $12,500 in annual overtime premium. Married Filing Jointly filers can deduct up to $25,000. Additionally, the overtime calculator applies MAGI phase-out rules: Single phase-out at $150K-$275K MAGI, Married phase-out at $300K-$550K MAGI. If you exceed these thresholds, the overtime calculator shows your deduction reduced or eliminated."
        },
        {
          q: 'How does the overtime calculator calculate the overtime premium?',
          a: 'The overtime calculator uses this formula: Overtime Premium = Hourly Rate × 0.5 (this 0.5x is the FLSA premium portion, not the overtime hours). Annual Premium = Overtime Premium × Weekly OT Hours × Weeks Per Year. For example: $25/hour worker, 5 hours OT/week, 52 weeks/year = ($25 × 0.5) × 5 × 52 = $3,250 annual overtime premium. The overtime calculator then applies caps and phase-outs to show your deductible amount.'
        },
        {
          q: 'Does the overtime calculator show tax savings right away?',
          a: 'Yes. The overtime calculator shows real-time results. As you adjust your hourly rate, overtime hours, or MAGI in the overtime calculator, your estimated deduction and tax savings update instantly. The overtime calculator displays your annual tax savings based on your marginal tax bracket, so you can see the impact immediately.'
        },
        {
          q: "What if my income is above the phase-out threshold? Does the overtime calculator still work?",
          a: "Yes, the overtime calculator still works. If your MAGI exceeds the overtime calculator's phase-out range, your deduction is reduced. The overtime calculator shows exactly how much your deduction is reduced based on excess income. For example, if you're single with MAGI of $200K, the overtime calculator reduces your deduction because you're $50K over the $150K threshold. The overtime calculator applies the phase-out formula automatically."
        }
      ]
    },
    {
      category: 'Texas Paycheck Calculator',
      questions: [
        {
          q: 'What makes the Texas paycheck calculator different from other paycheck calculators?',
          a: 'The Texas paycheck calculator includes Texas-specific tax rules. Texas has no state income tax, which means the Texas paycheck calculator shows federal taxes only (no state tax deduction). The Texas paycheck calculator takes your gross salary, subtracts federal income tax using 2026 IRS brackets and FICA taxes, and shows your net pay. Because Texas has no state income tax, the Texas paycheck calculator results are typically higher take-home pay compared to other states.'
        },
        {
          q: 'Do I need to use the Texas paycheck calculator if I live in Texas?',
          a: 'Yes, if you work in Texas and want an accurate paycheck estimate, use the Texas paycheck calculator. The Texas paycheck calculator accounts for the fact that Texas has no state income tax. If you use a generic paycheck calculator that includes state taxes for other states, the Texas paycheck calculator gives you a more accurate picture of your actual take-home pay.'
        },
        {
          q: 'Does the Texas paycheck calculator include local taxes?',
          a: 'The Texas paycheck calculator includes federal and FICA taxes. Some Texas cities have local taxes (like Dallas or Houston), but these vary by city and employer. The Texas paycheck calculator does not include local taxes. Check with your employer or city tax authority for local tax information if applicable.'
        },
        {
          q: 'Can I use the Texas paycheck calculator if I\'m paid hourly?',
          a: 'Yes. The Texas paycheck calculator works for both salaried and hourly employees. Simply enter your hourly rate and hours worked per week, or provide your annual salary. The Texas paycheck calculator calculates federal withholding and FICA, then shows your net pay by paycheck frequency. The Texas paycheck calculator adapts to any income structure.'
        },
        {
          q: 'How often should I check the Texas paycheck calculator if my income changes?',
          a: 'Use the Texas paycheck calculator whenever your income, withholding, or deductions change. If you get a raise, start overtime, change jobs, or adjust your W-4, recalculate using the Texas paycheck calculator. The Texas paycheck calculator updates instantly, so you always have current estimates for paycheck planning.'
        }
      ]
    },
    {
      category: 'Florida Paycheck Calculator',
      questions: [
        {
          q: 'What is unique about the Florida paycheck calculator?',
          a: "The Florida paycheck calculator reflects Florida's tax advantages: Florida has no state income tax, which means higher take-home pay. The Florida paycheck calculator estimates your federal taxes and FICA only (no state income tax deduction). Florida also has no state capital gains tax, making the Florida paycheck calculator great for financial planning in Florida. Use the Florida paycheck calculator to see your true net pay as a Florida resident."
        },
        {
          q: 'Is the Florida paycheck calculator accurate for all Florida residents?',
          a: 'The Florida paycheck calculator is accurate for federal tax estimates in Florida. Since Florida has no state income tax, the Florida paycheck calculator focuses on federal withholding and FICA. Some Florida counties may have small local taxes, but these are minimal. The Florida paycheck calculator gives you a highly accurate picture of federal withholding in Florida.'
        },
        {
          q: 'Can I use the Florida paycheck calculator if I work remotely for an out-of-state company?',
          a: "Yes. Use the Florida paycheck calculator if you live and work in Florida, even if your employer is located elsewhere. The Florida paycheck calculator uses your residence location (Florida) to determine tax treatment. Some states have special rules for remote workers, but Florida's lack of state income tax means the Florida paycheck calculator applies regardless of where your employer is based."
        },
        {
          q: 'Does the Florida paycheck calculator include self-employment taxes?',
          a: 'The Florida paycheck calculator is designed for W-2 employees. Self-employed individuals and 1099 contractors have different tax rules (15.3% self-employment tax instead of split FICA). For self-employed income estimates in Florida, consult a tax professional. The Florida paycheck calculator works best for traditional W-2 employment.'
        },
        {
          q: 'How does the Florida paycheck calculator compare to the Texas paycheck calculator?',
          a: 'Both the Florida paycheck calculator and Texas paycheck calculator show no state income tax (an advantage shared by both states). The main difference: different federal withholding brackets apply based on your filing status and income. The Florida paycheck calculator and Texas paycheck calculator are similarly accurate for their respective states. Use the Florida paycheck calculator for Florida residents and the Texas paycheck calculator for Texas residents.'
        }
      ]
    },
    {
      category: 'California Paycheck Calculator',
      questions: [
        {
          q: 'How much tax is taken out of a $2,000 paycheck in California?',
          a: 'The exact amount depends on your filing status, pay frequency, W-4 details, and deductions. For a rough estimate on a $2,000 paycheck, federal income tax, Social Security, Medicare, California state income tax, and SDI can together remove anywhere from around $300 to $500 or more depending on your situation. A California paycheck calculator gives you a personalized number based on your actual inputs.'
        },
        {
          q: 'How much is a $70,000 salary after taxes in California?',
          a: 'A $70,000 salary in California is subject to federal income tax, California state income tax, Social Security, Medicare, and SDI. After all these deductions, take-home pay is typically in the range of $50,000 to $55,000 annually for a single filer, though the exact number shifts based on filing status, pre-tax deductions, and withholding choices. Use the California paycheck calculator to get an estimate for your specific situation.'
        },
        {
          q: 'How much money does California take out of a paycheck?',
          a: 'California takes out state income tax using a progressive bracket system that ranges from 1% up to 13.3% for the highest earners. On top of that, SDI is withheld from wages. Combined with federal withholdings, California workers can see 25% to 35% or more of gross pay removed before the deposit arrives, depending on income level and filing status.'
        },
        {
          q: 'How to calculate each paycheck?',
          a: 'To calculate your paycheck, start with gross pay, then subtract federal income tax based on your brackets and W-4, Social Security at 6.2%, Medicare at 1.45%, California state income tax using CA brackets, SDI, and any pre-tax or post-tax deductions. The result is your net pay. A California paycheck calculator handles all of this automatically when you enter your salary, pay frequency, and filing details.'
        },
        {
          q: 'How much is a $100,000 salary in California after taxes?',
          a: 'A $100,000 salary in California faces federal tax, California state income tax, FICA taxes, and SDI. For a single filer with standard deductions, take-home pay is often estimated in the range of $68,000 to $74,000 annually, though pre-tax deductions like a 401(k) or health insurance can improve that figure. The California paycheck calculator can give you a closer estimate based on your specific inputs.'
        },
        {
          q: 'What are California rules for final paychecks?',
          a: 'California has strict final paycheck laws. If an employer terminates an employee, the final paycheck must be provided immediately at the time of termination. If an employee resigns with at least 72 hours of notice, the final paycheck is due on the last day of work. If an employee quits without notice, the employer has 72 hours to provide the final paycheck. Late final paychecks may result in waiting time penalties under California Labor Code.'
        },
        {
          q: 'How do you calculate hours and pay?',
          a: 'To calculate hourly pay, multiply your hourly rate by total hours worked in the pay period. For overtime, multiply the hourly rate by 1.5 for hours above 40 in a workweek, or above 8 in a single day under California law. Then apply federal and California tax withholding to that gross amount to estimate take-home pay. The California paycheck calculator supports hourly input so you can estimate net pay directly.'
        },
        {
          q: 'How much is $20,000 after taxes in California?',
          a: 'At $20,000 in annual income, federal income tax is generally low due to the standard deduction reducing taxable income significantly. California state income tax would apply at the lower brackets. After federal tax, California tax, Social Security, Medicare, and SDI, take-home pay on a $20,000 salary is typically around $17,000 to $18,500 depending on filing status and deductions. Enter your details into the California paycheck calculator for a more accurate estimate.'
        }
      ]
    },
    {
      category: 'General Calculator Questions',
      questions: [
        {
          q: 'Which calculator should I use: salary calculator, paycheck calculator, Texas paycheck calculator, or Florida paycheck calculator?',
          a: 'Choose based on your needs: (1) Use the salary calculator for annual take-home estimates. (2) Use the paycheck calculator for individual paycheck breakdowns. (3) Use the Texas paycheck calculator if you live/work in Texas. (4) Use the Florida paycheck calculator if you live/work in Florida. (5) Use the overtime calculator if you have OBBBA-qualifying overtime. The overtime calculator is supplementary to any paycheck or salary calculator.'
        },
        {
          q: 'Are these calculators FICA-compliant and current?',
          a: 'Yes. All calculators—the paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator—use 2026 IRS-confirmed tax brackets, FICA rates (Social Security 6.2%, Medicare 1.45%), and current withholding rules. However, tax laws change. Check back periodically to ensure you\'re using the latest calculator version. These calculators provide estimates, not official tax determinations.'
        },
        {
          q: 'Can I export or save my calculator results?',
          a: 'Our calculators do not store results permanently. The paycheck calculator, salary calculator, overtime calculator, and state-specific paycheck calculators (Texas paycheck calculator, Florida paycheck calculator) run in your browser and do not save data. You can screenshot results or manually record them. For ongoing paycheck tracking, check your actual pay stub from your employer.'
        },
        {
          q: 'What if my tax situation is complex? Should I still use these calculators?',
          a: 'These calculators—the paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator—work well for straightforward situations (single job, standard deductions, basic withholding). If you have complex situations (self-employment, multiple jobs, capital gains, dependents, itemized deductions), use these calculators for estimation but consult a CPA for accurate tax planning. The paycheck calculator and others provide helpful guidance but not personalized tax advice.'
        },
        {
          q: 'Do these calculators work for all filing statuses?',
          a: 'Yes. The paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator support: Single, Married Filing Jointly, Married Filing Separately, and Head of Household. Select your correct filing status for accurate results. Different filing statuses have different tax brackets and deduction amounts, which the calculators account for automatically.'
        },
        {
          q: 'Is my financial data safe when using these calculators?',
          a: 'Yes. The paycheck calculator, salary calculator, overtime calculator, and state paycheck calculators (Texas paycheck calculator, Florida paycheck calculator) do not collect or store your personal information. All calculations happen in your browser on your device. No data is sent to servers. These calculators prioritize your privacy. You can use them anonymously.'
        }
      ]
    },
    {
      category: 'OBBBA & Overtime Details',
      questions: [
        {
          q: 'What is OBBBA and how does it relate to the overtime calculator?',
          a: 'OBBBA (One Big Beautiful Bill Act, signed July 4, 2025) introduced a deduction for FLSA-qualified overtime premium pay. The overtime calculator helps estimate this deduction. Under OBBBA, W-2 employees can deduct the 0.5x overtime premium from federal taxable income. The overtime calculator shows how much you can deduct based on hours worked, pay rate, and MAGI. This law is effective for tax years 2025-2028.'
        },
        {
          q: 'Does the overtime calculator work for all types of overtime?',
          a: "The overtime calculator only works for FLSA-qualified overtime. This means overtime that meets Fair Labor Standards Act criteria: overtime beyond 40 hours/week at time-and-a-half (1.5x) pay. Double-time, shift premiums, or bonuses labeled 'overtime' do not qualify for the overtime calculator. Your W-2 must report qualifying overtime in Box 14 or Box 12 code 'TT' for the overtime calculator deduction to apply."
        },
        {
          q: 'When will the OBBBA overtime deduction expire? Does the overtime calculator apply indefinitely?',
          a: 'The OBBBA overtime deduction (used by the overtime calculator) is effective for tax years 2025, 2026, 2027, and 2028. After December 31, 2028, the deduction expires unless Congress extends it. The overtime calculator applies through 2028. If OBBBA is extended, the overtime calculator will be updated. Check back periodically or consult a tax professional for post-2028 rules.'
        }
      ]
    },
    {
      category: 'Tax Brackets & Withholding',
      questions: [
        {
          q: 'What tax brackets does the paycheck calculator use?',
          a: 'The paycheck calculator uses the 2026 IRS federal tax brackets: Single: 10%, 12%, 22%, 24%, 32%, 35%, 37%. Married Filing Jointly: 10%, 12%, 22%, 24%, 32%, 35%, 37% (with higher income thresholds). The Texas paycheck calculator and Florida paycheck calculator use these same federal brackets since both states have no state income tax. All calculators update annually with new IRS brackets.'
        },
        {
          q: 'How does the paycheck calculator determine my tax bracket?',
          a: 'The paycheck calculator calculates your taxable income (gross salary minus standard deduction and pre-tax deductions). It then matches your taxable income to the appropriate 2026 IRS tax bracket for your filing status. The paycheck calculator uses your marginal tax rate (the rate for your highest income dollar) to show your federal tax withholding. This is how the paycheck calculator determines accurate withholding.'
        },
        {
          q: 'Does the paycheck calculator show my marginal vs. effective tax rate?',
          a: "Most paycheck calculators show effective tax rate (total tax ÷ gross income). Ours shows both: effective and marginal rates. The paycheck calculator's effective rate shows your overall tax burden. The marginal rate (shown in the overtime calculator) shows the tax rate on your next dollar earned. Understanding both helps with overtime calculator decisions and tax planning."
        },
        {
          q: 'Can I adjust withholding in the paycheck calculator?',
          a: "Yes. The paycheck calculator lets you specify extra withholding (increasing taxes) or claim allowances/deductions (decreasing taxes). If you want different withholding than the paycheck calculator's default, enter the amount. The paycheck calculator updates instantly. This is useful if you're married with two earners or have complex withholding needs—adjust in the paycheck calculator and compare."
        }
      ]
    },
    {
      category: 'Deductions & Credits',
      questions: [
        {
          q: 'Does the paycheck calculator include standard deduction?',
          a: 'Yes. The paycheck calculator automatically includes the 2026 standard deduction: $16,100 for Single, $32,200 for Married Filing Jointly. The paycheck calculator subtracts this from your gross income before calculating federal tax. If you itemize deductions instead, you\'d need to manually adjust the paycheck calculator to reflect the difference. The paycheck calculator assumes standard deduction by default.'
        },
        {
          q: 'Can the paycheck calculator account for 401k contributions?',
          a: 'Yes. The paycheck calculator has a field for pre-tax retirement contributions (401k, traditional IRA, etc.). Enter your annual contribution, and the paycheck calculator subtracts it from gross income before calculating taxes. This reduces your taxable income, which the paycheck calculator reflects. Post-tax retirement contributions (Roth) do not reduce the paycheck calculator\'s taxable income.'
        },
        {
          q: 'Does the paycheck calculator include tax credits (child tax credit, etc.)?',
          a: 'The paycheck calculator focuses on withholding (taxes taken from your paycheck). Tax credits typically apply during tax filing, not on your paycheck. The paycheck calculator does not reduce withholding for credits. If you have credits, your paycheck calculator estimate may be higher than your actual tax. Talk to a tax professional about adjusting W-4 withholding if you expect significant refundable credits.'
        },
        {
          q: 'How does the overtime calculator account for deductions?',
          a: 'The overtime calculator calculates your deductible overtime premium after applying deduction caps and MAGI phase-outs. The overtime calculator then shows tax savings by multiplying your deductible amount by your marginal tax bracket (derived from MAGI). The overtime calculator assumes standard deduction already applied. For complex deduction situations, consult a tax professional about your specific overtime calculator results.'
        }
      ]
    },
    {
      category: 'Disclaimer & Legal',
      questions: [
        {
          q: 'Is the paycheck calculator a substitute for tax advice?',
          a: 'No. The paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator provide estimates for educational and planning purposes only. These calculators are not tax advice. Always consult a qualified CPA, Enrolled Agent, or tax attorney for personal tax situations. These calculators may underestimate or overestimate your actual taxes based on your complete financial situation.'
        },
        {
          q: "What if the paycheck calculator results don't match my actual paycheck?",
          a: 'Several factors could cause differences: (1) You may have entered incorrect information into the paycheck calculator. (2) Your employer may use different withholding rules. (3) You may have additional deductions not in the paycheck calculator (health insurance, FSA, garnishments, etc.). (4) The paycheck calculator uses standard assumptions. Check your actual pay stub to see what your employer withholds. If large differences exist, contact your payroll department or a tax professional.'
        },
        {
          q: 'Are these calculators updated for tax law changes?',
          a: 'We update these calculators annually with new IRS tax brackets and rules. The paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator reflect 2026 tax law as of the publication date. However, tax laws can change throughout the year. For the latest information, check IRS.gov. We recommend verifying current rules before major financial decisions.'
        },
        {
          q: 'Can I use results from these calculators when filing my tax return?',
          a: 'These calculators provide estimates for planning, not official tax determinations. The paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator cannot replace actual tax return preparation. For filing, work with a tax professional who can review your complete situation. Use these calculators for planning; use a tax professional for filing.'
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  useEffect(() => {
    document.title = 'FAQ - OBBBA Tax Calculators';

    const metaDescriptionContent =
      'Frequently asked questions about paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator.';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metaDescriptionContent);

    const schemaId = 'faq-page-schema';
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const mainEntity = faqData
      .flatMap((section) => section.questions)
      .map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      }));

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'Frequently Asked Questions - OBBBA Tax Calculators',
      description: metaDescriptionContent,
      url: `${window.location.origin}/faq`,
      mainEntity,
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, []);

  let faqIndex = 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Find answers to common questions about our paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator.
          </p>
        </div>

        <div className="space-y-8">
          {faqData.map((section, sectionIdx) => (
            <div key={sectionIdx} className={`rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'} p-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{section.category}</h2>

              <div className="space-y-4">
                {section.questions.map((faq, qIdx) => {
                  const globalIdx = faqIndex++;
                  return (
                    <div key={qIdx} className={`rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-300 bg-white'} overflow-hidden`}>
                      <button
                        onClick={() => toggleFAQ(globalIdx)}
                        className={`w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-70 transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                      >
                        <span className={`text-left font-semibold ${isDark ? 'text-cyan-300' : 'text-blue-600'}`}>{faq.q}</span>
                        {expandedFAQ === globalIdx ? (
                          <ChevronUp className={`flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
                        ) : (
                          <ChevronDown className={`flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                        )}
                      </button>

                      {expandedFAQ === globalIdx && (
                        <div className={`px-6 py-4 border-t ${isDark ? 'border-slate-700 bg-slate-900/20' : 'border-slate-200 bg-slate-100'}`}>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-12 p-8 rounded-2xl ${isDark ? 'bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 border border-indigo-800/50' : 'bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-cyan-300' : 'text-blue-900'}`}>Still have questions?</h3>
          <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            If you don't find the answer to your question about the paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, or Florida paycheck calculator, reach out to us.
          </p>
          <p className={`mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Website: <a href="https://obbacalculators.com" target="_blank" rel="nofollow noopener noreferrer" className="underline">obbacalculators.com</a>
          </p>
          <a href="mailto:obbacalculators@gmail.com" className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all">
            Contact Support
          </a>
        </div>

        <div className={`mt-12 p-6 rounded-xl border ${isDark ? 'border-red-900/30 bg-red-900/10' : 'border-red-200 bg-red-50'}`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-red-300' : 'text-red-800'}`}>
            ⚠️ <strong>Important:</strong> This FAQ provides general information about our calculators. The paycheck calculator, salary calculator, overtime calculator, Texas paycheck calculator, and Florida paycheck calculator provide estimates only—not tax advice. Always consult a qualified tax professional for your specific situation.
          </p>
        </div>
    </main>
  );
}
