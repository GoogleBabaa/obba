import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { blogs } from './blogData';

export default function BlogPost({ isDark }) {
  const { slug } = useParams();
  const post = blogs.find((b) => b.slug === slug);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | OBBA Calculators`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', post.excerpt);
  }, [post]);

  if (!post) return <Navigate to="/blogs" replace />;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link to="/blogs" className="text-sm text-cyan-400 hover:underline">← Back to Blogs</Link>
      </div>

      <article className={`rounded-3xl border p-6 sm:p-10 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{post.date}</p>
        <h1 className={`text-3xl font-bold mb-6 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>{post.title}</h1>

        <div
          className={`prose prose-sm max-w-none space-y-4 text-sm leading-relaxed
            ${isDark ? 'text-slate-300' : 'text-slate-700'}
          `}
          style={{ lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className={`mt-8 rounded-3xl border p-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>More Articles</h2>
        <div className="space-y-3">
          {blogs.filter((b) => b.slug !== slug).map((b) => (
            <Link
              key={b.slug}
              to={`/blogs/${b.slug}`}
              className={`block text-sm hover:text-cyan-400 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              → {b.title}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
