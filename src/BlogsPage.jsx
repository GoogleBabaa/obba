import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from './blogData';

export default function BlogsPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Knowledge Hub
      </h1>
      <p className={`mb-8 text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        Guides for paycheck calculators, salary planning, federal withholding, and state-specific take-home pay.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className={`rounded-2xl border p-5 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}
          >
            <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Link to={`/blogs/${post.slug}`} className="hover:text-cyan-400">
                {post.title}
              </Link>
            </h2>
            <p className={`text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {post.description}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
