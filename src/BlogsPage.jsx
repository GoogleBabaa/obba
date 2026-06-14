import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogs } from './blogData';

export default function BlogsPage({ isDark }) {
  useEffect(() => {
    document.title = 'Knowledge Hub | OBBA Calculators';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Read articles and guides about paycheck taxes, salary planning, overtime rules, and take-home pay from OBBA Calculators.');
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Knowledge Hub</h1>
        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Guides and articles on paycheck taxes, salary planning, overtime rules, and take-home pay across the USA.
        </p>
      </article>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post) => (
          <Link
            key={post.slug}
            to={`/blogs/${post.slug}`}
            className={`group flex flex-col rounded-3xl border p-6 transition-colors ${
              isDark
                ? 'border-white/10 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/70'
                : 'border-slate-200 bg-white hover:border-cyan-400 hover:bg-slate-50'
            }`}
          >
            <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{post.date}</p>
            <h2 className={`text-lg font-semibold mb-3 leading-snug group-hover:text-cyan-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {post.title}
            </h2>
            <p className={`text-sm flex-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{post.excerpt}</p>
            <span className="mt-4 text-sm font-medium text-cyan-400">Read more →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
