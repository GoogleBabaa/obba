import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogPostBySlug } from './blogData';

export default function BlogPost({ isDark }) {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <article className={`rounded-2xl border p-6 sm:p-8 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
        <Link to="/blogs" className="text-sm font-semibold text-cyan-500 hover:text-cyan-400">
          Back to Knowledge Hub
        </Link>
        <h1 className={`mt-4 text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {post.title}
        </h1>
        <p className={`mt-4 text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Learn how to estimate take-home pay, understand paycheck deductions, and use calculator results for practical planning.
        </p>

        <div className="mt-8 space-y-7">
          {post.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {heading}
              </h2>
              <p className={`leading-7 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {body}
              </p>
            </section>
          ))}
        </div>

        <div className={`mt-8 rounded-xl border p-5 ${isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Related Paycheck Calculators
          </h2>
          <Link to={post.calculatorPath} className="font-semibold text-cyan-500 hover:text-cyan-400">
            {post.calculatorLabel}
          </Link>
        </div>
      </article>
    </main>
  );
}
