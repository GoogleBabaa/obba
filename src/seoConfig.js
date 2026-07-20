import { blogPosts } from './blogData.js';

export const SITE_URL = 'https://www.obbacalculators.com';

export const pageSeoByPath = {
  '/': {
    title: 'Best Paycheck & Tax Calculators 2026 | OBBA',
    description: 'See your real take-home pay in seconds with OBBA Calculators - paycheck, salary, overtime, state taxes, and money-saving tools in one modern view.',
    keywords: 'Tax Calculator',
    canonicalPath: '/',
  },
  '/overtime': {
    title: 'Use the No Tax on Overtime Calculator to Maximize Earnings',
    description: 'Use our No Tax on Overtime Calculator to estimate federal overtime deductions, understand FLSA overtime rules, plan take-home pay, and optimize tax strategy under 2025-2028 OBBBA limits.',
    keywords: 'Overtime Calculator',
    canonicalPath: '/overtime',
  },
  '/salary-calculator': {
    title: 'Salary Calculator - Convert Hourly, Monthly & Annual Pay',
    description: 'Use our Salary Calculator to convert hourly, weekly, monthly, and annual pay into clear income estimates for USA workers.',
    keywords: 'Salary calculator',
    canonicalPath: '/salary-calculator',
  },
  '/paycheck-calculator': {
    title: 'Salary Paycheck Calculator - Estimate Your Take-Home Pay',
    description: 'A Salary Paycheck Calculator estimates take-home pay after federal taxes, state taxes, FICA, and deductions. Enter salary, pay frequency, and filing status for a clear net pay estimate.',
    keywords: 'Paycheck Calculator',
    canonicalPath: '/paycheck-calculator',
  },
  '/states': {
    title: 'State Paycheck Calculators | OBBA',
    description: 'Choose a state paycheck calculator for Texas, Florida, California, Illinois, Washington, Indiana, Virginia, Hawaii, or Nebraska.',
    keywords: 'State paycheck calculators',
    canonicalPath: '/states',
  },
  '/texas-paycheck-calculator': {
    title: 'Texas Paycheck Calculator - Texas Pay Calculator & Take Home Pay',
    description: 'Estimate Texas take-home pay with federal withholding and FICA deductions, compare gross vs net income, and plan monthly payroll budget accurately.',
    keywords: 'Texas Paycheck Calculator',
    canonicalPath: '/texas-paycheck-calculator',
  },
  '/florida-paycheck-calculator': {
    title: 'Florida Paycheck Calculator - See Your Earnings Instantly',
    description: 'Estimate Florida paycheck net income instantly using federal tax withholding and FICA deductions, and plan monthly spending with accurate payroll projections.',
    keywords: 'Florida Paycheck Calculator',
    canonicalPath: '/florida-paycheck-calculator',
  },
  '/california-paycheck-calculator': {
    title: 'California Paycheck Calculator | Estimate Take-Home Pay',
    description: 'Use this California Paycheck Calculator to estimate your take-home pay after federal tax, California income tax, SDI, FICA, and payroll deductions.',
    keywords: 'California Paycheck Calculator',
    canonicalPath: '/california-paycheck-calculator',
  },
  '/illinois-paycheck-calculator': {
    title: 'Illinois Paycheck Calculator - Estimate Your Take-Home Pay',
    description: 'Use this Illinois Paycheck Calculator to estimate your take-home pay after federal tax, Illinois flat 4.95% state income tax, and FICA deductions.',
    keywords: 'Illinois Paycheck Calculator',
    canonicalPath: '/illinois-paycheck-calculator',
  },
  '/washington-paycheck-calculator': {
    title: 'Washington Paycheck Calculator - Complete Guide to Wages, Taxes, and Deductions',
    description: 'Use this Washington Paycheck Calculator guide to understand wages, taxes, deductions, net pay, and take-home pay.',
    keywords: 'Washington Paycheck Calculator',
    canonicalPath: '/washington-paycheck-calculator',
  },
  '/indiana-paycheck-calculator': {
    title: 'Indiana Paycheck Calculator - Estimate Your Take-Home Pay',
    description: 'Use this Indiana Paycheck Calculator to estimate your take-home pay after federal tax, Indiana flat 3.05% state income tax, and FICA deductions.',
    keywords: 'Indiana Paycheck Calculator',
    canonicalPath: '/indiana-paycheck-calculator',
  },
  '/virginia-paycheck-calculator': {
    title: 'Virginia Paycheck Calculator - Estimate Your Take-Home Pay',
    description: 'Use this Virginia Paycheck Calculator to estimate your take-home pay after federal tax, Virginia progressive state income tax, and FICA deductions.',
    keywords: 'Virginia Paycheck Calculator',
    canonicalPath: '/virginia-paycheck-calculator',
  },
  '/hawaii-paycheck-calculator': {
    title: 'Hawaii Paycheck Calculator - Estimate Your Take-Home Pay',
    description: 'Use this Hawaii Paycheck Calculator to estimate your take-home pay after federal tax, Hawaii progressive state income tax, and FICA deductions.',
    keywords: 'Hawaii Paycheck Calculator',
    canonicalPath: '/hawaii-paycheck-calculator',
  },
  '/nebraska-paycheck-calculator': {
    title: 'Nebraska Paycheck Calculator - Estimate Your Take-Home Pay',
    description: 'Use this Nebraska Paycheck Calculator to estimate your take-home pay after federal tax, Nebraska progressive state income tax, and FICA deductions.',
    keywords: 'Nebraska Paycheck Calculator',
    canonicalPath: '/nebraska-paycheck-calculator',
  },
  '/faq': {
    title: 'FAQ - OBBBA Tax Calculators',
    description: 'Read frequently asked questions for OBBBA Tax Calculators covering overtime, salary, paycheck, Texas, and Florida paycheck estimation workflows.',
    keywords: 'How to use calculators, paycheck calculator guide, frequently asked questions',
    canonicalPath: '/faq',
  },
  '/about-us': {
    title: 'About Us - OBBBA Tax Calculators',
    description: 'Learn about OBBBA Tax Calculators, our estimate methodology, active tools, SEO-focused resources, and planning scope for federal payroll calculations.',
    canonicalPath: '/about-us',
  },
  '/privacy-policy': {
    title: 'Privacy Policy - OBBBA Tax Calculators',
    description: 'Review the OBBBA Tax Calculators Privacy Policy explaining data use, security practices, calculator input handling, and privacy rights.',
    canonicalPath: '/privacy-policy',
  },
  '/terms-conditions': {
    title: 'Terms & Conditions - OBBBA Tax Calculators',
    description: 'Read Terms & Conditions for OBBBA Tax Calculators including estimate limitations, liability terms, acceptable use, and legal scope.',
    canonicalPath: '/terms-conditions',
  },
  '/contact-us': {
    title: 'Contact Us - OBBBA Tax Calculators',
    description: 'Contact OBBBA Tax Calculators for support, corrections, policy requests, and calculator feedback across overtime, salary, and paycheck tools.',
    canonicalPath: '/contact-us',
  },
  '/blogs': {
    title: 'Knowledge Hub - Tax Calculator Guides & Articles',
    description: 'Read guides on how to use tax calculators, understand payroll deductions, federal income tax brackets, and overtime calculations.',
    keywords: 'How to use calculators',
    canonicalPath: '/blogs',
    robots: 'noindex,follow',
  },
  ...Object.fromEntries(blogPosts.map((post) => [
    `/blogs/${post.slug}`,
    {
      title: `${post.title} | OBBA Calculators`,
      description: post.description,
      canonicalPath: `/blogs/${post.slug}`,
      robots: 'noindex,follow',
    },
  ])),
};

export const breadcrumbLabelsByPath = {
  '/': 'Home',
  '/overtime': 'No Tax on Overtime Calculator',
  '/salary-calculator': 'Salary Calculator',
  '/paycheck-calculator': 'Paycheck Calculator',
  '/states': 'State Paycheck Calculators',
  '/texas-paycheck-calculator': 'Texas Paycheck Calculator',
  '/florida-paycheck-calculator': 'Florida Paycheck Calculator',
  '/california-paycheck-calculator': 'California Paycheck Calculator',
  '/illinois-paycheck-calculator': 'Illinois Paycheck Calculator',
  '/washington-paycheck-calculator': 'Washington Paycheck Calculator',
  '/indiana-paycheck-calculator': 'Indiana Paycheck Calculator',
  '/virginia-paycheck-calculator': 'Virginia Paycheck Calculator',
  '/hawaii-paycheck-calculator': 'Hawaii Paycheck Calculator',
  '/nebraska-paycheck-calculator': 'Nebraska Paycheck Calculator',
  '/faq': 'FAQ',
  '/about-us': 'About Us',
  '/privacy-policy': 'Privacy Policy',
  '/terms-conditions': 'Terms & Conditions',
  '/contact-us': 'Contact Us',
  '/blogs': 'Knowledge Hub',
  ...Object.fromEntries(blogPosts.map((post) => [`/blogs/${post.slug}`, post.title])),
};
