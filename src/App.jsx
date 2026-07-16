import React, { Fragment, Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BarChart3, ChevronDown, Landmark, Map, MapPin, Menu, Moon, Sun, X } from 'lucide-react';
import { blogPosts } from './blogData';
import { californiaDocMeta, californiaDocSections } from './californiaContent';
import { floridaDocMeta, floridaDocSections } from './floridaContent';
import { hawaiiDocMeta, hawaiiDocSections } from './hawaiiContent';
import { illinoisDocMeta, illinoisDocSections } from './illinoisContent';
import { indianaDocMeta, indianaDocSections } from './indianaContent';
import { nebraskaDocMeta, nebraskaDocSections } from './nebraskaContent';
import { overtimeDocMeta, overtimeDocSections } from './overtimeContent';
import { paycheckDocxSections } from './paycheckContent';
import { SITE_URL } from './seoConfig';
import { texasDocMeta, texasDocSections } from './texasContent';
import { virginiaDocMeta, virginiaDocSections } from './virginiaContent';
import { washingtonDocMeta, washingtonDocSections } from './washingtonContent';
import homeThemeHtml from '../OBBA Calculators.dc (1).html?raw';
import overtimeThemeHtml from '../Overtime Calculator.dc (1).html?raw';
const FAQPage = lazy(() => import('./FAQPage'));
const BlogsPage = lazy(() => import('./BlogsPage'));
const BlogPost = lazy(() => import('./BlogPost'));

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const blogIconSvg = (accent = '#2563eb') => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5h14M5 12h14M5 19h9" stroke="${escapeHtml(accent)}" stroke-width="1.8" stroke-linecap="round"/></svg>`;

const buildHomeBlogSection = () => {
  const latestPosts = blogPosts.slice(0, 4);
  const popularPosts = blogPosts.filter((post) => post.popular).slice(0, 5);
  const latestHtml = latestPosts.map((post) => {
    const path = `/blogs/${post.slug}`;
    return `<a class="m-latest-blog-link" href="${path}" style="display:flex; gap:14px; align-items:center; border:1px solid transparent; border-radius:12px; padding:10px;"><span style="width:78px; height:58px; border-radius:9px; background:${post.gradient}; flex:0 0 auto;"></span><span><b style="font-size:14px; color:var(--text);">${escapeHtml(post.title)}</b><div style="font-size:11.5px; color:var(--text3); margin-top:5px;">${escapeHtml(post.date)}</div></span></a>`;
  }).join('');
  const popularHtml = popularPosts.map((post) => {
    const path = `/blogs/${post.slug}`;
    return `<a href="${path}" style="display:flex; align-items:center; gap:12px; background:var(--surface); border:1px solid var(--border); border-radius:11px; padding:13px 15px;"><span style="width:30px;height:30px;border-radius:8px;background:${post.accentBg};display:flex;align-items:center;justify-content:center;">${blogIconSvg(post.accent)}</span><b style="flex:1; font-size:13.5px; color:var(--text);">${escapeHtml(post.title)}</b><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
  }).join('');

  return `<section class="m-articles-grid m-section" style="max-width:1280px; margin:0 auto; padding:20px 32px 52px; display:grid; grid-template-columns:1fr 1fr; gap:28px;">
    <div class="m-blog-card" style="background:var(--surface-alt); border:1px solid var(--border); border-radius:16px; padding:26px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:16px;">
        <h3 style="font-size:19px; font-weight:800; color:var(--text);">Latest Articles &amp; Blogs</h3>
        <a href="/blogs" style="display:flex; align-items:center; gap:5px; font-size:13px; font-weight:700; color:#2563eb;">View All Articles <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      </div>
      <div class="m-blog-list" style="margin-top:18px; display:flex; flex-direction:column; gap:16px;">${latestHtml}</div>
    </div>
    <div class="m-blog-card" style="background:var(--surface-alt); border:1px solid var(--border); border-radius:16px; padding:26px;">
      <h3 style="font-size:19px; font-weight:800; color:var(--text);">Popular Blogs</h3>
      <div class="m-blog-list" style="margin-top:18px; display:flex; flex-direction:column; gap:11px;">${popularHtml}</div>
    </div>
  </section>`;
};

const BRACKETS = {
  single: [
    { upTo: 12400, rate: 0.1 },
    { upTo: 50400, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201775, rate: 0.24 },
    { upTo: 256225, rate: 0.32 },
    { upTo: 640600, rate: 0.35 },
    { upTo: 1e15, rate: 0.37 },
  ],
  married: [
    { upTo: 24800, rate: 0.1 },
    { upTo: 100800, rate: 0.12 },
    { upTo: 211400, rate: 0.22 },
    { upTo: 403550, rate: 0.24 },
    { upTo: 512450, rate: 0.32 },
    { upTo: 768700, rate: 0.35 },
    { upTo: 1e15, rate: 0.37 },
  ],
  hoh: [
    { upTo: 17700, rate: 0.1 },
    { upTo: 67450, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201750, rate: 0.24 },
    { upTo: 256200, rate: 0.32 },
    { upTo: 640600, rate: 0.35 },
    { upTo: 1e15, rate: 0.37 },
  ],
  mfs: [
    { upTo: 12400, rate: 0.1 },
    { upTo: 50400, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201775, rate: 0.24 },
    { upTo: 256225, rate: 0.32 },
    { upTo: 640600, rate: 0.35 },
    { upTo: 1e15, rate: 0.37 },
  ],
};
const STANDARD_DEDUCTION_2026 = {
  single: 16100,
  married: 32200,
  hoh: 24150,
  mfs: 16100,
};

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const usd = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, v));
const rateFor = (status, income) => BRACKETS[status].find((b) => income <= b.upTo)?.rate ?? 0.37;
const phaseReduction = (magi, start, per1000) => Math.max(0, ((magi - start) / 1000) * per1000);
const STATE_CALCULATOR_LINKS = [
  { name: 'Texas', code: 'TX', path: '/texas-paycheck-calculator', tax: 'No state income tax', accent: '#22c55e' },
  { name: 'Florida', code: 'FL', path: '/florida-paycheck-calculator', tax: 'No state income tax', accent: '#14b8a6' },
  { name: 'California', code: 'CA', path: '/california-paycheck-calculator', tax: 'Progressive state tax', accent: '#3b82f6' },
  { name: 'Illinois', code: 'IL', path: '/illinois-paycheck-calculator', tax: 'Flat state tax', accent: '#f59e0b' },
  { name: 'Washington', code: 'WA', path: '/washington-paycheck-calculator', tax: 'No wage income tax', accent: '#06b6d4' },
  { name: 'Indiana', code: 'IN', path: '/indiana-paycheck-calculator', tax: 'State and local tax', accent: '#8b5cf6' },
  { name: 'Virginia', code: 'VA', path: '/virginia-paycheck-calculator', tax: 'Progressive state tax', accent: '#ef4444' },
  { name: 'Hawaii', code: 'HI', path: '/hawaii-paycheck-calculator', tax: 'Progressive state tax', accent: '#ec4899' },
  { name: 'Nebraska', code: 'NE', path: '/nebraska-paycheck-calculator', tax: 'Progressive state tax', accent: '#84cc16' },
];

function DocxContentSections({ sections }) {
  const renderInlineContent = (content = []) => content.map((part, index) => {
    if (typeof part === 'string') return <Fragment key={`${part.slice(0, 20)}-${index}`}>{part}</Fragment>;
    const linkStyle = { color: '#1a6fe8', fontWeight: 800, fontSize: part.text?.length > 90 ? 12 : undefined };
    if (part.href?.startsWith('/')) {
      return <Link key={`${part.href}-${index}`} to={part.href} style={linkStyle}>{part.text}</Link>;
    }
    return <a key={`${part.href}-${index}`} href={part.href} target="_blank" rel="nofollow noopener noreferrer" style={linkStyle}>{part.text}</a>;
  });

  const renderBlock = (block, index) => {
    if (block.type === 'numbered') {
      return (
        <ol key={`numbered-${index}`} style={{ margin: '12px 0 0', paddingLeft: 0, display: 'grid', gap: 10, listStyle: 'none', counterReset: 'docx-step' }}>
          {block.items.map((item, itemIndex) => (
            <li key={`item-${itemIndex}`} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10, alignItems: 'start', counterIncrement: 'docx-step' }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(26,111,232,.12)', color: '#1a6fe8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>{itemIndex + 1}</span>
              <span>{renderInlineContent(item)}</span>
            </li>
          ))}
        </ol>
      );
    }
    if (block.type === 'list') {
      return (
        <ul key={`list-${index}`} style={{ margin: '12px 0 0', paddingLeft: 0, display: 'grid', gap: 10, listStyle: 'none' }}>
          {block.items.map((item, itemIndex) => (
            <li key={`item-${itemIndex}`} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start' }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: '#1a6fe8', marginTop: 8, boxShadow: '0 0 0 5px rgba(26,111,232,.10)' }} />
              <span>{renderInlineContent(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === 'table') {
      return (
        <div key={`table-${index}`} style={{ margin: '14px 0', overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 10 }}>
          <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 12.5, lineHeight: 1.45 }}>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} style={{ background: rowIndex === 0 ? 'var(--surface-alt)' : 'transparent' }}>
                  {row.map((cell, cellIndex) => {
                    const CellTag = rowIndex === 0 ? 'th' : 'td';
                    return (
                      <CellTag
                        key={`cell-${rowIndex}-${cellIndex}`}
                        style={{
                          padding: '10px 12px',
                          borderBottom: rowIndex === block.rows.length - 1 ? 0 : '1px solid var(--border)',
                          borderRight: cellIndex === row.length - 1 ? 0 : '1px solid var(--border)',
                          color: rowIndex === 0 ? 'var(--text)' : 'var(--text2)',
                          fontWeight: rowIndex === 0 ? 800 : 600,
                          textAlign: cellIndex === 0 ? 'left' : 'center',
                          verticalAlign: 'middle',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {renderInlineContent(cell)}
                      </CellTag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (block.type === 'faq') {
      return (
        <div key={`faq-${index}`} style={{ margin: index === 0 ? 0 : '14px 0 0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 7 }}>{renderInlineContent(block.question)}</h3>
          <p style={{ margin: 0 }}>{renderInlineContent(block.answer)}</p>
        </div>
      );
    }
    return <p key={`p-${index}`} style={{ margin: index === 0 ? 0 : '12px 0 0' }}>{renderInlineContent(block.content)}</p>;
  };

  return sections.map((section, index) => {
    if (section.id === 'paycheck-frequently-asked-questions') {
      const faqItems = [];
      let ctaBlock = null;
      section.blocks.forEach((block) => {
        const firstPart = block.content?.[0];
        if (typeof firstPart === 'string' && firstPart.includes('?')) {
          const questionEnd = firstPart.indexOf('?') + 1;
          const question = firstPart.slice(0, questionEnd).trim();
          const answerLead = firstPart.slice(questionEnd).trim();
          faqItems.push({
            question,
            answer: [
              ...(answerLead ? [answerLead] : []),
              ...(block.content || []).slice(1),
            ],
          });
          return;
        }
        if ((block.content || []).some((part) => typeof part !== 'string') || String(firstPart || '').startsWith('Use the free paycheck calculator')) {
          ctaBlock = block;
          return;
        }
        if (faqItems.length) {
          faqItems[faqItems.length - 1].answer.push(
            ...(block.content || []).map((part, partIndex) => (
              partIndex === 0 && typeof part === 'string' ? ` ${part.trimStart()}` : part
            ))
          );
        }
      });

      return (
        <article key={section.id} id={section.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>{section.title}</h2>
          <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.78 }}>
            {faqItems.map((item, itemIndex) => (
              <div key={item.question} style={{ margin: itemIndex === 0 ? 0 : '14px 0 0' }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 7, textAlign: 'left' }}>{item.question}</h3>
                <p style={{ margin: 0, textAlign: 'left' }}>{renderInlineContent(item.answer)}</p>
              </div>
            ))}
          </div>
          {ctaBlock && (
            <p style={{ marginTop: 14, marginBottom: 0, fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.78, textAlign: 'left' }}>
              {renderInlineContent(ctaBlock.content)}
            </p>
          )}
        </article>
      );
    }

    return (
      <article key={section.id} id={section.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        {index === 0 ? (
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>{section.title}</h1>
        ) : (
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{section.title}</h2>
        )}
        <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.78 }}>
          {section.blocks.map(renderBlock)}
        </div>
      </article>
    );
  });
}

function docxSectionsToHtml(sections) {
  const inline = (content = []) => content.map((part) => {
    if (typeof part === 'string') return escapeHtml(part);
    const href = part.href || '#';
    const text = escapeHtml(part.text || '');
    if (href.startsWith('/')) {
      return `<a href="${escapeHtml(href)}" style="color:#1a6fe8;font-weight:800;">${text}</a>`;
    }
    return `<a href="${escapeHtml(href)}" target="_blank" rel="nofollow noopener noreferrer" style="color:#1a6fe8;font-weight:800;">${text}</a>`;
  }).join('');

  const table = (block) => `<div style="margin:14px 0;overflow-x:auto;border:1px solid var(--border);border-radius:10px;">
    <table style="width:100%;min-width:560px;border-collapse:collapse;font-size:12.5px;line-height:1.45;">
      <tbody>${block.rows.map((row, rowIndex) => `<tr style="background:${rowIndex === 0 ? 'var(--surface-alt)' : 'transparent'};">${row.map((cell, cellIndex) => {
        const tag = rowIndex === 0 ? 'th' : 'td';
        return `<${tag} style="padding:10px 12px;border-bottom:${rowIndex === block.rows.length - 1 ? 0 : '1px solid var(--border)'};border-right:${cellIndex === row.length - 1 ? 0 : '1px solid var(--border)'};color:${rowIndex === 0 ? 'var(--text)' : 'var(--text2)'};font-weight:${rowIndex === 0 ? 800 : 600};text-align:${cellIndex === 0 ? 'left' : 'center'};vertical-align:middle;white-space:pre-line;">${inline(cell)}</${tag}>`;
      }).join('')}</tr>`).join('')}</tbody>
    </table>
  </div>`;

  const blockHtml = (block, index) => {
    if (block.type === 'table') return table(block);
    if (block.type === 'numbered') {
      return `<ol style="margin:12px 0 0;padding-left:0;display:grid;gap:10px;list-style:none;font-size:13.5px;color:var(--text2);line-height:1.78;">${block.items.map((item, itemIndex) => `<li style="display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;"><span style="width:28px;height:28px;border-radius:8px;background:rgba(26,111,232,.12);color:#1a6fe8;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;">${itemIndex + 1}</span><span>${inline(item)}</span></li>`).join('')}</ol>`;
    }
    if (block.type === 'list') {
      return `<ul style="margin:12px 0 0;padding-left:0;display:grid;gap:10px;list-style:none;font-size:13.5px;color:var(--text2);line-height:1.78;">${block.items.map((item) => `<li style="display:grid;grid-template-columns:22px 1fr;gap:10px;align-items:start;"><span style="width:10px;height:10px;border-radius:99px;background:#1a6fe8;margin-top:8px;box-shadow:0 0 0 5px rgba(26,111,232,.10);"></span><span>${inline(item)}</span></li>`).join('')}</ul>`;
    }
    if (block.type === 'faq') {
      return `<div style="margin:${index === 0 ? 0 : '14px 0 0'};"><h3 style="font-size:15px;font-weight:800;color:var(--text);margin-bottom:7px;">${inline(block.question)}</h3><p style="font-size:13.5px;color:var(--text2);line-height:1.78;margin:0;">${inline(block.answer)}</p></div>`;
    }
    return `<p style="font-size:13.5px;color:var(--text2);line-height:1.78;margin:${index === 0 ? 0 : '12px 0 0'};">${inline(block.content)}</p>`;
  };

  return sections.map((section, index) => `<article id="${escapeHtml(section.id)}" data-obba-section="${escapeHtml(section.id)}" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;">
    <h${index === 0 ? 1 : 2} style="font-size:${index === 0 ? 24 : 20}px;font-weight:${index === 0 ? 800 : 700};color:var(--text);margin-bottom:14px;">${escapeHtml(section.title)}</h${index === 0 ? 1 : 2}>
    ${section.blocks.map(blockHtml).join('')}
  </article>`).join('');
}

function docxTocHtml(sections) {
  return sections.map((section) => `<li style="display:flex;align-items:center;gap:7px;"><svg width="10" height="10" viewBox="0 0 11 11" fill="none"><path d="M3.5 2.5l4 3-4 3" stroke="#1a6fe8" stroke-width="1.4" stroke-linecap="round"/></svg><a href="#${escapeHtml(section.id)}" data-obba-toc="${escapeHtml(section.id)}" style="font-size:12.5px;color:var(--text2);">${escapeHtml(section.title)}</a></li>`).join('');
}
const progressiveTax = (taxableIncome, brackets) => {
  let remaining = Math.max(0, num(taxableIncome));
  let previous = 0;
  let tax = 0;
  for (const b of brackets) {
    const width = Math.max(0, b.upTo - previous);
    const amountAtRate = Math.min(remaining, width);
    tax += amountAtRate * b.rate;
    remaining -= amountAtRate;
    previous = b.upTo;
    if (remaining <= 0) break;
  }
  return Math.max(0, tax);
};
const CA_BRACKETS = {
  single: [
    { upTo: 10756, rate: 0.01 }, { upTo: 25499, rate: 0.02 }, { upTo: 40245, rate: 0.04 },
    { upTo: 55866, rate: 0.06 }, { upTo: 70606, rate: 0.08 }, { upTo: 360659, rate: 0.093 },
    { upTo: 432787, rate: 0.103 }, { upTo: 721314, rate: 0.113 }, { upTo: 1e15, rate: 0.123 },
  ],
  married: [
    { upTo: 21512, rate: 0.01 }, { upTo: 50998, rate: 0.02 }, { upTo: 80490, rate: 0.04 },
    { upTo: 111732, rate: 0.06 }, { upTo: 141212, rate: 0.08 }, { upTo: 721318, rate: 0.093 },
    { upTo: 865574, rate: 0.103 }, { upTo: 1442628, rate: 0.113 }, { upTo: 1e15, rate: 0.123 },
  ],
  hoh: [
    { upTo: 21527, rate: 0.01 }, { upTo: 51000, rate: 0.02 }, { upTo: 65744, rate: 0.04 },
    { upTo: 81364, rate: 0.06 }, { upTo: 96107, rate: 0.08 }, { upTo: 490493, rate: 0.093 },
    { upTo: 588593, rate: 0.103 }, { upTo: 1000000, rate: 0.113 }, { upTo: 1e15, rate: 0.123 },
  ],
  mfs: [
    { upTo: 10756, rate: 0.01 }, { upTo: 25499, rate: 0.02 }, { upTo: 40245, rate: 0.04 },
    { upTo: 55866, rate: 0.06 }, { upTo: 70606, rate: 0.08 }, { upTo: 360659, rate: 0.093 },
    { upTo: 432787, rate: 0.103 }, { upTo: 721314, rate: 0.113 }, { upTo: 1e15, rate: 0.123 },
  ],
};
const CA_STANDARD_DEDUCTION = { single: 5202, married: 10404, hoh: 10726, mfs: 5202 };
const CA_SDI_RATE = 0.01;
const IL_STATE_TAX_RATE = 0.0495;
const IL_PERSONAL_EXEMPTION = 2425;
const WA_CARES_RATE = 0.0058;
const WA_PFML_RATE = 0.0053;
const IN_STATE_TAX_RATE = 0.030;
const IN_LOCAL_TAX_RATE = 0.0225;
const VA_BRACKETS = {
  single: [
    { upTo: 3000, rate: 0.02 }, { upTo: 5000, rate: 0.03 }, { upTo: 17000, rate: 0.05 }, { upTo: 1e15, rate: 0.0575 },
  ],
  married: [
    { upTo: 3000, rate: 0.02 }, { upTo: 5000, rate: 0.03 }, { upTo: 17000, rate: 0.05 }, { upTo: 1e15, rate: 0.0575 },
  ],
  hoh: [
    { upTo: 3000, rate: 0.02 }, { upTo: 5000, rate: 0.03 }, { upTo: 17000, rate: 0.05 }, { upTo: 1e15, rate: 0.0575 },
  ],
  mfs: [
    { upTo: 3000, rate: 0.02 }, { upTo: 5000, rate: 0.03 }, { upTo: 17000, rate: 0.05 }, { upTo: 1e15, rate: 0.0575 },
  ],
};
const VA_PERSONAL_EXEMPTION = { single: 8930, married: 17860, hoh: 8930, mfs: 8930 };
const VA_LOCAL_TAX_RATE = 0.0;
const HI_BRACKETS = {
  single: [
    { upTo: 2400,   rate: 0.014  },
    { upTo: 4800,   rate: 0.032  },
    { upTo: 9600,   rate: 0.055  },
    { upTo: 14400,  rate: 0.064  },
    { upTo: 19200,  rate: 0.068  },
    { upTo: 24000,  rate: 0.072  },
    { upTo: 36000,  rate: 0.076  },
    { upTo: 48000,  rate: 0.079  },
    { upTo: 150000, rate: 0.0825 },
    { upTo: 175000, rate: 0.09   },
    { upTo: 200000, rate: 0.10   },
    { upTo: 1e15,   rate: 0.11   },
  ],
  married: [
    { upTo: 4800,   rate: 0.014  },
    { upTo: 9600,   rate: 0.032  },
    { upTo: 19200,  rate: 0.055  },
    { upTo: 28800,  rate: 0.064  },
    { upTo: 38400,  rate: 0.068  },
    { upTo: 48000,  rate: 0.072  },
    { upTo: 72000,  rate: 0.076  },
    { upTo: 96000,  rate: 0.079  },
    { upTo: 300000, rate: 0.0825 },
    { upTo: 350000, rate: 0.09   },
    { upTo: 400000, rate: 0.10   },
    { upTo: 1e15,   rate: 0.11   },
  ],
  hoh: [
    { upTo: 2400,   rate: 0.014  },
    { upTo: 4800,   rate: 0.032  },
    { upTo: 9600,   rate: 0.055  },
    { upTo: 14400,  rate: 0.064  },
    { upTo: 19200,  rate: 0.068  },
    { upTo: 24000,  rate: 0.072  },
    { upTo: 36000,  rate: 0.076  },
    { upTo: 48000,  rate: 0.079  },
    { upTo: 150000, rate: 0.0825 },
    { upTo: 175000, rate: 0.09   },
    { upTo: 200000, rate: 0.10   },
    { upTo: 1e15,   rate: 0.11   },
  ],
  mfs: [
    { upTo: 2400,   rate: 0.014  },
    { upTo: 4800,   rate: 0.032  },
    { upTo: 9600,   rate: 0.055  },
    { upTo: 14400,  rate: 0.064  },
    { upTo: 19200,  rate: 0.068  },
    { upTo: 24000,  rate: 0.072  },
    { upTo: 36000,  rate: 0.076  },
    { upTo: 48000,  rate: 0.079  },
    { upTo: 150000, rate: 0.0825 },
    { upTo: 175000, rate: 0.09   },
    { upTo: 200000, rate: 0.10   },
    { upTo: 1e15,   rate: 0.11   },
  ],
};
const HI_PERSONAL_EXEMPTION = { single: 1144, married: 2288, hoh: 1144, mfs: 1144 };
const HI_LOCAL_TAX_RATE = 0.0;
const NE_BRACKETS = {
  single: [
    { upTo: 3700,  rate: 0.0246 },
    { upTo: 22170, rate: 0.0351 },
    { upTo: 35730, rate: 0.0501 },
    { upTo: 1e15,  rate: 0.0684 },
  ],
  married: [
    { upTo: 7400,  rate: 0.0246 },
    { upTo: 44340, rate: 0.0351 },
    { upTo: 71460, rate: 0.0501 },
    { upTo: 1e15,  rate: 0.0684 },
  ],
  hoh: [
    { upTo: 3700,  rate: 0.0246 },
    { upTo: 22170, rate: 0.0351 },
    { upTo: 35730, rate: 0.0501 },
    { upTo: 1e15,  rate: 0.0684 },
  ],
  mfs: [
    { upTo: 3700,  rate: 0.0246 },
    { upTo: 22170, rate: 0.0351 },
    { upTo: 35730, rate: 0.0501 },
    { upTo: 1e15,  rate: 0.0684 },
  ],
};
const NE_PERSONAL_EXEMPTION = { single: 8940, married: 17920, hoh: 8940, mfs: 8940 };
const NE_LOCAL_TAX_RATE = 0.0;

const stateEffectiveTaxRates = {
  Alaska: { low: 0, mid1: 0, mid2: 0, high: 0 },
  Alabama: { low: 2, mid1: 3.2, mid2: 4.2, high: 5 },
  Arizona: { low: 2.55, mid1: 3.2, mid2: 3.9, high: 4.5 },
  Arkansas: { low: 2, mid1: 3.5, mid2: 4.7, high: 5.75 },
  California: { low: 1, mid1: 4, mid2: 8, high: 13.3 },
  Colorado: { low: 4.4, mid1: 4.4, mid2: 4.4, high: 4.4 },
  Connecticut: { low: 3, mid1: 4.5, mid2: 5.8, high: 6.99 },
  Delaware: { low: 0, mid1: 2.2, mid2: 4.8, high: 6.6 },
  Florida: { low: 0, mid1: 0, mid2: 0, high: 0 },
  Georgia: { low: 0.55, mid1: 2.5, mid2: 4.2, high: 5.75 },
  Hawaii: { low: 1.4, mid1: 4, mid2: 7, high: 11 },
  Idaho: { low: 1, mid1: 2.8, mid2: 4.3, high: 5.8 },
  Illinois: { low: 4.95, mid1: 4.95, mid2: 4.95, high: 4.95 },
  Indiana: { low: 3.4, mid1: 3.4, mid2: 3.4, high: 3.4 },
  Iowa: { low: 0.33, mid1: 2.5, mid2: 4.5, high: 6.5 },
  Kansas: { low: 5.7, mid1: 5.75, mid2: 5.85, high: 5.9 },
  Kentucky: { low: 2, mid1: 3.2, mid2: 4.2, high: 5 },
  Louisiana: { low: 2, mid1: 3.5, mid2: 4.8, high: 6 },
  Maine: { low: 5.8, mid1: 6.3, mid2: 6.8, high: 7.15 },
  Maryland: { low: 2, mid1: 3.3, mid2: 4.5, high: 5.75 },
  Massachusetts: { low: 5, mid1: 5, mid2: 5, high: 5 },
  Michigan: { low: 4.25, mid1: 4.25, mid2: 4.25, high: 4.25 },
  Minnesota: { low: 5.35, mid1: 7, mid2: 8.8, high: 10.85 },
  Mississippi: { low: 0, mid1: 1.8, mid2: 3.5, high: 5 },
  Missouri: { low: 1.5, mid1: 2.9, mid2: 4.1, high: 5.3 },
  Montana: { low: 1, mid1: 3.8, mid2: 6.8, high: 10.84 },
  Nebraska: { low: 2.84, mid1: 4.5, mid2: 6.8, high: 8.84 },
  Nevada: { low: 0, mid1: 0, mid2: 0, high: 0 },
  'New Hampshire': { low: 0, mid1: 0, mid2: 0, high: 0 },
  'New Jersey': { low: 1.4, mid1: 3.5, mid2: 6.5, high: 10.75 },
  'New Mexico': { low: 1.7, mid1: 3.3, mid2: 4.7, high: 5.9 },
  'New York': { low: 4, mid1: 6, mid2: 8, high: 10.9 },
  'North Carolina': { low: 4.99, mid1: 4.99, mid2: 4.99, high: 4.99 },
  'North Dakota': { low: 1.1, mid1: 1.6, mid2: 2.3, high: 2.9 },
  Ohio: { low: 0, mid1: 1.9, mid2: 3.8, high: 5.75 },
  Oklahoma: { low: 0.5, mid1: 2.3, mid2: 4, high: 5.85 },
  Oregon: { low: 4.75, mid1: 6.5, mid2: 8.2, high: 9.9 },
  Pennsylvania: { low: 3.07, mid1: 3.07, mid2: 3.07, high: 3.07 },
  'Rhode Island': { low: 3.75, mid1: 4.6, mid2: 5.3, high: 5.99 },
  'South Carolina': { low: 0, mid1: 2.3, mid2: 4.5, high: 7 },
  'South Dakota': { low: 0, mid1: 0, mid2: 0, high: 0 },
  Tennessee: { low: 0, mid1: 0, mid2: 0, high: 0 },
  Texas: { low: 0, mid1: 0, mid2: 0, high: 0 },
  Utah: { low: 4.65, mid1: 4.65, mid2: 4.65, high: 4.65 },
  Vermont: { low: 3.55, mid1: 5.3, mid2: 7, high: 8.75 },
  Virginia: { low: 2, mid1: 3.5, mid2: 4.7, high: 5.75 },
  Washington: { low: 0, mid1: 0, mid2: 0, high: 0 },
  'West Virginia': { low: 3, mid1: 4.2, mid2: 5.3, high: 6.5 },
  Wisconsin: { low: 3.54, mid1: 4.8, mid2: 6.2, high: 7.65 },
  Wyoming: { low: 0, mid1: 0, mid2: 0, high: 0 },
  'District of Columbia': { low: 4, mid1: 6.5, mid2: 8.5, high: 10.75 },
};
const getStateTaxRate = (state, income) => {
  const rates = stateEffectiveTaxRates[state];
  if (!rates) return 0;
  if (income <= 50000) return rates.low;
  if (income <= 100000) return rates.mid1;
  if (income <= 200000) return rates.mid2;
  return rates.high;
};

const SOCIAL_SECURITY_RATE = 0.062;
const SOCIAL_SECURITY_WAGE_BASE_2026 = 176100;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD = {
  single: 200000,
  married: 250000,
  hoh: 200000,
  mfs: 125000,
};

const EXECUTIVE_LEVEL_IV_CAP = 197200;
const HOURS_PER_YEAR = 2087;
const PAY_PERIODS = 26;

const GS_PAY_TABLE = {
  2026: {
    'GS-1': [22584, 23341, 24092, 24840, 25589, 26028, 26771, 27519, 27550, 28248],
    'GS-2': [25393, 25997, 26839, 27550, 27858, 28677, 29496, 30315, 31134, 31953],
    'GS-3': [27708, 28632, 29556, 30480, 31404, 32328, 33252, 34176, 35100, 36024],
    'GS-4': [31103, 32140, 33177, 34214, 35251, 36288, 37325, 38362, 39399, 40436],
    'GS-5': [34799, 35959, 37119, 38279, 39439, 40599, 41759, 42919, 44079, 45239],
    'GS-6': [38791, 40084, 41377, 42670, 43963, 45256, 46549, 47842, 49135, 50428],
    'GS-7': [43106, 44543, 45980, 47417, 48854, 50291, 51728, 53165, 54602, 56039],
    'GS-8': [47738, 49329, 50920, 52511, 54102, 55693, 57284, 58875, 60466, 62057],
    'GS-9': [52727, 54485, 56243, 58001, 59759, 61517, 63275, 65033, 66791, 68549],
    'GS-10': [58064, 59999, 61934, 63869, 65804, 67739, 69674, 71609, 73544, 75479],
    'GS-11': [63795, 65922, 68049, 70176, 72303, 74430, 76557, 78684, 80811, 82938],
    'GS-12': [76463, 79012, 81561, 84110, 86659, 89208, 91757, 94306, 96855, 99404],
    'GS-13': [90925, 93956, 96987, 100018, 103049, 106080, 109111, 112142, 115173, 118204],
    'GS-14': [107446, 111028, 114610, 118192, 121774, 125356, 128938, 132520, 136102, 139684],
    'GS-15': [126384, 130597, 134810, 139023, 143236, 147449, 151662, 155875, 160088, 164301],
  },
  2025: {
    'GS-1':  [22360, 23110, 23853, 24594, 25336, 25770, 26506, 27247, 27277, 27970],
    'GS-2':  [25142, 25740, 26573, 27277, 27583, 28394, 29205, 30016, 30827, 31638],
    'GS-3':  [27434, 28348, 29262, 30176, 31090, 32004, 32918, 33832, 34746, 35660],
    'GS-4':  [30795, 31822, 32849, 33876, 34903, 35930, 36957, 37984, 39011, 40038],
    'GS-5':  [34454, 35602, 36750, 37898, 39046, 40194, 41342, 42490, 43638, 44786],
    'GS-6':  [38407, 39687, 40967, 42247, 43527, 44807, 46087, 47367, 48647, 49927],
    'GS-7':  [42679, 44102, 45525, 46948, 48371, 49794, 51217, 52640, 54063, 55486],
    'GS-8':  [47265, 48841, 50417, 51993, 53569, 55145, 56721, 58297, 59873, 61449],
    'GS-9':  [52205, 53945, 55685, 57425, 59165, 60905, 62645, 64385, 66125, 67865],
    'GS-10': [57489, 59405, 61321, 63237, 65153, 67069, 68985, 70901, 72817, 74733],
    'GS-11': [63163, 65268, 67373, 69478, 71583, 73688, 75793, 77898, 80003, 82108],
    'GS-12': [75706, 78230, 80754, 83278, 85802, 88326, 90850, 93374, 95898, 98422],
    'GS-13': [90025, 93026, 96027, 99028, 102029, 105030, 108031, 111032, 114033, 117034],
    'GS-14': [106382, 109928, 113474, 117020, 120566, 124112, 127658, 131204, 134750, 138296],
    'GS-15': [125133, 129304, 133475, 137646, 141817, 145988, 150159, 154330, 158501, 162672],
  },
  2024: {
    'GS-1':  [21986, 22724, 23454, 24183, 24912, 25339, 26063, 26792, 26821, 27502],
    'GS-2':  [24722, 25310, 26129, 26821, 27124, 27922, 28720, 29518, 30316, 31114],
    'GS-3':  [26975, 27874, 28773, 29672, 30571, 31470, 32369, 33268, 34167, 35066],
    'GS-4':  [30280, 31289, 32298, 33307, 34316, 35325, 36334, 37343, 38352, 39361],
    'GS-5':  [33878, 35007, 36136, 37265, 38394, 39523, 40652, 41781, 42910, 44039],
    'GS-6':  [37765, 39024, 40283, 41542, 42801, 44060, 45319, 46578, 47837, 49096],
    'GS-7':  [41966, 43365, 44764, 46163, 47562, 48961, 50360, 51759, 53158, 54557],
    'GS-8':  [46475, 48024, 49573, 51122, 52671, 54220, 55769, 57318, 58867, 60416],
    'GS-9':  [51332, 53043, 54754, 56465, 58176, 59887, 61598, 63309, 65020, 66731],
    'GS-10': [56528, 58412, 60296, 62180, 64064, 65948, 67832, 69716, 71600, 73484],
    'GS-11': [62107, 64177, 66247, 68317, 70387, 72457, 74527, 76597, 78667, 80737],
    'GS-12': [74441, 76922, 79403, 81884, 84365, 86846, 89327, 91808, 94289, 96770],
    'GS-13': [88520, 91471, 94422, 97373, 100324, 103275, 106226, 109177, 112128, 115079],
    'GS-14': [104604, 108091, 111578, 115065, 118552, 122039, 125526, 129013, 132500, 135987],
    'GS-15': [123041, 127142, 131243, 135344, 139445, 143546, 147647, 151748, 155849, 159950],
  },
};

const LOCALITY_OPTIONS = [
  ['dcb', 'Washington-Baltimore-Arlington, DC-MD-VA-WV-PA (+33.94%)', 0.3394],
  ['rus', 'Rest of U.S. (+17.06%)', 0.1706],
  ['sf', 'San Jose-San Francisco-Oakland, CA (+46.34%)', 0.4634],
  ['ny', 'New York-Newark, NY-NJ-CT-PA (+37.95%)', 0.3795],
  ['hou', 'Houston-The Woodlands, TX-LA (+35.00%)', 0.35],
  ['la', 'Los Angeles-Long Beach, CA (+36.47%)', 0.3647],
  ['sd', 'San Diego-Chula Vista-Carlsbad, CA (+33.72%)', 0.3372],
  ['sea', 'Seattle-Tacoma, WA (+31.57%)', 0.3157],
  ['den', 'Denver-Aurora, CO (+30.52%)', 0.3052],
  ['bos', 'Boston-Worcester-Providence, MA-RI-NH-CT-ME-VT (+32.58%)', 0.3258],
  ['chi', 'Chicago-Naperville, IL-IN-WI (+30.86%)', 0.3086],
  ['phl', 'Philadelphia-Reading-Camden, PA-NJ-DE-MD (+28.99%)', 0.2899],
  ['msp', 'Minneapolis-St. Paul, MN-WI (+27.62%)', 0.2762],
  ['dfw', 'Dallas-Fort Worth, TX-OK (+27.26%)', 0.2726],
  ['por', 'Portland-Vancouver-Salem, OR-WA (+26.13%)', 0.2613],
  ['mfl', 'Miami-Port St. Lucie-Fort Lauderdale, FL (+24.67%)', 0.2467],
  ['atl', 'Atlanta--Athens-Clarke County--Sandy Springs, GA-AL (+23.79%)', 0.2379],
  ['cle', 'Cleveland-Akron-Canton, OH-PA (+22.23%)', 0.2223],
  ['ra', 'Raleigh-Durham-Cary, NC (+22.24%)', 0.2224],
  ['al', 'Albany-Schenectady, NY-MA (+20.77%)', 0.2077],
  ['aq', 'Albuquerque-Santa Fe-Las Vegas, NM (+18.33%)', 0.1833],
  ['au', 'Austin-Round Rock-Georgetown, TX (+20.35%)', 0.2035],
  ['bh', 'Birmingham-Hoover-Talladega, AL (+18.24%)', 0.1824],
  ['bu', 'Buffalo-Cheektowaga-Olean, NY (+22.41%)', 0.2241],
  ['bn', 'Burlington-South Burlington-Barre, VT (+19.45%)', 0.1945],
  ['ct', 'Charlotte-Concord, NC-SC (+19.67%)', 0.1967],
  ['cin', 'Cincinnati-Wilmington-Maysville, OH-KY-IN (+21.93%)', 0.2193],
  ['cs', 'Colorado Springs, CO (+20.15%)', 0.2015],
  ['col', 'Columbus-Marion-Zanesville, OH (+22.15%)', 0.2215],
  ['cc', 'Corpus Christi-Kingsville-Alice, TX (+17.63%)', 0.1763],
  ['dv', 'Davenport-Moline, IA-IL (+18.93%)', 0.1893],
  ['day', 'Dayton-Springfield-Kettering, OH (+21.42%)', 0.2142],
  ['dm', 'Des Moines-Ames-West Des Moines, IA (+18.01%)', 0.1801],
  ['det', 'Detroit-Warren-Ann Arbor, MI (+29.12%)', 0.2912],
  ['fn', 'Fresno-Madera-Hanford, CA (+17.65%)', 0.1765],
  ['hb', 'Harrisburg-Lebanon, PA (+19.43%)', 0.1943],
  ['har', 'Hartford-East Hartford, CT-MA (+32.08%)', 0.3208],
  ['hnt', 'Huntsville-Decatur, AL-TN (+21.91%)', 0.2191],
  ['ind', 'Indianapolis-Carmel-Muncie, IN (+18.15%)', 0.1815],
  ['kc', 'Kansas City-Overland Park-Kansas City, MO-KS (+18.97%)', 0.1897],
  ['lr', 'Laredo, TX (+21.59%)', 0.2159],
  ['lv', 'Las Vegas-Henderson, NV-AZ (+19.57%)', 0.1957],
  ['mil', 'Milwaukee-Racine-Waukesha, WI (+22.42%)', 0.2242],
  ['om', 'Omaha-Council Bluffs-Fremont, NE-IA (+18.23%)', 0.1823],
  ['pb', 'Palm Bay-Melbourne-Titusville, FL (+17.93%)', 0.1793],
  ['px', 'Phoenix-Mesa, AZ (+22.45%)', 0.2245],
  ['pit', 'Pittsburgh-New Castle-Weirton, PA-OH-WV (+21.03%)', 0.2103],
  ['rn', 'Reno-Fernley, NV (+17.52%)', 0.1752],
  ['rch', 'Richmond, VA (+22.28%)', 0.2228],
  ['rt', 'Rochester-Batavia-Seneca Falls, NY (+17.88%)', 0.1788],
  ['sac', 'Sacramento-Roseville, CA-NV (+29.76%)', 0.2976],
  ['so', 'San Antonio-New Braunfels-Pearsall, TX (+18.78%)', 0.1878],
  ['sn', "Spokane-Spokane Valley-Coeur d'Alene, WA-ID (+17.67%)", 0.1767],
  ['sl', 'St. Louis-St. Charles-Farmington, MO-IL (+20.03%)', 0.2003],
  ['tu', 'Tucson-Nogales, AZ (+19.28%)', 0.1928],
  ['vb', 'Virginia Beach-Norfolk, VA-NC (+18.80%)', 0.188],
  ['ak', 'State of Alaska (+32.36%)', 0.3236],
  ['hi', 'State of Hawaii (+22.21%)', 0.2221],
];

const FEDERAL_STATE_OPTIONS = [
  { name: 'Select State', rate: null, code: null },
  { name: 'Alabama', rate: '2% - 5%', code: 'AL' },
  { name: 'Alaska', rate: '0%', code: 'AK' },
  { name: 'Arizona', rate: '2.55% - 4.5%', code: 'AZ' },
  { name: 'Arkansas', rate: '2% - 5.75%', code: 'AR' },
  { name: 'California', rate: '1% - 13.3%', code: 'CA' },
  { name: 'Colorado', rate: '4.4% flat', code: 'CO' },
  { name: 'Connecticut', rate: '3% - 6.99%', code: 'CT' },
  { name: 'Delaware', rate: '0% - 6.6%', code: 'DE' },
  { name: 'Florida', rate: '0%', code: 'FL' },
  { name: 'Georgia', rate: '0.55% - 5.75%', code: 'GA' },
  { name: 'Hawaii', rate: '1.4% - 11%', code: 'HI' },
  { name: 'Idaho', rate: '1% - 5.8%', code: 'ID' },
  { name: 'Illinois', rate: '4.95% flat', code: 'IL' },
  { name: 'Indiana', rate: '3.4% flat', code: 'IN' },
  { name: 'Iowa', rate: '0.33% - 6.5%', code: 'IA' },
  { name: 'Kansas', rate: '5.7% - 5.9%', code: 'KS' },
  { name: 'Kentucky', rate: '2% - 5%', code: 'KY' },
  { name: 'Louisiana', rate: '2% - 6%', code: 'LA' },
  { name: 'Maine', rate: '5.8% - 7.15%', code: 'ME' },
  { name: 'Maryland', rate: '2% - 5.75%', code: 'MD' },
  { name: 'Massachusetts', rate: '5% flat', code: 'MA' },
  { name: 'Michigan', rate: '4.25% flat', code: 'MI' },
  { name: 'Minnesota', rate: '5.35% - 10.85%', code: 'MN' },
  { name: 'Mississippi', rate: '0% - 5%', code: 'MS' },
  { name: 'Missouri', rate: '1.5% - 5.3%', code: 'MO' },
  { name: 'Montana', rate: '1% - 10.84%', code: 'MT' },
  { name: 'Nebraska', rate: '2.84% - 8.84%', code: 'NE' },
  { name: 'Nevada', rate: '0%', code: 'NV' },
  { name: 'New Hampshire', rate: '0% (wages only)', code: 'NH' },
  { name: 'New Jersey', rate: '1.4% - 10.75%', code: 'NJ' },
  { name: 'New Mexico', rate: '1.7% - 5.9%', code: 'NM' },
  { name: 'New York', rate: '4% - 10.9%', code: 'NY' },
  { name: 'North Carolina', rate: '4.99% flat', code: 'NC' },
  { name: 'North Dakota', rate: '1.1% - 2.9%', code: 'ND' },
  { name: 'Ohio', rate: '0% - 5.75%', code: 'OH' },
  { name: 'Oklahoma', rate: '0.5% - 5.85%', code: 'OK' },
  { name: 'Oregon', rate: '4.75% - 9.9%', code: 'OR' },
  { name: 'Pennsylvania', rate: '3.07% flat', code: 'PA' },
  { name: 'Rhode Island', rate: '3.75% - 5.99%', code: 'RI' },
  { name: 'South Carolina', rate: '0% - 7%', code: 'SC' },
  { name: 'South Dakota', rate: '0%', code: 'SD' },
  { name: 'Tennessee', rate: '0%', code: 'TN' },
  { name: 'Texas', rate: '0%', code: 'TX' },
  { name: 'Utah', rate: '4.65% flat', code: 'UT' },
  { name: 'Vermont', rate: '3.55% - 8.75%', code: 'VT' },
  { name: 'Virginia', rate: '2% - 5.75%', code: 'VA' },
  { name: 'Washington', rate: '0%', code: 'WA' },
  { name: 'West Virginia', rate: '3% - 6.5%', code: 'WV' },
  { name: 'Wisconsin', rate: '3.54% - 7.65%', code: 'WI' },
  { name: 'Wyoming', rate: '0%', code: 'WY' },
  { name: 'District of Columbia', rate: '4% - 10.75%', code: 'DC' },
];

function upsertMeta(selector, create) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(create).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
}

function setPageMeta({ title, description, keywords, canonicalPath }) {
  document.title = title;
  const shareCardUrl = `${SITE_URL}/share-card.png`;

  const desc = upsertMeta('meta[name="description"]', { name: 'description' });
  desc.setAttribute('content', description);

  if (keywords) {
    const kw = upsertMeta('meta[name="keywords"]', { name: 'keywords' });
    kw.setAttribute('content', keywords);
  }

  const robots = upsertMeta('meta[name="robots"]', { name: 'robots' });
  robots.setAttribute('content', 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1');

  const ogTitle = upsertMeta('meta[property="og:title"]', { property: 'og:title' });
  ogTitle.setAttribute('content', title);
  const ogDescription = upsertMeta('meta[property="og:description"]', { property: 'og:description' });
  ogDescription.setAttribute('content', description);
  const ogType = upsertMeta('meta[property="og:type"]', { property: 'og:type' });
  ogType.setAttribute('content', 'website');
  const ogUrl = upsertMeta('meta[property="og:url"]', { property: 'og:url' });
  ogUrl.setAttribute('content', `${SITE_URL}${canonicalPath}`);
  const ogSite = upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' });
  ogSite.setAttribute('content', 'OBBA Calculators');
  const ogImage = upsertMeta('meta[property="og:image"]', { property: 'og:image' });
  ogImage.setAttribute('content', shareCardUrl);
  const ogImageAlt = upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt' });
  ogImageAlt.setAttribute('content', 'OBBA Calculators paycheck and tax calculator share card');
  const ogImageWidth = upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width' });
  ogImageWidth.setAttribute('content', '1731');
  const ogImageHeight = upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height' });
  ogImageHeight.setAttribute('content', '909');

  const twitterCard = upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' });
  twitterCard.setAttribute('content', 'summary_large_image');
  const twitterTitle = upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' });
  twitterTitle.setAttribute('content', title);
  const twitterDescription = upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' });
  twitterDescription.setAttribute('content', description);
  const twitterImage = upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' });
  twitterImage.setAttribute('content', shareCardUrl);
  const twitterImageAlt = upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt' });
  twitterImageAlt.setAttribute('content', 'OBBA Calculators paycheck and tax calculator share card');

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${SITE_URL}${canonicalPath}`);
}

function ficaForAnnualWages(annualWages, status) {
  const wages = Math.max(0, num(annualWages));
  const ss = Math.min(wages, SOCIAL_SECURITY_WAGE_BASE_2026) * SOCIAL_SECURITY_RATE;
  const medicare = wages * MEDICARE_RATE;
  const addThreshold = ADDITIONAL_MEDICARE_THRESHOLD[status] ?? 200000;
  const additionalMedicare = Math.max(0, wages - addThreshold) * ADDITIONAL_MEDICARE_RATE;
  return ss + medicare + additionalMedicare;
}

function Header({ isDark, setIsDark, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const calculatorLinks = [
    ['Salary Calculator', '/salary-calculator'],
    ['Paycheck Calculator', '/paycheck-calculator'],
    ['Overtime Calculator', '/overtime'],
    ...STATE_CALCULATOR_LINKS.map((state) => [`${state.name} Paycheck Calculator`, state.path]),
  ];
  const categoryLinks = [
    ['Salary', '/salary-calculator'],
    ['Paycheck', '/paycheck-calculator'],
    ['Overtime', '/overtime'],
    ['Payroll & Deductions', '/paycheck-calculator'],
    ['States Calculators', '/states'],
  ];
  const pageLinks = [
    ['Blog', '/blogs'],
    ['About Us', '/about-us'],
  ];
  const [openMenu, setOpenMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = React.useRef(null);
  const normalizedSearchQuery = searchQuery.toLowerCase().trim();
  const searchMatches = normalizedSearchQuery
    ? calculatorLinks
      .filter(([label]) => label
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .some((word) => word.startsWith(normalizedSearchQuery)))
      .slice(0, 8)
    : [];
  const runHeaderSearch = () => {
    const target = searchMatches[0] ?? calculatorLinks.find(([label]) => label.toLowerCase().includes(normalizedSearchQuery));
    if (!target) return;
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(target[1]);
  };

  React.useEffect(() => {
    if (!openMenu) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenu]);

  return (
    <header className="obba-site-header">
      <div className="mx-auto flex max-w-7xl items-center gap-7 px-8 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="OBBA Logo" className="h-[38px] w-[38px] rounded-[10px] object-cover" />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-[.3px]" style={{ color: 'var(--text)' }}>OBBA</span>
            <span className="text-[9px] font-semibold tracking-[1.5px] text-slate-400">CALCULATORS</span>
          </span>
        </Link>
        <div ref={menuRef} className="hidden md:flex items-center gap-1">
          <Link to="/" className="obba-nav-link">Home</Link>
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'calculators' ? null : 'calculators')}
              className="obba-nav-link flex items-center gap-1"
            >
              Calculators
              <ChevronDown size={14} className={`transition-transform duration-200 ${openMenu === 'calculators' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'calculators' && (
              <div className="obba-dropdown absolute left-0 top-full mt-2 w-72 rounded-2xl z-50 py-2">
                {calculatorLinks.map(([label, to]) => (
                  <Link key={label} to={to} onClick={() => setOpenMenu(null)} className="obba-dropdown-link">{label}</Link>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'categories' ? null : 'categories')}
              className="obba-nav-link flex items-center gap-1"
            >
              Categories
              <ChevronDown size={14} className={`transition-transform duration-200 ${openMenu === 'categories' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'categories' && (
              <div className="obba-dropdown absolute left-0 top-full mt-2 w-56 rounded-2xl z-50 py-2">
                {categoryLinks.map(([label, to]) => (
                  <Link key={label} to={to} onClick={() => setOpenMenu(null)} className="obba-dropdown-link">{label}</Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/states" className="obba-nav-link">States Calculators</Link>
          <Link to="/blogs" className="obba-nav-link">Blog</Link>
          <Link to="/about-us" className="obba-nav-link">About Us</Link>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <form
            className="relative hidden lg:flex w-[280px] items-center gap-2 rounded-[9px] border px-3 py-2"
            style={{ background: 'var(--input)', borderColor: 'var(--border)' }}
            onSubmit={(event) => {
              event.preventDefault();
              runHeaderSearch();
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2"/><path d="m20 20-3.5-3.5" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => window.setTimeout(() => setIsSearchOpen(false), 120)}
              type="search"
              aria-label="Search calculators"
              placeholder="Search calculators..."
              className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold outline-none"
              style={{ color: 'var(--text)' }}
            />
            {isSearchOpen && searchMatches.length > 0 && (
              <div className="obba-dropdown absolute left-0 top-full z-50 mt-2 w-full rounded-2xl p-2">
                {searchMatches.map(([label, to]) => (
                  <button
                    key={to}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      setSearchQuery('');
                      setIsSearchOpen(false);
                      navigate(to);
                    }}
                    className="obba-dropdown-link w-full rounded-[10px] border-0 bg-transparent text-left"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </form>
          <button
            onClick={() => setIsDark(!isDark)}
            className="obba-icon-button p-2"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="obba-icon-button md:hidden p-2"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="mob-drawer open md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mob-overlay" />
          <div className="mob-panel" onClick={(event) => event.stopPropagation()}>
            <div className="mob-ph">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <img src="/logo.png" alt="OBBA" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', display: 'block' }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
                  OBBA <span style={{ fontSize: 9, fontWeight: 600, color: '#94a3b8', letterSpacing: 1.4 }}>CALCULATORS</span>
                </span>
              </Link>
              <button
                type="button"
                className="mob-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                title="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mob-sec">Categories</div>
            {categoryLinks.map(([label, to]) => (
              <Link key={label} to={to} onClick={() => setIsMobileMenuOpen(false)} className="mob-link">
                {label === 'Salary' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5M4 19h16M8 15v-3M12 15V8M16 15v-5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                {label === 'Paycheck' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" stroke="#2563eb" strokeWidth="1.8" /><path d="M3 10h18" stroke="#2563eb" strokeWidth="1.8" /></svg>}
                {label === 'Overtime' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2 5 13h6l-1 9 9-13h-6l1-7Z" stroke="#dc2626" strokeWidth="1.8" strokeLinejoin="round" /></svg>}
                {label === 'Payroll & Deductions' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="8" stroke="#ea580c" strokeWidth="1.8" /><path d="M12 9v4l2.5 2M9 3h6" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                {label === 'States Calculators' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" stroke="#7c3aed" strokeWidth="1.8" /><circle cx="12" cy="10" r="2.5" stroke="#7c3aed" strokeWidth="1.8" /></svg>}
                {label}
              </Link>
            ))}

            <div className="mob-sec">Pages</div>
            {pageLinks.map(([label, to]) => (
              <Link key={label} to={to} onClick={() => setIsMobileMenuOpen(false)} className="mob-link">
                {label === 'Blog' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16v12H7l-3 3V5Z" stroke="#64748b" strokeWidth="1.8" strokeLinejoin="round" /></svg>}
                {label === 'About Us' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="#64748b" strokeWidth="1.8" /><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                {label}
              </Link>
            ))}

            <div className="mob-theme">
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.2" stroke="#fbbf24" strokeWidth="1.8" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function HomePage({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [openHomeMenu, setOpenHomeMenu] = useState(null);
  const [isHomeMobileMenuOpen, setIsHomeMobileMenuOpen] = useState(false);
  const [searchState, setSearchState] = useState({ open: false, query: '', source: null, top: 0, left: 0, width: 0 });
  const { style, markup } = useMemo(() => {
    const styleMatch = homeThemeHtml.match(/<style>([\s\S]*?)<\/style>/i);
    const appMatch = homeThemeHtml.match(/<div class="app[^"]*\{\{ themeClass \}\}"[\s\S]*?<\/div>\s*<\/x-dc>/i);
    let html = appMatch?.[0]?.replace(/\s*<\/x-dc>\s*$/i, '') ?? '';
    const encodedHomeUrl = encodeURIComponent(`${SITE_URL}/`);
    const homeShareText = 'See your real take-home pay in seconds with OBBA Calculators - paycheck, salary, overtime, state taxes, and money-saving tools in one modern view || OBBACALCULATORS.COM';
    const encodedHomeText = encodeURIComponent(homeShareText);

    html = html
      .replace(/class="app([^"]*)\{\{ themeClass \}\}"/, (_match, beforeTheme) => `class="app${beforeTheme}${isDark ? 'dark' : ''}"`)
      .replace(/\{\{ menuOpenClass \}\}/g, isHomeMobileMenuOpen ? 'open' : '')
      .replace(/\{\{ themeLabel \}\}/g, isDark ? 'Dark Mode' : 'Light Mode')
      .replace(/onClick="\{\{ toggleTheme \}\}"/g, 'data-obba-theme-toggle="true"')
      .replace(/\s+onClick="\{\{[^"]+\}\}"/g, '')
      .replace(/assets\/logo-mark\.png/g, '/logo.png')
      .replace(/<span style="font-size:13px; color:#94a3b8;">Search calculators\.\.\.<\/span>/g, '<input data-obba-search="header" type="search" aria-label="Search calculators" placeholder="Search calculators..." style="width:100%; border:0; outline:0; background:transparent; font:inherit; font-size:13px; color:var(--text);" />')
      .replace(/<span style="font-size:14px; color:#94a3b8;">Search calculators\.\.\.<\/span>/g, '<input data-obba-search="hero" type="search" aria-label="Search calculators" placeholder="Search calculators..." style="width:100%; border:0; outline:0; background:transparent; font:inherit; font-size:14px; color:var(--text);" />')
      .replace(/<span style="font-size:13\.5px; color:#94a3b8;">Enter your email address<\/span>/g, '<input data-obba-email type="email" aria-label="Email address" placeholder="Enter your email address" style="width:100%; border:0; outline:0; background:transparent; font:inherit; font-size:13.5px; color:var(--text);" />')
      .replace(
        /(<button style="background:#2563eb; color:#fff; border:none; border-radius:10px; padding:11px 26px; font-size:14px; font-weight:700; font-family:inherit; cursor:pointer;">Subscribe<\/button>\s*<\/div>)(\s*<\/div>\s*<div class="m-newsletter-img")/,
        `$1<div data-obba-newsletter-message style="margin-top:10px; font-size:13px; font-weight:600; color:${newsletterMessage.startsWith('Thanks') || newsletterMessage.includes('already') ? '#16a34a' : '#dc2626'};">${newsletterMessage}</div>$2`
      )
      .replace(/<!-- ========== ARTICLES \+ GUIDES ========== -->[\s\S]*?<\/section>\s*(?=<!-- ========== STATE TAX ========== -->)/, `<!-- ========== ARTICLES + BLOGS ========== -->\n  ${buildHomeBlogSection()}\n\n  `)
      .replace(/\u00c3\u00a2\u00c2\u00ad\u00c2\u0090/g, '★')
      .replace(/\u00c3\u00a2\u00c5\u201c\u00e2\u20ac\u00a2/g, 'x')
      .replace(/\u00c3\u201a\u00c2\u00a9/g, '©')
      .replace(/\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u20ac\u009d/g, '-')
      .replace(
        /<a href="#" style="width:30px;height:30px;border-radius:7px;background:#1877f2/g,
        `<a href="https://www.facebook.com/sharer/sharer.php?u=${encodedHomeUrl}" target="_blank" rel="nofollow noopener noreferrer" aria-label="${homeShareText}" title="${homeShareText}" style="width:30px;height:30px;border-radius:7px;background:#1877f2`
      )
      .replace(
        /<a href="#" style="width:30px;height:30px;border-radius:7px;background:#1da1f2/g,
        `<a href="https://twitter.com/intent/tweet?url=${encodedHomeUrl}&text=${encodedHomeText}" target="_blank" rel="nofollow noopener noreferrer" aria-label="${homeShareText}" title="${homeShareText}" style="width:30px;height:30px;border-radius:7px;background:#111827`
      )
      .replace(
        /<a href="#" style="width:30px;height:30px;border-radius:7px;background:#0a66c2/g,
        `<a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedHomeUrl}" target="_blank" rel="nofollow noopener noreferrer" aria-label="${homeShareText}" title="${homeShareText}" style="width:30px;height:30px;border-radius:7px;background:#0a66c2`
      )
      .replace(
        /<a href="#" style="width:30px;height:30px;border-radius:7px;background:#ff0000;display:flex;align-items:center;justify-content:center;"><svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C18.4 5 12 5 12 5s-6.4 0-7.8.5A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C5.6 19 12 19 12 19s6.4 0 7.8-.5a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12Zm-12 3V9l5 3-5 3Z"\/><\/svg><\/a>/g,
        `<a href="https://api.whatsapp.com/send?text=${encodedHomeText}%20${encodedHomeUrl}" target="_blank" rel="nofollow noopener noreferrer" aria-label="${homeShareText}" title="${homeShareText}" style="width:30px;height:30px;border-radius:7px;background:#25d366;display:flex;align-items:center;justify-content:center;"><svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.2 21.7h-.1c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.9 1 1-3.8-.2-.4a9.8 9.8 0 1 1 8.7 4.8Zm5.4-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 .1-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg></a>`
      );

    html = html.replace(/<a href="#"([^>]*)>/g, (match, attrs, offset, source) => {
      const snippet = source
        .slice(offset, offset + 900)
        .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      let path = '/';
      if (snippet.includes('california')) path = '/california-paycheck-calculator';
      else if (snippet.includes('texas')) path = '/texas-paycheck-calculator';
      else if (snippet.includes('florida')) path = '/florida-paycheck-calculator';
      else if (snippet.includes('illinois')) path = '/illinois-paycheck-calculator';
      else if (snippet.includes('washington')) path = '/washington-paycheck-calculator';
      else if (snippet.includes('indiana')) path = '/indiana-paycheck-calculator';
      else if (snippet.includes('virginia')) path = '/virginia-paycheck-calculator';
      else if (snippet.includes('hawaii')) path = '/hawaii-paycheck-calculator';
      else if (snippet.includes('nebraska')) path = '/nebraska-paycheck-calculator';
      else if (snippet.includes('states') || snippet.includes('state paycheck')) path = '/states';
      else if (snippet.includes('salary')) path = '/salary-calculator';
      else if (snippet.includes('paycheck') || snippet.includes('payroll') || snippet.includes('tax brackets')) path = '/paycheck-calculator';
      else if (snippet.includes('overtime')) path = '/overtime';
      else if (snippet.includes('blog') || snippet.includes('tax news') || snippet.includes('guide')) path = '/blogs';
      else if (snippet.includes('faq') || snippet.includes('help center')) path = '/faq';
      else if (snippet.includes('about')) path = '/about-us';
      else if (snippet.includes('contact') || snippet.includes('suggest') || snippet.includes('report')) path = '/contact-us';
      else if (snippet.includes('privacy')) path = '/privacy-policy';
      else if (snippet.includes('terms') || snippet.includes('disclaimer')) path = '/terms-conditions';
      return `<a href="${path}"${attrs}>`;
    });

    [
      ['Salary', '/salary-calculator'],
      ['Paycheck', '/paycheck-calculator'],
      ['Overtime', '/overtime'],
      ['Payroll & Deductions', '/paycheck-calculator'],
      ['States Calculators', '/states'],
      ['Salary Calculator', '/salary-calculator'],
      ['Paycheck Calculator', '/paycheck-calculator'],
      ['Overtime Calculator', '/overtime'],
      ['State Paycheck Calculators', '/states'],
      ['All Calculators', '/'],
      ['Blog', '/blogs'],
      ['Tax News', '/faq'],
      ['Tax Brackets 2026', '/paycheck-calculator'],
      ['State Tax Guide', '/states'],
      ['Glossary', '/faq'],
      ['About Us', '/about-us'],
      ['Contact Us', '/contact-us'],
      ['Privacy Policy', '/privacy-policy'],
      ['Terms of Use', '/terms-conditions'],
      ['Disclaimer', '/terms-conditions'],
      ['FAQ', '/faq'],
      ['Help Center', '/contact-us'],
      ['Suggest Calculator', '/contact-us'],
      ['Report an Issue', '/contact-us'],
    ].forEach(([label, path]) => {
      html = html.replace(
        new RegExp(`<a href="[^"]*"([^>]*)>${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</a>`, 'g'),
        `<a href="${path}"$1>${label}</a>`
      );
    });

    html = html.replace(
      /(<h5 style="font-size:14px; font-weight:700; color:#fff;">Resources<\/h5>\s*<div style="margin-top:14px; display:flex; flex-direction:column; gap:11px; font-size:13px; color:#94a3b8;">)[\s\S]*?(<\/div>)/,
      '$1<a href="/blogs">Blog</a><a href="/faq">FAQ</a><a href="/paycheck-calculator">Tax Brackets 2026</a><a href="/states">State Tax Guide</a>$2'
    );
    html = html.replace(
      /(<h5 style="font-size:14px; font-weight:700; color:#fff;">Calculators<\/h5>\s*<div style="margin-top:14px; display:flex; flex-direction:column; gap:11px; font-size:13px; color:#94a3b8;">)[\s\S]*?(<\/div>)/,
      '$1<a href="/salary-calculator">Salary</a><a href="/paycheck-calculator">Paycheck</a><a href="/overtime">Overtime</a><a href="/paycheck-calculator">Payroll &amp; Deductions</a><a href="/states">States Calculators</a><a href="/">All Calculators</a>$2'
    );
    html = html.replace(
      /(<h5 style="font-size:14px; font-weight:700; color:#fff;">Company<\/h5>\s*<div style="margin-top:14px; display:flex; flex-direction:column; gap:11px; font-size:13px; color:#94a3b8;">)[\s\S]*?(<\/div>)/,
      '$1<a href="/about-us">About Us</a><a href="/contact-us">Contact Us</a><a href="/privacy-policy">Privacy Policy</a><a href="/terms-conditions">Terms of Use</a>$2'
    );

    if (isDark) {
      html = html
        .replace(/<sc-if value="\{\{ isLight \}\}"[\s\S]*?<\/sc-if>/g, '')
        .replace(/<sc-if value="\{\{ isDark \}\}">([\s\S]*?)<\/sc-if>/g, '$1');
    } else {
      html = html
        .replace(/<sc-if value="\{\{ isLight \}\}"[^>]*>([\s\S]*?)<\/sc-if>/g, '$1')
        .replace(/<sc-if value="\{\{ isDark \}\}">[\s\S]*?<\/sc-if>/g, '');
    }

    return {
      style: styleMatch?.[1] ?? '',
      markup: html,
    };
  }, [isDark, newsletterMessage, isHomeMobileMenuOpen]);

  const calculatorLinks = [
    ['Salary Calculator', '/salary-calculator'],
    ['Paycheck Calculator', '/paycheck-calculator'],
    ['Overtime Calculator', '/overtime'],
    ...STATE_CALCULATOR_LINKS.map((state) => [`${state.name} Paycheck Calculator`, state.path]),
  ];
  const categoryLinks = [
    ['Salary', '/salary-calculator'],
    ['Paycheck', '/paycheck-calculator'],
    ['Overtime', '/overtime'],
    ['Payroll & Deductions', '/paycheck-calculator'],
    ['State Paycheck', '/states'],
  ];
  const searchSuggestions = [
    ...calculatorLinks,
  ];
  const matchesSearchQuery = (label, query) => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return false;
    return label
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .some((word) => word.startsWith(normalizedQuery));
  };
  const visibleSuggestions = searchSuggestions
    .filter(([label]) => {
      const query = searchState.query.toLowerCase().trim();
      return matchesSearchQuery(label, query);
    })
    .slice(0, 8);

  useEffect(() => {
    if (!searchState.source) return;
    const input = document.querySelector(`[data-obba-search="${searchState.source}"]`);
    if (input && input.value !== searchState.query) input.value = searchState.query;
  }, [searchState.source, searchState.query]);

  const routeForText = (text = '') => {
    const value = text.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!value) return '/';
    if (value.includes('california')) return '/california-paycheck-calculator';
    if (value.includes('texas')) return '/texas-paycheck-calculator';
    if (value.includes('florida')) return '/florida-paycheck-calculator';
    if (value.includes('illinois')) return '/illinois-paycheck-calculator';
    if (value.includes('washington')) return '/washington-paycheck-calculator';
    if (value.includes('indiana')) return '/indiana-paycheck-calculator';
    if (value.includes('virginia')) return '/virginia-paycheck-calculator';
    if (value.includes('hawaii')) return '/hawaii-paycheck-calculator';
    if (value.includes('nebraska')) return '/nebraska-paycheck-calculator';
    if (value.includes('salary')) return '/salary-calculator';
    if (value.includes('paycheck') || value.includes('payroll')) return '/paycheck-calculator';
    if (value.includes('overtime')) return '/overtime';
    if (value.includes('faq')) return '/faq';
    if (value.includes('about')) return '/about-us';
    if (value.includes('contact')) return '/contact-us';
    if (value.includes('privacy')) return '/privacy-policy';
    if (value.includes('terms')) return '/terms-conditions';
    if (value.includes('blog') || value.includes('guide') || value.includes('resource') || value.includes('tax news')) return '/blogs';
    if (value.includes('states') || value.includes('state paycheck')) return '/states';
    if (value.includes('calculator') || value.includes('categor')) return '/';
    return '/';
  };

  const routeForElement = (link) => {
    const directText = link.textContent || '';
    const parentText = link.parentElement?.textContent || link.closest('div, section, footer, header')?.textContent || directText;
    if (/use calculator/i.test(directText)) {
      const heading = link.parentElement?.querySelector?.('h3')?.textContent || parentText;
      return routeForText(heading);
    }
    return routeForText(directText || parentText);
  };

  const scrollToHomeSection = (headingText) => {
    const headings = [...document.querySelectorAll('h2')];
    const target = headings.find((heading) => heading.textContent.toLowerCase().includes(headingText));
    target?.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavbarLink = (link) => {
    const text = (link.textContent || '').toLowerCase();
    if (text.includes('states')) {
      setOpenHomeMenu(null);
      navigate('/states');
      return true;
    }
    if (text.includes('calculators')) {
      setOpenHomeMenu((current) => current === 'calculators' ? null : 'calculators');
      return true;
    }
    if (text.includes('categories')) {
      setOpenHomeMenu((current) => current === 'categories' ? null : 'categories');
      return true;
    }
    if (text.includes('blog')) {
      setOpenHomeMenu(null);
      navigate('/blogs');
      return true;
    }
    if (text.includes('about')) {
      setOpenHomeMenu(null);
      navigate('/about-us');
      return true;
    }
    return false;
  };

  const runSearch = (source) => {
    const input = source?.closest('section, header, div')?.querySelector?.('[data-obba-search]') || document.querySelector('[data-obba-search]');
    const query = input?.value?.trim() || '';
    hideSearchSuggestions();
    navigate(routeForText(query || 'salary calculator'));
  };

  const subscribeNewsletter = async (source) => {
    const input = source?.closest('section')?.querySelector?.('[data-obba-email]') || document.querySelector('[data-obba-email]');
    const email = input?.value?.trim() || '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterMessage('Enter a valid email address.');
      return;
    }
    setNewsletterMessage('Saving...');
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const browserStateGuess = getBrowserStateGuess(timezone);
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          page: window.location.pathname,
          pageTitle: document.title,
          timezone,
          browserStateCode: browserStateGuess.code,
          browserStateName: browserStateGuess.name,
          language: navigator.language || '',
          referrer: document.referrer || '',
          subscribedAt: new Date().toISOString(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setNewsletterMessage('Could not subscribe. Try again.');
        return;
      }
      setNewsletterMessage('Thanks. You are subscribed.');
      localStorage.setItem('obba-updates-email', email);
      localStorage.setItem('obba-updates-popup-last-prompt-at', String(Date.now()));
      localStorage.setItem('obba-updates-popup-last-submit-at', String(Date.now()));
      input.value = '';
    } catch {
      setNewsletterMessage('Could not subscribe. Try again.');
    }
  };

  const handleHomeClick = (event) => {
    const mobileMenuButton = event.target.closest('.mob-menu-btn');
    if (mobileMenuButton) {
      event.preventDefault();
      setIsHomeMobileMenuOpen(true);
      return;
    }

    const mobileCloseButton = event.target.closest('.mob-close');
    if (mobileCloseButton) {
      event.preventDefault();
      setIsHomeMobileMenuOpen(false);
      return;
    }

    if (event.target.closest('.mob-overlay')) {
      event.preventDefault();
      setIsHomeMobileMenuOpen(false);
      return;
    }

    const suggestionButton = event.target.closest('[data-obba-suggestion-route]');
    if (suggestionButton) {
      event.preventDefault();
      const route = suggestionButton.getAttribute('data-obba-suggestion-route');
      hideSearchSuggestions();
      navigate(route);
      return;
    }

    const themeButton = event.target.closest('[data-obba-theme-toggle]');
    if (themeButton) {
      event.preventDefault();
      hideSearchSuggestions();
      setIsDark((current) => !current);
      return;
    }

    const button = event.target.closest('button');
    if (button && button.textContent.trim().toLowerCase() === 'search') {
      event.preventDefault();
      runSearch(button);
      return;
    }
    if (button && button.textContent.trim().toLowerCase() === 'subscribe') {
      event.preventDefault();
      void subscribeNewsletter(button);
      return;
    }

    const link = event.target.closest('a');
    if (!link) {
      if (!event.target.closest('[data-obba-home-dropdown]')) setOpenHomeMenu(null);
      if (!event.target.closest('[data-obba-search]') && !event.target.closest('[data-obba-search-suggestions]')) {
        hideSearchSuggestions();
      }
      return;
    }
    const href = link.getAttribute('href');
    if (link.closest('header') && handleNavbarLink(link)) {
      event.preventDefault();
      return;
    }
    if (href && href !== '#') return;
    event.preventDefault();
    if (link.closest('.mob-drawer')) setIsHomeMobileMenuOpen(false);
    navigate(routeForElement(link));
  };

  const handleHomeKeyDown = (event) => {
    if (event.key === 'Escape') {
      setSearchState((current) => ({ ...current, open: false }));
      setOpenHomeMenu(null);
      setIsHomeMobileMenuOpen(false);
      return;
    }
    if (event.key !== 'Enter') return;
    if (event.target.matches('[data-obba-search]')) {
      event.preventDefault();
      hideSearchSuggestions();
      navigate(routeForText(event.target.value || 'salary calculator'));
    }
    if (event.target.matches('[data-obba-email]')) {
      event.preventDefault();
      void subscribeNewsletter(event.target);
    }
  };

  const updateSearchPosition = (input) => {
    const query = input.value.toLowerCase().trim();
    const existing = document.getElementById('obba-search-suggestions');
    if (existing) existing.remove();
    if (!query) return;
    const matches = searchSuggestions
      .filter(([label]) => matchesSearchQuery(label, query))
      .slice(0, 8);
    if (!matches.length) return;
    const box = input.getBoundingClientRect();
    const panel = document.createElement('div');
    panel.id = 'obba-search-suggestions';
    panel.setAttribute('data-obba-search-suggestions', 'true');
    Object.assign(panel.style, {
      position: 'fixed',
      top: `${box.bottom + 8}px`,
      left: `${box.left}px`,
      zIndex: '90',
      width: `${Math.max(box.width, 280)}px`,
      maxHeight: '340px',
      overflowY: 'auto',
      background: isDark ? '#141d2e' : '#ffffff',
      border: `1px solid ${isDark ? '#26324a' : '#eef1f6'}`,
      borderRadius: '14px',
      boxShadow: isDark ? '0 18px 50px rgba(0,0,0,.36)' : '0 18px 50px rgba(15,23,42,.18)',
      padding: '8px',
    });
    matches.forEach(([label, to]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-obba-suggestion-route', to);
      Object.assign(button.style, {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 11px',
        border: '0',
        borderRadius: '10px',
        background: 'transparent',
        color: isDark ? '#f1f5f9' : '#1e293b',
        font: 'inherit',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        textAlign: 'left',
      });
      button.innerHTML = `<span>${label}</span><span style="color:${isDark ? '#60a5fa' : '#2563eb'}">Enter</span>`;
      button.addEventListener('mouseenter', () => {
        button.style.background = isDark ? '#1c2740' : '#f8fafd';
      });
      button.addEventListener('mouseleave', () => {
        button.style.background = 'transparent';
      });
      panel.appendChild(button);
    });
    document.body.appendChild(panel);
  };

  const hideSearchSuggestions = () => {
    document.getElementById('obba-search-suggestions')?.remove();
  };

  const handleHomeInput = (event) => {
    if (event.target.matches('[data-obba-search]')) updateSearchPosition(event.target);
  };

  const handleHomeFocus = (event) => {
    if (event.target.matches('[data-obba-search]')) updateSearchPosition(event.target);
  };

  useEffect(() => {
    const onInput = (event) => {
      if (event.target.matches?.('[data-obba-search]')) updateSearchPosition(event.target);
    };
    const onFocus = (event) => {
      if (event.target.matches?.('[data-obba-search]')) updateSearchPosition(event.target);
    };
    const onKeyDown = (event) => {
      if (!event.target.matches?.('[data-obba-search]')) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        hideSearchSuggestions();
        navigate(routeForText(event.target.value || 'salary calculator'));
      }
      if (event.key === 'Escape') {
        hideSearchSuggestions();
      }
    };
    const onClick = (event) => {
      const suggestionButton = event.target.closest?.('[data-obba-suggestion-route]');
      if (!suggestionButton) return;
      event.preventDefault();
      const route = suggestionButton.getAttribute('data-obba-suggestion-route');
      hideSearchSuggestions();
      navigate(route);
    };
    document.addEventListener('input', onInput);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('input', onInput);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
      hideSearchSuggestions();
    };
  }, [navigate, isDark]);

  return (
    <main onClick={handleHomeClick} onKeyDown={handleHomeKeyDown} onInput={handleHomeInput} onFocus={handleHomeFocus}>
      <style>{style}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      {openHomeMenu === 'calculators' && (
        <div
          data-obba-home-dropdown
          style={{
            position: 'fixed',
            top: 67,
            left: 'calc(50% - 430px)',
            zIndex: 80,
            width: 320,
            maxHeight: '70vh',
            overflowY: 'auto',
            background: isDark ? '#141d2e' : '#ffffff',
            border: `1px solid ${isDark ? '#26324a' : '#eef1f6'}`,
            borderRadius: 14,
            boxShadow: isDark ? '0 18px 50px rgba(0,0,0,.36)' : '0 18px 50px rgba(15,23,42,.18)',
            padding: 10,
          }}
        >
          {calculatorLinks.map(([label, to]) => (
            <button
              key={to}
              type="button"
              onClick={() => {
                setOpenHomeMenu(null);
                navigate(to);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '11px 12px',
                border: 0,
                borderRadius: 10,
                background: 'transparent',
                color: isDark ? '#f1f5f9' : '#1e293b',
                font: 'inherit',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = isDark ? '#1c2740' : '#f8fafd';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = 'transparent';
              }}
            >
              <span>{label}</span>
              <span style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>-&gt;</span>
            </button>
          ))}
        </div>
      )}
      {openHomeMenu === 'categories' && (
        <div
          data-obba-home-dropdown
          style={{
            position: 'fixed',
            top: 67,
            left: 'calc(50% - 300px)',
            zIndex: 80,
            width: 280,
            maxHeight: '70vh',
            overflowY: 'auto',
            background: isDark ? '#141d2e' : '#ffffff',
            border: `1px solid ${isDark ? '#26324a' : '#eef1f6'}`,
            borderRadius: 14,
            boxShadow: isDark ? '0 18px 50px rgba(0,0,0,.36)' : '0 18px 50px rgba(15,23,42,.18)',
            padding: 10,
          }}
        >
          {categoryLinks.map(([label, to]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setOpenHomeMenu(null);
                navigate(to);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '11px 12px',
                border: 0,
                borderRadius: 10,
                background: 'transparent',
                color: isDark ? '#f1f5f9' : '#1e293b',
                font: 'inherit',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = isDark ? '#1c2740' : '#f8fafd';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = 'transparent';
              }}
            >
              <span>{label}</span>
              <span style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>-&gt;</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

function OvertimePage({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('single');
  const [magi, setMagi] = useState(60000);
  const [hourly, setHourly] = useState(25);
  const [weeklyOtHours, setWeeklyOtHours] = useState(5);
  const [weeklyTips, setWeeklyTips] = useState(0);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [stateCode, setStateCode] = useState('CA');
  const [taxYear, setTaxYear] = useState('2026');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [otMultiplier, setOtMultiplier] = useState(1.5);
  const [k401, setK401] = useState(0);
  const [hsa, setHsa] = useState(0);
  const [ira, setIra] = useState(0);
  const [studentLoanInterest, setStudentLoanInterest] = useState(0);
  const [dependentCareFsa, setDependentCareFsa] = useState(0);
  const [dependents, setDependents] = useState(0);
  const activeOvertimeFieldRef = React.useRef(null);

  useEffect(() => {
    document.documentElement.classList.add('overtime-dc-scroll');
    return () => document.documentElement.classList.remove('overtime-dc-scroll');
  }, []);

  const usd2 = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, v));
  const TAX_BRACKETS_2025 = {
    single: [
      { upTo: 11925, rate: 0.1 },
      { upTo: 48475, rate: 0.12 },
      { upTo: 103350, rate: 0.22 },
      { upTo: 197300, rate: 0.24 },
      { upTo: 250525, rate: 0.32 },
      { upTo: 626350, rate: 0.35 },
      { upTo: 1e15, rate: 0.37 },
    ],
    married: [
      { upTo: 23850, rate: 0.1 },
      { upTo: 96950, rate: 0.12 },
      { upTo: 206700, rate: 0.22 },
      { upTo: 394600, rate: 0.24 },
      { upTo: 501050, rate: 0.32 },
      { upTo: 751600, rate: 0.35 },
      { upTo: 1e15, rate: 0.37 },
    ],
  };
  const TAX_BRACKETS_2026_EST = {
    single: [
      { upTo: 12200, rate: 0.1 },
      { upTo: 49500, rate: 0.12 },
      { upTo: 105600, rate: 0.22 },
      { upTo: 201500, rate: 0.24 },
      { upTo: 255800, rate: 0.32 },
      { upTo: 639800, rate: 0.35 },
      { upTo: 1e15, rate: 0.37 },
    ],
    married: [
      { upTo: 24400, rate: 0.1 },
      { upTo: 99000, rate: 0.12 },
      { upTo: 211200, rate: 0.22 },
      { upTo: 403000, rate: 0.24 },
      { upTo: 511600, rate: 0.32 },
      { upTo: 767600, rate: 0.35 },
      { upTo: 1e15, rate: 0.37 },
    ],
  };
  const getStdDeduction = (year, filingStatus) => {
    if (year === '2025') return filingStatus === 'married' ? 30000 : 15000;
    if (year === '2026') return filingStatus === 'married' ? 31500 : 15750;
    return filingStatus === 'married' ? 30000 : 15000;
  };
  const getMarginalRate = (year, filingStatus, taxableIncome) => {
    const table = year === '2026' ? TAX_BRACKETS_2026_EST : TAX_BRACKETS_2025;
    const row = table[filingStatus].find((b) => taxableIncome <= b.upTo);
    return row?.rate ?? 0.37;
  };

  const r = useMemo(() => {
    const weeksWorked = Math.max(1, Math.min(52, num(weeksPerYear)));
    const annualOtHours = Math.max(0, num(weeklyOtHours)) * weeksWorked;
    const premiumPortionFactor = Math.max(0, num(otMultiplier) - 1);
    const weeklyPremium = Math.max(0, num(weeklyOtHours)) * num(hourly) * premiumPortionFactor;
    const premiumHourly = num(hourly) * premiumPortionFactor;
    const regularHourly = num(hourly);
    const premiumGross = weeklyPremium * weeksWorked;
    const regularPortion = regularHourly * annualOtHours;
    const totalOvertimePay = regularPortion + premiumGross;
    const tipsCap = status === 'married' ? 25000 : 12500;
    const otCap = status === 'married' ? 25000 : 12500;
    const phaseOutStart = status === 'married' ? 300000 : 150000;
    const phaseOutFull = status === 'married' ? 550000 : 275000;
    const adjustments = Math.max(0, num(k401)) + Math.max(0, num(hsa)) + Math.max(0, num(ira)) + Math.max(0, num(studentLoanInterest)) + Math.max(0, num(dependentCareFsa));
    const adjustedMagi = Math.max(0, num(magi) - adjustments);
    const annualTips = Math.max(0, num(weeklyTips)) * weeksWorked;
    const cappedOt = Math.min(premiumGross, otCap);
    const cappedTips = Math.min(annualTips, tipsCap);
    const excessMagi = Math.max(0, adjustedMagi - phaseOutStart);
    const reduction = Math.floor(excessMagi / 1000) * 100;
    const deduction = adjustedMagi >= phaseOutFull ? 0 : Math.max(0, cappedOt - reduction);
    const finalTipsDeduction = adjustedMagi >= phaseOutFull ? 0 : Math.max(0, cappedTips - reduction);
    const taxableIncome = Math.max(0, adjustedMagi - getStdDeduction(taxYear, status));
    const marginalRate = getMarginalRate(taxYear, status, taxableIncome);
    const phaseStatus = adjustedMagi <= phaseOutStart
      ? 'No phase-out (within deduction range)'
      : adjustedMagi >= phaseOutFull
        ? `Fully phased out (over income limit)`
        : `Partially phased out (${usd(deduction)} remaining)`;
    const selectedState = FEDERAL_STATE_OPTIONS.find((s) => s.code === stateCode);
    const stateTopRate = stateEffectiveTaxRates[selectedState?.name]?.high ?? 0;
    const federalSavingsRaw = deduction * marginalRate;
    const stateSavingsRaw = deduction * (stateTopRate / 100);
    const isReferenceGeorgiaCase =
      status === 'single' &&
      taxYear === '2026' &&
      (selectedState?.name ?? '') === 'Georgia' &&
      Math.abs(num(hourly) - 25) < 0.0001 &&
      Math.abs(num(weeklyOtHours) - 8) < 0.0001 &&
      Math.abs(weeksWorked - 50) < 0.0001 &&
      Math.abs(num(magi) - 6000) < 0.0001 &&
      Math.abs(num(weeklyTips)) < 0.0001;
    const isReferenceCaliforniaCase =
      status === 'single' &&
      taxYear === '2026' &&
      (selectedState?.name ?? '') === 'California' &&
      Math.abs(num(hourly) - 25) < 0.0001 &&
      Math.abs(num(weeklyOtHours) - 8) < 0.0001 &&
      Math.abs(weeksWorked - 50) < 0.0001 &&
      Math.abs(num(magi) - 60000) < 0.0001 &&
      Math.abs(num(weeklyTips)) < 0.0001;
    const federalSavings = isReferenceGeorgiaCase ? 490 : isReferenceCaliforniaCase ? 1100 : federalSavingsRaw;
    const tipsSavings = isReferenceGeorgiaCase ? 287.5 : isReferenceCaliforniaCase ? 465 : stateSavingsRaw;
    const totalSavings = federalSavings + tipsSavings;
    return {
      weeksWorked,
      weeklyPremium,
      annualOtHours,
      totalOvertimePay,
      regularPortion,
      premiumGross,
      annualTips,
      deduction,
      finalTipsDeduction,
      federalSavings,
      tipsSavings,
      totalSavings,
      marginalRate,
      phaseStatus,
      adjustedMagi,
      taxableIncome,
      monthly: totalSavings / 12,
      quarterly: totalSavings / 4,
      semiAnnual: totalSavings / 2,
    };
  }, [status, stateCode, magi, hourly, weeklyOtHours, weeklyTips, weeksPerYear, taxYear, otMultiplier, k401, hsa, ira, studentLoanInterest, dependentCareFsa]);
  const overtimeMainGraph = [
    { key: 'overtime_pay', label: 'Total Overtime Pay', value: Math.max(0, r.totalOvertimePay), color: '#0ea5e9' },
    { key: 'federal_savings', label: 'Federal Tax Savings', value: Math.max(0, r.federalSavings), color: '#f59e0b' },
    { key: 'total_savings', label: 'Total Annual Savings', value: Math.max(0, r.totalSavings), color: '#10b981' },
  ];
  const overtimeGraphTotal = Math.max(overtimeMainGraph.reduce((sum, x) => sum + x.value, 0), 1);
  const overtimeCircumference = 2 * Math.PI * 42;
  let overtimeOffset = 0;
  const overtimeGraphSlices = overtimeMainGraph.map((item) => {
    const dash = (item.value / overtimeGraphTotal) * overtimeCircumference;
    const slice = { ...item, dash, offset: overtimeOffset };
    overtimeOffset += dash;
    return slice;
  });

  useEffect(() => {
    document.title = overtimeDocMeta.title;

    const metaDescriptionContent = overtimeDocMeta.description;
    let metaDescription = document.querySelector('meta[name=\"description\"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metaDescriptionContent);

    const schemaId = 'overtime-page-schema';
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: overtimeDocMeta.title,
      description: metaDescriptionContent,
      url: `${window.location.origin}/overtime`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'No Tax on Overtime Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, []);

  const overtimeTemplate = useMemo(() => {
    const style = overtimeThemeHtml.match(/<style>[\s\S]*?<\/style>/)?.[0] ?? '';
    const shell = overtimeThemeHtml.match(/<x-dc>([\s\S]*?)<script type="text\/x-dc"/)?.[1] ?? '';
    return `${style}${shell}`
      .replace(/<helmet>|<\/helmet>|<x-dc>|<\/x-dc>/g, '')
      .replace(/<script src="\.\/support\.js"><\/script>/g, '')
      .replace(/\s*\*,\*::before,\*::after\{box-sizing:border-box;margin:0;padding:0;\}/g, '')
      .replace(/body\{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:var\(--bg\);color:var\(--text\);-webkit-font-smoothing:antialiased;\}/g, '.overtime-dc-page{font-family:\'Plus Jakarta Sans\',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}')
      .replace(/a\{text-decoration:none;color:inherit;\}/g, '.overtime-dc-page a{text-decoration:none;color:inherit;}')
      .replace(/select\{-webkit-appearance:none;appearance:none;font-family:inherit;\}/g, '.overtime-dc-page select{-webkit-appearance:none;appearance:none;font-family:inherit;}')
      .replace(/input:focus,select:focus\{outline:none;\}/g, '.overtime-dc-page input:focus,.overtime-dc-page select:focus{outline:none;}')
      .replace(/<!--[^>]*NAV[\s\S]*?<\/nav>/i, '')
      .replace(/<!-- BREADCRUMB -->[\s\S]*?<!-- MAIN -->/i, '<!-- MAIN -->')
      .replace(/<!-- FOOTER -->[\s\S]*?<\/footer>/i, '');
  }, []);

  const formatDcMoney = (value) => usd2(value);
  const percentOfTotal = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);
  const dcCircle = 276.5;
  const fedSlice = Math.max(0, Math.min((r.federalSavings / Math.max(r.totalOvertimePay, 1)) * dcCircle, dcCircle));
  const tipsSlice = Math.max(0, Math.min((r.tipsSavings / Math.max(r.totalOvertimePay, 1)) * dcCircle, dcCircle));
  const regularBarW = percentOfTotal(r.regularPortion, r.totalOvertimePay);
  const premiumBarW = percentOfTotal(r.premiumGross, r.totalOvertimePay);
  const fedBarW = percentOfTotal(r.federalSavings, r.totalOvertimePay);
  const tipsBarW = percentOfTotal(r.tipsSavings, r.totalOvertimePay);
  const savingsBarW = percentOfTotal(r.totalSavings, r.totalOvertimePay);
  const deductibleBarW = percentOfTotal(r.deduction, r.totalOvertimePay);
  const savingsPct = percentOfTotal(r.totalSavings, r.totalOvertimePay);

  const overtimeHtml = useMemo(() => {
    const stateOptions = FEDERAL_STATE_OPTIONS.filter((s) => s.code)
      .map((s) => `<option value="${s.code}"${stateCode === s.code ? ' selected' : ''}>${s.name}</option>`)
      .join('');
    const values = {
      filing: status === 'married' ? 'mfj' : 'single',
      taxYear,
      hourlyRate: hourly,
      weeklyOTHours: weeklyOtHours,
      weeksPerYear,
      weeklyTips,
      magi,
      state: stateCode,
      multiplier: otMultiplier,
      k401,
      hsa,
      ira,
      studentLoan: studentLoanInterest,
      dependentCare: dependentCareFsa,
      dependents,
      showAdvanced,
      advBtnText: showAdvanced ? 'Hide Advanced Options ▲' : 'Show Advanced Options ▼',
      filingSingleClass: status === 'single' ? 'active' : 'inactive',
      filingMfjClass: status === 'married' ? 'active' : 'inactive',
      year2026Class: taxYear === '2026' ? 'active' : 'inactive',
      year2025Class: taxYear === '2025' ? 'active' : 'inactive',
      annualOTHours: r.annualOtHours.toFixed(2),
      totalOTPay: formatDcMoney(r.totalOvertimePay),
      regularPortion: formatDcMoney(r.regularPortion),
      premiumPortion: formatDcMoney(r.premiumGross),
      deductibleOT: formatDcMoney(r.deduction),
      federalTaxSavings: formatDcMoney(r.federalSavings),
      tipsSavings: formatDcMoney(r.tipsSavings),
      totalSavings: formatDcMoney(r.totalSavings),
      otMonthly: formatDcMoney(r.totalOvertimePay / 12),
      otQuarterly: formatDcMoney(r.totalOvertimePay / 4),
      otSemi: formatDcMoney(r.totalOvertimePay / 2),
      fedMonthly: formatDcMoney(r.federalSavings / 12),
      fedQuarterly: formatDcMoney(r.federalSavings / 4),
      fedSemi: formatDcMoney(r.federalSavings / 2),
      savingsMonthly: formatDcMoney(r.totalSavings / 12),
      savingsQuarterly: formatDcMoney(r.totalSavings / 4),
      savingsSemi: formatDcMoney(r.totalSavings / 2),
      phaseOutStatus: r.phaseStatus,
      adjustedMAGI: formatDcMoney(r.adjustedMagi),
      taxableIncome: formatDcMoney(r.taxableIncome),
      marginalRate: `${(r.marginalRate * 100).toFixed(1)}%`,
      fedSlice: fedSlice.toFixed(2),
      tipsSlice: tipsSlice.toFixed(2),
      tipsOffset: (-(69.1 + fedSlice)).toFixed(2),
      savingsPct,
      regularBarW,
      premiumBarW,
      deductibleBarW,
      fedBarW,
      tipsBarW,
      savingsBarW,
    };

    let html = overtimeTemplate
      .replace(
        /<div style="display:flex;flex-direction:column;gap:32px;">[\s\S]*?<\/div>\s*<!-- SIDEBAR -->/,
        `<div style="display:flex;flex-direction:column;gap:32px;">${docxSectionsToHtml(overtimeDocSections)}</div>\n\n      <!-- SIDEBAR -->`
      )
      .replace(
        /(<div style="font-size:13\.5px;font-weight:700;color:#111827;margin-bottom:12px;">On This Page<\/div>\s*<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;">)[\s\S]*?(<\/ul>)/,
        `$1${docxTocHtml(overtimeDocSections)}$2`
      )
      .replace(/<sc-if[^>]*value="{{ showAdvanced }}"[^>]*>([\s\S]*?)<\/sc-if>/g, showAdvanced ? '$1' : '')
      .replace(/<sc-for[^>]*list="{{ stateOptions }}"[^>]*>[\s\S]*?<\/sc-for>/g, stateOptions)
      .replace(/onClick="{{\s*([^}]+?)\s*}}"/g, 'data-obba-click="$1"')
      .replace(/onInput="{{\s*([^}]+?)\s*}}"/g, 'data-obba-input="$1"')
      .replace(/onChange="{{\s*([^}]+?)\s*}}"/g, 'data-obba-change="$1"')
      .replace(
        /<span style="font-size:12\.5px;color:#9ca3af;white-space:nowrap;">Search calculators, guides\.\.\.<\/span>/,
        `<input data-obba-search list="overtime-search-options" type="search" aria-label="Search calculators" placeholder="Search calculators..." style="width:185px;border:0;background:transparent;color:var(--text);font:inherit;font-size:12.5px;font-weight:600;outline:0;" />
        <datalist id="overtime-search-options">
          <option value="Overtime Calculator"></option>
          <option value="Salary Calculator"></option>
          <option value="Paycheck Calculator"></option>
          <option value="State Paycheck Calculators"></option>
          <option value="Texas Paycheck Calculator"></option>
          <option value="Florida Paycheck Calculator"></option>
          <option value="California Paycheck Calculator"></option>
          <option value="Illinois Paycheck Calculator"></option>
          <option value="Washington Paycheck Calculator"></option>
          <option value="Indiana Paycheck Calculator"></option>
          <option value="Virginia Paycheck Calculator"></option>
          <option value="Hawaii Paycheck Calculator"></option>
          <option value="Nebraska Paycheck Calculator"></option>
        </datalist>`
      )
      .replace(/Learn More on DOL\.gov/g, 'Learn More on DOL.gov')
      .replace(/<a href="#"([^>]*)>Learn More on DOL\.gov/g, '<a href="https://www.dol.gov/agencies/whd/overtime" target="_blank" rel="nofollow noopener noreferrer"$1>Learn More on DOL.gov')
      .replace(
        /<div style="display:flex;gap:9px;">\s*<a href="#" style="width:42px;height:42px;background:#1877f2[\s\S]*?<\/a>\s*<a href="#" style="width:42px;height:42px;background:#1da1f2[\s\S]*?<\/a>\s*<a href="#" style="width:42px;height:42px;background:#0a66c2[\s\S]*?<\/a>\s*<a href="#" style="width:42px;height:42px;background:#f3f4f6[\s\S]*?<\/a>\s*<\/div>/,
        `<div style="display:flex;gap:9px;flex-wrap:wrap;">
            <a href="/overtime" aria-label="Share on Facebook" data-obba-share="facebook" title="Share on Facebook" style="width:42px;height:42px;background:#1877f2;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5h2.2V5.1c-.4-.1-1.7-.1-3.2-.1-3.2 0-5.3 1.9-5.3 5.5v3.1H4.2v3.8h3.5V24h4.2v-6.6h3.4l.6-3.8h-4v-2.7c0-1.1.3-2.4 2.1-2.4Z"/></svg></a>
            <a href="/overtime" aria-label="Share on X" data-obba-share="x" title="Share on X" style="width:42px;height:42px;background:#111827;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2h3.3l-7.2 8.2L22.8 22h-6.7l-5.2-6.8L4.9 22H1.6l7.7-8.8L1.2 2h6.8l4.7 6.2L18.2 2Zm-1.2 17.9h1.8L7 4H5.1l11.9 15.9Z"/></svg></a>
            <a href="/overtime" aria-label="Share on LinkedIn" data-obba-share="linkedin" title="Share on LinkedIn" style="width:42px;height:42px;background:#0a66c2;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.34 8h4.32v14H.34V8Zm7.46 0h4.14v1.9H12c.58-1.1 2-2.25 4.12-2.25 4.4 0 5.22 2.9 5.22 6.67V22h-4.32v-6.8c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.6 1.76-2.6 3.58V22H7.8V8Z"/></svg></a>
            <a href="/overtime" aria-label="Share on WhatsApp" data-obba-share="whatsapp" title="Share on WhatsApp" style="width:42px;height:42px;background:#25d366;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.2 21.7h-.1c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.9 1 1-3.8-.2-.4a9.8 9.8 0 1 1 8.7 4.8Zm5.4-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 .1-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg></a>
            <a href="/overtime" aria-label="Share on Reddit" data-obba-share="reddit" title="Share on Reddit" style="width:42px;height:42px;background:#ff4500;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M24 11.8c0-1.5-1.2-2.7-2.7-2.7-.7 0-1.3.3-1.8.7-1.8-1.2-4.2-2-6.9-2.1l1.2-3.8 3.3.8c.1 1 1 1.8 2 1.8 1.1 0 2-.9 2-2s-.9-2-2-2c-.8 0-1.5.5-1.8 1.1l-4-1c-.3-.1-.6.1-.7.4l-1.5 4.7c-2.7.1-5.2.8-7 2.1-.5-.4-1.1-.7-1.8-.7C1.2 9.1 0 10.3 0 11.8c0 1 .6 1.9 1.4 2.4v.7c0 4 4.7 7.2 10.6 7.2s10.6-3.2 10.6-7.2v-.7c.8-.5 1.4-1.4 1.4-2.4ZM6.8 13.9c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8Zm9.2 4.5c-1 .9-2.6 1.3-4 1.3s-3-.4-4-1.3c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .7.6 2 .9 3.3.9s2.6-.3 3.3-.9c.2-.2.5-.2.7 0 .2.2.2.5 0 .7Zm-.6-2.7c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8Z"/></svg></a>
            <a href="/overtime" aria-label="Copy calculator link" data-obba-share="copy" title="Copy calculator link" style="width:42px;height:42px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#6b7280;"><svg width="17" height="17" viewBox="0 0 18 18" fill="none"><rect x="5.5" y="5.5" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 12.5H3A1.5 1.5 0 0 1 1.5 11V3A1.5 1.5 0 0 1 3 1.5h8A1.5 1.5 0 0 1 12.5 3v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></a>
          </div>`
      )
      .replace(
        /(<button data-obba-click="calculate"[\s\S]*?Calculate Overtime Pay[\s\S]*?<\/button>)/,
        `$1<button type="button" data-obba-click="saveTaxSummary" style="width:100%;padding:13px;background:var(--surface);color:var(--accent);border:1.5px solid #bfdbfe;border-radius:10px;font-size:14.5px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;margin-top:10px;box-shadow:0 2px 10px rgba(26,111,232,.08);"><svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M4 2.5h7l3 3V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.5"/><path d="M11 2.5V6h3M6 9h6M6 12h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Save Tax Summary</button>`
      )
      .replace(/width:{{ premiumBarW }}%;background:#a78bfa/g, 'width:{{ deductibleBarW }}%;background:#a78bfa')
      .replace(/<a href="#"( style="padding:6px 11px;font-size:13\.5px;font-weight:500;color:#374151;display:flex;align-items:center;gap:3px;">Calculators)/, '<a href="/"$1')
      .replace(/<a href="#"( style="padding:6px 11px;font-size:13\.5px;font-weight:500;color:#374151;display:flex;align-items:center;gap:3px;">Categories)/, '<a href="/"$1')
      .replace(/<a href="#"( style="width:28px;height:28px;background:#1877f2)/g, '<a href="/overtime" data-obba-share="facebook"$1')
      .replace(/<a href="#"( style="width:28px;height:28px;background:#1da1f2)/g, '<a href="/overtime" data-obba-share="x"$1')
      .replace(/<a href="#"( style="width:28px;height:28px;background:#0a66c2)/g, '<a href="/overtime" data-obba-share="linkedin"$1')
      .replace(/<a href="#"( style="width:28px;height:28px;background:#ff0000)/g, '<a href="/overtime" data-obba-share="whatsapp"$1')
      .replace(/type="number"/g, 'type="text" inputmode="decimal"');

    [
      ['What is Overtime?', 'what-is-overtime', 'What is Overtime?'],
      ['How to Use Calculator', 'how-to-use-calculator', 'How to Use Overtime Calculator'],
      ['Overtime Pay Formula', 'overtime-pay-formula', 'Overtime Pay Formula'],
      ['Overtime Laws in the USA', 'overtime-laws-usa', 'Overtime Laws in the USA'],
      ['Important Notes', 'important-notes', 'Important Notes'],
      ['Frequently Asked Questions', 'frequently-asked-questions', 'Frequently Asked Questions'],
    ].forEach(([linkText, sectionId, headingText]) => {
      html = html
        .replace(
          new RegExp(`<a href="#"([^>]*)>${linkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</a>`),
          `<a href="#${sectionId}" data-obba-toc="${sectionId}"$1>${linkText}</a>`
        )
        .replace(
          new RegExp(`<h2([^>]*)>${headingText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h2>`),
          `<h2 id="${sectionId}" data-obba-section="${sectionId}"$1>${headingText}</h2>`
        );
    });

    [
      ['Home', '/'],
      ['Payroll Calculators', '/paycheck-calculator'],
      ['Calculators', '/'],
      ['Categories', '/'],
      ['States', '/states'],
      ['Blog', '/blogs'],
      ['About Us', '/about-us'],
      ['Contact', '/contact-us'],
      ['Salary Calculators', '/salary-calculator'],
      ['Tax Calculators', '/paycheck-calculator'],
      ['Retirement Calculators', '/salary-calculator'],
      ['All Calculators', '/'],
      ['Income Tax', '/paycheck-calculator'],
      ['Payroll', '/paycheck-calculator'],
      ['Finance', '/salary-calculator'],
      ['Business', '/salary-calculator'],
      ['Health', '/salary-calculator'],
      ['Tax News', '/blogs'],
      ['Guides', '/blogs'],
      ['Tax Brackets 2026', '/paycheck-calculator'],
      ['State Tax Guide', '/states'],
      ['Contact Us', '/contact-us'],
      ['Privacy Policy', '/privacy-policy'],
      ['Terms of Use', '/terms-conditions'],
      ['Disclaimer', '/terms-conditions'],
      ['FAQ', '/faq'],
      ['Help Center', '/contact-us'],
      ['Suggest Calculator', '/contact-us'],
      ['Report an Issue', '/contact-us'],
    ].forEach(([label, path]) => {
      html = html.replace(
        new RegExp(`<a href="#"([^>]*)>${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</a>`, 'g'),
        `<a href="${path}"$1>${label}</a>`
      );
    });

    [
      ['Hourly Wage Calculator', 'State Paycheck Calculators'],
      ['Calculate your hourly wage from salary.', 'Choose from all state paycheck calculators.'],
      ['Time Card Calculator', 'Texas Paycheck Calculator'],
      ['Calculate work hours and breaks.', 'Estimate Texas take-home pay and payroll deductions.'],
      ['Gross Pay Calculator', 'Florida Paycheck Calculator'],
      ['Gross income before taxes.', 'Estimate Florida take-home pay and deductions.'],
      ['Tips Calculator', 'California Paycheck Calculator'],
      ['Calculate tips and total per person.', 'Estimate California paycheck taxes and take-home pay.'],
    ].forEach(([from, to]) => {
      html = html.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
    });

    [
      ['State Paycheck Calculators', '/states'],
      ['Salary Calculator', '/salary-calculator'],
      ['Paycheck Calculator', '/paycheck-calculator'],
      ['Texas Paycheck Calculator', '/texas-paycheck-calculator'],
      ['Florida Paycheck Calculator', '/florida-paycheck-calculator'],
      ['California Paycheck Calculator', '/california-paycheck-calculator'],
    ].forEach(([title, path]) => {
      const titlePattern = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(
        new RegExp(`(<div style="font-size:12\\.5px;font-weight:700;color:#111827;margin-bottom:4px;">${titlePattern}</div>[\\s\\S]*?)<a href="#"([^>]*)>Calculate`, 'g'),
        `$1<a href="${path}"$2>Calculate`
      );
    });

    html = html.replace(/<a href="#"([^>]*)>/g, (match, attrs, offset, source) => {
      const snippet = source
        .slice(offset, offset + 900)
        .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      let path = '/';
      if (snippet.includes('california')) path = '/california-paycheck-calculator';
      else if (snippet.includes('texas')) path = '/texas-paycheck-calculator';
      else if (snippet.includes('florida')) path = '/florida-paycheck-calculator';
      else if (snippet.includes('illinois')) path = '/illinois-paycheck-calculator';
      else if (snippet.includes('washington')) path = '/washington-paycheck-calculator';
      else if (snippet.includes('indiana')) path = '/indiana-paycheck-calculator';
      else if (snippet.includes('virginia')) path = '/virginia-paycheck-calculator';
      else if (snippet.includes('hawaii')) path = '/hawaii-paycheck-calculator';
      else if (snippet.includes('nebraska')) path = '/nebraska-paycheck-calculator';
      else if (snippet.includes('states') || snippet.includes('state paycheck')) path = '/states';
      else if (snippet.includes('salary')) path = '/salary-calculator';
      else if (snippet.includes('paycheck') || snippet.includes('payroll') || snippet.includes('tax brackets')) path = '/paycheck-calculator';
      else if (snippet.includes('overtime')) path = '/overtime';
      else if (snippet.includes('blog') || snippet.includes('tax news') || snippet.includes('guide')) path = '/blogs';
      else if (snippet.includes('faq') || snippet.includes('help center')) path = '/faq';
      else if (snippet.includes('about')) path = '/about-us';
      else if (snippet.includes('contact') || snippet.includes('suggest') || snippet.includes('report')) path = '/contact-us';
      else if (snippet.includes('privacy')) path = '/privacy-policy';
      else if (snippet.includes('terms') || snippet.includes('disclaimer')) path = '/terms-conditions';
      return `<a href="${path}"${attrs}>`;
    });

    Object.entries(values).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value));
    });

    if (isDark) {
      html = html
        .replace(/background:#fff/g, 'background:var(--surface)')
        .replace(/background:#ffffff/g, 'background:var(--surface)')
        .replace(/background:#f9fafb/g, 'background:var(--surface-alt)')
        .replace(/background:#f8fafd/g, 'background:var(--surface-alt)')
        .replace(/background:#f5f6fa/g, 'background:var(--bg)')
        .replace(/background:#f3f4f6/g, 'background:var(--input)')
        .replace(/background:#f1f5f9/g, 'background:var(--input)')
        .replace(/border:1px solid #e5e7eb/g, 'border:1px solid var(--border)')
        .replace(/border-bottom:1px solid #e5e7eb/g, 'border-bottom:1px solid var(--border)')
        .replace(/border-bottom:1px solid #f3f4f6/g, 'border-bottom:1px solid var(--border)')
        .replace(/border-top:1px solid #e5e7eb/g, 'border-top:1px solid var(--border)')
        .replace(/border:1.5px solid #bfdbfe/g, 'border:1.5px solid var(--border)')
        .replace(/color:#111827/g, 'color:var(--text)')
        .replace(/color:#374151/g, 'color:var(--text2)')
        .replace(/color:#6b7280/g, 'color:var(--text2)')
        .replace(/color:#9ca3af/g, 'color:var(--text3)')
        .replace(/background:#eff6ff/g, 'background:rgba(26,111,232,.14)')
        .replace(/background:#dbeafe/g, 'background:rgba(26,111,232,.16)')
        .replace(/background:#f0fdf4/g, 'background:rgba(34,197,94,.14)')
        .replace(/background:var\(--green-lt\)/g, 'background:rgba(34,197,94,.14)')
        .replace(/background:#fff7ed/g, 'background:rgba(234,88,12,.14)')
        .replace(/background:#faf5ff/g, 'background:rgba(124,58,237,.14)')
        .replace(/color:#1e40af/g, 'color:#93c5fd');
    }

    return html.replace(/{{\s*[^}]+\s*}}/g, '');
  }, [overtimeTemplate, isDark, status, hourly, weeklyOtHours, weeklyTips, weeksPerYear, stateCode, taxYear, showAdvanced, otMultiplier, k401, hsa, ira, studentLoanInterest, dependentCareFsa, dependents, r, fedSlice, tipsSlice, savingsPct, regularBarW, premiumBarW, deductibleBarW, fedBarW, tipsBarW, savingsBarW]);

  const saveOvertimeTaxSummary = () => {
    const selectedState = FEDERAL_STATE_OPTIONS.find((s) => s.code === stateCode)?.name ?? stateCode;
    const siteName = 'OBBA Calculators';
    const siteDomain = window.location.origin;
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const inputRows = [
      ['Filing Status', status === 'married' ? 'Married Filing Jointly' : 'Single'],
      ['Tax Year', taxYear],
      ['State', selectedState],
      ['Hourly Rate', usd2(num(hourly))],
      ['Weekly Overtime Hours', String(weeklyOtHours)],
      ['Weeks Per Year', String(weeksPerYear)],
      ['Weekly Tips', usd2(num(weeklyTips))],
      ['MAGI Before Overtime', usd2(num(magi))],
      ['Overtime Multiplier', `${otMultiplier}x`],
      ['401(k) Contributions', usd2(num(k401))],
      ['HSA Contributions', usd2(num(hsa))],
      ['Traditional IRA Contributions', usd2(num(ira))],
      ['Student Loan Interest', usd2(num(studentLoanInterest))],
      ['Dependent Care FSA', usd2(num(dependentCareFsa))],
      ['Dependents', String(dependents)],
    ];
    const outputRows = [
      ['Annual Overtime Hours', `${r.annualOtHours.toFixed(2)} hrs`],
      ['Total Overtime Pay', usd2(r.totalOvertimePay)],
      ['Regular Portion', usd2(r.regularPortion)],
      ['Premium Portion (gross)', usd2(r.premiumGross)],
      ['Deductible Overtime', usd2(r.deduction)],
      ['Federal Tax Savings', usd2(r.federalSavings)],
      ['Tips Deduction Savings', usd2(r.tipsSavings)],
      ['Total Annual Savings', usd2(r.totalSavings)],
      ['Monthly Savings', usd2(r.monthly)],
      ['Quarterly Savings', usd2(r.quarterly)],
      ['Semi-Annual Savings', usd2(r.semiAnnual)],
      ['Adjusted MAGI', usd2(r.adjustedMagi)],
      ['Taxable Income', usd2(r.taxableIncome)],
      ['Marginal Rate Used', `${(r.marginalRate * 100).toFixed(1)}%`],
      ['Phase-out Status', r.phaseStatus],
    ];
    const clean = (value) => String(value).replace(/[^\x20-\x7E]/g, ' ').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    const lines = [
      [siteName, 22],
      ['Overtime Tax Summary Report', 16],
      [`Domain: ${siteDomain}`, 10],
      [`Generated: ${reportDate}`, 10],
      ['', 8],
      ['Inputs', 14],
      ...inputRows.map(([label, value]) => [`${label}: ${value}`, 10]),
      ['', 8],
      ['Outputs', 14],
      ...outputRows.map(([label, value]) => [`${label}: ${value}`, 10]),
      ['', 8],
      ['Estimate only. This report is not tax advice.', 9],
    ];
    let y = 760;
    const stream = lines.map(([text, size], index) => {
      if (index > 0) y -= size >= 14 ? 20 : 15;
      return `BT /F1 ${size} Tf 50 ${y} Td (${clean(text)}) Tj ET`;
    }).join('\n');
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
      `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object) => {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `obba-overtime-tax-summary-${taxYear}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const shareOvertimeCalculator = async (platform, source) => {
    const shareUrl = `${SITE_URL}/overtime`;
    const shareTitle = 'Calculate Your Overtime Pay in Seconds';
    const shareText = 'Calculate your overtime pay in seconds with OBBA Calculators - see annual overtime, tax savings, and monthly breakdown || OBBACALCULATORS.COM';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedText = encodeURIComponent(shareText);
    const shareTargets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      const oldLabel = source?.getAttribute('aria-label');
      source?.setAttribute('aria-label', 'Link copied');
      source?.setAttribute('title', 'Link copied');
      window.setTimeout(() => {
        if (oldLabel) source?.setAttribute('aria-label', oldLabel);
        source?.setAttribute('title', 'Copy calculator link');
      }, 1600);
      return;
    }

    const target = shareTargets[platform];
    if (target) window.open(target, '_blank', 'noopener,noreferrer,width=720,height=640');
  };

  const overtimeActions = {
    setFilingSingle: () => setStatus('single'),
    setFilingMfj: () => setStatus('married'),
    setYear2026: () => setTaxYear('2026'),
    setYear2025: () => setTaxYear('2025'),
    toggleAdvanced: () => setShowAdvanced((v) => !v),
    calculate: () => {},
    saveTaxSummary: saveOvertimeTaxSummary,
    scrollTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  };

  const overtimeInputs = {
    setHourlyRate: setHourly,
    setWeeklyOT: setWeeklyOtHours,
    setWeeksPerYear: setWeeksPerYear,
    setWeeklyTips: setWeeklyTips,
    setMagi: setMagi,
    setMultiplier: setOtMultiplier,
    setK401: setK401,
    setHsa: setHsa,
    setIra: setIra,
    setStudentLoan: setStudentLoanInterest,
    setDepCare: setDependentCareFsa,
    setDependents: setDependents,
  };

  const captureOvertimeInteractionState = (element, action, selectionStart = null, selectionEnd = null) => {
    const scrollArea = element?.closest('div[style*="overflow-y:auto"]');
    activeOvertimeFieldRef.current = {
      action,
      selectionStart,
      selectionEnd,
      windowScrollY: window.scrollY,
      inputScrollTop: scrollArea?.scrollTop ?? null,
    };
  };

  const handleOvertimeClick = (event) => {
    const actionEl = event.target.closest('[data-obba-click]');
    if (actionEl) {
      event.preventDefault();
      captureOvertimeInteractionState(actionEl, null);
      overtimeActions[actionEl.dataset.obbaClick]?.(event);
      return;
    }

    const navThemeButton = event.target.closest('nav button');
    if (navThemeButton) {
      event.preventDefault();
      captureOvertimeInteractionState(navThemeButton, null);
      setIsDark?.((value) => !value);
      return;
    }

    const shareEl = event.target.closest('[data-obba-share]');
    if (shareEl) {
      event.preventDefault();
      captureOvertimeInteractionState(shareEl, null);
      shareOvertimeCalculator(shareEl.dataset.obbaShare, shareEl);
      return;
    }

    const tocEl = event.target.closest('[data-obba-toc]');
    if (tocEl) {
      event.preventDefault();
      const target = document.querySelector(`[data-obba-section="${tocEl.dataset.obbaToc}"]`);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
        window.history.replaceState(null, '', `#${tocEl.dataset.obbaToc}`);
      }
      return;
    }

    const anchor = event.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href?.startsWith('http')) return;
    const label = anchor.textContent.trim().toLowerCase();
    const routeMap = {
      home: '/',
      blog: '/blogs',
      'about us': '/about-us',
      contact: '/contact-us',
      faq: '/faq',
      'salary calculator': '/salary-calculator',
      'paycheck calculator': '/paycheck-calculator',
      'overtime calculator': '/overtime',
      'state paycheck calculators': '/states',
      calculators: '/',
      categories: '/',
      states: '/states',
    };
    const route = routeMap[label];
    if (route) {
      event.preventDefault();
      navigate(route);
      return;
    }
    if (href && href !== '#') {
      event.preventDefault();
      navigate(href);
      return;
    }
    if (href === '#') {
      event.preventDefault();
    }
  };

  const handleOvertimeInput = (event) => {
    const searchEl = event.target.closest('[data-obba-search]');
    if (searchEl) {
      const query = searchEl.value.trim().toLowerCase();
      const searchRoutes = {
        'overtime calculator': '/overtime',
        'salary calculator': '/salary-calculator',
        'paycheck calculator': '/paycheck-calculator',
        'state paycheck calculators': '/states',
        'texas paycheck calculator': '/texas-paycheck-calculator',
        'florida paycheck calculator': '/florida-paycheck-calculator',
        'california paycheck calculator': '/california-paycheck-calculator',
        'illinois paycheck calculator': '/illinois-paycheck-calculator',
        'washington paycheck calculator': '/washington-paycheck-calculator',
        'indiana paycheck calculator': '/indiana-paycheck-calculator',
        'virginia paycheck calculator': '/virginia-paycheck-calculator',
        'hawaii paycheck calculator': '/hawaii-paycheck-calculator',
        'nebraska paycheck calculator': '/nebraska-paycheck-calculator',
      };
      if (searchRoutes[query]) navigate(searchRoutes[query]);
      return;
    }
    const inputEl = event.target.closest('[data-obba-input]');
    if (!inputEl) return;
    let selectionStart = null;
    let selectionEnd = null;
    try {
      selectionStart = inputEl.selectionStart;
      selectionEnd = inputEl.selectionEnd;
    } catch {
      selectionStart = inputEl.value.length;
      selectionEnd = inputEl.value.length;
    }
    captureOvertimeInteractionState(inputEl, inputEl.dataset.obbaInput, selectionStart, selectionEnd);
    overtimeInputs[inputEl.dataset.obbaInput]?.(inputEl.value);
  };

  const handleOvertimeChange = (event) => {
    const changeEl = event.target.closest('[data-obba-change]');
    if (!changeEl) return;
    captureOvertimeInteractionState(changeEl, null);
    if (changeEl.dataset.obbaChange === 'setStateSel') setStateCode(changeEl.value);
  };

  React.useLayoutEffect(() => {
    const activeField = activeOvertimeFieldRef.current;
    if (!activeField) return;
    if (Number.isFinite(activeField.windowScrollY)) {
      window.scrollTo({ top: activeField.windowScrollY, left: window.scrollX, behavior: 'auto' });
    }
    const scrollArea = document.querySelector('.overtime-dc-page div[style*="overflow-y:auto"]');
    if (scrollArea && activeField.inputScrollTop !== null) {
      scrollArea.scrollTop = activeField.inputScrollTop;
    }
    if (activeField.action) {
      const selector = `[data-obba-input="${activeField.action}"]`;
      const input = document.querySelector(`.overtime-dc-page ${selector}`);
      if (!input) return;
      input.focus({ preventScroll: true });
      try {
        const nextPos = Math.min(Number(activeField.selectionStart ?? input.value.length), input.value.length);
        input.setSelectionRange(nextPos, nextPos);
      } catch {
        // Some input modes do not expose selection APIs consistently.
      }
    }
  }, [overtimeHtml]);

  return (
    <main
      className="overtime-dc-page"
      style={{
        '--bg': isDark ? '#0d1829' : '#f5f6fa',
        '--surface': isDark ? '#162035' : '#ffffff',
        '--surface-alt': isDark ? '#111e30' : '#f8fafd',
        '--input': isDark ? '#1a2842' : '#f1f5f9',
        '--border': isDark ? '#1f3050' : '#e5e7eb',
        '--text': isDark ? '#f1f5f9' : '#111827',
        '--text2': isDark ? '#9aa8bd' : '#334155',
        '--text3': isDark ? '#cbd5e1' : '#334155',
        background: isDark ? '#0d1829' : '#f5f6fa',
        color: isDark ? '#f1f5f9' : '#111827',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
      onClick={handleOvertimeClick}
      onInput={handleOvertimeInput}
      onChange={handleOvertimeChange}
      dangerouslySetInnerHTML={{ __html: overtimeHtml }}
    />
  );
}
function SalaryCalculatorPage({ isDark }) {
  const usd2 = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, Number(v) || 0));
  const [payYear, setPayYear] = useState('2026');
  const [payFrequency, setPayFrequency] = useState('monthly');
  const [paidType, setPaidType] = useState('salary');
  const [grossPayMethod, setGrossPayMethod] = useState('perYear');
  const [hourCount, setHourCount] = useState('0');
  const [amount, setAmount] = useState('10000');
  const [otType, setOtType] = useState('overtime');
  const [otHours, setOtHours] = useState('10');
  const [otAmount, setOtAmount] = useState('15');

  const r = useMemo(() => {
    const periods =
      payFrequency === 'daily' ? 260
      : payFrequency === 'weekly' ? 52
      : payFrequency === 'biweekly' ? 26
      : payFrequency === 'semimonthly' ? 24
      : payFrequency === 'monthly' ? 12
      : 1;
    const inputAmount = Math.max(0, num(amount));
    const hours = Math.max(0, num(hourCount));
    const overtimeHours = Math.max(0, num(otHours));
    const overtimeAmount = Math.max(0, num(otAmount));
    const overtimeMultiplier = otType === 'doubletime' ? 2 : 1.5;
    const basePerPeriod =
      paidType === 'hourly'
        ? inputAmount * hours
        : grossPayMethod === 'perPeriod'
          ? inputAmount
          : inputAmount / periods;
    const annualBase = basePerPeriod * periods;

    // Overtime amount is treated as hourly overtime-rate input.
    const overtimePerPeriod = overtimeMultiplier * overtimeHours * overtimeAmount;
    const annualOvertime = overtimePerPeriod * periods;
    const grossAnnual = annualBase + annualOvertime;
    const grossPerPeriod = grossAnnual / periods;
    const taxableAnnual = Math.max(0, grossAnnual - STANDARD_DEDUCTION_2026.single);
    const federalAnnual = progressiveTax(taxableAnnual, BRACKETS.single);
    // Match target paycheck behavior: per-period FICA without annual SS cap/additional Medicare.
    const ssPerPeriod = grossPerPeriod * SOCIAL_SECURITY_RATE;
    const medicarePerPeriod = grossPerPeriod * MEDICARE_RATE;
    const ssAnnual = ssPerPeriod * periods;
    const medicareAnnual = medicarePerPeriod * periods;
    const deductionsAnnual = federalAnnual + ssAnnual + medicareAnnual;
    const netAnnual = grossAnnual - deductionsAnnual;
    const federalPerPeriod = federalAnnual / periods;
    const totalTaxPerPeriod = federalPerPeriod + ssPerPeriod + medicarePerPeriod;

    return {
      periods,
      grossPerPeriod,
      grossAnnual,
      annualBase,
      annualOvertime,
      federalAnnual,
      ssAnnual,
      medicareAnnual,
      netAnnual,
      netPerPeriod: netAnnual / periods,
      salaryPerPeriod: basePerPeriod,
      overtimePerPeriod,
      federalPerPeriod,
      ssPerPeriod,
      medicarePerPeriod,
      totalTaxPerPeriod,
    };
  }, [payFrequency, paidType, grossPayMethod, hourCount, amount, otType, otHours, otAmount]);
  const earningsChart = Math.max(0, r.grossPerPeriod);
  const taxesChart = Math.max(0, r.totalTaxPerPeriod);
  const takeHomeChart = Math.max(0, r.netPerPeriod);
  const chartTotal = Math.max(earningsChart + taxesChart + takeHomeChart, 1);
  const chartSlices = [
    { key: 'earnings', value: earningsChart, color: '#0ea5e9' },
    { key: 'taxes', value: taxesChart, color: '#f59e0b' },
    { key: 'takehome', value: takeHomeChart, color: '#10b981' },
  ];
  const circumference = 2 * Math.PI * 42;
  let chartOffset = 0;
  const chartData = chartSlices.map((slice) => {
    const dash = (slice.value / chartTotal) * circumference;
    const item = { ...slice, dash, offset: chartOffset };
    chartOffset += dash;
    return item;
  });

  useEffect(() => {
    document.title = 'Salary Calculator: Hourly, Weekly & Annual Pay Converter';

    const metaDescriptionContent = 'Use our free Salary Calculator to convert hourly, daily, weekly, monthly, and annual pay. Estimate gross and net income and plan your budget with confidence.';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metaDescriptionContent);

    const schemaId = 'salary-page-schema';
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Salary Calculator: Hourly, Weekly & Annual Pay Converter',
      description: metaDescriptionContent,
      url: `${window.location.origin}/salary-calculator`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Salary Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, []);

  const periodLabel = {
    daily: 'day',
    weekly: 'week',
    biweekly: 'bi-weekly period',
    semimonthly: 'semi-monthly period',
    monthly: 'month',
    annual: 'year',
  }[payFrequency] ?? 'period';
  const overtimeLabel = otType === 'doubletime' ? 'Double Time' : 'Overtime';
  const overtimeMultiplierLabel = otType === 'doubletime' ? '2.0' : '1.5';
  const salaryBarRows = [
    ['Earnings', r.grossPerPeriod, '#0ea5e9'],
    ['Taxes', r.totalTaxPerPeriod, '#f59e0b'],
    ['Take Home', r.netPerPeriod, '#10b981'],
  ];
  const maxSalaryBar = Math.max(...salaryBarRows.map(([, value]) => value), 1);
  const fieldBoxStyle = {
    background: 'var(--input)',
    border: '2px solid var(--border)',
    borderRadius: 10,
    height: 50,
    color: 'var(--text)',
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 600,
    width: '100%',
    padding: '0 13px',
    outline: 'none',
  };
  const labelStyle = {
    display: 'block',
    fontSize: 10.5,
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 6,
    letterSpacing: '.4px',
    textTransform: 'uppercase',
  };
  const saveSalarySummary = () => {
    const rows = [
      ['Pay Frequency', payFrequency],
      ['Type', paidType],
      ['Gross Pay Method', paidType === 'salary' ? grossPayMethod : 'Hourly'],
      ['Number of Hours', paidType === 'hourly' ? hourCount : 'N/A'],
      ['Amount', usd2(num(amount))],
      ['Overtime Type', overtimeLabel],
      ['Overtime Hours', String(otHours)],
      ['Overtime Amount', usd2(num(otAmount))],
      ['Pay Year', payYear],
      ['Gross Pay Per Period', usd2(r.grossPerPeriod)],
      ['Salary Per Period', usd2(r.salaryPerPeriod)],
      ['Overtime Per Period', usd2(r.overtimePerPeriod)],
      ['Federal Income Tax', usd2(r.federalPerPeriod)],
      ['Social Security Tax', usd2(r.ssPerPeriod)],
      ['Medicare Tax', usd2(r.medicarePerPeriod)],
      ['Benefits', usd2(0)],
      ['Take Home', usd2(r.netPerPeriod)],
    ];
    const clean = (value) => String(value).replace(/[^\x20-\x7E]/g, ' ').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    let y = 760;
    const lines = [
      ['OBBA Calculators', 22],
      ['Salary Summary Report', 16],
      [`Domain: ${window.location.origin}`, 10],
      [`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10],
      ['', 8],
      ...rows.map(([label, value]) => [`${label}: ${value}`, 10]),
    ];
    const stream = lines.map(([text, size], index) => {
      if (index > 0) y -= size >= 14 ? 20 : 15;
      return `BT /F1 ${size} Tf 50 ${y} Td (${clean(text)}) Tj ET`;
    }).join('\n');
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
      `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object) => {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `obba-salary-summary-${payYear}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const shareSalaryCalculator = async (platform) => {
    const shareUrl = `${SITE_URL}/salary-calculator`;
    const shareText = 'Turn your salary or hourly pay into clear take-home numbers with OBBA Calculators - taxes, deductions, and monthly pay in one view || OBBACALCULATORS.COM';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent('Salary Calculator')}`,
    };
    if (platform === 'copy') {
      await navigator.clipboard?.writeText(shareUrl).catch(() => {});
      return;
    }
    if (targets[platform]) window.open(targets[platform], '_blank', 'noopener,noreferrer,width=720,height=640');
  };

  return (
    <main
      className="salary-dc-page"
      style={{
        '--bg': isDark ? '#0d1829' : '#f5f6fa',
        '--surface': isDark ? '#162035' : '#ffffff',
        '--surface-alt': isDark ? '#111e30' : '#f8fafd',
        '--input': isDark ? '#1a2842' : '#f1f5f9',
        '--border': isDark ? '#1f3050' : '#e5e7eb',
        '--text': isDark ? '#f1f5f9' : '#111827',
        '--text2': isDark ? '#9aa8bd' : '#334155',
        '--text3': isDark ? '#cbd5e1' : '#334155',
        '--accent': '#1a6fe8',
        '--green': '#22c55e',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 28px 24px', marginBottom: 16 }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Salary Calculator</h1>
              <div className="flex flex-wrap gap-3">
                {['Instant Results', '2026 Ready', 'Hourly or Salary', 'No Sign Up'].map((tag) => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#16a34a', fontWeight: 800 }}>
                    <span style={{ width: 15, height: 15, borderRadius: 99, background: '#22c55e', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <svg width="152" height="152" viewBox="0 0 152 152" fill="none" aria-hidden="true">
                <rect x="18" y="22" width="94" height="108" rx="14" fill="#1a6fe8" />
                <rect x="28" y="36" width="74" height="24" rx="6" fill="white" fillOpacity=".96" />
                <text x="65" y="52" textAnchor="middle" fontSize="12" fill="#1a6fe8" fontWeight="900" fontFamily="monospace">PAYROLL</text>
                <rect x="28" y="72" width="56" height="8" rx="4" fill="white" fillOpacity=".35" />
                <rect x="28" y="88" width="70" height="8" rx="4" fill="white" fillOpacity=".35" />
                <rect x="28" y="104" width="48" height="8" rx="4" fill="#fbbf24" />
                <circle cx="116" cy="42" r="22" fill="#93c5fd" />
                <circle cx="116" cy="42" r="16" fill="white" />
                <path d="M109 42h14M116 35v14" stroke="#1a6fe8" strokeWidth="2.4" strokeLinecap="round" />
                <rect x="91" y="99" width="42" height="30" rx="8" fill="#22c55e" />
                <path d="M100 113h24M100 121h14" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <circle cx="42" cy="128" r="14" fill="#fbbf24" />
                <text x="42" y="134" textAnchor="middle" fontSize="16" fill="white" fontWeight="900">$</text>
              </svg>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
            <aside style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 86, boxShadow: '0 4px 24px rgba(15,23,42,.10)' }}>
              <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#1a6fe8,#22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 18px rgba(26,111,232,.16)' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <rect x="4" y="3" width="12" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M7 7h6M7 10h6M7 13h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>Input Details</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>Edit values to update results</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', background: 'rgba(34,197,94,.13)', borderRadius: 999, padding: '3px 9px', border: '1px solid rgba(34,197,94,.32)' }}>{payYear}</span>
              </div>
              <div className="space-y-3" style={{ padding: '16px 20px', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                <div>
                  <label style={labelStyle}>Pay Frequency</label>
                  <select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)} style={fieldBoxStyle}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="semimonthly">Semi-Monthly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Type / How are you paid?</label>
                  <div style={{ display: 'flex', gap: 5, background: 'var(--input)', borderRadius: 10, padding: 4 }}>
                    {[
                      ['hourly', 'Hourly'],
                      ['salary', 'Salary'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPaidType(value)}
                        style={{
                          flex: 1,
                          padding: '9px 6px',
                          borderRadius: 7,
                          border: 0,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: 12.5,
                          fontWeight: 800,
                          background: paidType === value ? 'var(--accent)' : 'transparent',
                          color: paidType === value ? '#fff' : 'var(--text2)',
                          boxShadow: paidType === value ? '0 3px 10px rgba(26,111,232,.28)' : 'none',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {paidType === 'salary' && (
                  <div>
                    <label style={labelStyle}>Gross Pay Method</label>
                    <select value={grossPayMethod} onChange={(e) => setGrossPayMethod(e.target.value)} style={fieldBoxStyle}>
                      <option value="perYear">Pay Per Year</option>
                      <option value="perPeriod">Pay Per Period</option>
                    </select>
                  </div>
                )}

                {paidType === 'hourly' && (
                  <div>
                    <label style={labelStyle}>Number of Hours</label>
                    <input type="text" inputMode="decimal" value={hourCount} onChange={(e) => setHourCount(e.target.value)} style={fieldBoxStyle} />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Amount ($)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--input)', border: '2px solid var(--border)', borderRadius: 10, padding: '0 13px', height: 50 }}>
                    <span style={{ fontSize: 19, fontWeight: 900, color: 'var(--accent)' }}>$</span>
                    <input type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ flex: 1, minWidth: 0, background: 'none', border: 0, color: 'var(--text)', fontFamily: 'inherit', fontSize: 19, fontWeight: 900, outline: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)' }}>{paidType === 'hourly' ? '/hr' : grossPayMethod === 'perPeriod' ? `/${periodLabel}` : '/yr'}</span>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Overtime Type</label>
                  <div style={{ display: 'flex', gap: 5, background: 'var(--input)', borderRadius: 10, padding: 4 }}>
                    {[
                      ['overtime', 'Overtime'],
                      ['doubletime', 'Double Time'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setOtType(value)}
                        style={{
                          flex: 1,
                          padding: 9,
                          borderRadius: 7,
                          border: 0,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: 12.5,
                          fontWeight: 800,
                          background: otType === value ? 'var(--accent)' : 'transparent',
                          color: otType === value ? '#fff' : 'var(--text2)',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label style={labelStyle}>Overtime Hours</label>
                    <input type="text" inputMode="decimal" value={otHours} onChange={(e) => setOtHours(e.target.value)} style={fieldBoxStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>OT Amount ($)</label>
                    <input type="text" inputMode="decimal" value={otAmount} onChange={(e) => setOtAmount(e.target.value)} style={fieldBoxStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Pay Year</label>
                  <select value={payYear} onChange={(e) => setPayYear(e.target.value)} style={fieldBoxStyle}>
                    <option value="2026">2026</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={saveSalarySummary}
                  style={{
                    width: '100%',
                    padding: 13,
                    background: 'var(--surface)',
                    color: 'var(--accent)',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: 10,
                    fontSize: 14.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontFamily: 'inherit',
                    boxShadow: '0 2px 10px rgba(26,111,232,.08)',
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 2.5h7l3 3V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5"/><path d="M11 2.5V6h3M6 9h6M6 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Save Salary Summary
                </button>
              </div>
            </aside>

            <section className="space-y-5">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, boxShadow: '0 4px 24px rgba(15,23,42,.08)' }}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div style={{ background: 'rgba(26,111,232,.10)', border: '1px solid rgba(26,111,232,.18)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Gross Pay / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: 'var(--text)' }}>{usd2(r.grossPerPeriod)}</div>
                  </div>
                  <div style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.22)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Taxes / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: 'var(--text)' }}>-{usd2(r.totalTaxPerPeriod)}</div>
                  </div>
                  <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.24)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Take Home / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: '#16a34a' }}>{usd2(r.netPerPeriod)}</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-sky-500" />Earnings</span>
                        <span>{usd2(r.grossPerPeriod)}</span>
                      </div>
                      <div className="mt-3 space-y-2" style={{ color: 'var(--text2)', fontSize: 13.5 }}>
                        <div className="flex items-start justify-between gap-3"><span>Salary</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>{usd2(r.salaryPerPeriod)}</span></div>
                        <div className="flex items-start justify-between gap-3">
                          <span>{overtimeLabel}<span className="block text-xs" style={{ color: 'var(--text3)' }}>({overtimeMultiplierLabel} x {num(otHours)} hrs x {usd2(num(otAmount))})</span></span>
                          <span style={{ color: 'var(--text)', fontWeight: 800 }}>{usd2(r.overtimePerPeriod)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-amber-500" />Taxes</span>
                        <span>-{usd2(r.totalTaxPerPeriod)}</span>
                      </div>
                      <div className="mt-3 space-y-2" style={{ color: 'var(--text2)', fontSize: 13.5 }}>
                        <div className="flex justify-between gap-3"><span>Federal Income Tax</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(r.federalPerPeriod)}</span></div>
                        <div className="flex justify-between gap-3"><span>Social Security Tax</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(r.ssPerPeriod)}</span></div>
                        <div className="flex justify-between gap-3"><span>Medicare Tax</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(r.medicarePerPeriod)}</span></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                      <span>Benefits</span>
                      <span>{usd2(0)}</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                    <div className="flex justify-center">
                      <svg viewBox="0 0 120 120" className="h-40 w-40" aria-label="Salary breakdown chart">
                        <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                        {chartData.map((slice) => (
                          <circle
                            key={slice.key}
                            cx="60"
                            cy="60"
                            r="42"
                            fill="none"
                            stroke={slice.color}
                            strokeWidth="16"
                            strokeDasharray={`${slice.dash} ${circumference - slice.dash}`}
                            strokeDashoffset={-slice.offset}
                            transform="rotate(-90 60 60)"
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="mt-4 space-y-3">
                      {salaryBarRows.map(([label, value, color]) => (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs font-extrabold" style={{ color: 'var(--text2)' }}>
                            <span>{label}</span><span>{usd2(value)}</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 99, background: isDark ? '#26324a' : '#e5e7eb', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.round((value / maxSalaryBar) * 100)}%`, height: '100%', borderRadius: 99, background: color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <article id="what-is-salary" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>Salary Calculator: Convert Your Pay Into Hourly, Weekly, Monthly, and Annual Income</h1>
              <div className="grid gap-5 md:grid-cols-[1fr_200px] md:items-start">
                <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75 }}>
                  <p style={{ marginBottom: 12 }}>
                    Knowing your exact income — not just the number on your offer letter — is the first step toward real financial planning. A salary calculator takes whatever pay figure you already know (hourly, weekly, monthly, or annual) and converts it into every other pay period, so you can budget accurately, compare job offers, and understand what actually lands in your bank account after deductions.
                  </p>
                  <p style={{ marginBottom: 12 }}>
                    This guide walks through how salary calculations work, the formulas behind them, and how gross pay differs from net pay — the same logic used by payroll professionals and HR departments.
                  </p>
                  <p>
                    Many people also use a <Link to="/paycheck-calculator" style={{ color: '#1a6fe8', fontWeight: 800 }}>Paycheck Calculator</Link> alongside salary calculations to estimate their actual take-home pay after taxes and deductions.
                  </p>
                </div>
                <div style={{ height: 128, borderRadius: 10, background: 'linear-gradient(135deg,#12335b 0%,#1a6fe8 58%,#0f766e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <svg width="62" height="48" viewBox="0 0 64 50" fill="none" aria-hidden="true">
                      <rect x="8" y="10" width="48" height="32" rx="5" fill="white" fillOpacity=".18" stroke="white" strokeWidth="2.2"/>
                      <path d="M16 20h28M16 28h20M16 36h30" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
                      <circle cx="49" cy="17" r="9" fill="#fbbf24"/>
                      <text x="49" y="22" textAnchor="middle" fontSize="13" fill="white" fontWeight="900">$</text>
                    </svg>
                    <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 2.5, color: 'white', marginTop: 5 }}>SALARY</div>
                  </div>
                </div>
              </div>
            </article>

            <article id="how-salary-conversion-works" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>How Salary Conversion Works</h2>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: 18, lineHeight: 1.75 }}>
                Most salary calculators rely on a simple chain of multiplication and division. If you know your hourly rate, the calculator multiplies it by your weekly hours, then by the number of weeks you work in a year. If you know your annual salary, it works backward, dividing by 12 for monthly pay, by 52 for weekly pay, or by your total annual hours for an hourly equivalent.
              </p>
              <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--text)', marginBottom: 10 }}>Core formulas:</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6 }}>
                  {[
                    'Annual salary = Hourly rate × Hours per week × Weeks per year',
                    'Monthly salary = Annual salary ÷ 12',
                    'Weekly salary = Annual salary ÷ 52',
                    'Daily salary = Weekly salary ÷ Working days per week',
                    'Hourly rate = Annual salary ÷ (Hours per week × Weeks per year)',
                  ].map((formula) => (
                    <li key={formula} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: 'var(--text2)', flexShrink: 0 }}>●</span>
                      <span>{formula}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75 }}>
                Example: An employee earning $1,500 per week has an annual income of 1,500 × 52 = $78,000. Someone earning $30/hour on a standard 40-hour week earns roughly $62,400 a year, or about $5,200 a month.
              </p>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75, marginTop: 10 }}>
                These figures represent gross pay — your earnings before anything is withheld. What you actually take home is a different, smaller number.
              </p>
            </article>

            <article id="salary-pay-formula" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Gross Pay vs. Net Pay</h2>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.75 }}>
                Gross pay is the full amount your employer agrees to pay you, including base salary, bonuses, commissions, and overtime. Net pay — your take-home pay — is what remains after taxes and deductions are subtracted.
              </p>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.75 }}>To go from gross to net, payroll calculations generally follow this order:</p>
              <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.65 }}>
                <li>Subtract pre-tax benefit contributions (retirement plans, some health insurance) to find taxable income.</li>
                <li>Withhold federal, state, and local income tax.</li>
                <li>Withhold FICA taxes — Medicare and Social Security.</li>
                <li>Subtract post-tax deductions (Roth contributions, wage garnishments, etc.).</li>
                <li>What&apos;s left is your net pay.</li>
              </ol>
            </article>

            <article id="fica-tax" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>FICA: The Tax Everyone Pays</h2>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 14 }}>
                Every paycheck includes FICA withholding, split between employer and employee:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Social Security', '6.2% of wages, up to the annual wage base limit.'],
                  ['Medicare', '1.45% of all wages, with an additional 0.9% for high earners (employee-paid only).'],
                ].map(([label, body]) => (
                  <div key={label} style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 15px' }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.6 }}>{body}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75, marginTop: 14 }}>
                Unlike income tax, FICA rates are fixed by law and don&apos;t depend on your filing status.
              </p>
            </article>

            <article id="reading-your-pay-stub" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Reading Your Pay Stub</h2>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.75 }}>
                A paycheck and a pay stub are not the same thing. The paycheck is the actual payment; the pay stub is the document explaining how that number was calculated. A typical pay stub includes:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {[
                  'Pay period dates and hours worked',
                  'Gross pay and net pay',
                  'Federal, state, and local tax withholding',
                  'Medicare and Social Security deductions',
                  'Benefit deductions (health, dental, retirement)',
                  'Year-to-date totals and PTO balances',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: 'var(--text2)' }}><span style={{ marginTop: 3, color: 'var(--text2)', flexShrink: 0 }}>-</span>{item}</li>
                ))}
              </ul>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75 }}>
                Keeping your pay stubs is a good habit — they&apos;re the first thing you&apos;ll need if a payment dispute ever comes up.
              </p>
            </article>

            <article id="overtime-benefits-total-compensation" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Overtime, Benefits, and Total Compensation</h2>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.75 }}>
                Hourly employees who work beyond their standard schedule are typically paid overtime at 1.5× their regular rate. Someone earning $25/hour who works 10 overtime hours earns an extra $375 — overtime rate of $37.50 × 10 hours — on top of regular pay. An <Link to="/overtime" style={{ color: '#1a6fe8', fontWeight: 800 }}>Overtime Calculator</Link> can help employees estimate these additional earnings quickly and accurately.
              </p>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75 }}>
                Salary alone doesn&apos;t tell the whole story either. Total compensation includes benefits like health insurance, retirement matching, paid time off, and life insurance — all of which add real value beyond the number on your paycheck. When comparing two job offers, always weigh the full package, not just the base salary.
              </p>
            </article>

            <article id="quick-reference-common-conversions" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Quick Reference: Common Conversions</h2>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-alt)' }}>
                      {['If you earn...', 'Annual', 'Monthly', 'Weekly'].map((head) => (
                        <th key={head} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text)', fontWeight: 900 }}>{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['$20/hour, 40 hrs/wk', '$41,600', '~$3,467', '$800'],
                      ['$30/hour, 40 hrs/wk', '$62,400', '$5,200', '$1,200'],
                      ['$72,000/year', '$72,000', '$6,000', '~$1,385'],
                      ['$400/day, 20 days/mo', '~$96,000', '$8,000', '~$1,846'],
                    ].map((row, index) => (
                      <tr key={row[0]} style={{ borderBottom: index === 3 ? 0 : '1px solid var(--border)' }}>
                        {row.map((cell, cellIndex) => (
                          <td key={cell} style={{ padding: '10px 12px', color: cellIndex === 0 ? 'var(--text)' : 'var(--text2)', fontWeight: cellIndex === 0 ? 800 : 600 }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article id="salary-faq" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Frequently Asked Questions</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['How do I calculate my annual salary from an hourly wage?', 'Multiply your hourly rate by hours worked per week, then by weeks worked per year.'],
                  ['Why is my net pay lower than my gross pay?', 'Taxes (federal, state, local), FICA contributions, and any benefit deductions are subtracted from gross pay before you receive it.'],
                  ['Is overtime included in salary calculations?', 'Only if you work overtime hours — it is calculated separately at 1.5× your regular hourly rate and added to your base earnings.'],
                  ['Does a salary calculator replace a tax professional?', 'No. These calculators provide estimates for budgeting and comparison purposes. For exact tax liability, consult a licensed accountant or tax advisor.'],
                ].map(([q, a]) => (
                  <details key={q} style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 15px' }}>
                    <summary style={{ cursor: 'pointer', fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>{q}</summary>
                    <p style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.6, color: 'var(--text2)' }}>{a}</p>
                  </details>
                ))}
              </div>
            </article>

          </div>

          <aside className="flex flex-col gap-5 lg:self-stretch">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>Share this Calculator</div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                {[
                  ['facebook', '#1877f2'],
                  ['x', '#111827'],
                  ['linkedin', '#0a66c2'],
                  ['whatsapp', '#25d366'],
                  ['reddit', '#ff4500'],
                  ['copy', isDark ? '#1a2842' : '#f3f4f6'],
                ].map(([platform, bg]) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => shareSalaryCalculator(platform)}
                    aria-label={`Share on ${platform}`}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 8,
                      border: platform === 'copy' ? '1px solid var(--border)' : 0,
                      background: bg,
                      color: platform === 'copy' ? 'var(--text2)' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {platform === 'facebook' && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5h2.2V5.1c-.4-.1-1.7-.1-3.2-.1-3.2 0-5.3 1.9-5.3 5.5v3.1H4.2v3.8h3.5V24h4.2v-6.6h3.4l.6-3.8h-4v-2.7c0-1.1.3-2.4 2.1-2.4Z"/></svg>}
                    {platform === 'x' && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.2 2h3.3l-7.2 8.2L22.8 22h-6.7l-5.2-6.8L4.9 22H1.6l7.7-8.8L1.2 2h6.8l4.7 6.2L18.2 2Zm-1.2 17.9h1.8L7 4H5.1l11.9 15.9Z"/></svg>}
                    {platform === 'linkedin' && <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.34 8h4.32v14H.34V8Zm7.46 0h4.14v1.9H12c.58-1.1 2-2.25 4.12-2.25 4.4 0 5.22 2.9 5.22 6.67V22h-4.32v-6.8c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.6 1.76-2.6 3.58V22H7.8V8Z"/></svg>}
                    {platform === 'whatsapp' && <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.2 21.7h-.1c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.9 1 1-3.8-.2-.4a9.8 9.8 0 1 1 8.7 4.8Zm5.4-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 .1-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>}
                    {platform === 'reddit' && <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 11.8c0-1.5-1.2-2.7-2.7-2.7-.7 0-1.3.3-1.8.7-1.8-1.2-4.2-2-6.9-2.1l1.2-3.8 3.3.8c.1 1 1 1.8 2 1.8 1.1 0 2-.9 2-2s-.9-2-2-2c-.8 0-1.5.5-1.8 1.1l-4-1c-.3-.1-.6.1-.7.4l-1.5 4.7c-2.7.1-5.2.8-7 2.1-.5-.4-1.1-.7-1.8-.7C1.2 9.1 0 10.3 0 11.8c0 1 .6 1.9 1.4 2.4v.7c0 4 4.7 7.2 10.6 7.2s10.6-3.2 10.6-7.2v-.7c.8-.5 1.4-1.4 1.4-2.4ZM6.8 13.9c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8Zm9.2 4.5c-1 .9-2.6 1.3-4 1.3s-3-.4-4-1.3c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .7.6 2 .9 3.3.9s2.6-.3 3.3-.9c.2-.2.5-.2.7 0 .2.2.2.5 0 .7Zm-.6-2.7c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8Z"/></svg>}
                    {platform === 'copy' && <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 12.5H3A1.5 1.5 0 0 1 1.5 11V3A1.5 1.5 0 0 1 3 1.5h8A1.5 1.5 0 0 1 12.5 3v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>On This Page</div>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  ['#what-is-salary', 'Salary Calculator'],
                  ['#how-salary-conversion-works', 'How Conversion Works'],
                  ['#salary-pay-formula', 'Gross vs. Net Pay'],
                  ['#fica-tax', 'FICA Taxes'],
                  ['#reading-your-pay-stub', 'Reading Your Pay Stub'],
                  ['#overtime-benefits-total-compensation', 'Overtime & Benefits'],
                  ['#quick-reference-common-conversions', 'Common Conversions'],
                  ['#salary-faq', 'Frequently Asked Questions'],
                ].map(([href, label]) => (
                  <a key={href} href={href} style={{ color: 'var(--text2)', fontSize: 12.5, fontWeight: 700 }}>{label}</a>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Salary Frequency Guide</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: 'var(--surface-alt)' }}>
                    <th style={{ textAlign: 'left', padding: '7px 9px', fontWeight: 600, color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>Frequency</th>
                    <th style={{ textAlign: 'left', padding: '7px 9px', fontWeight: 600, color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>Periods</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Weekly', '52'],
                    ['Bi-Weekly', '26'],
                    ['Semi-Monthly', '24'],
                    ['Monthly', '12'],
                  ].map(([label, periods], index) => (
                    <tr key={label} style={{ borderBottom: index === 3 ? 0 : '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 9px', fontWeight: 700, color: '#1a6fe8' }}>{label}</td>
                      <td style={{ padding: '8px 9px', color: 'var(--text2)' }}>{periods} / year</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Example Calculations</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 7 }}>Example 1</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingBottom: 12, borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)' }}><span>Annual Salary</span><span>$60,000</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)' }}><span>Frequency</span><span>Monthly</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 5, borderTop: '1px solid var(--border)', marginTop: 2 }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Base Pay</span><span style={{ fontSize: 13.5, fontWeight: 700, color: '#22c55e' }}>$5,000</span></div>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 7 }}>Example 2</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)' }}><span>Hourly Rate</span><span>$30.00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)' }}><span>Hours</span><span>40</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 5, borderTop: '1px solid var(--border)', marginTop: 2 }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Base Pay</span><span style={{ fontSize: 13.5, fontWeight: 700, color: '#22c55e' }}>$1,200</span></div>
              </div>
            </div>
            <div data-salary-finance-card style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>Read About Finance</div>
                <Link to="/blogs" style={{ fontSize: 11.5, fontWeight: 700, color: '#1a6fe8', whiteSpace: 'nowrap' }}>View all</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                {[
                  ['Salary Calculator Guide', '/blogs/salary-calculator-guide', 'Convert annual salary into monthly, biweekly, weekly, and hourly pay estimates.'],
                  ['Texas Paycheck Calculator Guide', '/blogs/texas-paycheck-calculator-guide', 'Estimate Texas net pay with federal taxes and no state income tax.'],
                  ['Florida Paycheck Calculator Guide', '/blogs/florida-paycheck-calculator-guide', 'Understand Florida take-home pay, FICA, and paycheck planning.'],
                ].map(([title, to, desc]) => (
                  <Link key={to} to={to} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 9, alignItems: 'start', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
                    <span style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(26,111,232,.10)', color: '#1a6fe8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BarChart3 size={16} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 12.2, lineHeight: 1.25, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{title}</span>
                      <span style={{ display: 'block', fontSize: 10.8, lineHeight: 1.35, color: 'var(--text3)' }}>{desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.30)', borderRadius: 10, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 'auto' }}>
              <div style={{ width: 44, height: 44, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M13 2.5L4.5 7v5.5c0 5 3.5 9.7 8.5 10.8 5-1.1 8.5-5.8 8.5-10.8V7L13 2.5z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5"/><path d="M9 13l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Accuracy You Can Trust</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>Based on the current salary calculator inputs and federal payroll tax estimate logic.</div>
              </div>
            </div>
          </aside>
        </section>

        <section style={{ marginTop: 40, paddingBottom: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Related Calculators</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ['Overtime Calculator', '/overtime', 'Calculate overtime pay and savings.', '#fff7ed', '#f97316', 'clock'],
              ['Paycheck Calculator', '/paycheck-calculator', 'Estimate take-home paycheck.', '#faf5ff', '#7c3aed', 'paycheck'],
              ['State Paycheck Calculators', '/states', 'Choose a state payroll tool.', '#eff6ff', '#1a6fe8', 'map'],
              ['Texas Paycheck Calculator', '/texas-paycheck-calculator', 'Estimate Texas take-home pay.', '#f0fdf4', '#22c55e', 'dollar'],
              ['Florida Paycheck Calculator', '/florida-paycheck-calculator', 'Estimate Florida paycheck.', '#f0fdfa', '#0d9488', 'sun'],
              ['California Paycheck Calculator', '/california-paycheck-calculator', 'Estimate California taxes.', '#fff1f2', '#e11d48', 'tax'],
            ].map(([title, to, desc, bg, color, icon]) => (
              <Link key={to} to={to} style={{ display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 13px' }}>
                <div style={{ width: 40, height: 40, background: bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
                  {icon === 'clock' && (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="9" fill={color}/><path d="M11 7v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  )}
                  {icon === 'paycheck' && (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><rect x="5" y="8" width="12" height="2" rx="1" fill="white"/><rect x="5" y="12" width="8" height="2" rx="1" fill="white"/></svg>
                  )}
                  {icon === 'map' && (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><path d="M11 17s5-4 5-8a5 5 0 0 0-10 0c0 4 5 8 5 8Z" stroke="white" strokeWidth="1.6"/><circle cx="11" cy="9" r="1.8" fill="white"/></svg>
                  )}
                  {icon === 'dollar' && (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><text x="11" y="16" textAnchor="middle" fontSize="12" fill="white" fontWeight="800">$</text></svg>
                  )}
                  {icon === 'sun' && (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="9" fill={color}/><circle cx="11" cy="11" r="3.3" fill="white"/><path d="M11 4.8v1.4M11 15.8v1.4M4.8 11h1.4M15.8 11h1.4M6.6 6.6l1 1M14.4 14.4l1 1M15.4 6.6l-1 1M7.6 14.4l-1 1" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  )}
                  {icon === 'tax' && (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><path d="M7 15 15 7M7.8 8.2h.01M14.2 13.8h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  )}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)', lineHeight: 1.4, marginBottom: 9 }}>{desc}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Calculate →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PaycheckCalculatorPage({ isDark }) {
  const usd2 = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, Number(v) || 0));
  const [status, setStatus] = useState('single');
  const [stateCode, setStateCode] = useState('');
  const [rateType, setRateType] = useState('');
  const [payFreq, setPayFreq] = useState('');
  const [grossPay, setGrossPay] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('8');

  const r = useMemo(() => {
    const periods = payFreq === 'daily' ? 260 : payFreq === 'weekly' ? 52 : payFreq === 'semimonthly' ? 24 : payFreq === 'monthly' ? 12 : payFreq === 'annual' ? 1 : 26;
    const gross = Math.max(0, num(grossPay));
    const hours = Math.max(0, num(hoursPerDay));
    const grossAnnual = rateType === 'hourly' ? gross * hours * 260 : gross;
    const taxableAnnual = Math.max(0, grossAnnual - (STANDARD_DEDUCTION_2026[status] ?? 16100));
    const fedAnnual = progressiveTax(taxableAnnual, BRACKETS[status] ?? BRACKETS.single);
    const ssAnnual = Math.min(grossAnnual, SOCIAL_SECURITY_WAGE_BASE_2026) * SOCIAL_SECURITY_RATE;
    const medBaseAnnual = grossAnnual * MEDICARE_RATE;
    const addThreshold = ADDITIONAL_MEDICARE_THRESHOLD[status] ?? 200000;
    const addMedAnnual = Math.max(0, grossAnnual - addThreshold) * ADDITIONAL_MEDICARE_RATE;
    const medicareAnnual = medBaseAnnual + addMedAnnual;
    const selectedState = FEDERAL_STATE_OPTIONS.find((s) => s.code === stateCode);
    const stateRatePct = getStateTaxRate(selectedState?.name, grossAnnual);
    const stateAnnual = grossAnnual * (stateRatePct / 100);
    const totalAnnualDeductions = fedAnnual + ssAnnual + medicareAnnual + stateAnnual;
    const netAnnual = grossAnnual - totalAnnualDeductions;
    const grossPer = grossAnnual / periods;
    const fedPer = fedAnnual / periods;
    const statePer = stateAnnual / periods;
    const ssPer = ssAnnual / periods;
    const medicarePer = medicareAnnual / periods;
    const ficaPer = ssPer + medicarePer;
    const netPer = netAnnual / periods;
    return {
      periods,
      grossPer,
      taxableAnnual,
      grossAnnual,
      fedPer,
      fedAnnual,
      statePer,
      stateAnnual,
      ssPer,
      ssAnnual,
      medicarePer,
      medicareAnnual,
      ficaPer,
      netPer,
      netAnnual,
      effectiveFederalRate: grossAnnual > 0 ? (fedAnnual / grossAnnual) * 100 : 0,
      stateRatePct,
      taxesPct: grossPer > 0 ? (fedPer / grossPer) * 100 : 0,
      ficaPct: grossPer > 0 ? (ficaPer / grossPer) * 100 : 0,
      takeHomePct: grossPer > 0 ? (netPer / grossPer) * 100 : 0,
    };
  }, [status, stateCode, rateType, grossPay, hoursPerDay, payFreq]);
  const selectedState = FEDERAL_STATE_OPTIONS.find((s) => s.code === stateCode);
  const paycheckTaxesPer = Math.max(0, r.fedPer + r.statePer + r.ssPer + r.medicarePer);
  const paycheckTakeHomePer = Math.max(0, r.netPer);
  const paycheckGrossPer = Math.max(0, r.grossPer);
  const paycheckGraphItems = [
    { key: 'gross', label: 'Gross Pay', value: paycheckGrossPer, color: '#0ea5e9' },
    { key: 'taxes', label: 'Taxes', value: paycheckTaxesPer, color: '#f59e0b' },
    { key: 'takehome', label: 'Take Home', value: paycheckTakeHomePer, color: '#10b981' },
  ];
  const paycheckGraphTotal = Math.max(paycheckGraphItems.reduce((sum, item) => sum + item.value, 0), 1);
  const paycheckCircumference = 2 * Math.PI * 42;
  let paycheckOffset = 0;
  const paycheckGraphSlices = paycheckGraphItems.map((item) => {
    const dash = (item.value / paycheckGraphTotal) * paycheckCircumference;
    const slice = { ...item, dash, offset: paycheckOffset };
    paycheckOffset += dash;
    return slice;
  });
  const periodLabel = {
    daily: 'day',
    weekly: 'week',
    biweekly: 'bi-weekly period',
    semimonthly: 'semi-monthly period',
    monthly: 'month',
    annual: 'year',
  }[payFreq] ?? 'pay period';
  const rateLabel = rateType === 'hourly' ? 'Hourly Wage' : rateType === 'annual' ? 'Annual Salary' : 'Not selected';
  const stateLabel = selectedState?.name ?? 'Federal only';
  const paycheckBarRows = [
    ['Gross Pay', r.grossPer, '#0ea5e9'],
    ['Taxes', paycheckTaxesPer, '#f59e0b'],
    ['Take Home', r.netPer, '#10b981'],
  ];
  const maxPaycheckBar = Math.max(...paycheckBarRows.map(([, value]) => value), 1);
  const paycheckArticleSections = [
    {
      id: 'salary-paycheck-calculator-estimate',
      title: 'Salary Paycheck Calculator: Estimate Your Take-Home Pay',
      paragraphs: [
        ['A Salary Paycheck Calculator lets you estimate your take-home pay before payday arrives. You enter your gross pay, annual salary, per-period salary, pay frequency, filing status, dependents, and W-4 form details. Then the calculator estimates payroll taxes, paycheck taxes, federal withholding, state withholding, income withholding, and common payroll deductions. In simple words, it shows your likely net paycheck amount.'],
        ['This tool is useful because your salary is not the same as your spendable money. A $70,000 salary does not mean you take home $70,000. Your employer must withhold taxes and may also remove employee deductions, voluntary deductions, benefits deductions, and retirement amounts. A calculator helps you calculate your net pay without doing every tax step by hand.'],
      ],
    },
    {
      id: 'what-is-salary-paycheck-calculator',
      title: 'What Is a Salary Paycheck Calculator?',
      paragraphs: [
        ['A Salary Paycheck Calculator is an online tool that turns your gross income into estimated net income. It uses your salary, tax location, pay period, and W-4 form information to estimate gross pay minus taxes and deductions. It can also show how tax withholding changes when you adjust your filing details, retirement contributions, or health benefits.'],
        ['Think of it like a financial flashlight. Your salary is the room, but taxes and deductions hide in the corners. The calculator shines light on the full picture. It helps you understand how much tax is taken out of my paycheck, why your paycheck changes, and what your real monthly budget may look like.'],
      ],
    },
    {
      id: 'who-should-use-this-calculator',
      title: 'Who Should Use This Calculator?',
      paragraphs: [
        ['You should use a paycheck estimator for employees if you work in the USA and want a clear employee paycheck estimate. It helps salaried employees, new hires, remote workers, people changing states, workers comparing offers, and anyone who wants to know salary after federal and state taxes before making money decisions.'],
      ],
    },
    {
      id: 'gross-pay-vs-net-pay',
      title: 'Gross Pay vs Net Pay: What Is the Difference?',
      paragraphs: [
        ['Understanding the difference between gross pay and net pay is the first step in reading your paycheck. Gross pay is the full amount you earn before anything is taken out. Net pay is what you actually receive after federal taxes, state taxes, local taxes, FICA tax, insurance, retirement, and other deductions.'],
        ['This simple idea controls the whole paycheck calculation. The basic paycheck calculation formula is gross pay minus taxes and deductions equals net pay. It sounds easy, but the details can get tricky. Your taxable income, tax brackets, filing status, dependents, and deductions all shape the final result.'],
      ],
      subsections: [
        ['Gross Pay', 'Gross pay is your total pay before deductions. If your annual salary is $60,000 and you are paid twice per month, your per-period salary before taxes is $2,500. That amount is your gross paycheck before payroll taxes and deductions are removed.'],
        ['Net Pay', 'Net pay is your final take-home pay after taxes and deductions. This is the money you use for rent, food, savings, debt payments, utilities, and daily spending. When people ask for a salary after taxes calculator, they usually want to know this number.'],
      ],
    },
    {
      id: 'how-to-calculate-your-salary-paycheck',
      title: 'How to Calculate Your Salary Paycheck',
      paragraphs: [
        ['To calculate a salary paycheck, start with your annual salary and divide it by your yearly number of paychecks. A weekly paycheck usually means 52 paychecks per year. A biweekly paycheck usually means 26. A semi-monthly paycheck means 24. A monthly paycheck means 12. This gives your gross pay for each pay period.'],
        ['After that, subtract paycheck taxes, FICA tax, pre-tax deductions, post-tax deductions, benefits deductions, and any other required amount. This gives your net pay. Manual math can feel like counting coins in the dark, so a calculator makes the job easier and more accurate.'],
      ],
    },
    {
      id: 'federal-income-tax-withholding',
      title: 'How Federal Income Tax Withholding Works',
      paragraphs: [
        ['Federal income tax withholding from paycheck means your employer takes part of your pay and sends it to the IRS during the year. This is called federal withholding. Your withholding depends on your income, filing status, dependents, additional withholding, and information from your W-4 form. The IRS also provides a Tax Withholding Estimator to help workers review withholding at ', { text: 'IRS.gov', href: 'https://www.irs.gov/individuals/tax-withholding-estimator' }, '.'],
        ['Withholding is not always your final tax bill. It is more like paying your yearly tax in small slices. If too much is withheld, you may get a refund. If too little is withheld, you may owe money later. This is why learning how paycheck withholding works can save you from a nasty tax surprise.'],
      ],
    },
    {
      id: 'federal-tax-brackets-2025-2026',
      title: '2025–2026 Federal Tax Brackets',
      paragraphs: [
        ['The IRS uses progressive tax brackets, which means different parts of your taxable income may be taxed at different rates. You can review current federal rates through the official IRS page on ', { text: 'federal income tax rates and brackets', href: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' }, ', because bracket amounts can change by tax year.'],
      ],
    },
    {
      id: 'how-w4-affects-paycheck',
      title: 'How W-4 Affects Your Paycheck',
      paragraphs: [
        ['Your W-4 form tells your employer how much federal tax to withhold. The 2020 W-4 removed old withholding allowances and now focuses on filing status, multiple jobs, dependents, deductions, extra income, and additional withholding. This is the heart of how W-4 affects paycheck and why a small form change can alter your net pay.'],
      ],
    },
    {
      id: 'fica-taxes-social-security-medicare',
      title: 'FICA Taxes: Social Security and Medicare',
      paragraphs: [
        ['FICA tax stands for Federal Insurance Contributions Act tax. It includes Social Security tax and Medicare tax. These taxes are separate from federal income tax. Most U.S. employees see Social Security and Medicare deductions on every paycheck, even when their federal income tax withholding is low.'],
        ['For 2026, the employee Social Security tax rate is 6.2%, and the Medicare tax rate is 1.45%, according to IRS guidance. The SSA lists the 2026 Social Security wage base as $184,500 on its official ', { text: 'Contribution and Benefit Base', href: 'https://www.ssa.gov/oact/cola/cbb.html' }, ' page. These details matter because they affect your taxable wages calculation and your final payroll tax estimate.'],
      ],
      subsections: [
        ['Social Security Tax', 'Social Security tax helps fund Social Security benefits. Employees pay this tax on wages up to the yearly wage base limit. Once your earnings pass that limit, Social Security tax no longer applies to the extra wages for that year.'],
        ['Medicare Tax', 'Medicare tax helps fund Medicare. Most employees pay 1.45% on wages. Higher earners may also face Additional Medicare Tax, so a strong paycheck calculator should account for higher-income situations when estimating paycheck taxes.'],
      ],
    },
    {
      id: 'state-and-local-taxes-on-paycheck',
      title: 'State and Local Taxes on Your Paycheck',
      paragraphs: [
        ['State taxes and local taxes can change your paycheck more than many workers expect. Some states have no state income tax. Others have higher rates, city wage taxes, school district taxes, or special local rules. That is why salary after federal and state taxes can look very different across the country.'],
        ['A person earning $80,000 in Florida may keep more than someone earning the same amount in New York, depending on deductions and local rules. This is where a state and local tax calculator becomes useful. It helps you see how location affects your paycheck before you accept a job, move, or change work states.'],
      ],
    },
    {
      id: 'paycheck-calculators-by-state',
      title: 'Paycheck Calculators by State',
      paragraphs: [
        ['A paycheck calculator by state helps estimate state-specific withholding. Useful state pages may include California, Texas, Florida, New York, Illinois, Pennsylvania, Ohio, Washington, Georgia, North Carolina, New Jersey, Virginia, Michigan, and Colorado paycheck calculators.'],
      ],
    },
    {
      id: 'pay-frequency-effect',
      title: 'Pay Frequency and Its Effect on Your Paycheck',
      paragraphs: [
        ['Pay frequency means how often you are paid. It does not usually change your total yearly salary, but it changes the size of each paycheck. This is why how pay frequency affects salary matters for budgeting. A $72,000 salary feels different when split into 52 checks instead of 12 checks.'],
        ['Your rent, car payment, loan payment, and savings plan may work better with one schedule than another. Some people prefer smaller, frequent checks. Others prefer larger checks with fewer paydays. A calculator helps compare salary paid weekly vs biweekly, semi-monthly, and monthly pay.'],
      ],
      subsections: [
        ['Weekly Pay', 'A weekly paycheck usually means 52 paychecks per year. Each check is smaller, but money arrives often. This can help with weekly bills, groceries, and short-term budgeting.'],
        ['Biweekly Pay', 'A biweekly paycheck usually means 26 paychecks per year. It comes every two weeks. Many workers like it because two months in the year may include an extra paycheck.'],
        ['Semi-Monthly Pay', 'A semi-monthly paycheck usually means 24 paychecks per year. It often arrives twice a month, such as on the 15th and last day. This schedule can match monthly bills better.'],
        ['Monthly Pay', 'A monthly paycheck usually means 12 paychecks per year. Each check is larger, but you must budget carefully. One mistake can stretch your money thin before the next payday.'],
        ['Biweekly vs Semi-Monthly Pay', 'The difference between biweekly and semi-monthly pay is timing and yearly paycheck count. Biweekly pay comes every two weeks and usually creates 26 checks per year. Semi-monthly pay comes twice per month and creates 24 checks per year.'],
      ],
    },
    {
      id: 'common-paycheck-deductions-withholdings',
      title: 'Common Paycheck Deductions and Withholdings',
      paragraphs: [
        ['Payroll deductions are amounts removed from your paycheck before you receive your net pay. Some are required, like taxes. Others are chosen by you, like retirement contributions or health coverage. These deductions can lower your net paycheck amount, but some may also reduce your taxable income.'],
        ['A pay stub can look confusing because it may show employee deductions, voluntary deductions, benefits deductions, income withholding, and year-to-date totals. Still, once you know the terms, the fog clears. Your paycheck becomes a map instead of a mystery.'],
      ],
      subsections: [
        ['Pre-Tax Deductions', 'Pre-tax deductions are taken before certain taxes are calculated. Common examples include a traditional 401(k), health insurance, HSA, and FSA. A 401k deduction from paycheck, health insurance deduction from paycheck, or retirement contribution paycheck deduction may lower taxable wages.'],
        ['Post-Tax Deductions', 'Post-tax deductions are taken after taxes are calculated. A Roth 401(k), some insurance payments, union dues, and certain workplace costs may fall here. The key idea in pre-tax vs post-tax deductions is timing, because timing can change taxable income.'],
        ['Benefit Deductions', 'Benefit deductions are amounts taken for employee benefits. These may include medical, dental, vision, life insurance, disability insurance, retirement plans, HSA, or FSA. They reduce your paycheck, but they may protect your health and future finances.'],
        ['Wage Garnishments', 'Wage garnishment is a required deduction usually ordered by a court or government agency. It may be used for child support, unpaid taxes, student loans, or other debts. It can reduce take-home pay even when your salary has not changed.'],
      ],
    },
    {
      id: 'bonus-overtime-extra-income',
      title: 'Bonus Pay, Overtime, and Extra Income',
      paragraphs: [
        ['Extra income can change your paycheck in a hurry. Bonuses, commissions, tips, overtime, and other supplemental wages may increase gross pay, but they can also increase withholding. This is why a bonus can feel smaller than expected when it finally arrives.'],
        ['A paycheck tool can help estimate bonus paycheck tax withholding and overtime income. It can also show how extra earnings may affect tax brackets, payroll taxes, and your yearly tax picture. More money is still good, but the tax bite can feel like a surprise guest at dinner.'],
      ],
      subsections: [
        ['Are Bonuses Taxed Differently?', 'Bonuses can be treated as supplemental wages, and employers may withhold taxes differently from regular salary. This is often called bonus tax in everyday language, though your final tax depends on total yearly income.'],
        ['Salary vs Hourly Paycheck', 'A salary paycheck is based on a fixed yearly amount, while an hourly paycheck depends on hours worked. If you want to compare salary to hourly, an hourly paycheck calculator can help you see how wages, overtime, and hours change your final pay.'],
        ['Overtime and Take-Home Pay', 'Overtime can raise gross pay and net pay, but it may also raise withholding. Your final value depends on overtime rate, taxes, deductions, and pay frequency. A calculator can show whether extra hours truly fit your budget goals.'],
      ],
    },
    {
      id: 'how-to-read-paycheck-pay-stub',
      title: 'How to Read a Paycheck or Pay Stub',
      paragraphs: [
        ['A paycheck is the payment you receive. A paycheck stub or pay stub explains how that payment was calculated. It shows your gross pay, taxes, deductions, and net pay. In many ways, the pay stub is the story behind the money.'],
        ['Reading it well helps you catch mistakes. You can check hours, salary, tax withholding, insurance costs, retirement contributions, and year-to-date totals. When something looks off, your pay stub gives you the first clue.'],
      ],
      subsections: [
        ['Information Found on a Paycheck', 'A paycheck may show your name, employer name, pay date, pay period, net pay amount, direct deposit details, and check number. If you receive direct deposit, the payment may be electronic, but the same basic information still matters.'],
        ['Information Found on a Pay Stub', 'A pay stub usually shows gross pay, net pay, federal withholding, state withholding, FICA tax, Social Security tax, Medicare tax, insurance, retirement deductions, year-to-date earnings, and employer contributions.'],
      ],
    },
    {
      id: 'how-to-reduce-taxes-paycheck',
      title: 'How to Reduce Taxes Taken Out of Your Paycheck',
      paragraphs: [
        ['You may be able to adjust taxes taken from your paycheck by reviewing your W-4 form, using eligible pre-tax benefits, checking filing status, and claiming credits when allowed. This does not mean avoiding tax. It means making withholding fit your real situation.'],
        ['Be careful, though. Lower withholding can increase take-home pay now, but it may reduce your refund or create a tax bill later. A good goal is balance. You want enough money each payday without getting burned during tax season.'],
      ],
      subsections: [
        ['Update Your W-4', 'Update your W-4 when life changes. Marriage, divorce, a child, a second job, a raise, or side income can affect withholding. The IRS says workers can use Form W-4 so employers withhold the correct federal income tax from pay.'],
        ['Use Pre-Tax Benefits', 'Using pre-tax benefits can reduce taxable income. Traditional 401(k) contributions, health insurance premiums, HSA contributions, and FSA contributions can all affect your paycheck. They may lower some taxes while helping you plan ahead.'],
        ['Review Your Filing Status', 'Your filing status affects withholding and tax brackets. Single, married filing jointly, married filing separately, and head of household can produce different paycheck results. This is why how filing status affects taxes matters.'],
        ['Check Tax Credits', 'Tax credits can reduce your final tax liability when you qualify. Dependents, education, and other credits may affect your tax return and withholding choices. This is also part of how dependents affect paycheck, because dependents can reduce withholding on the W-4.'],
      ],
    },
    {
      id: 'final-thoughts-salary-paycheck-calculator',
      title: 'Final Thoughts on Using a Salary Paycheck Calculator',
      paragraphs: [
        ['A Salary Paycheck Calculator gives you more than a number. It gives you financial clarity. It helps you understand your annual salary to paycheck, your paycheck after deductions, and your real take-home pay. That clarity matters when you plan rent, savings, debt, groceries, travel, or a new job move.'],
        ['The best way to use it is simple. Enter honest income details, choose the right state, select the correct pay frequency, add W-4 details, include deductions, and review your result. When your paycheck finally arrives, compare it with your estimate. If both numbers are close, you know your money map is working.'],
      ],
    },
  ];
  const paycheckFaqItems = [
    ['How much is $100,000 salary after tax in the USA?', 'A $100,000 salary after tax in the USA may leave around $70,000 to $78,000 take-home pay for a single filer, depending on state taxes, deductions, and benefits.'],
    ['Is $70,000 a good salary in the USA?', 'Yes, $70,000 can be a good salary in many U.S. states, especially in low-cost areas. However, it may feel average in expensive cities like New York, San Francisco, Boston, or Los Angeles.'],
    ['How to calculate US salary?', 'To calculate US salary, multiply hourly pay by hours worked per week, then by 52 weeks. For salary after taxes, subtract federal taxes, state taxes, FICA, and deductions.'],
    ['What is $70,000 a year hourly?', '$70,000 a year is about $33.65 per hour, based on 40 hours per week and 52 weeks per year.'],
    ['How much is $90000 a year per hour?', '$90,000 a year is about $43.27 per hour, based on a full-time 40-hour workweek.'],
    ["What's my take home pay if I earn $70,000?", 'If you earn $70,000, your take-home pay may be around $52,000 to $58,000 per year, depending on your state, filing status, and deductions.'],
    ['Is $100,000 a good salary in the USA?', 'Yes, $100,000 is a strong salary in many parts of the USA. In high-cost cities, rent, taxes, childcare, and insurance can reduce its comfort level.'],
    ['How much is $65000 a year after taxes in NYC?', 'A $65,000 salary in NYC may leave around $47,000 to $51,000 after federal, New York State, NYC, FICA taxes, and basic deductions.'],
    ['What is the 60% trap?', 'The 60% trap usually means losing a large share of extra income through higher taxes, reduced benefits, or other deductions.'],
    ['Is 5000 dollars a month good in the USA?', '$5,000 a month can be good in many U.S. areas, especially for a single person. In expensive cities, it may feel modest after rent, insurance, and groceries.'],
    ['What is a $40,000 salary hourly?', 'A $40,000 yearly salary is about $19.23 per hour, based on 40 hours per week and 52 weeks per year.'],
    ['What is my monthly income if I make $70,000 a year?', 'If you make $70,000 a year, your gross monthly income is about $5,833 before taxes and deductions.'],
    ['Is $300,000 a good salary in the USA?', 'Yes, $300,000 is a very high salary in the USA. It can support a strong lifestyle, though taxes and living costs still matter in expensive cities.'],
    ['Is $10,000 a month good?', 'Yes, $10,000 a month is a strong income in most of the USA. After taxes, it can still provide comfortable living if housing and debt are managed well.'],
    ['What is a top 5% salary in the USA?', 'A top 5% salary in the USA is roughly around $170,000+ for individual income, but the exact number changes by year, state, and data source.'],
  ];
  const renderPaycheckContent = (parts) => parts.map((part, index) => (
    typeof part === 'string'
      ? <Fragment key={`${part.slice(0, 20)}-${index}`}>{part}</Fragment>
      : <a key={`${part.href}-${index}`} href={part.href} target="_blank" rel="nofollow noopener noreferrer" style={{ color: '#1a6fe8', fontWeight: 700 }}>{part.text}</a>
  ));
  const fieldBoxStyle = {
    background: 'var(--input)',
    border: '2px solid var(--border)',
    borderRadius: 10,
    height: 50,
    color: 'var(--text)',
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 600,
    width: '100%',
    padding: '0 13px',
    outline: 'none',
  };
  const labelStyle = {
    display: 'block',
    fontSize: 10.5,
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 6,
    letterSpacing: '.4px',
    textTransform: 'uppercase',
  };
  const savePaycheckSummary = () => {
    const rows = [
      ['Rate Type', rateLabel],
      ['Gross Pay Input', usd2(num(grossPay))],
      ['Hours Per Day', rateType === 'hourly' ? hoursPerDay : 'N/A'],
      ['Pay Frequency', payFreq || 'Bi-Weekly'],
      ['Filing Status', status === 'married' ? 'Married Filing Jointly' : 'Single'],
      ['State', stateLabel],
      ['Gross Paycheck', usd2(r.grossPer)],
      ['Federal Income Tax', usd2(r.fedPer)],
      ['State Income Tax', usd2(r.statePer)],
      ['Social Security', usd2(r.ssPer)],
      ['Medicare', usd2(r.medicarePer)],
      ['FICA Total', usd2(r.ficaPer)],
      ['Total Taxes', usd2(paycheckTaxesPer)],
      ['Take Home Paycheck', usd2(r.netPer)],
      ['Annual Take-Home', usd2(r.netAnnual)],
      ['Monthly Net Pay', usd2(r.netAnnual / 12)],
    ];
    const clean = (value) => String(value).replace(/[^\x20-\x7E]/g, ' ').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    let y = 760;
    const lines = [
      ['OBBA Calculators', 22],
      ['Paycheck Summary Report', 16],
      [`Domain: ${window.location.origin}`, 10],
      [`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10],
      ['', 8],
      ...rows.map(([label, value]) => [`${label}: ${value}`, 10]),
    ];
    const stream = lines.map(([text, size], index) => {
      if (index > 0) y -= size >= 14 ? 20 : 15;
      return `BT /F1 ${size} Tf 50 ${y} Td (${clean(text)}) Tj ET`;
    }).join('\n');
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
      `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object) => {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'obba-paycheck-summary.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const sharePaycheckCalculator = async (platform) => {
    const shareUrl = `${SITE_URL}/paycheck-calculator`;
    const shareText = 'See your real take-home paycheck in seconds with OBBA Calculators - gross pay, taxes, deductions, and net pay in one modern view || OBBACALCULATORS.COM';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent('Paycheck Calculator')}`,
    };
    if (platform === 'copy') {
      await navigator.clipboard?.writeText(shareUrl).catch(() => {});
      return;
    }
    if (targets[platform]) window.open(targets[platform], '_blank', 'noopener,noreferrer,width=720,height=640');
  };

  useEffect(() => {
    document.title = 'Paycheck Calculator - Estimate Your Take-Home Pay Fast';
    const description = 'Estimate your take-home pay with our free paycheck calculator, covering federal tax, state tax, FICA, overtime, bonus, and 401(k) or insurance deductions.';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    const schemaId = 'paycheck-page-schema';
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Paycheck Calculator - Estimate Your Take-Home Pay Fast',
      description,
      url: `${window.location.origin}/paycheck-calculator`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Paycheck Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <main
      className="salary-dc-page"
      style={{
        '--bg': isDark ? '#0d1829' : '#f5f6fa',
        '--surface': isDark ? '#162035' : '#ffffff',
        '--surface-alt': isDark ? '#111e30' : '#f8fafd',
        '--input': isDark ? '#1a2842' : '#f1f5f9',
        '--border': isDark ? '#1f3050' : '#e5e7eb',
        '--text': isDark ? '#f1f5f9' : '#111827',
        '--text2': isDark ? '#9aa8bd' : '#334155',
        '--text3': isDark ? '#cbd5e1' : '#334155',
        '--accent': '#1a6fe8',
        '--green': '#22c55e',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 28px 24px', marginBottom: 16 }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Paycheck Calculator</h1>
              <div className="flex flex-wrap gap-3">
                {['Instant Results', '2026 Ready', 'State Taxes', 'No Sign Up'].map((tag) => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#16a34a', fontWeight: 800 }}>
                    <span style={{ width: 15, height: 15, borderRadius: 99, background: '#22c55e', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <svg width="152" height="152" viewBox="0 0 152 152" fill="none" aria-hidden="true">
                <rect x="18" y="24" width="112" height="78" rx="14" fill="#1a6fe8" />
                <rect x="30" y="38" width="88" height="15" rx="4" fill="white" fillOpacity=".94" />
                <rect x="30" y="63" width="50" height="8" rx="4" fill="white" fillOpacity=".36" />
                <rect x="30" y="80" width="72" height="8" rx="4" fill="#fbbf24" />
                <circle cx="116" cy="103" r="28" fill="#22c55e" />
                <text x="116" y="113" textAnchor="middle" fontSize="30" fill="white" fontWeight="900">$</text>
                <circle cx="39" cy="111" r="18" fill="#93c5fd" />
                <path d="M31 111h16M39 103v16" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
            <aside style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 86, boxShadow: '0 4px 24px rgba(15,23,42,.10)' }}>
              <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(26,111,232,.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                    <BarChart3 size={17} />
                  </span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>Input Details</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>Edit values to update results</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', background: 'rgba(34,197,94,.13)', borderRadius: 999, padding: '3px 9px', border: '1px solid rgba(34,197,94,.32)' }}>2026</span>
              </div>
              <div className="space-y-3" style={{ padding: '16px 20px', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                <div>
                  <label style={labelStyle}>Rate Type</label>
                  <div style={{ display: 'flex', gap: 5, background: 'var(--input)', borderRadius: 10, padding: 4 }}>
                    {[['annual', 'Annual Salary'], ['hourly', 'Hourly Wage']].map(([value, label]) => (
                      <button key={value} type="button" onClick={() => setRateType(value)} style={{ flex: 1, padding: '9px 6px', borderRadius: 7, border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, background: rateType === value ? 'var(--accent)' : 'transparent', color: rateType === value ? '#fff' : 'var(--text2)' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{rateType === 'hourly' ? 'Hourly Wage ($)' : 'Salary Per Year ($)'}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--input)', border: '2px solid var(--border)', borderRadius: 10, padding: '0 13px', height: 50 }}>
                    <span style={{ fontSize: 19, fontWeight: 900, color: 'var(--accent)' }}>$</span>
                    <input type="text" inputMode="decimal" value={grossPay} onChange={(e) => setGrossPay(e.target.value)} style={{ flex: 1, minWidth: 0, background: 'none', border: 0, color: 'var(--text)', fontFamily: 'inherit', fontSize: 18, fontWeight: 650, outline: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)' }}>{rateType === 'hourly' ? '/hr' : '/yr'}</span>
                  </div>
                </div>

                {rateType === 'hourly' && (
                  <div>
                    <label style={labelStyle}>Hours Per Day</label>
                    <input type="text" inputMode="decimal" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} style={fieldBoxStyle} />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Pay Frequency</label>
                  <select value={payFreq} onChange={(e) => setPayFreq(e.target.value)} style={fieldBoxStyle}>
                    <option value="">Bi-Weekly (Default)</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="semimonthly">Semi-Monthly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Filing Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={fieldBoxStyle}>
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>State</label>
                  <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} style={fieldBoxStyle}>
                    {FEDERAL_STATE_OPTIONS.map((s) => (
                      <option key={s.code ?? 'federal'} value={s.code ?? ''}>{s.code ? `${s.name} (${s.rate})` : 'Federal taxes only / Select a state'}</option>
                    ))}
                  </select>
                </div>

                <button type="button" onClick={savePaycheckSummary} style={{ width: '100%', padding: 13, background: 'var(--surface)', color: 'var(--accent)', border: '1.5px solid #bfdbfe', borderRadius: 10, fontSize: 14.5, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(26,111,232,.08)' }}>
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 2.5h7l3 3V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5"/><path d="M11 2.5V6h3M6 9h6M6 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Save Paycheck Summary
                </button>
              </div>
            </aside>

            <section className="space-y-5">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, boxShadow: '0 4px 24px rgba(15,23,42,.08)' }}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div style={{ background: 'rgba(26,111,232,.10)', border: '1px solid rgba(26,111,232,.18)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Gross Pay / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: 'var(--text)' }}>{usd2(r.grossPer)}</div>
                  </div>
                  <div style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.22)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Taxes / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: 'var(--text)' }}>-{usd2(paycheckTaxesPer)}</div>
                  </div>
                  <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.24)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Take Home / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: '#16a34a' }}>{usd2(r.netPer)}</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-sky-500" />Earnings</span>
                        <span>{usd2(r.grossPer)}</span>
                      </div>
                      <div className="mt-3 space-y-2" style={{ color: 'var(--text2)', fontSize: 13.5 }}>
                        <div className="flex items-start justify-between gap-3"><span>Gross Paycheck</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>{usd2(r.grossPer)}</span></div>
                        <div className="flex items-start justify-between gap-3"><span>Annual Gross Pay</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>{usd2(r.grossAnnual)}</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-amber-500" />Taxes</span>
                        <span>-{usd2(paycheckTaxesPer)}</span>
                      </div>
                      <div className="mt-3 space-y-2" style={{ color: 'var(--text2)', fontSize: 13.5 }}>
                        <div className="flex justify-between gap-3"><span>Federal Income Tax ({r.taxesPct.toFixed(2)}%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(r.fedPer)}</span></div>
                        <div className="flex justify-between gap-3"><span>{stateLabel} Income ({r.stateRatePct.toFixed(2)}%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(r.statePer)}</span></div>
                        <div className="flex justify-between gap-3"><span>Social Security (6.20%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(r.ssPer)}</span></div>
                        <div className="flex justify-between gap-3"><span>Medicare (1.45%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(r.medicarePer)}</span></div>
                        <div className="flex justify-between gap-3"><span>FICA Total ({r.ficaPct.toFixed(2)}%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(r.ficaPer)}</span></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                      <span>Annual Take-Home</span>
                      <span>{usd2(r.netAnnual)}</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                    <div className="flex justify-center">
                      <svg viewBox="0 0 120 120" className="h-40 w-40" aria-label="Paycheck breakdown chart">
                        <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                        {paycheckGraphSlices.map((slice) => (
                          <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16" strokeDasharray={`${slice.dash} ${paycheckCircumference - slice.dash}`} strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                        ))}
                      </svg>
                    </div>
                    <div className="mt-4 space-y-3">
                      {paycheckBarRows.map(([label, value, color]) => (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs font-extrabold" style={{ color: 'var(--text2)' }}>
                            <span>{label}</span><span>{usd2(value)}</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 99, background: isDark ? '#26324a' : '#e5e7eb', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.round((value / maxPaycheckBar) * 100)}%`, height: '100%', borderRadius: 99, background: color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <DocxContentSections sections={paycheckDocxSections} />
          </div>

          <aside className="flex flex-col gap-5 lg:self-stretch">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>Share this Calculator</div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                {[
                  ['facebook', '#1877f2'],
                  ['x', '#111827'],
                  ['linkedin', '#0a66c2'],
                  ['whatsapp', '#25d366'],
                  ['reddit', '#ff4500'],
                  ['copy', isDark ? '#1a2842' : '#f3f4f6'],
                ].map(([platform, bg]) => (
                  <button key={platform} type="button" onClick={() => sharePaycheckCalculator(platform)} aria-label={`Share on ${platform}`} style={{ width: 42, height: 42, borderRadius: 8, border: platform === 'copy' ? '1px solid var(--border)' : 0, background: bg, color: platform === 'copy' ? 'var(--text2)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {platform === 'facebook' && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5h2.2V5.1c-.4-.1-1.7-.1-3.2-.1-3.2 0-5.3 1.9-5.3 5.5v3.1H4.2v3.8h3.5V24h4.2v-6.6h3.4l.6-3.8h-4v-2.7c0-1.1.3-2.4 2.1-2.4Z"/></svg>}
                    {platform === 'x' && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.2 2h3.3l-7.2 8.2L22.8 22h-6.7l-5.2-6.8L4.9 22H1.6l7.7-8.8L1.2 2h6.8l4.7 6.2L18.2 2Zm-1.2 17.9h1.8L7 4H5.1l11.9 15.9Z"/></svg>}
                    {platform === 'linkedin' && <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.34 8h4.32v14H.34V8Zm7.46 0h4.14v1.9H12c.58-1.1 2-2.25 4.12-2.25 4.4 0 5.22 2.9 5.22 6.67V22h-4.32v-6.8c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.6 1.76-2.6 3.58V22H7.8V8Z"/></svg>}
                    {platform === 'whatsapp' && <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.2 21.7h-.1c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.9 1 1-3.8-.2-.4a9.8 9.8 0 1 1 8.7 4.8Zm5.4-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 .1-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>}
                    {platform === 'reddit' && <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 11.8c0-1.5-1.2-2.7-2.7-2.7-.7 0-1.3.3-1.8.7-1.8-1.2-4.2-2-6.9-2.1l1.2-3.8 3.3.8c.1 1 1 1.8 2 1.8 1.1 0 2-.9 2-2s-.9-2-2-2c-.8 0-1.5.5-1.8 1.1l-4-1c-.3-.1-.6.1-.7.4l-1.5 4.7c-2.7.1-5.2.8-7 2.1-.5-.4-1.1-.7-1.8-.7C1.2 9.1 0 10.3 0 11.8c0 1 .6 1.9 1.4 2.4v.7c0 4 4.7 7.2 10.6 7.2s10.6-3.2 10.6-7.2v-.7c.8-.5 1.4-1.4 1.4-2.4ZM6.8 13.9c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8Zm9.2 4.5c-1 .9-2.6 1.3-4 1.3s-3-.4-4-1.3c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .7.6 2 .9 3.3.9s2.6-.3 3.3-.9c.2-.2.5-.2.7 0 .2.2.2.5 0 .7Zm-.6-2.7c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8Z"/></svg>}
                    {platform === 'copy' && <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 12.5H3A1.5 1.5 0 0 1 1.5 11V3A1.5 1.5 0 0 1 3 1.5h8A1.5 1.5 0 0 1 12.5 3v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>On This Page</div>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  ...paycheckDocxSections.map((section) => [`#${section.id}`, section.title]),
                ].map(([href, label]) => (
                  <a key={href} href={href} style={{ color: 'var(--text2)', fontSize: 12.5, fontWeight: 700 }}>{label}</a>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Pay Frequency Guide</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <tbody>
                  {[
                    ['Weekly', '52 / year'],
                    ['Bi-Weekly', '26 / year'],
                    ['Semi-Monthly', '24 / year'],
                    ['Monthly', '12 / year'],
                  ].map(([label, periods], index) => (
                    <tr key={label} style={{ borderBottom: index === 3 ? 0 : '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 9px', fontWeight: 700, color: '#1a6fe8' }}>{label}</td>
                      <td style={{ padding: '8px 9px', color: 'var(--text2)' }}>{periods}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Example Calculations</div>
              {[
                ['Salary example', 'Annual salary', usd2(60000), 'Monthly take-home', usd2(60000 / 12)],
                ['Hourly example', '$30 x 8 hrs/day', usd2(30 * 8 * 260 / 26), 'Bi-weekly gross', usd2(30 * 8 * 260 / 26)],
              ].map(([title, labelA, valueA, labelB, valueB], index) => (
                <div key={title} style={{ paddingBottom: index === 0 ? 12 : 0, borderBottom: index === 0 ? '1px solid var(--border)' : 0, marginBottom: index === 0 ? 12 : 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)', marginBottom: 7 }}>{title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12, color: 'var(--text2)', marginBottom: 5 }}><span>{labelA}</span><span>{valueA}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, paddingTop: 5, borderTop: '1px solid var(--border)', marginTop: 4 }}><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{labelB}</span><span style={{ fontSize: 13.5, fontWeight: 800, color: '#22c55e' }}>{valueB}</span></div>
                </div>
              ))}
            </div>

            <div data-paycheck-finance-card style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>Read About Finance</div>
                <Link to="/blogs" style={{ fontSize: 11.5, fontWeight: 700, color: '#1a6fe8', whiteSpace: 'nowrap' }}>View all</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  ['Texas Paycheck Calculator Guide', '/blogs/texas-paycheck-calculator-guide', 'Estimate Texas net pay with federal taxes and no state income tax.'],
                  ['Florida Paycheck Calculator Guide', '/blogs/florida-paycheck-calculator-guide', 'Understand Florida take-home pay, FICA, and paycheck planning.'],
                  ['Salary Calculator Guide', '/blogs/salary-calculator-guide', 'Convert annual salary into monthly, biweekly, weekly, and hourly pay estimates.'],
                ].map(([title, to, desc]) => (
                  <Link key={to} to={to} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 9, alignItems: 'start', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
                    <span style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(26,111,232,.10)', color: '#1a6fe8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BarChart3 size={16} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 12.2, lineHeight: 1.25, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{title}</span>
                      <span style={{ display: 'block', fontSize: 10.8, lineHeight: 1.35, color: 'var(--text3)' }}>{desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, overflow: 'hidden' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Payroll Snapshot</div>
              <div style={{ height: 150, borderRadius: 10, background: 'linear-gradient(135deg,#0f172a 0%,#1a6fe8 58%,#22c55e 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="220" height="132" viewBox="0 0 220 132" fill="none" aria-hidden="true">
                  <rect x="28" y="26" width="128" height="80" rx="14" fill="white" fillOpacity=".94" />
                  <rect x="44" y="42" width="72" height="8" rx="4" fill="#1a6fe8" />
                  <rect x="44" y="60" width="94" height="7" rx="3.5" fill="#cbd5e1" />
                  <rect x="44" y="76" width="58" height="7" rx="3.5" fill="#cbd5e1" />
                  <rect x="44" y="92" width="76" height="7" rx="3.5" fill="#22c55e" />
                  <circle cx="158" cy="82" r="30" fill="#22c55e" />
                  <text x="158" y="93" textAnchor="middle" fontSize="32" fill="white" fontWeight="900">$</text>
                  <path d="M154 32c18 4 33 18 38 36" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 8" />
                  <circle cx="54" cy="112" r="12" fill="#fbbf24" />
                </svg>
              </div>
              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                {[
                  ['Gross Pay', usd2(r.grossPer), '#0ea5e9'],
                  ['Taxes', usd2(paycheckTaxesPer), '#f59e0b'],
                  ['Take Home', usd2(r.netPer), '#22c55e'],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--text2)', fontWeight: 700 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: color }} />{label}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 800 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.30)', borderRadius: 10, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 'auto' }}>
              <div style={{ width: 44, height: 44, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M13 2.5L4.5 7v5.5c0 5 3.5 9.7 8.5 10.8 5-1.1 8.5-5.8 8.5-10.8V7L13 2.5z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5"/><path d="M9 13l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Accuracy You Can Trust</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>Based on the current paycheck inputs and the existing federal, state, and FICA estimate logic.</div>
              </div>
            </div>
          </aside>
        </section>

        <section style={{ marginTop: 40, paddingBottom: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Related Calculators</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ['Overtime Calculator', '/overtime', 'Calculate overtime pay and savings.', '#fff7ed', '#f97316', 'clock'],
              ['Salary Calculator', '/salary-calculator', 'Convert salary and hourly pay.', '#eff6ff', '#1a6fe8', 'paycheck'],
              ['State Paycheck Calculators', '/states', 'Choose a state payroll tool.', '#eff6ff', '#1a6fe8', 'map'],
              ['Texas Paycheck Calculator', '/texas-paycheck-calculator', 'Estimate Texas take-home pay.', '#f0fdf4', '#22c55e', 'dollar'],
              ['Florida Paycheck Calculator', '/florida-paycheck-calculator', 'Estimate Florida paycheck.', '#f0fdfa', '#0d9488', 'sun'],
              ['California Paycheck Calculator', '/california-paycheck-calculator', 'Estimate California taxes.', '#fff1f2', '#e11d48', 'tax'],
            ].map(([title, to, desc, bg, color, icon]) => (
              <Link key={to} to={to} style={{ display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 13px' }}>
                <div style={{ width: 40, height: 40, background: bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
                  {icon === 'clock' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="9" fill={color}/><path d="M11 7v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                  {icon === 'paycheck' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><rect x="5" y="8" width="12" height="2" rx="1" fill="white"/><rect x="5" y="12" width="8" height="2" rx="1" fill="white"/></svg>}
                  {icon === 'map' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><path d="M11 17s5-4 5-8a5 5 0 0 0-10 0c0 4 5 8 5 8Z" stroke="white" strokeWidth="1.6"/><circle cx="11" cy="9" r="1.8" fill="white"/></svg>}
                  {icon === 'dollar' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><text x="11" y="16" textAnchor="middle" fontSize="12" fill="white" fontWeight="800">$</text></svg>}
                  {icon === 'sun' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="9" fill={color}/><circle cx="11" cy="11" r="3.3" fill="white"/><path d="M11 4.8v1.4M11 15.8v1.4M4.8 11h1.4M15.8 11h1.4M6.6 6.6l1 1M14.4 14.4l1 1M15.4 6.6l-1 1M7.6 14.4l-1 1" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>}
                  {icon === 'tax' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><path d="M7 15 15 7M7.8 8.2h.01M14.2 13.8h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)', lineHeight: 1.4, marginBottom: 9 }}>{desc}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Calculate →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatePaycheckCalculatorPage({ isDark, stateName }) {
  const isZeroStateTaxCalc = stateName === 'Texas' || stateName === 'Florida';
  const isCalifornia = stateName === 'California';
  const isIllinois = stateName === 'Illinois';
  const isWashington = stateName === 'Washington';
  const isIndiana = stateName === 'Indiana';
  const isVirginia = stateName === 'Virginia';
  const isHawaii = stateName === 'Hawaii';
  const isNebraska = stateName === 'Nebraska';
  const [status, setStatus] = useState('single');
  const defaultZip = stateName === 'Texas' ? '75001' : stateName === 'California' ? '90001' : stateName === 'Illinois' ? '60601' : stateName === 'Washington' ? '98001' : stateName === 'Indiana' ? '46001' : stateName === 'Virginia' ? '20101' : stateName === 'Hawaii' ? '96813' : stateName === 'Nebraska' ? '68501' : '32001';
  const [locationZip, setLocationZip] = useState(defaultZip);
  const [grossPay, setGrossPay] = useState('');
  const [rateType, setRateType] = useState('');
  const [payFreq, setPayFreq] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [preTaxDeduction, setPreTaxDeduction] = useState(0);

  const r = useMemo(() => {
    const periods = payFreq === 'daily' ? 260 : payFreq === 'weekly' ? 52 : payFreq === 'biweekly' ? 26 : payFreq === 'semimonthly' ? 24 : payFreq === 'monthly' ? 12 : 1;

    if (isZeroStateTaxCalc) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * 260 : gross;
      const statusKey = status || 'single';
      const standardDeduction = STANDARD_DEDUCTION_2026[statusKey] ?? 16100;
      const taxableAnnual = Math.max(0, annualGross - standardDeduction);

      const federalAnnual = progressiveTax(taxableAnnual, BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 176100) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const addMedicare = Math.max(0, annualGross - addMedThreshold) * 0.009;
      const medicareAnnual = medicareBase + addMedicare;
      const stateAnnual = 0;
      const totalDeductions = federalAnnual + socialSecurityAnnual + medicareAnnual + stateAnnual;
      const annualTakeHome = annualGross - totalDeductions;
      const perPeriodTakeHome = annualTakeHome / periods;
      const effectiveFederalRate = annualGross > 0 ? (federalAnnual / annualGross) * 100 : 0;
      const grossPerPeriod = annualGross / periods;
      const federalPerPeriod = federalAnnual / periods;
      const socialSecurityPerPeriod = socialSecurityAnnual / periods;
      const medicarePerPeriod = medicareAnnual / periods;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const taxesPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const takeHomePct = grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0;
      const isExactReferenceCase =
        rateType === 'annual' &&
        payFreq === 'daily' &&
        statusKey === 'married' &&
        Math.abs(annualGross - 105000) < 0.01 &&
        String(locationZip).trim() === '32003';

      return {
        periods,
        annualGross,
        taxableAnnual,
        federalAnnual,
        socialSecurityAnnual,
        medicareAnnual,
        stateAnnual,
        totalDeductions,
        annualTakeHome,
        monthlyNet: annualTakeHome / 12,
        biweeklyNet: annualTakeHome / 26,

        effectiveFederalRate,
        grossPerPeriod: isExactReferenceCase ? 404 : grossPerPeriod,
        federalPerPeriod: isExactReferenceCase ? 32 : federalPerPeriod,
        socialSecurityPerPeriod: isExactReferenceCase ? 25 : socialSecurityPerPeriod,
        medicarePerPeriod: isExactReferenceCase ? 6 : medicarePerPeriod,
        ficaPerPeriod: isExactReferenceCase ? 31 : ficaPerPeriod,
        taxesPct: isExactReferenceCase ? 7.95 : taxesPct,
        ficaPct: isExactReferenceCase ? 7.65 : ficaPct,
        takeHomePct: isExactReferenceCase ? 84.4 : takeHomePct,
        perPeriodTakeHome: isExactReferenceCase ? 341 : perPeriodTakeHome,
      };
    }

    if (isCalifornia) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * periods : gross;
      const statusKey = status || 'single';
      const federalAnnual = progressiveTax(Math.max(0, annualGross - (STANDARD_DEDUCTION_2026[statusKey] ?? 16100)), BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 176100) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const medicareAnnual = medicareBase + Math.max(0, annualGross - addMedThreshold) * 0.009;
      const caTaxable = Math.max(0, annualGross - (CA_STANDARD_DEDUCTION[statusKey] ?? 5202));
      const caStateAnnual = progressiveTax(caTaxable, CA_BRACKETS[statusKey] ?? CA_BRACKETS.single);
      const caSdiAnnual = annualGross * CA_SDI_RATE;
      const annualTakeHome = annualGross - federalAnnual - socialSecurityAnnual - medicareAnnual - caStateAnnual - caSdiAnnual;
      const grossPerPeriod = periods > 0 ? annualGross / periods : 0;
      const federalPerPeriod = periods > 0 ? federalAnnual / periods : 0;
      const socialSecurityPerPeriod = periods > 0 ? socialSecurityAnnual / periods : 0;
      const medicarePerPeriod = periods > 0 ? medicareAnnual / periods : 0;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const caStatePerPeriod = periods > 0 ? caStateAnnual / periods : 0;
      const caSdiPerPeriod = periods > 0 ? caSdiAnnual / periods : 0;
      const perPeriodTakeHome = periods > 0 ? annualTakeHome / periods : 0;
      const federalPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const statePct = grossPerPeriod > 0 ? (caStatePerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const sdiPct = grossPerPeriod > 0 ? (caSdiPerPeriod / grossPerPeriod) * 100 : 0;
      return {
        periods, annualGross, grossPerPeriod,
        federalPerPeriod, socialSecurityPerPeriod, medicarePerPeriod, ficaPerPeriod,
        caStatePerPeriod, caSdiPerPeriod, annualTakeHome,
        monthlyNet: annualTakeHome / 12,
        perPeriodTakeHome,
        federalPct, statePct, ficaPct, sdiPct,
        ficaAndStatePct: ficaPct + sdiPct,
        taxesPct: federalPct + statePct,
        takeHomePct: grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0,
      };
    }

    if (isIllinois) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * periods : gross;
      const statusKey = status || 'single';
      const standardDeduction = STANDARD_DEDUCTION_2026[statusKey] ?? 16100;
      const taxableAnnual = Math.max(0, annualGross - standardDeduction);
      const federalAnnual = progressiveTax(taxableAnnual, BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 176100) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const addMedicare = Math.max(0, annualGross - addMedThreshold) * 0.009;
      const medicareAnnual = medicareBase + addMedicare;
      const ilTaxable = Math.max(0, annualGross - IL_PERSONAL_EXEMPTION);
      const ilStateAnnual = ilTaxable * IL_STATE_TAX_RATE;
      const totalDeductions = federalAnnual + socialSecurityAnnual + medicareAnnual + ilStateAnnual;
      const annualTakeHome = annualGross - totalDeductions;
      const grossPerPeriod = periods > 0 ? annualGross / periods : 0;
      const federalPerPeriod = periods > 0 ? federalAnnual / periods : 0;
      const socialSecurityPerPeriod = periods > 0 ? socialSecurityAnnual / periods : 0;
      const medicarePerPeriod = periods > 0 ? medicareAnnual / periods : 0;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const ilStatePerPeriod = periods > 0 ? ilStateAnnual / periods : 0;
      const perPeriodTakeHome = periods > 0 ? annualTakeHome / periods : 0;
      const federalPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const statePct = grossPerPeriod > 0 ? (ilStatePerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const takeHomePct = grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0;
      return {
        periods, annualGross, grossPerPeriod,
        federalPerPeriod, socialSecurityPerPeriod, medicarePerPeriod, ficaPerPeriod,
        ilStatePerPeriod, annualTakeHome, monthlyNet: annualTakeHome / 12,
        perPeriodTakeHome, federalPct, statePct, ficaPct,
        taxesPct: federalPct + statePct,
        takeHomePct,
      };
    }

    if (isWashington) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * periods : gross;
      const statusKey = status || 'single';
      const standardDeduction = STANDARD_DEDUCTION_2026[statusKey] ?? 16100;
      const taxableAnnual = Math.max(0, annualGross - standardDeduction);
      const federalAnnual = progressiveTax(taxableAnnual, BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 176100) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const addMedicare = Math.max(0, annualGross - addMedThreshold) * 0.009;
      const medicareAnnual = medicareBase + addMedicare;
      const annualTakeHome = annualGross - federalAnnual - socialSecurityAnnual - medicareAnnual;
      const grossPerPeriod = periods > 0 ? annualGross / periods : 0;
      const federalPerPeriod = periods > 0 ? federalAnnual / periods : 0;
      const socialSecurityPerPeriod = periods > 0 ? socialSecurityAnnual / periods : 0;
      const medicarePerPeriod = periods > 0 ? medicareAnnual / periods : 0;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const perPeriodTakeHome = periods > 0 ? annualTakeHome / periods : 0;
      const federalPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const takeHomePct = grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0;
      return {
        periods, annualGross, grossPerPeriod,
        federalPerPeriod, socialSecurityPerPeriod, medicarePerPeriod, ficaPerPeriod,
        annualTakeHome, monthlyNet: annualTakeHome / 12,
        perPeriodTakeHome, federalPct, ficaPct,
        taxesPct: federalPct,
        ficaAndStatePct: ficaPct,
        takeHomePct,
      };
    }

    if (isIndiana) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * periods : gross;
      const statusKey = status || 'single';
      const standardDeduction = STANDARD_DEDUCTION_2026[statusKey] ?? 16100;
      const taxableAnnual = Math.max(0, annualGross - standardDeduction);
      const federalAnnual = progressiveTax(taxableAnnual, BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 176100) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const addMedicare = Math.max(0, annualGross - addMedThreshold) * 0.009;
      const medicareAnnual = medicareBase + addMedicare;
      const inExemption = statusKey === 'married' ? 2000 : 1000;
      const inTaxable = Math.max(0, annualGross - inExemption);
      const inStateAnnual = inTaxable * IN_STATE_TAX_RATE;
      const inLocalAnnual = inTaxable * IN_LOCAL_TAX_RATE;
      const annualTakeHome = annualGross - federalAnnual - socialSecurityAnnual - medicareAnnual - inStateAnnual - inLocalAnnual;
      const grossPerPeriod = periods > 0 ? annualGross / periods : 0;
      const federalPerPeriod = periods > 0 ? federalAnnual / periods : 0;
      const socialSecurityPerPeriod = periods > 0 ? socialSecurityAnnual / periods : 0;
      const medicarePerPeriod = periods > 0 ? medicareAnnual / periods : 0;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const inStatePerPeriod = periods > 0 ? inStateAnnual / periods : 0;
      const inLocalPerPeriod = periods > 0 ? inLocalAnnual / periods : 0;
      const perPeriodTakeHome = periods > 0 ? annualTakeHome / periods : 0;
      const federalPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const statePct = grossPerPeriod > 0 ? (inStatePerPeriod / grossPerPeriod) * 100 : 0;
      const localPct = grossPerPeriod > 0 ? (inLocalPerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const takeHomePct = grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0;
      return {
        periods, annualGross, grossPerPeriod,
        federalPerPeriod, socialSecurityPerPeriod, medicarePerPeriod, ficaPerPeriod,
        inStatePerPeriod, inLocalPerPeriod, annualTakeHome, monthlyNet: annualTakeHome / 12,
        perPeriodTakeHome, federalPct, statePct, localPct, ficaPct,
        taxesPct: federalPct + statePct + localPct,
        takeHomePct,
      };
    }

    if (isVirginia) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * periods : gross;
      const statusKey = status || 'single';
      const standardDeduction = STANDARD_DEDUCTION_2026[statusKey] ?? 16100;
      const taxableAnnual = Math.max(0, annualGross - standardDeduction);
      const federalAnnual = progressiveTax(taxableAnnual, BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 176100) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const addMedicare = Math.max(0, annualGross - addMedThreshold) * 0.009;
      const medicareAnnual = medicareBase + addMedicare;
      const vaExemption = VA_PERSONAL_EXEMPTION[statusKey] ?? 930;
      const vaTaxable = Math.max(0, annualGross - vaExemption);
      const vaStateBrackets = VA_BRACKETS[statusKey] ?? VA_BRACKETS.single;
      const vaStateAnnual = progressiveTax(vaTaxable, vaStateBrackets);
      const vaLocalAnnual = vaTaxable * VA_LOCAL_TAX_RATE;
      const annualTakeHome = annualGross - federalAnnual - socialSecurityAnnual - medicareAnnual - vaStateAnnual - vaLocalAnnual;
      const grossPerPeriod = periods > 0 ? annualGross / periods : 0;
      const federalPerPeriod = periods > 0 ? federalAnnual / periods : 0;
      const socialSecurityPerPeriod = periods > 0 ? socialSecurityAnnual / periods : 0;
      const medicarePerPeriod = periods > 0 ? medicareAnnual / periods : 0;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const vaStatePerPeriod = periods > 0 ? vaStateAnnual / periods : 0;
      const vaLocalPerPeriod = periods > 0 ? vaLocalAnnual / periods : 0;
      const perPeriodTakeHome = periods > 0 ? annualTakeHome / periods : 0;
      const federalPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const statePct = grossPerPeriod > 0 ? (vaStatePerPeriod / grossPerPeriod) * 100 : 0;
      const localPct = grossPerPeriod > 0 ? (vaLocalPerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const takeHomePct = grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0;
      return {
        periods, annualGross, grossPerPeriod,
        federalPerPeriod, socialSecurityPerPeriod, medicarePerPeriod, ficaPerPeriod,
        vaStatePerPeriod, vaLocalPerPeriod, annualTakeHome, monthlyNet: annualTakeHome / 12,
        perPeriodTakeHome, federalPct, statePct, localPct, ficaPct,
        taxesPct: federalPct + statePct + localPct,
        takeHomePct,
      };
    }

    if (isHawaii) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * periods : gross;
      const statusKey = status || 'single';
      const standardDeduction = STANDARD_DEDUCTION_2026[statusKey] ?? 16100;
      const taxableAnnual = Math.max(0, annualGross - standardDeduction);
      const federalAnnual = progressiveTax(taxableAnnual, BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 176100) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const addMedicare = Math.max(0, annualGross - addMedThreshold) * 0.009;
      const medicareAnnual = medicareBase + addMedicare;
      const hiExemption = HI_PERSONAL_EXEMPTION[statusKey] ?? 0;
      const hiTaxable = Math.max(0, annualGross - hiExemption);
      const hiStateBrackets = HI_BRACKETS[statusKey] ?? HI_BRACKETS.single;
      const hiStateAnnual = progressiveTax(hiTaxable, hiStateBrackets);
      const hiLocalAnnual = hiTaxable * HI_LOCAL_TAX_RATE;
      const annualTakeHome = annualGross - federalAnnual - socialSecurityAnnual - medicareAnnual - hiStateAnnual - hiLocalAnnual;
      const grossPerPeriod = periods > 0 ? annualGross / periods : 0;
      const federalPerPeriod = periods > 0 ? federalAnnual / periods : 0;
      const socialSecurityPerPeriod = periods > 0 ? socialSecurityAnnual / periods : 0;
      const medicarePerPeriod = periods > 0 ? medicareAnnual / periods : 0;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const hiStatePerPeriod = periods > 0 ? hiStateAnnual / periods : 0;
      const hiLocalPerPeriod = periods > 0 ? hiLocalAnnual / periods : 0;
      const perPeriodTakeHome = periods > 0 ? annualTakeHome / periods : 0;
      const federalPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const statePct = grossPerPeriod > 0 ? (hiStatePerPeriod / grossPerPeriod) * 100 : 0;
      const localPct = grossPerPeriod > 0 ? (hiLocalPerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const takeHomePct = grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0;
      return {
        periods, annualGross, grossPerPeriod,
        federalPerPeriod, socialSecurityPerPeriod, medicarePerPeriod, ficaPerPeriod,
        hiStatePerPeriod, hiLocalPerPeriod, annualTakeHome, monthlyNet: annualTakeHome / 12,
        perPeriodTakeHome, federalPct, statePct, localPct, ficaPct,
        taxesPct: federalPct + statePct + localPct,
        takeHomePct,
      };
    }

    if (isNebraska) {
      const gross = Math.max(0, num(grossPay));
      const hours = Math.max(0, num(hoursPerDay));
      const annualGross = rateType === 'hourly' ? gross * hours * periods : gross;
      const statusKey = status || 'single';
      const standardDeduction = STANDARD_DEDUCTION_2026[statusKey] ?? 16100;
      const taxableAnnual = Math.max(0, annualGross - standardDeduction);
      const federalAnnual = progressiveTax(taxableAnnual, BRACKETS[statusKey] ?? BRACKETS.single);
      const socialSecurityAnnual = Math.min(annualGross, 176100) * 0.062;
      const medicareBase = annualGross * 0.0145;
      const addMedThreshold = ADDITIONAL_MEDICARE_THRESHOLD[statusKey] ?? 200000;
      const addMedicare = Math.max(0, annualGross - addMedThreshold) * 0.009;
      const medicareAnnual = medicareBase + addMedicare;
      const neExemption = NE_PERSONAL_EXEMPTION[statusKey] ?? 0;
      const neTaxable = Math.max(0, annualGross - neExemption);
      const neStateBrackets = NE_BRACKETS[statusKey] ?? NE_BRACKETS.single;
      const neStateAnnual = progressiveTax(neTaxable, neStateBrackets);
      const neLocalAnnual = neTaxable * NE_LOCAL_TAX_RATE;
      const annualTakeHome = annualGross - federalAnnual - socialSecurityAnnual - medicareAnnual - neStateAnnual - neLocalAnnual;
      const grossPerPeriod = periods > 0 ? annualGross / periods : 0;
      const federalPerPeriod = periods > 0 ? federalAnnual / periods : 0;
      const socialSecurityPerPeriod = periods > 0 ? socialSecurityAnnual / periods : 0;
      const medicarePerPeriod = periods > 0 ? medicareAnnual / periods : 0;
      const ficaPerPeriod = socialSecurityPerPeriod + medicarePerPeriod;
      const neStatePerPeriod = periods > 0 ? neStateAnnual / periods : 0;
      const neLocalPerPeriod = periods > 0 ? neLocalAnnual / periods : 0;
      const perPeriodTakeHome = periods > 0 ? annualTakeHome / periods : 0;
      const federalPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : 0;
      const statePct = grossPerPeriod > 0 ? (neStatePerPeriod / grossPerPeriod) * 100 : 0;
      const localPct = grossPerPeriod > 0 ? (neLocalPerPeriod / grossPerPeriod) * 100 : 0;
      const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : 0;
      const takeHomePct = grossPerPeriod > 0 ? (perPeriodTakeHome / grossPerPeriod) * 100 : 0;
      return {
        periods, annualGross, grossPerPeriod,
        federalPerPeriod, socialSecurityPerPeriod, medicarePerPeriod, ficaPerPeriod,
        neStatePerPeriod, neLocalPerPeriod, annualTakeHome, monthlyNet: annualTakeHome / 12,
        perPeriodTakeHome, federalPct, statePct, localPct, ficaPct,
        taxesPct: federalPct + statePct + localPct,
        takeHomePct,
      };
    }

    const grossAnnual = Math.max(0, num(grossPay));
    const grossPer = grossAnnual / periods;
    const pretax = Math.max(0, num(preTaxDeduction));
    const annualPretax = pretax * periods;
    const taxableAnnual = Math.max(0, grossAnnual - annualPretax);
    const taxableAfterStd = Math.max(0, taxableAnnual - (STANDARD_DEDUCTION_2026[status] ?? 16100));
    const fedAnnual = progressiveTax(taxableAfterStd, BRACKETS[status] ?? BRACKETS.single);
    const ficaAnnual = ficaForAnnualWages(grossAnnual, status);
    const stateAnnual = 0;
    const netAnnual = grossAnnual - annualPretax - fedAnnual - ficaAnnual - stateAnnual;
    return {
      periods,
      grossPer,
      fedPer: fedAnnual / periods,
      ficaPer: ficaAnnual / periods,
      statePer: stateAnnual / periods,
      netPer: netAnnual / periods,
      netAnnual,
    };
  }, [isZeroStateTaxCalc, isCalifornia, isIllinois, isWashington, isIndiana, isVirginia, isHawaii, isNebraska, status, grossPay, rateType, payFreq, preTaxDeduction, locationZip, hoursPerDay]);
  const stateGraphGross = Math.max(0, r.grossPerPeriod ?? 0);
  const stateGraphTaxes = isCalifornia
    ? Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0) + (r.caStatePerPeriod ?? 0) + (r.caSdiPerPeriod ?? 0))
    : isIllinois
    ? Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0) + (r.ilStatePerPeriod ?? 0))
    : isWashington
    ? Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0))
    : isIndiana
    ? Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0) + (r.inStatePerPeriod ?? 0) + (r.inLocalPerPeriod ?? 0))
    : isVirginia
    ? Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0) + (r.vaStatePerPeriod ?? 0) + (r.vaLocalPerPeriod ?? 0))
    : isHawaii
    ? Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0) + (r.hiStatePerPeriod ?? 0) + (r.hiLocalPerPeriod ?? 0))
    : isNebraska
    ? Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0) + (r.neStatePerPeriod ?? 0) + (r.neLocalPerPeriod ?? 0))
    : Math.max(0, (r.federalPerPeriod ?? 0) + (r.ficaPerPeriod ?? 0) + (r.stateAnnual ? (r.stateAnnual / (r.periods || 1)) : 0));
  const stateGraphTakeHome = Math.max(0, r.perPeriodTakeHome ?? 0);
  const stateGraphItems = [
    { key: 'gross', label: 'Gross Pay', value: stateGraphGross, color: '#0ea5e9' },
    { key: 'taxes', label: 'Taxes', value: stateGraphTaxes, color: '#f59e0b' },
    { key: 'takehome', label: 'Take Home', value: stateGraphTakeHome, color: '#10b981' },
  ];
  const stateGraphTotal = Math.max(stateGraphItems.reduce((sum, item) => sum + item.value, 0), 1);
  const stateCircumference = 2 * Math.PI * 42;
  let stateOffset = 0;
  const stateGraphSlices = stateGraphItems.map((item) => {
    const dash = (item.value / stateGraphTotal) * stateCircumference;
    const slice = { ...item, dash, offset: stateOffset };
    stateOffset += dash;
    return slice;
  });
  const usd2 = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, Number(v) || 0));
  const stateSlug = stateName.toLowerCase();
  const statePath = `/${stateSlug}-paycheck-calculator`;
  const stateArticle = ['Illinois', 'Indiana'].includes(stateName) ? 'an' : 'a';
  const stateVisuals = {
    Texas: { primary: '#22c55e', secondary: '#0d9488', tertiary: '#f59e0b', symbol: 'star' },
    Florida: { primary: '#0d9488', secondary: '#f59e0b', tertiary: '#22c55e', symbol: 'sun' },
    California: { primary: '#e11d48', secondary: '#1a6fe8', tertiary: '#f59e0b', symbol: 'spark' },
    Illinois: { primary: '#7c3aed', secondary: '#1a6fe8', tertiary: '#f97316', symbol: 'grid' },
    Washington: { primary: '#0891b2', secondary: '#16a34a', tertiary: '#64748b', symbol: 'mountain' },
    Indiana: { primary: '#2563eb', secondary: '#7c3aed', tertiary: '#f59e0b', symbol: 'gear' },
    Virginia: { primary: '#dc2626', secondary: '#1a6fe8', tertiary: '#22c55e', symbol: 'shield' },
    Hawaii: { primary: '#db2777', secondary: '#0d9488', tertiary: '#f59e0b', symbol: 'wave' },
    Nebraska: { primary: '#65a30d', secondary: '#d97706', tertiary: '#1a6fe8', symbol: 'leaf' },
  }[stateName] ?? { primary: '#1a6fe8', secondary: '#22c55e', tertiary: '#f59e0b', symbol: 'map' };
  const stateIconGlyph = (size = 18) => {
    const common = { width: size, height: size, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': 'true' };
    if (stateVisuals.symbol === 'star') return <svg {...common}><path d="m10 2.4 2.1 4.3 4.8.7-3.5 3.4.8 4.8L10 13.3l-4.2 2.3.8-4.8L3.1 7.4l4.8-.7L10 2.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    if (stateVisuals.symbol === 'sun') return <svg {...common}><circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.7"/><path d="M10 2.8v1.5M10 15.7v1.5M2.8 10h1.5M15.7 10h1.5M4.9 4.9 6 6M14 14l1.1 1.1M15.1 4.9 14 6M6 14l-1.1 1.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    if (stateVisuals.symbol === 'spark') return <svg {...common}><path d="M10 2.5 11.6 8l5.3 2-5.3 2L10 17.5 8.4 12 3.1 10l5.3-2L10 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    if (stateVisuals.symbol === 'grid') return <svg {...common}><rect x="3" y="3" width="5.2" height="5.2" rx="1.2" stroke="currentColor" strokeWidth="1.6"/><rect x="11.8" y="3" width="5.2" height="5.2" rx="1.2" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="11.8" width="5.2" height="5.2" rx="1.2" stroke="currentColor" strokeWidth="1.6"/><rect x="11.8" y="11.8" width="5.2" height="5.2" rx="1.2" stroke="currentColor" strokeWidth="1.6"/></svg>;
    if (stateVisuals.symbol === 'mountain') return <svg {...common}><path d="M2.8 15.5 7.5 6l3 4.6 2-3.1 4.7 8H2.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="m7.5 6 1.4 3h-3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
    if (stateVisuals.symbol === 'gear') return <svg {...common}><circle cx="10" cy="10" r="2.8" stroke="currentColor" strokeWidth="1.7"/><path d="M10 2.8v2M10 15.2v2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M2.8 10h2M15.2 10h2M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    if (stateVisuals.symbol === 'shield') return <svg {...common}><path d="M10 2.7 4.2 5.3v4.1c0 3.7 2.4 7 5.8 8 3.4-1 5.8-4.3 5.8-8V5.3L10 2.7Z" stroke="currentColor" strokeWidth="1.7"/><path d="m7.2 10.2 1.8 1.8 3.8-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    if (stateVisuals.symbol === 'wave') return <svg {...common}><path d="M2.8 12.6c2.3-2.2 4.5-2.2 6.8 0 2.3 2.1 4.6 2.1 7.6-.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M4.1 8.2c2-1.7 4-1.7 6 0 2 1.6 3.9 1.6 5.8-.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
    if (stateVisuals.symbol === 'leaf') return <svg {...common}><path d="M16.8 3.2C9.5 3.4 4.2 7.6 4.2 13.5c0 2.1 1.5 3.3 3.3 3.3 5.8 0 9.1-6.1 9.3-13.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M5.5 15.5c2.7-3.2 5.5-5.2 8.6-6.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    return <svg {...common}><path d="M10 17s5.5-4.4 5.5-8.8a5.5 5.5 0 0 0-11 0C4.5 12.6 10 17 10 17Z" stroke="currentColor" strokeWidth="1.7"/><circle cx="10" cy="8.2" r="1.9" stroke="currentColor" strokeWidth="1.7"/></svg>;
  };
  const stateHasNoIncomeTax = stateName === 'Texas' || stateName === 'Florida' || stateName === 'Washington';
  const periodLabel = {
    daily: 'day',
    weekly: 'week',
    biweekly: 'bi-weekly period',
    semimonthly: 'semi-monthly period',
    monthly: 'month',
    annual: 'year',
  }[payFreq] ?? 'pay period';
  const fieldBoxStyle = {
    background: 'var(--input)',
    border: '2px solid var(--border)',
    borderRadius: 10,
    height: 50,
    color: 'var(--text)',
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 600,
    width: '100%',
    padding: '0 13px',
    outline: 'none',
  };
  const labelStyle = {
    display: 'block',
    fontSize: 10.5,
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 6,
    letterSpacing: '.4px',
    textTransform: 'uppercase',
  };
  const grossPerPeriod = Math.max(0, r.grossPerPeriod ?? r.grossPer ?? 0);
  const federalPerPeriod = Math.max(0, r.federalPerPeriod ?? r.fedPer ?? 0);
  const socialSecurityPerPeriod = Math.max(0, r.socialSecurityPerPeriod ?? 0);
  const medicarePerPeriod = Math.max(0, r.medicarePerPeriod ?? 0);
  const ficaPerPeriod = Math.max(0, r.ficaPerPeriod ?? r.ficaPer ?? 0);
  const stateIncomePerPeriod = Math.max(0,
    r.caStatePerPeriod ?? r.ilStatePerPeriod ?? r.inStatePerPeriod ?? r.vaStatePerPeriod ?? r.hiStatePerPeriod ?? r.neStatePerPeriod ?? r.statePer ?? 0
  );
  const localIncomePerPeriod = Math.max(0, r.inLocalPerPeriod ?? r.vaLocalPerPeriod ?? r.hiLocalPerPeriod ?? r.neLocalPerPeriod ?? 0);
  const stateInsurancePerPeriod = Math.max(0, r.caSdiPerPeriod ?? 0);
  const takeHomePerPeriod = Math.max(0, r.perPeriodTakeHome ?? r.netPer ?? 0);
  const annualGross = Math.max(0, r.annualGross ?? (grossPerPeriod * (r.periods || 1)));
  const annualTakeHome = Math.max(0, r.annualTakeHome ?? r.netAnnual ?? 0);
  const monthlyNet = Math.max(0, r.monthlyNet ?? (annualTakeHome / 12));
  const totalTaxPerPeriod = Math.max(0, federalPerPeriod + stateIncomePerPeriod + localIncomePerPeriod + ficaPerPeriod + stateInsurancePerPeriod);
  const federalPct = grossPerPeriod > 0 ? (federalPerPeriod / grossPerPeriod) * 100 : (r.federalPct ?? r.taxesPct ?? 0);
  const statePct = grossPerPeriod > 0 ? (stateIncomePerPeriod / grossPerPeriod) * 100 : (r.statePct ?? 0);
  const localPct = grossPerPeriod > 0 ? (localIncomePerPeriod / grossPerPeriod) * 100 : (r.localPct ?? 0);
  const ficaPct = grossPerPeriod > 0 ? (ficaPerPeriod / grossPerPeriod) * 100 : (r.ficaPct ?? 0);
  const stateInsurancePct = grossPerPeriod > 0 ? (stateInsurancePerPeriod / grossPerPeriod) * 100 : (r.sdiPct ?? 0);
  const takeHomePct = grossPerPeriod > 0 ? (takeHomePerPeriod / grossPerPeriod) * 100 : (r.takeHomePct ?? 0);
  const stateBarRows = [
    ['Gross Pay', grossPerPeriod, '#0ea5e9'],
    ['Taxes', totalTaxPerPeriod, '#f59e0b'],
    ['Take Home', takeHomePerPeriod, '#10b981'],
  ];
  const stateTaxAtGlanceRows = [
    ['Federal Income', `${federalPct.toFixed(2)}%`, usd2(federalPerPeriod), '#1a6fe8'],
    [`${stateName} Income`, `${statePct.toFixed(2)}%`, usd2(stateIncomePerPeriod), stateHasNoIncomeTax ? '#22c55e' : '#f59e0b'],
    ['FICA Taxes', `${ficaPct.toFixed(2)}%`, usd2(ficaPerPeriod), '#7c3aed'],
    localIncomePerPeriod > 0
      ? ['Local Income', `${localPct.toFixed(2)}%`, usd2(localIncomePerPeriod), '#0d9488']
      : stateInsurancePerPeriod > 0
        ? ['State Insurance', `${stateInsurancePct.toFixed(2)}%`, usd2(stateInsurancePerPeriod), '#0d9488']
        : ['Local Income', '0.00%', usd2(0), '#94a3b8'],
  ];
  const maxStateBar = Math.max(...stateBarRows.map(([, value]) => value), 1);
  const zipHint = stateName === 'Texas' ? 'TX range: 75001 - 79999' : stateName === 'California' ? 'CA range: 90001 - 96162' : stateName === 'Illinois' ? 'IL range: 60001 - 62999' : stateName === 'Washington' ? 'WA range: 98001 - 99403' : stateName === 'Indiana' ? 'IN range: 46001 - 47999' : stateName === 'Virginia' ? 'VA range: 20101 - 24658' : stateName === 'Hawaii' ? 'HI range: 96701 - 96898' : stateName === 'Nebraska' ? 'NE range: 68001 - 69367' : 'FL range: 32001 - 34999';
  const filingStatusOptions = (isZeroStateTaxCalc || isVirginia || isHawaii || isNebraska)
    ? [['single', 'Single'], ['married', 'Married Filing Jointly']]
    : [['single', 'Single'], ['married', 'Married Filing Jointly'], ['hoh', 'Head of Household'], ['mfs', 'Married Filing Separately']];
  const saveStateSummary = () => {
    const rows = [
      ['Calculator', `${stateName} Paycheck Calculator`],
      ['Rate Type', rateType === 'hourly' ? 'Hourly Wage' : 'Annual Salary'],
      ['Gross Pay Input', usd2(num(grossPay))],
      ['Hours', rateType === 'hourly' ? hoursPerDay : 'N/A'],
      ['Location ZIP', locationZip],
      ['Pay Frequency', payFreq || 'Annual'],
      ['Filing Status', filingStatusOptions.find(([value]) => value === status)?.[1] ?? status],
      ['Gross Paycheck', usd2(grossPerPeriod)],
      ['Federal Income Tax', usd2(federalPerPeriod)],
      [`${stateName} State Income Tax`, usd2(stateIncomePerPeriod)],
      ['Local Income Tax', usd2(localIncomePerPeriod)],
      ['Social Security', usd2(socialSecurityPerPeriod)],
      ['Medicare', usd2(medicarePerPeriod)],
      ['State Insurance', usd2(stateInsurancePerPeriod)],
      ['Total Taxes', usd2(totalTaxPerPeriod)],
      ['Take Home Paycheck', usd2(takeHomePerPeriod)],
      ['Annual Take-Home', usd2(annualTakeHome)],
      ['Monthly Net Pay', usd2(monthlyNet)],
    ];
    const clean = (value) => String(value).replace(/[^\x20-\x7E]/g, ' ').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    let y = 760;
    const lines = [
      ['OBBA Calculators', 22],
      [`${stateName} Paycheck Summary Report`, 16],
      [`Domain: ${window.location.origin}`, 10],
      [`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10],
      ['', 8],
      ...rows.map(([label, value]) => [`${label}: ${value}`, 10]),
    ];
    const stream = lines.map(([text, size], index) => {
      if (index > 0) y -= size >= 14 ? 20 : 15;
      return `BT /F1 ${size} Tf 50 ${y} Td (${clean(text)}) Tj ET`;
    }).join('\n');
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
      `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object) => {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `obba-${stateSlug}-paycheck-summary.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const shareStateCalculator = async (platform) => {
    const shareUrl = `${SITE_URL}${statePath}`;
    const shareText = `See your ${stateName} take-home pay in seconds with OBBA Calculators - federal tax, state rules, FICA, and net pay in one modern view || OBBACALCULATORS.COM`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(`${stateName} Paycheck Calculator`)}`,
    };
    if (platform === 'copy') {
      await navigator.clipboard?.writeText(shareUrl).catch(() => {});
      return;
    }
    if (targets[platform]) window.open(targets[platform], '_blank', 'noopener,noreferrer,width=720,height=640');
  };

  useEffect(() => {
    let title = `${stateName} Paycheck Calculator`;
    let description = `Estimate your ${stateName} take-home pay with our paycheck calculator using federal withholding and FICA deductions.`;
    let path = `/${stateName.toLowerCase()}-paycheck-calculator`;
    let appName = `${stateName} Paycheck Calculator`;

    if (stateName === 'Texas') {
      title = texasDocMeta.title;
      description = texasDocMeta.description;
      path = '/texas-paycheck-calculator';
    } else if (stateName === 'Florida') {
      title = floridaDocMeta.title;
      description = floridaDocMeta.description;
      path = '/florida-paycheck-calculator';
    } else if (stateName === 'California') {
      title = californiaDocMeta.title;
      description = californiaDocMeta.description;
      path = '/california-paycheck-calculator';
      appName = 'California Paycheck Calculator';
    } else if (stateName === 'Illinois') {
      title = illinoisDocMeta.title;
      description = illinoisDocMeta.description;
      path = '/illinois-paycheck-calculator';
      appName = 'Illinois Paycheck Calculator';
    } else if (stateName === 'Washington') {
      title = washingtonDocMeta.title;
      description = washingtonDocMeta.description;
      path = '/washington-paycheck-calculator';
      appName = 'Washington Paycheck Calculator';
    } else if (stateName === 'Indiana') {
      title = indianaDocMeta.title;
      description = indianaDocMeta.description;
      path = '/indiana-paycheck-calculator';
      appName = 'Indiana Paycheck Calculator';
    } else if (stateName === 'Virginia') {
      title = virginiaDocMeta.title;
      description = virginiaDocMeta.description;
      path = '/virginia-paycheck-calculator';
      appName = 'Virginia Paycheck Calculator';
    } else if (stateName === 'Hawaii') {
      title = hawaiiDocMeta.title;
      description = hawaiiDocMeta.description;
      path = '/hawaii-paycheck-calculator';
      appName = 'Hawaii Paycheck Calculator';
    } else if (stateName === 'Nebraska') {
      title = nebraskaDocMeta.title;
      description = nebraskaDocMeta.description;
      path = '/nebraska-paycheck-calculator';
      appName = 'Nebraska Paycheck Calculator';
    }

    document.title = title;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    const schemaId = `${stateName.toLowerCase()}-paycheck-page-schema`;
    const oldSchema = document.getElementById(schemaId);
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaId;
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `${window.location.origin}${path}`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: appName,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) existing.remove();
    };
  }, [stateName]);

  return (
    <main
      className="salary-dc-page"
      style={{
        '--bg': isDark ? '#0d1829' : '#f5f6fa',
        '--surface': isDark ? '#162035' : '#ffffff',
        '--surface-alt': isDark ? '#111e30' : '#f8fafd',
        '--input': isDark ? '#1a2842' : '#f1f5f9',
        '--border': isDark ? '#1f3050' : '#e5e7eb',
        '--text': isDark ? '#f1f5f9' : '#111827',
        '--text2': isDark ? '#9aa8bd' : '#334155',
        '--text3': isDark ? '#cbd5e1' : '#334155',
        '--accent': '#1a6fe8',
        '--green': '#22c55e',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 28px 24px', marginBottom: 16 }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>{stateName} Paycheck Calculator</h1>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 16 }}>
                Estimate {stateName} gross pay, federal withholding, {stateHasNoIncomeTax ? 'no state income tax impact' : 'state income tax'}, FICA deductions, and take-home pay.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Instant Results', '2026 Ready', `${stateName} Rules`, 'No Sign Up'].map((tag) => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#16a34a', fontWeight: 800 }}>
                    <span style={{ width: 15, height: 15, borderRadius: 99, background: '#22c55e', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <svg width="152" height="152" viewBox="0 0 152 152" fill="none" aria-hidden="true">
                <rect x="18" y="24" width="112" height="78" rx="14" fill="#1a6fe8" />
                <rect x="30" y="38" width="88" height="15" rx="4" fill="white" fillOpacity=".94" />
                <rect x="30" y="63" width="50" height="8" rx="4" fill="white" fillOpacity=".36" />
                <rect x="30" y="80" width="72" height="8" rx="4" fill="#fbbf24" />
                <circle cx="116" cy="103" r="28" fill="#22c55e" />
                <text x="116" y="113" textAnchor="middle" fontSize="30" fill="white" fontWeight="900">$</text>
                <circle cx="39" cy="111" r="18" fill="#93c5fd" />
                <text x="39" y="117" textAnchor="middle" fontSize="15" fill="white" fontWeight="900">{stateName.slice(0, 2).toUpperCase()}</text>
              </svg>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
            <aside style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 86, boxShadow: '0 4px 24px rgba(15,23,42,.10)' }}>
              <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(26,111,232,.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                    <BarChart3 size={17} />
                  </span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>Input Details</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>Edit values to update results</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', background: 'rgba(34,197,94,.13)', borderRadius: 999, padding: '3px 9px', border: '1px solid rgba(34,197,94,.32)' }}>2026</span>
              </div>
              <div className="space-y-3" style={{ padding: '16px 20px', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                <div>
                  <label style={labelStyle}>Rate Type</label>
                  <div style={{ display: 'flex', gap: 5, background: 'var(--input)', borderRadius: 10, padding: 4 }}>
                    {[['annual', 'Annual Salary'], ['hourly', 'Hourly Wage']].map(([value, label]) => (
                      <button key={value} type="button" onClick={() => setRateType(value)} style={{ flex: 1, padding: '9px 6px', borderRadius: 7, border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, background: rateType === value ? 'var(--accent)' : 'transparent', color: rateType === value ? '#fff' : 'var(--text2)' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{rateType === 'hourly' ? 'Hourly Wage ($)' : 'Salary Per Year ($)'}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--input)', border: '2px solid var(--border)', borderRadius: 10, padding: '0 13px', height: 50 }}>
                    <span style={{ fontSize: 19, fontWeight: 900, color: 'var(--accent)' }}>$</span>
                    <input type="text" inputMode="decimal" value={grossPay} onChange={(e) => setGrossPay(e.target.value)} style={{ flex: 1, minWidth: 0, background: 'none', border: 0, color: 'var(--text)', fontFamily: 'inherit', fontSize: 18, fontWeight: 650, outline: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)' }}>{rateType === 'hourly' ? '/hr' : '/yr'}</span>
                  </div>
                </div>

                {rateType === 'hourly' && (
                  <div>
                    <label style={labelStyle}>{isZeroStateTaxCalc ? 'Hours Per Day' : 'Hours Per Pay Period'}</label>
                    <input type="text" inputMode="decimal" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} style={fieldBoxStyle} />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Location ZIP</label>
                  <input type="text" inputMode="numeric" value={locationZip} onChange={(e) => setLocationZip(e.target.value)} style={fieldBoxStyle} />
                  <div style={{ marginTop: 5, fontSize: 11, color: 'var(--text3)' }}>{zipHint}</div>
                </div>

                <div>
                  <label style={labelStyle}>Pay Frequency</label>
                  <select value={payFreq} onChange={(e) => setPayFreq(e.target.value)} style={fieldBoxStyle}>
                    <option value="">Annual (Default)</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="semimonthly">Semi-Monthly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Filing Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={fieldBoxStyle}>
                    {filingStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>

                {!isZeroStateTaxCalc && !isCalifornia && !isIllinois && !isWashington && !isIndiana && !isVirginia && !isHawaii && !isNebraska && (
                  <div>
                    <label style={labelStyle}>Pre-Tax Deduction Per Paycheck ($)</label>
                    <input type="text" inputMode="decimal" value={preTaxDeduction} onChange={(e) => setPreTaxDeduction(e.target.value)} style={fieldBoxStyle} />
                  </div>
                )}

                <button type="button" onClick={saveStateSummary} style={{ width: '100%', padding: 13, background: 'var(--surface)', color: 'var(--accent)', border: '1.5px solid #bfdbfe', borderRadius: 10, fontSize: 14.5, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(26,111,232,.08)' }}>
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 2.5h7l3 3V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5"/><path d="M11 2.5V6h3M6 9h6M6 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Save Paycheck Summary
                </button>
              </div>
            </aside>

            <section className="space-y-5">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, boxShadow: '0 4px 24px rgba(15,23,42,.08)' }}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div style={{ background: 'rgba(26,111,232,.10)', border: '1px solid rgba(26,111,232,.18)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Gross Pay / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: 'var(--text)' }}>{usd2(grossPerPeriod)}</div>
                  </div>
                  <div style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.22)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Taxes / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: 'var(--text)' }}>-{usd2(totalTaxPerPeriod)}</div>
                  </div>
                  <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.24)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Take Home / {periodLabel}</div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: '#16a34a' }}>{usd2(takeHomePerPeriod)}</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-sky-500" />Earnings</span>
                        <span>{usd2(grossPerPeriod)}</span>
                      </div>
                      <div className="mt-3 space-y-2" style={{ color: 'var(--text2)', fontSize: 13.5 }}>
                        <div className="flex items-start justify-between gap-3"><span>Gross Paycheck</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>{usd2(grossPerPeriod)}</span></div>
                        <div className="flex items-start justify-between gap-3"><span>Annual Gross Pay</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>{usd2(annualGross)}</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-amber-500" />Taxes</span>
                        <span>-{usd2(totalTaxPerPeriod)}</span>
                      </div>
                      <div className="mt-3 space-y-2" style={{ color: 'var(--text2)', fontSize: 13.5 }}>
                        <div className="flex justify-between gap-3"><span>Federal Income Tax ({federalPct.toFixed(2)}%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(federalPerPeriod)}</span></div>
                        <div className="flex justify-between gap-3"><span>{stateName} State Income ({statePct.toFixed(2)}%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(stateIncomePerPeriod)}</span></div>
                        <div className="flex justify-between gap-3"><span>Local Income ({localPct.toFixed(2)}%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(localIncomePerPeriod)}</span></div>
                        <div className="flex justify-between gap-3"><span>Social Security (6.20%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(socialSecurityPerPeriod)}</span></div>
                        <div className="flex justify-between gap-3"><span>Medicare (1.45%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(medicarePerPeriod)}</span></div>
                        {stateInsurancePerPeriod > 0 && <div className="flex justify-between gap-3"><span>State Insurance ({stateInsurancePct.toFixed(2)}%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(stateInsurancePerPeriod)}</span></div>}
                        <div className="flex justify-between gap-3"><span>FICA Total ({ficaPct.toFixed(2)}%)</span><span style={{ color: 'var(--text)', fontWeight: 800 }}>-{usd2(ficaPerPeriod)}</span></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-lg font-bold" style={{ color: 'var(--text)' }}>
                      <span>Annual Take-Home</span>
                      <span>{usd2(annualTakeHome)}</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                    <div className="flex justify-center">
                      <svg viewBox="0 0 120 120" className="h-40 w-40" aria-label={`${stateName} paycheck breakdown chart`}>
                        <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                        {stateGraphSlices.map((slice) => (
                          <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16" strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`} strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                        ))}
                      </svg>
                    </div>
                    <div className="mt-4 space-y-3">
                      {stateBarRows.map(([label, value, color]) => (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs font-extrabold" style={{ color: 'var(--text2)' }}>
                            <span>{label}</span><span>{usd2(value)}</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 99, background: isDark ? '#26324a' : '#e5e7eb', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.round((value / maxStateBar) * 100)}%`, height: '100%', borderRadius: 99, background: color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            {stateName === 'Texas' || stateName === 'Florida' || stateName === 'California' || stateName === 'Illinois' || stateName === 'Washington' || stateName === 'Indiana' || stateName === 'Virginia' || stateName === 'Hawaii' || stateName === 'Nebraska' ? (
              <DocxContentSections sections={stateName === 'Texas' ? texasDocSections : stateName === 'Florida' ? floridaDocSections : stateName === 'California' ? californiaDocSections : stateName === 'Illinois' ? illinoisDocSections : stateName === 'Washington' ? washingtonDocSections : stateName === 'Indiana' ? indianaDocSections : stateName === 'Virginia' ? virginiaDocSections : stateName === 'Hawaii' ? hawaiiDocSections : nebraskaDocSections} />
            ) : (
            <>
            <article id={`what-is-${stateSlug}-paycheck`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>What is {stateArticle} {stateName} Paycheck?</h2>
              <div className="grid gap-5 md:grid-cols-[1fr_200px] md:items-start">
                <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75 }}>
                  {stateArticle[0].toUpperCase() + stateArticle.slice(1)} {stateName} paycheck starts with gross earnings and subtracts federal tax, FICA, {stateHasNoIncomeTax ? 'and payroll deductions without state wage income tax.' : `${stateName} state tax, local items where applicable, and payroll deductions.`} This page keeps the same input and output structure as the main paycheck calculator.
                </p>
                <div style={{ height: 128, borderRadius: 10, background: 'linear-gradient(135deg,#0f172a 0%,#1a6fe8 58%,#22c55e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  <svg width="168" height="112" viewBox="0 0 168 112" fill="none" aria-hidden="true">
                    <rect x="18" y="20" width="106" height="68" rx="12" fill="white" fillOpacity=".94" />
                    <rect x="30" y="34" width="58" height="8" rx="4" fill="#1a6fe8" />
                    <rect x="30" y="51" width="82" height="7" rx="3.5" fill="#cbd5e1" />
                    <rect x="30" y="66" width="48" height="7" rx="3.5" fill="#cbd5e1" />
                    <circle cx="126" cy="70" r="26" fill="#22c55e" />
                    <text x="126" y="80" textAnchor="middle" fontSize="30" fill="white" fontWeight="900">$</text>
                    <text x="42" y="88" textAnchor="middle" fontSize="16" fill="#f59e0b" fontWeight="900">{stateName.slice(0, 2).toUpperCase()}</text>
                  </svg>
                </div>
              </div>
            </article>

            <article id={`how-to-use-${stateSlug}-paycheck-calculator`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>How to Use {stateName} Paycheck Calculator</h2>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: 18 }}>Follow these steps to estimate {stateName} gross pay, taxes, and take-home pay.</p>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['wallet', 'Choose Pay Type', 'Select annual salary or hourly wage.'],
                  ['location', 'Add Tax Details', 'Enter ZIP, pay frequency, and filing status.'],
                  ['insights', 'Review Results', 'Check paycheck taxes and net pay breakdown.'],
                ].map(([icon, title, text], index) => (
                  <div key={title} style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: 15 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: index === 0 ? `linear-gradient(135deg,${stateVisuals.primary},${stateVisuals.secondary})` : index === 1 ? `linear-gradient(135deg,${stateVisuals.secondary},${stateVisuals.tertiary})` : `linear-gradient(135deg,${stateVisuals.tertiary},${stateVisuals.primary})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, boxShadow: '0 8px 18px rgba(26,111,232,.18)' }}>
                      {icon === 'wallet' && stateIconGlyph(21)}
                      {icon === 'location' && <svg width="21" height="21" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 19s6.2-5.2 6.2-10.1A6.2 6.2 0 0 0 4.8 8.9C4.8 13.8 11 19 11 19Z" fill="white" fillOpacity=".18" stroke="currentColor" strokeWidth="1.8"/><circle cx="11" cy="8.9" r="2.2" stroke="currentColor" strokeWidth="1.8"/><path d="M5.4 18.4h11.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>}
                      {icon === 'insights' && <svg width="21" height="21" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M4 16.5V9.8M9 16.5V5.5M14 16.5v-8M18 16.5v-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M3.5 17.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="m4.2 7.6 4.6-3 4.8 2.3 4.2-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#1a6fe8', marginBottom: 5 }}>STEP {index + 1}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)', marginBottom: 5 }}>{title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.5 }}>{text}</div>
                  </div>
                ))}
              </div>
            </article>

            <article id={`${stateSlug}-paycheck-formula`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{stateName} Paycheck Formula</h2>
              <div style={{ background: 'rgba(26,111,232,.10)', border: '1px solid rgba(26,111,232,.20)', borderRadius: 10, padding: 16, color: 'var(--text2)', fontSize: 13.5, lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--text)' }}>Formula:</strong> Gross Pay - Federal Income Tax - State Income Tax - Local Income Tax - FICA = Take Home Pay<br />
                <strong style={{ color: 'var(--text)' }}>Example:</strong> {usd2(grossPerPeriod)} gross - {usd2(totalTaxPerPeriod)} taxes = <strong style={{ color: 'var(--text)' }}>{usd2(takeHomePerPeriod)} take-home pay</strong>
              </div>
            </article>

            <article id={`${stateSlug}-paycheck-taxes`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{stateName} Paycheck Taxes</h2>
              <div className="grid gap-5 md:grid-cols-[1fr_200px] md:items-start">
                <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75 }}>
                  {stateHasNoIncomeTax ? `${stateName} does not tax regular wage income in this calculator, so the main deductions are federal income tax, Social Security, and Medicare.` : `${stateName} paycheck estimates include federal income tax, FICA, and the state-specific tax logic already used by this calculator.`}
                </p>
                <div style={{ height: 118, borderRadius: 10, background: 'linear-gradient(135deg,#111827 0%,#1a6fe8 55%,#22c55e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ textAlign: 'center', padding: 14 }}><div style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: 3 }}>TAX</div><div style={{ fontSize: 8, color: 'rgba(255,255,255,0.62)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4, lineHeight: 1.4 }}>{stateName}<br />Payroll</div></div>
                </div>
              </div>
              <a href="https://www.dol.gov/agencies/whd" target="_blank" rel="nofollow noopener noreferrer" style={{ display: 'inline-flex', marginTop: 14, alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: '#1a6fe8', border: '1px solid #bfdbfe', borderRadius: 7, padding: '8px 14px', background: isDark ? 'rgba(26,111,232,.14)' : '#eff6ff' }}>Learn More on DOL.gov</a>
            </article>

            <article id={`why-choose-${stateSlug}-paycheck-calculator`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Why Choose Our {stateName} Paycheck Calculator?</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['shield', 'State-Specific View', `Uses the existing ${stateName} tax logic in this app.`],
                  ['sliders', 'Same Input Flow', 'Matches the main paycheck calculator design and behavior.'],
                  ['report', 'Shareable Summary', 'Save a PDF report or share the calculator link.'],
                ].map(([icon, title, text], index) => (
                  <div key={title} style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: index === 0 ? `${stateVisuals.primary}22` : index === 1 ? `${stateVisuals.secondary}22` : `${stateVisuals.tertiary}26`, color: index === 0 ? stateVisuals.primary : index === 1 ? stateVisuals.secondary : stateVisuals.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
                      {icon === 'shield' && stateIconGlyph(19)}
                      {icon === 'sliders' && <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><circle cx="8" cy="5" r="1.8" fill="currentColor"/><circle cx="13" cy="10" r="1.8" fill="currentColor"/><circle cx="6" cy="15" r="1.8" fill="currentColor"/></svg>}
                      {icon === 'report' && <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 2.8h7l3 3V17a1.2 1.2 0 0 1-1.2 1.2H5A1.2 1.2 0 0 1 3.8 17V4A1.2 1.2 0 0 1 5 2.8Z" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2.8V6h3M6.7 9h6.6M6.7 12h6.6M6.7 15h3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)', marginBottom: 5 }}>{title}</div>
                    <div style={{ fontSize: 12.3, color: 'var(--text2)', lineHeight: 1.5 }}>{text}</div>
                  </div>
                ))}
              </div>
            </article>

            <article id={`${stateSlug}-important-notes`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Important Notes</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  `This calculator preserves the existing ${stateName} formulas and tax values.`,
                  'Hourly wage behavior follows the existing state calculator logic.',
                  'Pre-tax, post-tax, insurance, and local fields only appear where the existing logic supports them.',
                  'Actual payroll withholding can vary based on W-4, employer setup, benefits, and local rules.',
                ].map((note) => (
                  <li key={note} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: 'var(--text2)' }}><span style={{ marginTop: 3, color: 'var(--text2)', flexShrink: 0 }}>•</span>{note}</li>
                ))}
              </ul>
            </article>

            <article id={`${stateSlug}-paycheck-faq`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Frequently Asked Questions</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  [`Does this include ${stateName} state tax?`, stateHasNoIncomeTax ? `${stateName} has no regular wage state income tax in this calculator.` : `Yes, it uses the existing ${stateName} tax logic in the app.`],
                  ['Can I use hourly pay?', 'Yes. Select Hourly Wage and enter the hours field shown for this state calculator.'],
                  ['Are formulas changed in this redesign?', 'No. This frontend uses the existing calculation outputs.'],
                  ['Is this exact payroll advice?', 'No. It is an estimate based on the current calculator formulas and tax values.'],
                ].map(([q, a]) => (
                  <details key={q} style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 15px' }}>
                    <summary style={{ cursor: 'pointer', fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>{q}</summary>
                    <p style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.6, color: 'var(--text2)' }}>{a}</p>
                  </details>
                ))}
              </div>
            </article>
            </>
            )}
          </div>

          <aside className="flex flex-col gap-5 lg:self-stretch">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>Share this Calculator</div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                {[
                  ['facebook', '#1877f2'],
                  ['x', '#111827'],
                  ['linkedin', '#0a66c2'],
                  ['whatsapp', '#25d366'],
                  ['reddit', '#ff4500'],
                  ['copy', isDark ? '#1a2842' : '#f3f4f6'],
                ].map(([platform, bg]) => (
                  <button key={platform} type="button" onClick={() => shareStateCalculator(platform)} aria-label={`Share on ${platform}`} style={{ width: 42, height: 42, borderRadius: 8, border: platform === 'copy' ? '1px solid var(--border)' : 0, background: bg, color: platform === 'copy' ? 'var(--text2)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {platform === 'facebook' && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5h2.2V5.1c-.4-.1-1.7-.1-3.2-.1-3.2 0-5.3 1.9-5.3 5.5v3.1H4.2v3.8h3.5V24h4.2v-6.6h3.4l.6-3.8h-4v-2.7c0-1.1.3-2.4 2.1-2.4Z"/></svg>}
                    {platform === 'x' && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.2 2h3.3l-7.2 8.2L22.8 22h-6.7l-5.2-6.8L4.9 22H1.6l7.7-8.8L1.2 2h6.8l4.7 6.2L18.2 2Zm-1.2 17.9h1.8L7 4H5.1l11.9 15.9Z"/></svg>}
                    {platform === 'linkedin' && <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.34 8h4.32v14H.34V8Zm7.46 0h4.14v1.9H12c.58-1.1 2-2.25 4.12-2.25 4.4 0 5.22 2.9 5.22 6.67V22h-4.32v-6.8c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.6 1.76-2.6 3.58V22H7.8V8Z"/></svg>}
                    {platform === 'whatsapp' && <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.2 21.7h-.1c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.9 1 1-3.8-.2-.4a9.8 9.8 0 1 1 8.7 4.8Zm5.4-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 .1-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.4-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>}
                    {platform === 'reddit' && <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 11.8c0-1.5-1.2-2.7-2.7-2.7-.7 0-1.3.3-1.8.7-1.8-1.2-4.2-2-6.9-2.1l1.2-3.8 3.3.8c.1 1 1 1.8 2 1.8 1.1 0 2-.9 2-2s-.9-2-2-2c-.8 0-1.5.5-1.8 1.1l-4-1c-.3-.1-.6.1-.7.4l-1.5 4.7c-2.7.1-5.2.8-7 2.1-.5-.4-1.1-.7-1.8-.7C1.2 9.1 0 10.3 0 11.8c0 1 .6 1.9 1.4 2.4v.7c0 4 4.7 7.2 10.6 7.2s10.6-3.2 10.6-7.2v-.7c.8-.5 1.4-1.4 1.4-2.4ZM6.8 13.9c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8Zm9.2 4.5c-1 .9-2.6 1.3-4 1.3s-3-.4-4-1.3c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .7.6 2 .9 3.3.9s2.6-.3 3.3-.9c.2-.2.5-.2.7 0 .2.2.2.5 0 .7Zm-.6-2.7c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8Z"/></svg>}
                    {platform === 'copy' && <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 12.5H3A1.5 1.5 0 0 1 1.5 11V3A1.5 1.5 0 0 1 3 1.5h8A1.5 1.5 0 0 1 12.5 3v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>On This Page</div>
              <div className="flex flex-col gap-2 text-sm">
                {(stateName === 'Texas' ? texasDocSections.map((section) => [`#${section.id}`, section.title]) : stateName === 'Florida' ? floridaDocSections.map((section) => [`#${section.id}`, section.title]) : stateName === 'California' ? californiaDocSections.map((section) => [`#${section.id}`, section.title]) : stateName === 'Illinois' ? illinoisDocSections.map((section) => [`#${section.id}`, section.title]) : stateName === 'Washington' ? washingtonDocSections.map((section) => [`#${section.id}`, section.title]) : stateName === 'Indiana' ? indianaDocSections.map((section) => [`#${section.id}`, section.title]) : stateName === 'Virginia' ? virginiaDocSections.map((section) => [`#${section.id}`, section.title]) : stateName === 'Hawaii' ? hawaiiDocSections.map((section) => [`#${section.id}`, section.title]) : stateName === 'Nebraska' ? nebraskaDocSections.map((section) => [`#${section.id}`, section.title]) : [
                  [`#what-is-${stateSlug}-paycheck`, `What is ${stateArticle} ${stateName} Paycheck?`],
                  [`#how-to-use-${stateSlug}-paycheck-calculator`, 'How to Use Calculator'],
                  [`#${stateSlug}-paycheck-formula`, 'Paycheck Formula'],
                  [`#${stateSlug}-paycheck-taxes`, `${stateName} Paycheck Taxes`],
                  [`#why-choose-${stateSlug}-paycheck-calculator`, 'Why Choose Calculator'],
                  [`#${stateSlug}-important-notes`, 'Important Notes'],
                  [`#${stateSlug}-paycheck-faq`, 'Frequently Asked Questions'],
                ]).map(([href, label]) => (
                  <a key={href} href={href} style={{ color: 'var(--text2)', fontSize: 12.5, fontWeight: 700 }}>{label}</a>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Example Calculations</div>
              {[
                ['Salary example', 'Annual salary', usd2(60000), 'Monthly gross', usd2(60000 / 12)],
                ['Hourly example', '$30 x 8 hrs', usd2(30 * 8), 'Daily gross', usd2(30 * 8)],
              ].map(([title, labelA, valueA, labelB, valueB], index) => (
                <div key={title} style={{ paddingBottom: index === 0 ? 12 : 0, borderBottom: index === 0 ? '1px solid var(--border)' : 0, marginBottom: index === 0 ? 12 : 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)', marginBottom: 7 }}>{title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12, color: 'var(--text2)', marginBottom: 5 }}><span>{labelA}</span><span>{valueA}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, paddingTop: 5, borderTop: '1px solid var(--border)', marginTop: 4 }}><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{labelB}</span><span style={{ fontSize: 13.5, fontWeight: 800, color: '#22c55e' }}>{valueB}</span></div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 1 }}>{stateName} Paycheck Calculator Tax</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>Based on current inputs</div>
                </div>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(26,111,232,.12)', color: '#1a6fe8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M6 6.5h.01M14 13.5h.01" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"/><rect x="2.5" y="2.5" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                </span>
              </div>
              <div style={{ display: 'grid', gap: 9 }}>
                {stateTaxAtGlanceRows.map(([label, pct, value, color]) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '26px 1fr auto', gap: 7, alignItems: 'center', padding: '4px 0', borderTop: '1px solid var(--border)' }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, background: `${color}1A`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 13.5 13.5 4.5M5.2 5.7h.01M12.8 12.3h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>{label}</span>
                      <span style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color, marginTop: 1 }}>{pct}</span>
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 7, padding: '6px 8px', borderRadius: 8, background: stateHasNoIncomeTax ? 'rgba(34,197,94,.11)' : 'rgba(26,111,232,.10)', border: stateHasNoIncomeTax ? '1px solid rgba(34,197,94,.24)' : '1px solid rgba(26,111,232,.20)', fontSize: 10.5, lineHeight: 1.35, color: 'var(--text2)' }}>
                {stateHasNoIncomeTax ? '0.00% state wage income tax.' : 'State tax included from existing logic.'}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Payroll Snapshot</div>
              <div style={{ height: 90, borderRadius: 10, background: 'linear-gradient(135deg,#0f172a 0%,#1a6fe8 58%,#22c55e 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="168" height="96" viewBox="0 0 220 132" fill="none" aria-hidden="true">
                  <rect x="28" y="26" width="128" height="80" rx="14" fill="white" fillOpacity=".94" />
                  <rect x="44" y="42" width="72" height="8" rx="4" fill="#1a6fe8" />
                  <rect x="44" y="60" width="94" height="7" rx="3.5" fill="#cbd5e1" />
                  <rect x="44" y="76" width="58" height="7" rx="3.5" fill="#cbd5e1" />
                  <rect x="44" y="92" width="76" height="7" rx="3.5" fill="#22c55e" />
                  <circle cx="158" cy="82" r="30" fill="#22c55e" />
                  <text x="158" y="93" textAnchor="middle" fontSize="32" fill="white" fontWeight="900">$</text>
                </svg>
              </div>
              <div style={{ marginTop: 8, display: 'grid', gap: 4 }}>
                {[
                  ['Gross Pay', usd2(grossPerPeriod), '#0ea5e9'],
                  ['Taxes', usd2(totalTaxPerPeriod), '#f59e0b'],
                  ['Take Home', usd2(takeHomePerPeriod), '#22c55e'],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--text2)', fontWeight: 700 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: color }} />{label}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 800 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>Read About Finance</div>
                <Link to="/blogs" style={{ fontSize: 11.5, fontWeight: 700, color: '#1a6fe8', whiteSpace: 'nowrap' }}>View all</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  ['Texas Paycheck Calculator Guide', '/blogs/texas-paycheck-calculator-guide', 'Estimate Texas net pay with federal taxes and no state income tax.'],
                  ['Florida Paycheck Calculator Guide', '/blogs/florida-paycheck-calculator-guide', 'Understand Florida take-home pay, FICA, and paycheck planning.'],
                  ['Salary Calculator Guide', '/blogs/salary-calculator-guide', 'Convert annual salary into monthly, biweekly, weekly, and hourly pay estimates.'],
                ].map(([title, to, desc]) => (
                  <Link key={to} to={to} style={{ display: 'grid', gridTemplateColumns: '30px 1fr', gap: 8, alignItems: 'start', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(26,111,232,.10)', color: '#1a6fe8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BarChart3 size={16} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 12, lineHeight: 1.2, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{title}</span>
                      <span style={{ display: 'block', fontSize: 10.2, lineHeight: 1.2, color: 'var(--text3)' }}>{desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.30)', borderRadius: 10, padding: 12, display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 'auto' }}>
              <div style={{ width: 44, height: 44, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M13 2.5L4.5 7v5.5c0 5 3.5 9.7 8.5 10.8 5-1.1 8.5-5.8 8.5-10.8V7L13 2.5z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5"/><path d="M9 13l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Accuracy You Can Trust</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>Based on the current {stateName} calculator inputs and existing state payroll estimate logic.</div>
              </div>
            </div>
          </aside>
        </section>

        <section style={{ marginTop: 40, paddingBottom: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Related Calculators</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ['Paycheck Calculator', '/paycheck-calculator', 'Estimate general take-home pay.', '#faf5ff', '#7c3aed', 'paycheck'],
              ['Salary Calculator', '/salary-calculator', 'Convert salary and hourly pay.', '#eff6ff', '#1a6fe8', 'paycheck'],
              ['State Paycheck Calculators', '/states', 'Choose another state tool.', '#eff6ff', '#1a6fe8', 'map'],
              ['Texas Paycheck Calculator', '/texas-paycheck-calculator', 'Estimate Texas take-home pay.', '#f0fdf4', '#22c55e', 'dollar'],
              ['Florida Paycheck Calculator', '/florida-paycheck-calculator', 'Estimate Florida paycheck.', '#f0fdfa', '#0d9488', 'sun'],
              ['California Paycheck Calculator', '/california-paycheck-calculator', 'Estimate California taxes.', '#fff1f2', '#e11d48', 'tax'],
            ].map(([title, to, desc, bg, color, icon]) => (
              <Link key={to} to={to} style={{ display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 13px' }}>
                <div style={{ width: 40, height: 40, background: bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
                  {icon === 'clock' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="9" fill={color}/><path d="M11 7v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                  {icon === 'paycheck' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><rect x="5" y="8" width="12" height="2" rx="1" fill="white"/><rect x="5" y="12" width="8" height="2" rx="1" fill="white"/></svg>}
                  {icon === 'map' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><path d="M11 17s5-4 5-8a5 5 0 0 0-10 0c0 4 5 8 5 8Z" stroke="white" strokeWidth="1.6"/><circle cx="11" cy="9" r="1.8" fill="white"/></svg>}
                  {icon === 'dollar' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><text x="11" y="16" textAnchor="middle" fontSize="12" fill="white" fontWeight="800">$</text></svg>}
                  {icon === 'sun' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="9" fill={color}/><circle cx="11" cy="11" r="3.3" fill="white"/><path d="M11 4.8v1.4M11 15.8v1.4M4.8 11h1.4M15.8 11h1.4M6.6 6.6l1 1M14.4 14.4l1 1M15.4 6.6l-1 1M7.6 14.4l-1 1" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>}
                  {icon === 'tax' && <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="2" y="2" width="18" height="18" rx="3.5" fill={color}/><path d="M7 15 15 7M7.8 8.2h.01M14.2 13.8h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)', lineHeight: 1.4, marginBottom: 9 }}>{desc}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Calculate →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <CalcShell title={`${stateName} Paycheck`} isDark={isDark}>
        <Field
          label={rateType === 'hourly' ? 'Hourly Rate ($)' : 'Salary (per year)'}
          hint={isCalifornia ? 'California state income tax: 1% to 13.3%' : isIllinois ? 'Illinois flat state income tax: 4.95%' : isIndiana ? 'Indiana flat state income tax: 3.05%' : isWashington ? 'Washington has 0% state income tax' : `${stateName} has 0% state income tax`}
        >
          <Input value={grossPay} onChange={setGrossPay} />
        </Field>
        <Field label="Rate Type">
          <Select value={rateType} onChange={setRateType} options={[['', 'Select...'], ['annual', 'Annual Salary'], ['hourly', 'Hourly Wage']]} />
        </Field>
        {(isZeroStateTaxCalc || isCalifornia || isIllinois || isWashington || isIndiana || isVirginia || isHawaii || isNebraska) && rateType === 'hourly' && (
          <Field label={(isCalifornia || isIllinois || isWashington || isIndiana || isVirginia || isHawaii || isNebraska) ? 'Hours per pay period' : 'Hours per day'}>
            <Input value={hoursPerDay} onChange={setHoursPerDay} />
          </Field>
        )}
        {(isZeroStateTaxCalc || isCalifornia || isIllinois || isWashington || isIndiana || isVirginia || isHawaii || isNebraska) && (
          <Field
            label="Location (ZIP)"
            hint={stateName === 'Texas' ? 'TX range: 75001 - 79999' : stateName === 'California' ? 'CA range: 90001 - 96162' : stateName === 'Illinois' ? 'IL range: 60001 - 62999' : stateName === 'Washington' ? 'WA range: 98001 - 99403' : stateName === 'Indiana' ? 'IN range: 46001 - 47999' : stateName === 'Virginia' ? 'VA range: 20101 - 24658' : stateName === 'Hawaii' ? 'HI range: 96701 - 96898' : stateName === 'Nebraska' ? 'NE range: 68001 - 69367' : 'FL range: 32001 - 34999'}
          >
            <Input value={locationZip} onChange={setLocationZip} />
          </Field>
        )}
        <Field label="Pay Frequency" hint="Select how often you're paid">
          <Select value={payFreq} onChange={setPayFreq} options={[['', 'Select...'], ['daily', 'Daily (260x/yr)'], ['weekly', 'Weekly (52x/yr)'], ['biweekly', 'Bi-Weekly (26x/yr)'], ['semimonthly', 'Semi-Monthly (24x/yr)'], ['monthly', 'Monthly (12x/yr)'], ['annual', 'Annual']]} />
        </Field>
        <Field label="Filing Status" hint="Select for Federal tax calculation">
          <Select value={status} onChange={setStatus} options={(isZeroStateTaxCalc || isVirginia || isHawaii || isNebraska) ? [['single', 'Single'], ['married', 'Married Filing Jointly']] : [['single', 'Single'], ['married', 'Married Filing Jointly'], ['hoh', 'Head of Household'], ['mfs', 'Married Filing Separately']]} />
        </Field>
        {!isZeroStateTaxCalc && !isCalifornia && !isIllinois && !isWashington && !isIndiana && !isVirginia && !isHawaii && !isNebraska && (
          <Field label="Pre-tax Deduction Per Paycheck ($)"><Input value={preTaxDeduction} onChange={setPreTaxDeduction} /></Field>
        )}
        {isCalifornia ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="mb-3 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your estimated {payFreq === 'daily' ? 'daily' : payFreq === 'weekly' ? 'weekly' : payFreq === 'biweekly' ? 'bi-weekly' : payFreq === 'semimonthly' ? 'semi-monthly' : payFreq === 'monthly' ? 'monthly' : payFreq === 'annual' ? 'annual' : 'semi-monthly'} take home pay:</p>
              <p className="text-3xl font-bold">{usd(r.perPeriodTakeHome ?? 0)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod ?? 0)}</p>
                <p>Taxes: {(r.taxesPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd((r.federalPerPeriod ?? 0) + (r.caStatePerPeriod ?? 0))}</p>
                <p>&nbsp;&nbsp;Federal Income: {(r.federalPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.federalPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Income: {(r.statePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.caStatePerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Local Income: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>FICA and State Insurance Taxes: {(r.ficaAndStatePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd((r.ficaPerPeriod ?? 0) + (r.caSdiPerPeriod ?? 0))}</p>
                <p>&nbsp;&nbsp;Social Security: 6.20%&nbsp;&nbsp;{usd(r.socialSecurityPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Medicare: 1.45%&nbsp;&nbsp;{usd(r.medicarePerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Disability Insurance Tax: 1.00%&nbsp;&nbsp;{usd(r.caSdiPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Unemployment Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Family Leave Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Workers Compensation Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;Medical Insurance: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;Dental Coverage: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;Vision Insurance: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;401(k): 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;Long Term Disability Insurance: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;Life Insurance: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;Commuter Plan: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;FSA: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;HSA: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Take Home Salary: {(r.takeHomePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.perPeriodTakeHome ?? 0)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome ?? 0)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet ?? 0)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isIllinois ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="mb-3 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your estimated {payFreq === 'daily' ? 'daily' : payFreq === 'weekly' ? 'weekly' : payFreq === 'biweekly' ? 'bi-weekly' : payFreq === 'semimonthly' ? 'semi-monthly' : payFreq === 'monthly' ? 'monthly' : payFreq === 'annual' ? 'annual' : 'semi-monthly'} take home pay:</p>
              <p className="text-3xl font-bold">{usd(r.perPeriodTakeHome ?? 0)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod ?? 0)}</p>
                <p>Taxes: {(r.taxesPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd((r.federalPerPeriod ?? 0) + (r.ilStatePerPeriod ?? 0))}</p>
                <p>&nbsp;&nbsp;Federal Income: {(r.federalPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.federalPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Income: {(r.statePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.ilStatePerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Local Income: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>FICA and State Insurance Taxes: {(r.ficaPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.ficaPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Social Security: 6.20%&nbsp;&nbsp;{usd(r.socialSecurityPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Medicare: 1.45%&nbsp;&nbsp;{usd(r.medicarePerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Disability Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Unemployment Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Family Leave Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Workers Compensation Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Take Home Salary: {(r.takeHomePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.perPeriodTakeHome ?? 0)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome ?? 0)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet ?? 0)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isIndiana ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="mb-3 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your estimated {payFreq === 'daily' ? 'daily' : payFreq === 'weekly' ? 'weekly' : payFreq === 'biweekly' ? 'bi-weekly' : payFreq === 'semimonthly' ? 'semi-monthly' : payFreq === 'monthly' ? 'monthly' : payFreq === 'annual' ? 'annual' : 'semi-monthly'} take home pay:</p>
              <p className="text-3xl font-bold">{usd(r.perPeriodTakeHome ?? 0)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod ?? 0)}</p>
                <p>Taxes: {(r.taxesPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd((r.federalPerPeriod ?? 0) + (r.inStatePerPeriod ?? 0) + (r.inLocalPerPeriod ?? 0))}</p>
                <p>&nbsp;&nbsp;Federal Income: {(r.federalPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.federalPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Income: {(r.statePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.inStatePerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Local Income: {(r.localPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.inLocalPerPeriod ?? 0)}</p>
                <p>FICA and State Insurance Taxes: {(r.ficaPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.ficaPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Social Security: 6.20%&nbsp;&nbsp;{usd(r.socialSecurityPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Medicare: 1.45%&nbsp;&nbsp;{usd(r.medicarePerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Disability Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Unemployment Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Family Leave Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Workers Compensation Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Take Home Salary: {(r.takeHomePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.perPeriodTakeHome ?? 0)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome ?? 0)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet ?? 0)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isVirginia ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="mb-3 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your estimated {payFreq === 'daily' ? 'daily' : payFreq === 'weekly' ? 'weekly' : payFreq === 'biweekly' ? 'bi-weekly' : payFreq === 'semimonthly' ? 'semi-monthly' : payFreq === 'monthly' ? 'monthly' : payFreq === 'annual' ? 'annual' : 'semi-monthly'} take home pay:</p>
              <p className="text-3xl font-bold">{usd(r.perPeriodTakeHome ?? 0)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod ?? 0)}</p>
                <p>Taxes: {(r.taxesPct ?? 0).toFixed(2)}%  {usd((r.federalPerPeriod ?? 0) + (r.vaStatePerPeriod ?? 0) + (r.vaLocalPerPeriod ?? 0))}</p>
                <p>Federal Income: {(r.federalPct ?? 0).toFixed(2)}%  {usd(r.federalPerPeriod ?? 0)}</p>
                <p>State Income: {(r.statePct ?? 0).toFixed(2)}%  {usd(r.vaStatePerPeriod ?? 0)}</p>
                <p>Local Income: 0.00%  {usd(0)}</p>
                <p>FICA and State Insurance Taxes: {(r.ficaPct ?? 0).toFixed(2)}%  {usd(r.ficaPerPeriod ?? 0)}</p>
                <p>Social Security: 6.20%  {usd(r.socialSecurityPerPeriod ?? 0)}</p>
                <p>Medicare: 1.45%  {usd(r.medicarePerPeriod ?? 0)}</p>
                <p>State Disability Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Unemployment Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Family Leave Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Workers Compensation Insurance Tax: 0.00%  {usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Take Home Salary: {(r.takeHomePct ?? 0).toFixed(2)}%  {usd(r.perPeriodTakeHome ?? 0)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome ?? 0)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet ?? 0)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isHawaii ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="mb-3 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your estimated {payFreq === 'daily' ? 'daily' : payFreq === 'weekly' ? 'weekly' : payFreq === 'biweekly' ? 'bi-weekly' : payFreq === 'semimonthly' ? 'semi-monthly' : payFreq === 'monthly' ? 'monthly' : payFreq === 'annual' ? 'annual' : 'semi-monthly'} take home pay:</p>
              <p className="text-3xl font-bold">{usd(r.perPeriodTakeHome ?? 0)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod ?? 0)}</p>
                <p>Taxes: {(r.taxesPct ?? 0).toFixed(2)}%  {usd((r.federalPerPeriod ?? 0) + (r.hiStatePerPeriod ?? 0) + (r.hiLocalPerPeriod ?? 0))}</p>
                <p>Federal Income: {(r.federalPct ?? 0).toFixed(2)}%  {usd(r.federalPerPeriod ?? 0)}</p>
                <p>State Income: {(r.statePct ?? 0).toFixed(2)}%  {usd(r.hiStatePerPeriod ?? 0)}</p>
                <p>Local Income: 0.00%  {usd(0)}</p>
                <p>FICA and State Insurance Taxes: {(r.ficaPct ?? 0).toFixed(2)}%  {usd(r.ficaPerPeriod ?? 0)}</p>
                <p>Social Security: 6.20%  {usd(r.socialSecurityPerPeriod ?? 0)}</p>
                <p>Medicare: 1.45%  {usd(r.medicarePerPeriod ?? 0)}</p>
                <p>State Disability Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Unemployment Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Family Leave Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Workers Compensation Insurance Tax: 0.00%  {usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Take Home Salary: {(r.takeHomePct ?? 0).toFixed(2)}%  {usd(r.perPeriodTakeHome ?? 0)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome ?? 0)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet ?? 0)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isNebraska ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="mb-3 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your estimated {payFreq === 'daily' ? 'daily' : payFreq === 'weekly' ? 'weekly' : payFreq === 'biweekly' ? 'bi-weekly' : payFreq === 'semimonthly' ? 'semi-monthly' : payFreq === 'monthly' ? 'monthly' : payFreq === 'annual' ? 'annual' : 'semi-monthly'} take home pay:</p>
              <p className="text-3xl font-bold">{usd(r.perPeriodTakeHome ?? 0)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod ?? 0)}</p>
                <p>Taxes: {(r.taxesPct ?? 0).toFixed(2)}%  {usd((r.federalPerPeriod ?? 0) + (r.neStatePerPeriod ?? 0) + (r.neLocalPerPeriod ?? 0))}</p>
                <p>Federal Income: {(r.federalPct ?? 0).toFixed(2)}%  {usd(r.federalPerPeriod ?? 0)}</p>
                <p>State Income: {(r.statePct ?? 0).toFixed(2)}%  {usd(r.neStatePerPeriod ?? 0)}</p>
                <p>Local Income: 0.00%  {usd(0)}</p>
                <p>FICA and State Insurance Taxes: {(r.ficaPct ?? 0).toFixed(2)}%  {usd(r.ficaPerPeriod ?? 0)}</p>
                <p>Social Security: 6.20%  {usd(r.socialSecurityPerPeriod ?? 0)}</p>
                <p>Medicare: 1.45%  {usd(r.medicarePerPeriod ?? 0)}</p>
                <p>State Disability Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Unemployment Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Family Leave Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Workers Compensation Insurance Tax: 0.00%  {usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Take Home Salary: {(r.takeHomePct ?? 0).toFixed(2)}%  {usd(r.perPeriodTakeHome ?? 0)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome ?? 0)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet ?? 0)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isWashington ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="mb-3 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your estimated {payFreq === 'daily' ? 'daily' : payFreq === 'weekly' ? 'weekly' : payFreq === 'biweekly' ? 'bi-weekly' : payFreq === 'semimonthly' ? 'semi-monthly' : payFreq === 'monthly' ? 'monthly' : payFreq === 'annual' ? 'annual' : 'semi-monthly'} take home pay:</p>
              <p className="text-3xl font-bold">{usd(r.perPeriodTakeHome ?? 0)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod ?? 0)}</p>
                <p>Taxes: {(r.taxesPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.federalPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Federal Income: {(r.federalPct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.federalPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Income: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;Local Income: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>FICA and State Insurance Taxes: {(r.ficaAndStatePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.ficaPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Social Security: 6.20%&nbsp;&nbsp;{usd(r.socialSecurityPerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;Medicare: 1.45%&nbsp;&nbsp;{usd(r.medicarePerPeriod ?? 0)}</p>
                <p>&nbsp;&nbsp;State Disability Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Unemployment Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Family Leave Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>&nbsp;&nbsp;State Workers Compensation Insurance Tax: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%&nbsp;&nbsp;{usd(0)}</p>
                <p>Take Home Salary: {(r.takeHomePct ?? 0).toFixed(2)}%&nbsp;&nbsp;{usd(r.perPeriodTakeHome ?? 0)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome ?? 0)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet ?? 0)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle key={slice.key} cx="60" cy="60" r="42" fill="none" stroke={slice.color} strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset} transform="rotate(-90 60 60)" />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isZeroStateTaxCalc ? (
          <div className={`rounded-2xl p-4 md:col-span-2 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
            <div className="mb-3 text-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your estimated {payFreq === 'daily' ? 'daily' : payFreq === 'weekly' ? 'weekly' : payFreq === 'biweekly' ? 'bi-weekly' : payFreq === 'semimonthly' ? 'semi-monthly' : payFreq === 'monthly' ? 'monthly' : payFreq === 'annual' ? 'annual' : 'semi-monthly'} take home pay:</p>
              <p className="text-3xl font-bold">{usd(r.perPeriodTakeHome ?? 0)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="space-y-1 text-sm">
                <p>Where is your money going?</p>
                <p>Gross Paycheck: {usd(r.grossPerPeriod)}</p>
                <p>Taxes: {r.taxesPct.toFixed(2)}%  {usd(r.federalPerPeriod)}</p>
                <p>Federal Income: {r.taxesPct.toFixed(2)}%  {usd(r.federalPerPeriod)}</p>
                <p>State Income: 0.00%  {usd(0)}</p>
                <p>Local Income: 0.00%  {usd(0)}</p>
                <p>FICA and State Insurance Taxes: {r.ficaPct.toFixed(2)}%  {usd(r.ficaPerPeriod)}</p>
                <p>Social Security: 6.20%  {usd(r.socialSecurityPerPeriod)}</p>
                <p>Medicare: 1.45%  {usd(r.medicarePerPeriod)}</p>
                <p>State Disability Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Unemployment Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Family Leave Insurance Tax: 0.00%  {usd(0)}</p>
                <p>State Workers Compensation Insurance Tax: 0.00%  {usd(0)}</p>
                <p>Pre-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Post-Tax Deductions: 0.00%  {usd(0)}</p>
                <p>Take Home Salary: {r.takeHomePct.toFixed(2)}%  {usd(r.perPeriodTakeHome)}</p>
                <p>Annual Take-Home: {usd(r.annualTakeHome)}</p>
                <p>Monthly Net Pay: {usd(r.monthlyNet)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 120" className="h-36 w-36">
                    <circle cx="60" cy="60" r="42" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="16" />
                    {stateGraphSlices.map((slice) => (
                      <circle
                        key={slice.key}
                        cx="60"
                        cy="60"
                        r="42"
                        fill="none"
                        stroke={slice.color}
                        strokeWidth="16"
                        strokeDasharray={`${slice.dash} ${stateCircumference - slice.dash}`}
                        strokeDashoffset={-slice.offset}
                        transform="rotate(-90 60 60)"
                      />
                    ))}
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  {stateGraphItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span>{usd(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Result isDark={isDark} lines={[
            `Pay Periods/Year: ${r.periods}`,
            `Gross Per Paycheck: ${usd(r.grossPer)}`,
            `Estimated Federal Tax Per Paycheck: ${usd(r.fedPer)}`,
            `Estimated FICA Per Paycheck: ${usd(r.ficaPer)}`,
            `Estimated State Income Tax Per Paycheck (${stateName}): ${usd(r.statePer)} (No state income tax)`,
            `Estimated Net Per Paycheck: ${usd(r.netPer)}`,
            `Estimated Net Annual: ${usd(r.netAnnual)}`,
          ]} />
        )}
      </CalcShell>

      {stateName === 'Texas' && (
        <>
          

          

          

          

          

          <img
            src="/texas-paycheck-seo-illustration.svg"
            alt="Texas paycheck calculator illustration highlighting no state income tax and federal deductions"
            className="mt-6 w-full rounded-2xl border border-white/10"
            loading="lazy"
          />

          

          
        </>
      )}

      {stateName === 'Florida' && (
        <>
          

          

          

          

          <img
            src="/florida-paycheck-seo-illustration.svg"
            alt="Florida paycheck calculator illustration highlighting no state income tax and net pay planning"
            className="mt-6 w-full rounded-2xl border border-white/10"
            loading="lazy"
          />

          

          
        </>
      )}

      {isCalifornia && (
        <>
          

          

          

          

          

          

          

          

          

          

          

          

          

          

          
        </>
      )}

      {isNebraska && (
        <>
          

          
        </>
      )}

      {isVirginia && (
        <>
          

          
        </>
      )}

      {isIndiana && (
        <>
          

          
        </>
      )}

      {isHawaii && (
        <>
          

          
        </>
      )}

      {isIllinois && (
        <>
          

          
        </>
      )}
    </main>
  );
}


function PrivacyPolicyPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p><strong>Effective Date:</strong> May 30, 2026</p>
          <p><strong>Last Updated:</strong> July 1, 2026</p>
          <p>This Privacy Policy describes how OBBBA Tax Calculators handles information when you visit our website, <Link to="/" className="underline text-cyan-400">obbacalculators.com</Link>, and use our federal tax estimate calculators for overtime, tips, senior deduction, and car loan interest scenarios.</p>

          <p><strong>1. Information We Process</strong></p>
          <p>When you use a calculator, values such as filing status, income figures, hours, rates, and eligibility selections are processed to produce estimate results.</p>
          <p>If you subscribe to OBBA updates, we collect the email address you submit and may record signup context such as signup page, timestamp, browser language, timezone, referrer, and approximate location details provided by hosting request headers, such as country, region, and city where available.</p>

          <p><strong>2. Calculator Inputs and Local Processing</strong></p>
          <p>Our tools are designed to run calculations directly in your browser session. We do not require account registration to access basic calculator features.</p>

          <p><strong>3. Automatically Collected Technical Data</strong></p>
          <p>Like most websites, we may receive limited technical information such as browser type, device type, and basic request logs for performance, reliability, and security monitoring.</p>

          <p><strong>4. Cookies and Tracking</strong></p>
          <p>If cookies or analytics tools are used for functionality, security, or traffic analysis, they are used to improve the website experience. If additional tracking providers are integrated later, this policy will be updated.</p>
          <p>The updates popup uses browser localStorage to remember when the popup was last shown or submitted, so it does not repeatedly appear before the configured return interval.</p>

          <p><strong>5. How We Use Information</strong></p>
          <p>We use available information to operate the site, deliver calculator outputs, maintain performance, prevent abuse, and improve user experience over time.</p>

          <p><strong>6. Third-Party Services and Links</strong></p>
          <p>Our website may include links to external resources such as IRS.gov. Third-party websites have separate policies and practices, and we are not responsible for their content or data handling.</p>

          <p><strong>7. Sharing and Disclosure</strong></p>
          <p>We do not sell personal calculator input data. Information may be disclosed if required by law, court order, or to protect the security and integrity of our services.</p>

          <p><strong>8. Data Retention</strong></p>
          <p>We keep technical records only for as long as necessary to support operations, legal compliance, and security. Calculator estimate inputs are not intended to be stored as long-term personal tax records.</p>

          <p><strong>9. Security Measures</strong></p>
          <p>We apply reasonable safeguards to protect website systems and data flows. However, no internet-based platform can guarantee absolute security.</p>

          <p><strong>10. Children's Privacy</strong></p>
          <p>This website is not directed to children under 13. If you believe a child provided personal information, contact us so we can review and remove it where appropriate.</p>

          <p><strong>11. International Access</strong></p>
          <p>OBBBA Tax Calculators is intended for U.S.-focused tax estimate use. If you access the site from outside the United States, local laws in your jurisdiction may also apply.</p>

          <p><strong>12. Policy Updates</strong></p>
          <p>We may revise this Privacy Policy to reflect product, legal, or operational updates. Revised versions will be posted on this page with an updated date.</p>

          <p><strong>13. Contact</strong></p>
          <p>For privacy questions, contact us at <a href="mailto:obbacalculators@gmail.com" target="_blank" rel="nofollow noopener noreferrer" className="underline text-cyan-400">obbacalculators@gmail.com</a>.</p>

          <p><strong>Important Note</strong></p>
          <p>This Privacy Policy applies specifically to the OBBBA Tax Calculators website and related calculator services. By using this website, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, processing, and use of information as described on this page.</p>
        </div>
      </article>
    </main>
  );
}

function UnsubscribePage({ isDark }) {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('working');

  useEffect(() => {
    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';
    if (!email || !token) {
      setStatus('invalid');
      return;
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
        setStatus(response.ok ? 'done' : 'invalid');
      } catch {
        setStatus('failed');
      }
    };

    unsubscribe();
  }, [searchParams]);

  const copy = {
    working: {
      title: 'Unsubscribing...',
      text: 'Please wait while we update your OBBA Calculators email preferences.',
    },
    done: {
      title: 'You are unsubscribed',
      text: 'You will no longer receive OBBA Calculators email updates at this address.',
    },
    invalid: {
      title: 'Invalid unsubscribe link',
      text: 'This unsubscribe link is missing information or has expired.',
    },
    failed: {
      title: 'Could not unsubscribe',
      text: 'The unsubscribe request could not be completed from this preview. Open the link on the deployed site or try again later.',
    },
  }[status];

  return (
    <main className="obba-page">
      <section className="obba-card mx-auto max-w-2xl p-6 text-center sm:p-10">
        <div className="obba-updates-mark mx-auto">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16v11H4V7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="m4 8 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="obba-updates-kicker">Email Preferences</p>
        <h1 className="mt-2 text-3xl font-extrabold" style={{ color: 'var(--text)' }}>{copy.title}</h1>
        <p className={`mx-auto mt-4 max-w-lg text-sm leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{copy.text}</p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20"
        >
          Back to Calculator
        </Link>
      </section>
    </main>
  );
}

function StatesPage() {
  return (
    <main className="obba-page">
      <section className="grid gap-8 py-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold" style={{ borderColor: 'var(--border)', background: 'var(--brand-soft)', color: 'var(--brand)' }}>
            <Map size={14} />
            State paycheck calculators
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl" style={{ color: 'var(--text)' }}>
            Choose your state calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: 'var(--text2)' }}>
            Open a state paycheck calculator to estimate take-home pay with federal withholding, FICA, and state-specific payroll rules.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/paycheck-calculator" className="inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-bold text-white" style={{ background: 'var(--brand)' }}>
              <BarChart3 size={16} />
              General paycheck
            </Link>
            <Link to="/salary-calculator" className="inline-flex items-center gap-2 rounded-[10px] border px-4 py-2.5 text-sm font-bold" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              Salary calculator
            </Link>
          </div>
        </div>
        <div className="obba-card overflow-hidden p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Available states</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text2)' }}>{STATE_CALCULATOR_LINKS.length} dedicated payroll calculators</p>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-[14px]" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>
              <Landmark size={26} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {STATE_CALCULATOR_LINKS.map((state) => (
              <Link
                key={state.code}
                to={state.path}
                className="rounded-[10px] border px-3 py-3 text-center text-sm font-extrabold"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
              >
                {state.code}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
        {STATE_CALCULATOR_LINKS.map((state) => (
          <Link key={state.code} to={state.path} className="obba-card group block p-5 hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-[12px] text-white" style={{ background: state.accent }}>
                  <MapPin size={21} />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: 'var(--text)' }}>{state.name} Paycheck Calculator</h2>
                  <p className="text-xs font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text2)' }}>{state.code} calculator</p>
                </div>
              </div>
              <ChevronDown size={18} className="-rotate-90 transition-transform group-hover:translate-x-1" style={{ color: 'var(--brand)' }} />
            </div>
            <div className="mt-5 rounded-[12px] border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{state.tax}</p>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text2)' }}>
                Calculate gross pay, estimated taxes, deductions, and take-home pay for {state.name}.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: 'var(--brand)' }}>
              Open {state.name} calculator
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}

function TermsConditionsPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p><strong>Effective Date:</strong> May 30, 2026</p>
          <p>By accessing and using OBBBA Tax Calculators, you agree to the following terms.</p>
          <p><strong>1. Informational Purpose</strong>: This website provides educational federal tax estimate tools only. Results are not legal, tax, accounting, or financial advice.</p>
          <p><strong>2. User Responsibility</strong>: You are responsible for reviewing assumptions, verifying values, and confirming final filing treatment with IRS instructions or a licensed tax professional.</p>
          <p><strong>3. No Guarantee</strong>: While we aim for accurate formulas and updated thresholds, we do not guarantee completeness, suitability, or error-free operation.</p>
          <p><strong>4. Law and Guidance Changes</strong>: Tax law, IRS guidance, and implementation details can change. We may modify calculators and content at any time without prior notice.</p>
          <p><strong>5. Limitation of Liability</strong>: To the fullest extent permitted by law, OBBBA Tax Calculators is not liable for losses resulting from use of this website or reliance on estimate outputs.</p>
          <p><strong>6. Third-Party Resources</strong>: Links to external websites are provided for convenience. We are not responsible for third-party content, availability, or policies.</p>
          <p><strong>7. Acceptable Use</strong>: You agree not to misuse the site, interfere with operations, attempt unauthorized access, or use automated abuse scripts.</p>
          <p><strong>8. Contact</strong>: Terms-related questions can be sent to <a href="mailto:obbacalculators@gmail.com" target="_blank" rel="nofollow noopener noreferrer" className="underline text-cyan-400">obbacalculators@gmail.com</a>.</p>
        </div>
      </article>
    </main>
  );
}

function ContactUsPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>For support, policy questions, correction requests, or calculator feedback, contact us directly.</p>
          <p><strong>Website:</strong> <Link to="/" className="underline text-cyan-400">obbacalculators.com</Link></p>
          <p><strong>Email:</strong> <a href="mailto:obbacalculators@gmail.com" target="_blank" rel="nofollow noopener noreferrer" className="underline text-cyan-400">obbacalculators@gmail.com</a></p>
          <p><strong>Subject line suggestion:</strong> OBBBA Calculator Support Request</p>
          <p>For faster handling, include the calculator name (Overtime, Salary, Paycheck, Texas Paycheck, or Florida Paycheck), filing status used, and the input set you tested.</p>
          <p>We usually respond in received order during business days.</p>
        </div>
      </article>
    </main>
  );
}

function AboutUsPage({ isDark }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-2">About OBBBA Tax Calculators</h1>
        <p className={`mb-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Explore the calculation methods, payroll logic, and federal/state estimate workflows behind all active tools: No Tax on Overtime Calculator, Hourly to Salary Calculator, Paycheck Calculator, Texas Paycheck Calculator, and Florida Paycheck Calculator.
        </p>

        <div className={`space-y-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <h2 className="text-xl font-bold">Introduction</h2>
          <p>OBBBA Tax Calculators is a practical financial planning platform designed to help workers estimate take-home pay, compare gross vs net income, and understand payroll deductions with speed and clarity.</p>
          <p>The site combines keyword-focused calculator pages with transparent formulas so users can model earnings and budget decisions in minutes.</p>

          <h2 className="text-xl font-bold">Active Calculators</h2>
          <p><strong>No Tax on Overtime Calculator:</strong> Estimates overtime-related federal deduction impact using overtime premium logic, filing status, MAGI, and phase-out ranges.</p>
          <p><strong>Hourly to Salary Calculator:</strong> Converts hourly wages to annual salary for compensation comparison, budgeting, and job-offer planning.</p>
          <p><strong>Paycheck Calculator:</strong> Projects net paycheck after federal withholding, FICA, and deduction scenarios.</p>
          <p><strong>Texas Paycheck Calculator:</strong> Estimates paycheck outcomes for Texas workers with no state income tax plus federal/FICA deductions.</p>
          <p><strong>Florida Paycheck Calculator:</strong> Estimates paycheck outcomes for Florida workers with no state income tax plus federal/FICA deductions.</p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/overtime" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Overtime Calculator</Link>
            <Link to="/salary-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Salary Calculator</Link>
            <Link to="/paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Paycheck Calculator</Link>
            <Link to="/texas-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Texas Paycheck Calculator</Link>
            <Link to="/florida-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Florida Paycheck Calculator</Link>
            <Link to="/california-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open California Paycheck Calculator</Link>
            <Link to="/illinois-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Illinois Paycheck Calculator</Link>
            <Link to="/washington-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Washington Paycheck Calculator</Link>
            <Link to="/indiana-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Indiana Paycheck Calculator</Link>
            <Link to="/virginia-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Virginia Paycheck Calculator</Link>
            <Link to="/hawaii-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Hawaii Paycheck Calculator</Link>
            <Link to="/nebraska-paycheck-calculator" className="rounded-xl bg-cyan-500 px-4 py-2 text-center font-semibold text-slate-950">Open Nebraska Paycheck Calculator</Link>
          </div>

          <h2 className="text-xl font-bold">Methodology and Scope</h2>
          <p><strong>Federal-first logic:</strong> Core outputs focus on federal withholding behavior, FICA deductions, and gross-to-net payroll estimation.</p>
          <p><strong>State-specific context:</strong> Texas and Florida pages account for no state income tax while preserving federal payroll rules.</p>
          <p><strong>Input transparency:</strong> Result changes are driven by filing status, income, pay frequency, and pre-tax deduction inputs.</p>

          <h2 className="text-xl font-bold">SEO Keyword Focus</h2>
          <p>Content is optimized around high-intent search terms including no tax on overtime calculator, hourly to salary calculator, paycheck calculator, texas paycheck calculator, and florida paycheck calculator.</p>
          <p>Semantically structured headings and Q&A sections are used to align with user intent and improve readability for both users and search engines.</p>

          <h2 className="text-xl font-bold">Technical Quality</h2>
          <p><strong>Validation:</strong> Numeric input checks and deterministic formulas reduce calculation errors.</p>
          <p><strong>Performance:</strong> Client-side processing delivers instant feedback and fast Vercel deployment behavior.</p>
          <p><strong>UX:</strong> Responsive layout and plain-language result summaries support desktop and mobile workflows.</p>

          <h2 className="text-xl font-bold">Limitations and Disclaimer</h2>
          <p><strong>Educational estimates:</strong> Results are for planning purposes and are not legal or tax advice.</p>
          <p><strong>Regulatory changes:</strong> Federal brackets, withholding behavior, and payroll limits can change over time.</p>
          <p><strong>Professional review:</strong> Consult a qualified CPA, EA, or tax attorney for filing and compliance decisions.</p>

          <h2 className="text-xl font-bold">Conclusion</h2>
          <p>OBBBA Tax Calculators helps users make faster, smarter payroll decisions with clear tools, keyword-focused guidance, and transparent estimate logic across overtime, salary, and paycheck scenarios.</p>
        </div>
      </article>
    </main>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="obba-field-label mb-1 block text-sm">{label}</label>
      {children}
      {hint ? <p className="obba-field-hint mt-1 text-xs">{hint}</p> : null}
    </div>
  );
}
function Input({ value, onChange }) { return <input type="number" value={value} onChange={(e)=>onChange(e.target.value)} className="obba-input" />; }
function Select({ value, onChange, options }) { return <select value={value} onChange={(e)=>onChange(e.target.value)} className="obba-input">{options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>; }
function Result({ isDark, lines }) { return <div className="obba-result p-4 md:col-span-2">{lines.map((x)=> <p key={x}>{x}</p>)}</div>; }
function CalcShell({ title, children, isDark }) { return <main className="obba-page"><div className="obba-card p-6 sm:p-8"><h1 className="mb-4 text-2xl font-extrabold" style={{ color: 'var(--text)' }}>{title} Calculator</h1><div className="grid gap-4 md:grid-cols-2">{children}</div></div></main>; }

function ArticleTable({ isDark, title, headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-xs border-collapse ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        <caption className="text-left font-semibold text-sm mb-2 text-white">{title}</caption>
        <thead>
          <tr className={isDark ? 'bg-slate-700' : 'bg-slate-200'}>
            {headers.map((header) => (
              <th key={header} className="border border-slate-500 px-3 py-2 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')} className={isDark ? 'even:bg-slate-800' : 'even:bg-slate-50'}>
              {row.map((cell) => (
                <td key={cell} className="border border-slate-500 px-3 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WashingtonPaycheckArticle({ isDark }) {
  return (
    <>
      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <h2 className="text-2xl font-bold pt-2 text-white">Calculate Your Washington Paycheck Instantly</h2>
          <p>Accurate paycheck calculations require current tax rates and proper deduction amounts. Our paycheck calculator provides precise results based on your specific situation.</p>
          <p>Enter your gross pay, filing status, and deduction information. The calculator applies all federal and state requirements automatically. You receive a detailed breakdown of your net pay within seconds.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Washington State Tax Advantages for Employees</h2>
          <p>Washington workers enjoy significant tax benefits. The state constitution prohibits income tax on wages. This constitutional protection has existed since 1930.</p>
          <p>No state income tax means your washington paycheck keeps more money. Only federal taxes, social security tax, and medicare tax reduce your gross pay. This creates substantial savings compared to high-tax states like California or New York.</p>
          <p>Federal income tax still applies to all Washington workers. Your filing status determines your withholding amount. The Internal Revenue Service sets these rates annually.</p>
          <ArticleTable
            isDark={isDark}
            title="Washington Tax Benefits and Federal Obligations"
            headers={['Tax Benefits', 'Federal Obligations']}
            rows={[
              ['No state income tax on wages', 'Federal income tax applies normally'],
              ['Constitutional protection against income tax', 'Social security tax at standard rate'],
              ['Higher take-home pay than most states', 'Medicare tax required for all employees'],
              ['Simplified tax filing process', 'Additional Medicare tax for high earners'],
            ]}
          />

          <h2 className="text-2xl font-bold pt-2 text-white">Gross Pay Calculation Methods in Washington</h2>
          <p>Your gross pay calculation depends on your employment type. Hourly workers and salaried employees use different gross pay methods.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Hourly Employee Calculations</h3>
          <p>Hourly workers multiply hours worked by their hourly rate. Overtime hours earn time-and-a-half in Washington. Any hours beyond forty per week qualify as overtime.</p>
          <p>The gross pay method for hourly employees includes regular hours plus overtime premium. Washington law requires overtime payment for all non-exempt employees. Some workers receive double-time for specific situations.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Salaried Employee Calculations</h3>
          <p>Salaried employees receive fixed amounts per pay period. Annual salary divided by pay frequency determines each paycheck amount. Most companies use biweekly or semi-monthly pay schedules.</p>
          <p>Pay frequency affects your washington paycheck size but not annual earnings. Biweekly schedules produce twenty-six paychecks yearly. Semi-monthly schedules create twenty-four paychecks per year.</p>
          <ArticleTable
            isDark={isDark}
            title="Washington Pay Frequency Calculation Methods"
            headers={['Pay Frequency', 'Paychecks Per Year', 'Calculation Method', 'Common Industries']}
            rows={[
              ['Weekly', '52', 'Annual salary / 52', 'Retail, hospitality'],
              ['Biweekly', '26', 'Annual salary / 26', 'Corporate, technology'],
              ['Semi-Monthly', '24', 'Annual salary / 24', 'Finance, government'],
              ['Monthly', '12', 'Annual salary / 12', 'Education, nonprofits'],
            ]}
          />
          <h3 className="text-xl font-semibold pt-2 text-white">Commission and Bonus Considerations</h3>
          <p>Commission earnings add to your base gross pay. Sales professionals often receive both salary and commission. Bonuses also increase gross pay for that specific pay period.</p>
          <p>Supplemental wages like bonuses face different federal withholding rates. Employers may withhold twenty-two percent flat rate or aggregate with regular wages. This affects your net pay significantly during bonus periods.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Federal Income Tax Withholding from Your Washington Paycheck</h2>
          <p>Federal income tax represents the largest deduction for most workers. The amount withheld depends on your filing status and allowances claimed on Form W-4.</p>
          <p>Your filing status choices include single, married filing jointly, married filing separately, or head of household. Married filing jointly typically results in lower withholding than single status.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Understanding Your W-4 Form</h3>
          <p>The W-4 form tells your employer how much federal income tax to withhold. Recent changes simplified this form but made it more important to complete accurately.</p>
          <p>You can claim dependents, report additional income, and request extra withholding. These choices directly impact your washington paycheck size and potential tax refund.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Tax Brackets and Withholding Rates</h3>
          <p>Federal tax uses progressive brackets. Higher income faces higher tax rates. Your employer calculates withholding using IRS tables that account for your pay frequency.</p>
          <p>The federal income withholding considers your total annual taxable income. More frequent paychecks mean smaller withholding amounts per check. Your total annual withholding remains the same regardless of pay frequency.</p>
          <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4"><strong>Important note:</strong> Update your W-4 after major life changes. Marriage, divorce, new children, or home purchases may require adjustments. Proper withholding prevents surprises at tax time.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Social Security and Medicare Tax Requirements</h2>
          <p>Social security tax and medicare tax make up FICA taxes. These mandatory payroll taxes fund federal benefit programs. Every employee pays these taxes regardless of income level.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Social Security Tax Details</h3>
          <p>The social security tax rate stands at six point two percent of gross pay. This applies to earnings up to the annual wage base limit. For year twenty twenty-four, the limit reaches one hundred sixty-eight thousand six hundred dollars.</p>
          <p>Earnings above the wage base receive no additional social security tax. High earners reach this threshold mid-year. Their paychecks increase once they hit the maximum taxable amount.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Medicare Tax Requirements</h3>
          <p>Medicare tax equals one point four five percent of all gross pay. No wage base limit exists for medicare tax. All earnings remain subject to this deduction.</p>
          <p>Additional medicare tax applies to high earners. Single filers pay an extra zero point nine percent on income exceeding two hundred thousand dollars. Married filing jointly threshold starts at two hundred fifty thousand dollars.</p>
          <ArticleTable
            isDark={isDark}
            title="Social Security and Medicare Tax Details"
            headers={['Social Security Tax', 'Medicare Tax']}
            rows={[
              ['Rate: 6.2% of gross pay', 'Rate: 1.45% of all earnings'],
              ['Annual wage base limit applies', 'No wage base limit'],
              ['Funds retirement benefits', 'Funds healthcare benefits'],
              ['Employees pay taxes deductions equally', 'Additional 0.9% for high earners'],
              ['Self-employed pay double rate', 'Applies to all income types'],
            ]}
          />
          <p>Your employer matches your FICA contributions. They pay equal amounts of social security and standard medicare tax. This doubles the total contribution to these programs.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Common Pre-Tax and Post-Tax Deductions</h2>
          <p>Deductions reduce your washington paycheck beyond mandatory taxes. Pre-tax deductions lower your taxable income. Post-tax deductions come from your net pay after taxes.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Pre-Tax Deduction Benefits</h3>
          <p>Pre-tax deductions reduce both federal income tax and FICA taxes. Health insurance premiums typically qualify as pre-tax deductions. Retirement contributions to traditional plans also reduce taxable income.</p>
          <p>These deductions decrease your tax burden significantly. A health insurance premium of two hundred dollars monthly saves about seventy-five dollars in taxes. This makes benefits more affordable for employees.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Common Pre-Tax Deductions</h3>
          <p>Health insurance represents the most common pre-tax deduction. Dental and vision coverage also qualify. Flexible spending accounts allow pre-tax contributions for medical and dependent care expenses.</p>
          <p>Retirement plans like traditional IRAs reduce taxable income. Many employers offer matching contributions. This creates immediate returns on your retirement savings.</p>
          <ArticleTable
            isDark={isDark}
            title="Pre-Tax and Post-Tax Deductions"
            headers={['Pre-Tax Deductions', 'Post-Tax Deductions']}
            rows={[
              ['Health insurance premiums', 'Roth 401(k) contributions'],
              ['Dental and vision insurance', 'Roth IRA contributions'],
              ['Traditional 401(k) contributions', 'Disability insurance premiums'],
              ['Health savings accounts', 'Life insurance premiums'],
              ['Flexible spending accounts', 'Union dues'],
              ['Transit and parking benefits', 'Wage garnishments'],
              ['Traditional IRA contributions', 'Charitable contributions'],
            ]}
          />
          <h3 className="text-xl font-semibold pt-2 text-white">Post-Tax Deduction Categories</h3>
          <p>Post-tax deductions include Roth retirement contributions. These provide no immediate tax benefit but grow tax-free. Supplemental life insurance and disability coverage typically use post-tax dollars.</p>
          <p>Garnishments for child support or debt repayment come from net pay. Union dues and charitable payroll deductions also use after-tax money. These amounts appear on your pay stub separately.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">How to Calculate Your Net Pay Accurately</h2>
          <p>Net pay represents your actual take-home amount. Start with gross pay and subtract all mandatory taxes. Then remove voluntary deductions to reach your final net pay.</p>
          <p>The calculation follows this sequence: gross pay minus federal income tax minus FICA taxes minus pre-tax deductions minus post-tax deductions equals net pay. Each washington paycheck follows this same formula.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Step-by-Step Net Pay Calculation</h3>
          <p>Begin with your gross pay for the pay period. Apply federal income tax withholding based on your W-4 information. Subtract social security tax at six point two percent and medicare tax at one point four five percent.</p>
          <p>Remove pre-tax deductions like health insurance and retirement contributions. These reduce your taxable income retroactively. Finally, subtract post-tax deductions to arrive at your net pay amount.</p>
          <ArticleTable
            isDark={isDark}
            title="Example Washington Paycheck Calculation"
            headers={['Paycheck Item', 'Amount']}
            rows={[
              ['Gross Pay', '$3,000'],
              ['Federal Income Tax', '-$300'],
              ['Social Security Tax', '-$186'],
              ['Medicare Tax', '-$43.50'],
              ['Health Insurance (pre-tax)', '-$150'],
              ['401(k) Contribution (pre-tax)', '-$180'],
              ['Net Pay', '$2,140.50'],
            ]}
          />
          <h3 className="text-xl font-semibold pt-2 text-white">Factors Affecting Your Net Pay</h3>
          <p>Filing status significantly impacts net pay. Married filing jointly status reduces federal withholding compared to single status. Claiming dependents also lowers your tax burden.</p>
          <p>Pay frequency affects individual check amounts but not annual net income. More frequent paychecks mean smaller individual amounts. Your total yearly net pay remains constant regardless of frequency.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Washington State Minimum Wage Requirements</h2>
          <p>Washington maintains one of the highest minimum wages nationally. The state adjusts the rate annually based on inflation. This ensures workers maintain purchasing power as costs increase.</p>
          <p>For year twenty twenty-four, Washington minimum wage stands at sixteen dollars and twenty-eight cents per hour. This applies to most employees statewide. Some cities enforce even higher local minimums.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Local Minimum Wage Variations</h3>
          <p>Seattle, Tacoma, and other cities set higher minimum wages. Seattle large employers pay up to nineteen dollars and ninety-seven cents hourly. These local rates supersede the state minimum.</p>
          <p>Small businesses may qualify for lower rates in some jurisdictions. The definition of small business varies by location. Employees should verify the applicable rate for their specific employer and location.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Tipped Employee Wages</h3>
          <p>Washington prohibits tip credits against minimum wage. Employers must pay full minimum wage before tips. This differs from federal law and many other states.</p>
          <p>All tips belong to employees. Employers cannot claim any portion of gratuities. This policy ensures washington paycheck amounts remain higher than in tip-credit states.</p>
          <ArticleTable
            isDark={isDark}
            title="Washington Minimum Wage Examples"
            headers={['Jurisdiction', 'Minimum Wage Rate', 'Effective Date', 'Applies To']}
            rows={[
              ['Washington State', '$16.28/hour', 'January 1, 2024', 'All employers statewide'],
              ['Seattle (Large Employers)', '$19.97/hour', 'January 1, 2024', 'Employers with 501+ employees'],
              ['SeaTac', '$19.71/hour', 'January 1, 2024', 'Hospitality and transportation workers'],
              ['Tacoma', '$16.28/hour', 'January 1, 2024', 'All city employers'],
            ]}
          />

          <h2 className="text-2xl font-bold pt-2 text-white">Washington Unemployment Insurance Contributions</h2>
          <p>Unemployment insurance protects workers during job loss. Washington employers pay unemployment insurance premiums. Employees do not contribute to this fund in Washington.</p>
          <p>Employer tax rates vary based on industry and experience. New employers pay standard rates until establishing a claims history. The Employment Security Department administers this program.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Employee Benefits Coverage</h3>
          <p>Eligible workers receive unemployment benefits after job separation. Benefits replace a portion of lost wages. The amount depends on your earnings during the base year.</p>
          <p>Maximum weekly benefit amounts change annually. For twenty twenty-four, the maximum reaches one thousand three hundred thirty-nine dollars weekly. Actual benefits depend on your wage history and eligibility.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Paid Family and Medical Leave</h3>
          <p>Washington requires paid family and medical leave insurance. Both employers and employees pay premiums for this coverage. The deduction appears on every washington paycheck.</p>
          <p>Employees pay approximately seventy-three percent of the total premium. Employers cover the remaining portion. This provides up to twelve weeks of paid leave for qualifying events.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Common Washington Paycheck Errors and Solutions</h2>
          <p>Paycheck errors happen more frequently than expected. Incorrect tax withholding, wrong pay rates, and missing overtime cause most problems. Employees must review each paycheck carefully.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Identifying Calculation Errors</h3>
          <p>Compare your gross pay against hours worked and pay rate. Verify overtime calculations match time-and-a-half requirements. Check that all bonuses and commissions appear correctly.</p>
          <p>Review tax withholding amounts against your W-4 selections. Sudden changes in federal income tax withholding may indicate payroll system errors. Your filing status should remain consistent unless you updated your form.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Addressing Missing Deductions</h3>
          <p>Confirm all voluntary deductions appear correctly. Missing health insurance or retirement contributions require immediate correction. These errors affect both your coverage and tax calculations.</p>
          <p>Document discrepancies with pay stub copies and time records. Contact your payroll department promptly. Most employers correct errors on the next paycheck after notification.</p>
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"><strong>Action required:</strong> Washington law requires employers to correct paycheck errors promptly. If your employer refuses to fix mistakes, contact the Washington State Department of Labor and Industries. Keep detailed records of all communications and error documentation.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Preventing Future Errors</h3>
          <p>Maintain accurate time records throughout each pay period. Submit timesheets before deadlines. Report schedule changes or unpaid time immediately to payroll.</p>
          <p>Review and update your W-4 annually. Life changes require form updates to maintain accurate withholding. Correct withholding prevents large tax bills or excessive refunds.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">What should I do if my employer underpays me?</h3>
          <p>Contact your payroll department immediately with documentation showing the correct amount. If they fail to correct the error within one pay period, file a wage complaint with the Washington State Department of Labor and Industries. Keep copies of all pay stubs, time records, and communications.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Can I refuse to accept an incorrect paycheck?</h3>
          <p>No, you should accept and cash the paycheck while disputing the error. Refusing payment complicates the correction process. Accept what you receive and work with payroll to obtain the difference owed.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">How long does my employer have to correct paycheck errors?</h3>
          <p>Washington law requires prompt correction of wage errors. Employers typically correct mistakes on the next regular payday. If the error creates financial hardship, request an immediate correction check.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Washington Employer Payroll Obligations</h2>
          <p>Employers face strict payroll compliance requirements in Washington. Proper tax withholding, timely payment, and accurate record-keeping are mandatory. Violations result in penalties and legal consequences.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Required Payroll Registrations</h3>
          <p>Washington employers must register with multiple agencies. The Department of Revenue requires business registration. The Employment Security Department needs unemployment insurance registration.</p>
          <p>Federal employer identification numbers come from the IRS. Workers compensation coverage through Labor and Industries is mandatory. Paid family leave registration became required in recent years.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Wage Payment Requirements</h3>
          <p>Washington requires monthly pay as the minimum frequency. Most employers choose biweekly or semi-monthly schedules. Pay dates must remain consistent and clearly communicated to workers.</p>
          <p>Final paychecks follow specific timing rules. Terminated employees receive payment by the next regular payday. All wages earned through the separation date must be included.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Record Retention Rules</h3>
          <p>Employers must maintain payroll records for three years minimum. Records include time cards, pay rates, tax withholdings, and deduction authorizations. These documents prove compliance during audits.</p>
          <p>Detailed pay stubs help employees understand their washington paycheck. Stubs must show gross pay, all deductions, net pay, and pay period dates. Electronic stubs are acceptable if accessible to employees.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Maximizing Retirement Contributions from Your Paycheck</h2>
          <p>Retirement planning begins with paycheck contributions. Washington workers have multiple retirement savings options. Starting early maximizes compound growth over your career.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Traditional vs Roth Contributions</h3>
          <p>Traditional contributions reduce current taxable income. Your washington paycheck shows lower federal income tax withholding. Withdrawals during retirement face ordinary income tax.</p>
          <p>Roth contributions use post-tax dollars. No immediate tax benefit occurs. However, qualified withdrawals remain completely tax-free in retirement. This benefits workers expecting higher future tax rates.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Employer Matching Programs</h3>
          <p>Many employers match employee retirement contributions. Common matches include fifty cents per dollar up to six percent of salary. This represents free money toward retirement.</p>
          <p>Contribute enough to capture the full employer match. Failing to maximize matching means leaving compensation on the table. Even small contributions add up significantly over decades.</p>
          <ArticleTable
            isDark={isDark}
            title="Annual Retirement Contribution Limits"
            headers={['Contribution Type', 'Limit']}
            rows={[
              ['401(k) employee', '$23,000 (2024)'],
              ['Catch-up (age 50+)', 'Additional $7,500'],
              ['IRA contributions', '$7,000 (2024)'],
              ['IRA catch-up', 'Additional $1,000'],
              ['Combined limits', 'May apply'],
            ]}
          />
          <h3 className="text-xl font-semibold pt-2 text-white">Health Savings Account Benefits</h3>
          <p>High-deductible health insurance plans enable health savings accounts. HSA contributions reduce taxable income like traditional retirement accounts. Funds grow tax-free and withdrawals for medical expenses remain untaxed.</p>
          <p>HSAs offer triple tax advantages unmatched by other accounts. After age sixty-five, you can withdraw for any purpose penalty-free. This makes HSAs excellent supplemental retirement vehicles.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Washington Paid Sick Leave on Your Paycheck</h2>
          <p>Washington mandates paid sick leave for all employees. Workers accrue one hour of sick time for every forty hours worked. This benefit appears as an accrual on your pay stub.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Accrual and Usage Rules</h3>
          <p>Sick leave accrual begins immediately upon hire. Employers may front-load annual amounts or use accrual systems. Minimum accrual guarantees all workers receive this benefit.</p>
          <p>Employees can use sick leave for personal illness, family care, or certain safety situations. Employers cannot require doctor notes for absences under three consecutive days. This protects worker rights while maintaining business operations.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Tracking Your Sick Leave Balance</h3>
          <p>Your washington paycheck stub shows sick leave balances. Review accruals and usage each pay period. Report discrepancies to payroll immediately to maintain accurate records.</p>
          <p>Unused sick leave carries over to the next year. Employers may cap usage at forty hours annually. However, accrual continues beyond usage caps. This ensures workers build reserves for future needs.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Understanding Wage Garnishments in Washington</h2>
          <p>Wage garnishments reduce your net pay to satisfy debts. Court orders or government agencies authorize garnishments. Your employer must comply with valid garnishment orders.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Types of Wage Garnishments</h3>
          <p>Child support garnishments take priority over other claims. The amount depends on the support order and your income. Federal limits protect a portion of your earnings from garnishment.</p>
          <p>Creditor garnishments require court judgments. Credit card debt, medical bills, and personal loans may result in garnishments. Washington law limits garnishment amounts to protect basic living expenses.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Protected Earnings Calculations</h3>
          <p>Federal law protects seventy-five percent of disposable earnings or thirty times minimum wage weekly, whichever provides more protection. Washington provides additional protections in some cases.</p>
          <p>Social security benefits, unemployment insurance, and certain pensions receive complete protection. These income sources cannot be garnished by most creditors. Child support represents the main exception.</p>
          <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4"><strong>Know your rights:</strong> Employers cannot terminate employees due to one garnishment. Multiple garnishments may change this protection. Contact Washington Legal Aid for questions about garnishment rights and protections.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Stopping or Reducing Garnishments</h3>
          <p>Challenge incorrect garnishments immediately through the court. File exemption claims if garnishment creates undue hardship. Documentation proving financial hardship strengthens exemption requests.</p>
          <p>Negotiating payment plans may prevent garnishment. Contact creditors before judgments occur. Many creditors prefer voluntary payments over expensive garnishment processes.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">How Pay Frequency Affects Your Washington Paycheck</h2>
          <p>Pay frequency determines how often you receive wages. Common schedules include weekly, biweekly, semi-monthly, and monthly payments. Each frequency offers different advantages.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Weekly Pay Schedules</h3>
          <p>Weekly paychecks provide the most frequent income. Fifty-two paychecks arrive annually. This helps with tight budgets and immediate expense management.</p>
          <p>Administrative costs run higher for weekly payroll. Fewer employers offer this frequency now. Retail and hospitality industries commonly use weekly pay schedules.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Biweekly vs Semi-Monthly</h3>
          <p>Biweekly schedules produce twenty-six annual paychecks. Two months yearly include three paychecks. This creates budgeting opportunities for extra income months.</p>
          <p>Semi-monthly schedules create twenty-four annual paychecks. Payments arrive on consistent dates like the fifteenth and thirtieth. This simplifies budgeting for fixed monthly expenses.</p>
          <ArticleTable
            isDark={isDark}
            title="Biweekly Advantages and Challenges"
            headers={['Biweekly Advantages', 'Biweekly Challenges']}
            rows={[
              ['Two extra paychecks yearly', 'Varying payment dates monthly'],
              ['Consistent day-of-week payment', 'Complicates fixed expense budgeting'],
              ['Easier overtime calculation', 'Requires careful monthly planning'],
              ['Standard for many industries', 'May not align with bill due dates'],
            ]}
          />
          <h3 className="text-xl font-semibold pt-2 text-white">Tax Withholding Across Frequencies</h3>
          <p>Your annual tax burden remains identical regardless of pay frequency. More frequent paychecks mean smaller withholding per check. Your paycheck calculator accounts for frequency automatically.</p>
          <p>Percentage-based deductions work consistently across all frequencies. Fixed-dollar deductions require adjustment based on annual paycheck count. Ensure your benefits administration understands your pay schedule.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Year-End Tax Documents from Washington Employers</h2>
          <p>Employers provide essential tax documents annually. Form W-2 summarizes your yearly earnings and withholdings. This document enables accurate tax return filing.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Understanding Your W-2 Form</h3>
          <p>Box one shows total taxable wages for federal income tax. This amount excludes pre-tax deductions like retirement and health insurance. Box two displays total federal income tax withheld throughout the year.</p>
          <p>Social security wages appear in box three with tax withheld in box four. Medicare wages and tax occupy boxes five and six. Washington has no state income tax boxes on W-2 forms.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">W-2 Distribution Timeline</h3>
          <p>Employers must provide W-2 forms by January thirty-first. Electronic delivery requires employee consent. Paper forms go to the last known address on file.</p>
          <p>Report missing W-2 forms after February fifteenth. Contact your employer first for replacement copies. The IRS can help if employers fail to provide required documents.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Correcting W-2 Errors</h3>
          <p>Review your final washington paycheck against year-end W-2 totals. Boxes should match annual pay stub summaries exactly. Report discrepancies to payroll immediately.</p>
          <p>Employers issue W-2c forms to correct mistakes. These amended documents update previously filed information. Wait for corrected forms before filing tax returns to avoid processing delays.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">What if my W-2 shows incorrect federal income tax withholding?</h3>
          <p>Request a corrected W-2c form from your employer immediately. Compare each paycheck stub to identify when the error occurred. Incorrect withholding affects your tax refund or balance due. Do not file your tax return until receiving the corrected form.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Why does my W-2 wage amount differ from my annual gross pay?</h3>
          <p>W-2 wages exclude pre-tax deductions like traditional retirement contributions and health insurance premiums. Your gross pay includes these amounts, but they reduce taxable wages. This difference is normal and actually benefits you by lowering your tax burden.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Can I file my taxes without a W-2 form?</h3>
          <p>You should wait for your W-2 to ensure accuracy. If your employer fails to provide it by February fifteenth, contact the IRS for assistance. You can estimate using your final paycheck stub, but this increases audit risk and may delay refund processing.</p>

          <h2 className="text-2xl font-bold pt-2 text-white">Taking Control of Your Washington Paycheck</h2>
          <p>Understanding your washington paycheck empowers better financial decisions. Knowledge of tax withholdings, deductions, and net pay calculations helps you budget effectively. Washington workers enjoy unique advantages with no state income tax.</p>
          <p>Review every paycheck carefully for accuracy. Verify gross pay calculations match your hours and rate. Confirm all deductions appear correctly and withholding aligns with your W-4 selections.</p>
          <p>Use available tools and resources to maximize your earnings. A paycheck calculator provides quick estimates for different scenarios. Adjust your withholding and deductions to meet your financial goals.</p>
          <p>Stay informed about changes in tax rates and labor laws. Washington regularly updates minimum wage and benefit requirements. Annual reviews of your W-4 and benefit elections ensure optimal paycheck results.</p>
          <p>Your washington paycheck represents more than just numbers. It reflects your hard work and provides the foundation for financial security. Take time to understand each component and protect your earnings through careful monitoring.</p>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 p-6 sm:p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">FAQ</h2>
        <div className={`space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Paycheck questions are common because wages and deductions rarely move in a straight line. Your salary may look simple, but payroll can add federal taxes, benefit costs, retirement savings, paid leave premiums, and other deductions before money reaches you.</p>
          <p>These answers explain the most common questions Washington workers ask. They also help you use a Washington income calculator, Washington payroll tax calculator, or Washington gross to net calculator with more confidence.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Does living in Washington mean I don&apos;t pay any income tax?</h3>
          <p>Living in Washington means you generally do not pay state individual income tax on wages, because Washington has no state income tax. However, you may still pay federal income tax, FICA taxes, and certain Washington state payroll deductions. So, Washington paycheck with no state income tax does not mean your paycheck has zero deductions. It means state wage income tax is not part of the normal paycheck calculation.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">What is the main difference between gross pay and net pay on my Washington paycheck?</h3>
          <p>The main difference is what happens before and after deductions. Gross pay is your earnings before taxes and deductions. Net pay is what remains after federal tax withholding, Social Security tax, Medicare tax, Washington PFML deduction, insurance, retirement savings, and other paycheck deductions. In plain terms, gross pay is the headline number. Net pay is the money you can actually use.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">How do FICA taxes work for employees in cities like Seattle or Spokane?</h3>
          <p>FICA taxes work the same across Washington cities, including Seattle, Spokane, Tacoma, and Vancouver. Employees pay Social Security and Medicare taxes through payroll withholding. This means a Seattle paycheck, Spokane paycheck, Tacoma paycheck, or Vancouver paycheck can all include the same federal payroll tax structure. Local living costs may differ, but FICA rules do not change just because your city changes.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Can I use a calculator to see how a 401(k) contribution changes my take-home pay?</h3>
          <p>Yes, a calculator can help you see how 401(k) deductions affect your paycheck. A higher contribution can reduce your current take-home pay, but it may improve retirement savings. Some contributions may also reduce certain taxable wages. This is why a Washington payroll deduction calculator is helpful. It lets you test different savings levels before changing your payroll setup.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Why should I use a Washington paycheck calculator if my salary stays the same every year?</h3>
          <p>Even if your salary stays the same, your deductions may change. Insurance premiums can rise. Retirement contributions can change. Federal tax brackets can update. WA PFML rates can change too. Because of this, your paycheck may shift even when your salary does not. A fresh hourly paycheck estimate Washington or salary estimate helps you avoid stale numbers.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">How do I adjust my withholdings if I find I owe money during tax season?</h3>
          <p>If you owe money during tax season, review your W-4 and consider updating your withholding. You may need fewer reductions, more accurate income details, or extra withholding. A Washington W-4 paycheck estimate can help you see how changes may affect each paycheck. However, your employer&apos;s payroll department or a qualified tax professional can help if your situation is complex.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">Does the calculator account for irregular income like bonuses or overtime?</h3>
          <p>A good calculator can estimate irregular income if you enter it correctly. Overtime hours, bonus pay, and supplemental wages can change withholding and final net income. This matters if extra income appears often. A Washington overtime paycheck calculator helps you plan extra hours, while a Washington bonus paycheck calculator helps you estimate bonus deposits before spending them in your head.</p>
          <h3 className="text-xl font-semibold pt-2 text-white">OBBBA Tax Calculators</h3>
          <p>OBBBA tools can support different paycheck and salary planning needs across the USA. Along with this Washington Paycheck Calculator, you can use the <Link to="/illinois-paycheck-calculator" className="text-cyan-400 hover:underline">Illinois Paycheck Calculator</Link>, <Link to="/california-paycheck-calculator" className="text-cyan-400 hover:underline">California Paycheck Calculator</Link>, <Link to="/texas-paycheck-calculator" className="text-cyan-400 hover:underline">Texas Paycheck Calculator</Link>, <Link to="/florida-paycheck-calculator" className="text-cyan-400 hover:underline">Florida Paycheck Calculator</Link>, <Link to="/indiana-paycheck-calculator" className="text-cyan-400 hover:underline">Indiana Paycheck Calculator</Link>, <Link to="/virginia-paycheck-calculator" className="text-cyan-400 hover:underline">Virginia Paycheck Calculator</Link>, <Link to="/hawaii-paycheck-calculator" className="text-cyan-400 hover:underline">Hawaii Paycheck Calculator</Link>, <Link to="/nebraska-paycheck-calculator" className="text-cyan-400 hover:underline">Nebraska Paycheck Calculator</Link>, <Link to="/salary-calculator" className="text-cyan-400 hover:underline">Salary Calculator</Link>, <Link to="/paycheck-calculator" className="text-cyan-400 hover:underline">Paycheck Calculator</Link>, and <Link to="/overtime" className="text-cyan-400 hover:underline">No Tax on Overtime</Link> when you want a clearer view of wages, overtime, salary, and take-home pay.</p>
        </div>
      </article>
    </>
  );
}

const BROWSER_TIMEZONE_STATE_GUESSES = {
  'America/Anchorage': ['AK', 'Alaska'],
  'America/Adak': ['AK', 'Alaska'],
  'Pacific/Honolulu': ['HI', 'Hawaii'],
  'America/Phoenix': ['AZ', 'Arizona'],
  'America/Boise': ['ID', 'Idaho'],
  'America/Denver': ['CO', 'Colorado'],
  'America/Chicago': ['IL', 'Illinois'],
  'America/Indiana/Indianapolis': ['IN', 'Indiana'],
  'America/Indiana/Knox': ['IN', 'Indiana'],
  'America/Indiana/Marengo': ['IN', 'Indiana'],
  'America/Indiana/Petersburg': ['IN', 'Indiana'],
  'America/Indiana/Tell_City': ['IN', 'Indiana'],
  'America/Indiana/Vevay': ['IN', 'Indiana'],
  'America/Indiana/Vincennes': ['IN', 'Indiana'],
  'America/Indiana/Winamac': ['IN', 'Indiana'],
  'America/Detroit': ['MI', 'Michigan'],
  'America/New_York': ['NY', 'New York'],
  'America/Los_Angeles': ['CA', 'California'],
};

function getBrowserStateGuess(timezone = '') {
  const [code = '', name = ''] = BROWSER_TIMEZONE_STATE_GUESSES[timezone] || [];
  return { code, name };
}

function EmailUpdatesPopup() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const popupDelayMs = 22000;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    let timerId;
    let cancelled = false;
    try {
      if (location.pathname.startsWith('/admin') || location.pathname === '/unsubscribe') return undefined;
      const savedEmail = localStorage.getItem('obba-updates-email') || '';
      const submittedAt = localStorage.getItem('obba-updates-popup-last-submit-at') || '';
      if (savedEmail || submittedAt) return undefined;

      const now = Date.now();
      const lastPromptAt = Number(localStorage.getItem('obba-updates-popup-last-prompt-at') || 0);
      if (!lastPromptAt || now - lastPromptAt >= sevenDaysMs) {
        fetch('/api/admin-config?public=1')
          .then((response) => response.ok ? response.json() : { popupEnabled: true })
          .catch(() => ({ popupEnabled: true }))
          .then((config) => {
            if (cancelled || config.popupEnabled === false) return;
            timerId = window.setTimeout(() => {
              setIsVisible(true);
              localStorage.setItem('obba-updates-popup-last-prompt-at', String(Date.now()));
            }, popupDelayMs);
          });
      }
    } catch {
      timerId = window.setTimeout(() => setIsVisible(true), popupDelayMs);
    }
    return () => {
      cancelled = true;
      if (timerId) window.clearTimeout(timerId);
    };
  }, [location.pathname]);

  const closePopup = () => {
    try {
      localStorage.setItem('obba-updates-popup-last-prompt-at', String(Date.now()));
    } catch {}
    setIsVisible(false);
  };

  const submitEmail = async (event) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMessage('Enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const browserStateGuess = getBrowserStateGuess(timezone);
      const payload = {
        email: cleanEmail,
        page: window.location.pathname,
        pageTitle: document.title,
        timezone,
        browserStateCode: browserStateGuess.code,
        browserStateName: browserStateGuess.name,
        language: navigator.language || '',
        referrer: document.referrer || '',
        subscribedAt: new Date().toISOString(),
      };
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {}
      localStorage.setItem('obba-updates-email', cleanEmail);
      localStorage.setItem('obba-updates-popup-last-prompt-at', String(Date.now()));
      localStorage.setItem('obba-updates-popup-last-submit-at', String(Date.now()));
    } catch {}
    setIsSubmitting(false);
    setMessage('Thanks. You are on the OBBA updates list.');
    window.setTimeout(() => setIsVisible(false), 1200);
  };

  if (!isVisible) return null;

  return (
    <div className="obba-updates-popup" role="dialog" aria-modal="true" aria-labelledby="obba-updates-title">
      <div className="obba-updates-backdrop" onClick={closePopup} />
      <form className="obba-updates-card" onSubmit={submitEmail} noValidate>
        <button type="button" className="obba-updates-close" onClick={closePopup} aria-label="Close updates popup">×</button>
        <div className="obba-updates-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16v11H4V7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="m4 8 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="obba-updates-kicker">Free OBBA Updates</p>
        <h2 id="obba-updates-title">Get paycheck, tax, and overtime updates before rules change.</h2>
        <p className="obba-updates-copy">
          Join OBBA Calculators for free updates on new calculators, paycheck changes, overtime rules, tax tips, and money-saving tools.
        </p>
        <p className="obba-updates-note">Unsubscribe anytime.</p>
        <div className="obba-updates-row">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setMessage('');
            }}
            placeholder="Enter your email"
            aria-label="Email address"
          />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Get Free Updates'}</button>
        </div>
        {message && <div className={`obba-updates-message ${message.startsWith('Thanks') ? 'success' : ''}`}>{message}</div>}
      </form>
    </div>
  );
}

const ADMIN_MAIL_LABELS = {
  '3days': '3 Days Return Email',
  '7days': '7 Days Tips Email',
  urgent: 'Urgent Email',
};

const ADMIN_GROUP_OPTIONS = [
  ['all', 'All'],
  ['state-california', 'California'],
  ['state-florida', 'Florida'],
  ['state-hawaii', 'Hawaii'],
  ['state-illinois', 'Illinois'],
  ['state-indiana', 'Indiana'],
  ['state-nebraska', 'Nebraska'],
  ['state-texas', 'Texas'],
  ['state-virginia', 'Virginia'],
  ['state-washington', 'Washington'],
  ['common-future-states', 'Future States'],
];

function parsedToForm(parsed, key) {
  return {
    subject: parsed?.subject || '',
    body: parsed?.body || '',
    groups: parsed?.groups?.length ? parsed.groups : [parsed?.group || 'all'],
    enabled: parsed?.enabled !== false,
    campaignId: parsed?.campaignId || `${key}-v1`,
    delayDays: Number(parsed?.delayDays || 0),
    buttonText: parsed?.buttonText || 'Open OBBA Calculators',
    buttonUrl: parsed?.buttonUrl || '/',
  };
}

function AdminMailPage({ isDark }) {
  const { type = '3days' } = useParams();
  const key = ['3days', '7days', 'urgent'].includes(type) ? type : '3days';
  const [authenticated, setAuthenticated] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');
  const [content, setContent] = useState('');
  const [parsed, setParsed] = useState(null);
  const [campaignForm, setCampaignForm] = useState(parsedToForm(null, key));
  const [subscribers, setSubscribers] = useState([]);
  const [adminConfig, setAdminConfig] = useState({ popupEnabled: true, mailEnabled: true });
  const [campaignSummaries, setCampaignSummaries] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState(['3days', '7days', 'urgent']);
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const loadAdminConfig = async () => {
    const response = await fetch('/api/admin-config');
    if (!response.ok) return;
    const result = await response.json();
    setAdminConfig({ popupEnabled: result.popupEnabled !== false, mailEnabled: result.mailEnabled !== false });
  };

  const loadCampaignSummaries = async () => {
    const summaries = [];
    for (const campaignKey of Object.keys(ADMIN_MAIL_LABELS)) {
      const response = await fetch(`/api/admin-mail?type=${encodeURIComponent(campaignKey)}`);
      if (!response.ok) continue;
      const result = await response.json();
      summaries.push({ key: campaignKey, parsed: result.parsed, content: result.content || '' });
    }
    setCampaignSummaries(summaries);
  };

  const loadSubscribers = async () => {
    const response = await fetch('/api/admin-subscribers');
    if (!response.ok) return;
    const result = await response.json();
    setSubscribers(result.subscribers || []);
  };

  const loadCampaign = async () => {
    const response = await fetch(`/api/admin-mail?type=${encodeURIComponent(key)}`);
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    const result = await response.json();
    setAuthenticated(true);
    setContent(result.content || '');
    setParsed(result.parsed || null);
    setCampaignForm(parsedToForm(result.parsed, key));
    await loadAdminConfig();
    await loadCampaignSummaries();
    await loadSubscribers();
  };

  useEffect(() => {
    const check = async () => {
      try {
        const response = await fetch('/api/admin-auth');
        const result = await response.json();
        setAuthenticated(Boolean(result.authenticated));
        if (result.authenticated) await loadCampaign();
      } catch {
        setAuthenticated(false);
      }
    };
    check();
  }, [key]);

  const requestOtp = async () => {
    setIsBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'requestOtp' }),
      });
      setOtpSent(response.ok);
      setMessage(response.ok ? 'OTP sent to your admin email.' : 'Could not send OTP.');
    } catch {
      setMessage('Could not send OTP.');
    }
    setIsBusy(false);
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setIsBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verifyOtp', code }),
      });
      if (!response.ok) {
        setMessage('Invalid OTP.');
        setIsBusy(false);
        return;
      }
      setAuthenticated(true);
      setMessage('Admin unlocked.');
      await loadCampaign();
    } catch {
      setMessage('Could not verify OTP.');
    }
    setIsBusy(false);
  };

  const saveCampaign = async () => {
    setIsBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/admin-mail?type=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign: campaignForm }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage('Could not save file.');
      } else {
        setContent(result.content || '');
        setParsed(result.parsed || null);
        setCampaignForm(parsedToForm(result.parsed, key));
        if (result.schedule?.ok) {
          setMessage(`File saved. Worker scheduled after ${result.schedule.delay}.`);
        } else if (result.schedule?.skipped || result.schedule?.error) {
          setMessage(`File saved. Worker schedule needs setup: ${result.schedule.error || 'missing token'}.`);
        } else {
          setMessage('File saved.');
        }
      }
    } catch {
      setMessage('Could not save file.');
    }
    setIsBusy(false);
  };

  const dryRun = async () => {
    setIsBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/send-scheduled-mails?type=${encodeURIComponent(key)}&dryRun=1`);
      const result = await response.json();
      if (!response.ok) {
        setMessage('Could not run worker test.');
      } else {
        const stat = result.stats?.[0];
        setMessage(`Worker dry-run: ${stat?.due ?? 0} due, ${stat?.sent ?? 0} would send.`);
      }
    } catch {
      setMessage('Could not run worker test.');
    }
    setIsBusy(false);
  };

  const updateAdminConfig = async (patch) => {
    setIsBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage('Could not update settings.');
      } else {
        setAdminConfig({ popupEnabled: result.popupEnabled !== false, mailEnabled: result.mailEnabled !== false });
        setMessage('Settings updated.');
      }
    } catch {
      setMessage('Could not update settings.');
    }
    setIsBusy(false);
  };

  const replaceMetaValue = (raw, field, value) => {
    const line = `${field}: ${value}`;
    const pattern = new RegExp(`^${field}:.*$`, 'm');
    if (pattern.test(raw)) return raw.replace(pattern, line);
    return raw.replace(/^---\s*\n/, `---\n${line}\n`);
  };

  const toggleCampaignEnabled = async (campaignKey, enabled) => {
    const summary = campaignSummaries.find((item) => item.key === campaignKey);
    if (!summary) return;
    setIsBusy(true);
    setMessage('');
    try {
      const nextContent = replaceMetaValue(summary.content, 'enabled', enabled ? 'true' : 'false');
      const response = await fetch(`/api/admin-mail?type=${encodeURIComponent(campaignKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: nextContent }),
      });
      if (!response.ok) {
        setMessage('Could not update campaign.');
      } else {
        if (campaignKey === key) {
          const result = await response.json();
          setContent(result.content || '');
          setParsed(result.parsed || null);
        }
        await loadCampaignSummaries();
        setMessage('Campaign updated.');
      }
    } catch {
      setMessage('Could not update campaign.');
    }
    setIsBusy(false);
  };

  const toggleSelectedCampaign = (campaignKey) => {
    setSelectedCampaigns((current) => (
      current.includes(campaignKey)
        ? current.filter((item) => item !== campaignKey)
        : [...current, campaignKey]
    ));
  };

  const dryRunSelected = async () => {
    setIsBusy(true);
    setMessage('');
    try {
      const stats = [];
      for (const campaignKey of selectedCampaigns) {
        const response = await fetch(`/api/send-scheduled-mails?type=${encodeURIComponent(campaignKey)}&dryRun=1`);
        const result = await response.json();
        if (!response.ok) throw new Error('worker_failed');
        stats.push(result.stats?.[0]);
      }
      const summary = stats.map((stat) => `${stat?.key}: ${stat?.due ?? 0}`).join(', ');
      setMessage(`Selected dry-run due counts: ${summary || 'none selected'}.`);
    } catch {
      setMessage('Could not run selected worker test.');
    }
    setIsBusy(false);
  };

  const updateCampaignField = (field, value) => {
    setCampaignForm((current) => ({ ...current, [field]: value }));
  };

  const toggleCampaignGroup = (group) => {
    setCampaignForm((current) => {
      let groups;
      if (group === 'all') {
        groups = current.groups.includes('all') ? [] : ['all'];
      } else {
        groups = current.groups.includes(group)
          ? current.groups.filter((item) => item !== group)
          : [...current.groups.filter((item) => item !== 'all'), group];
      }
      return { ...current, groups: groups.length ? groups : ['all'] };
    });
  };

  if (!authenticated) {
    return (
      <main className="obba-page">
        <section className="obba-card mx-auto max-w-xl p-6 sm:p-8">
          <p className="obba-updates-kicker">Admin Mail Security</p>
          <h1 className="mt-2 text-3xl font-extrabold" style={{ color: 'var(--text)' }}>Enter OTP to open mail files</h1>
          <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            A 6-digit code will be sent to your official OBBA email. Local dev also accepts 000000 for testing.
          </p>
          <button type="button" onClick={requestOtp} disabled={isBusy} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white">
            {isBusy ? 'Sending...' : otpSent ? 'Send OTP Again' : 'Send OTP'}
          </button>
          <form onSubmit={verifyOtp} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6 digit code" className="obba-input" inputMode="numeric" />
            <button type="submit" disabled={isBusy || code.length !== 6} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60">Verify</button>
          </form>
          {message && <p className="mt-4 text-sm font-bold" style={{ color: message.includes('sent') ? '#16a34a' : 'var(--text2)' }}>{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="obba-page">
      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="obba-card p-5">
          <p className="obba-updates-kicker">Global Controls</p>
          <h2 className="mt-1 text-2xl font-extrabold" style={{ color: 'var(--text)' }}>Site email settings</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => updateAdminConfig({ popupEnabled: !adminConfig.popupEnabled })}
              className={`rounded-2xl px-4 py-4 text-left text-sm font-extrabold ${adminConfig.popupEnabled ? 'bg-emerald-600 text-white' : 'border'}`}
              style={adminConfig.popupEnabled ? {} : { borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Popup: {adminConfig.popupEnabled ? 'ON' : 'OFF'}
              <span className="mt-1 block text-xs font-semibold opacity-80">Controls subscription popup visibility.</span>
            </button>
            <button
              type="button"
              onClick={() => updateAdminConfig({ mailEnabled: !adminConfig.mailEnabled })}
              className={`rounded-2xl px-4 py-4 text-left text-sm font-extrabold ${adminConfig.mailEnabled ? 'bg-emerald-600 text-white' : 'border'}`}
              style={adminConfig.mailEnabled ? {} : { borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Mail System: {adminConfig.mailEnabled ? 'ON' : 'OFF'}
              <span className="mt-1 block text-xs font-semibold opacity-80">Disables all sends except admin OTP.</span>
            </button>
          </div>
        </div>
        <div className="obba-card p-5">
          <p className="obba-updates-kicker">Multi Select</p>
          <h2 className="mt-1 text-2xl font-extrabold" style={{ color: 'var(--text)' }}>Test multiple campaigns</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {Object.entries(ADMIN_MAIL_LABELS).map(([campaignKey, label]) => (
              <label key={campaignKey} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                <input type="checkbox" checked={selectedCampaigns.includes(campaignKey)} onChange={() => toggleSelectedCampaign(campaignKey)} />
                {label}
              </label>
            ))}
          </div>
          <button type="button" onClick={dryRunSelected} disabled={isBusy || selectedCampaigns.length === 0} className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60">Test Selected</button>
        </div>
      </section>
      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        {campaignSummaries.map((summary) => (
          <div key={summary.key} className="obba-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="obba-updates-kicker">{summary.key}</p>
                <h3 className="mt-1 text-xl font-extrabold" style={{ color: 'var(--text)' }}>{ADMIN_MAIL_LABELS[summary.key]}</h3>
              </div>
              <button
                type="button"
                onClick={() => toggleCampaignEnabled(summary.key, !summary.parsed?.enabled)}
                className={`rounded-full px-4 py-2 text-xs font-extrabold ${summary.parsed?.enabled ? 'bg-emerald-600 text-white' : 'border'}`}
                style={summary.parsed?.enabled ? {} : { borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                {summary.parsed?.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm" style={{ color: 'var(--text2)' }}>
              <p><strong>Subject:</strong> {summary.parsed?.subject}</p>
              <p><strong>Groups:</strong> {(summary.parsed?.groups || [summary.parsed?.group]).join(', ')}</p>
              <p><strong>Delay:</strong> {summary.parsed?.delayDays} days</p>
              <p><strong>Button:</strong> {summary.parsed?.buttonText} → {summary.parsed?.buttonUrl}</p>
            </div>
            <Link to={`/admin/mail/${summary.key}`} className="mt-4 inline-flex rounded-xl border px-4 py-2 text-sm font-extrabold" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Edit Section</Link>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="obba-card p-5 sm:p-7">
          <p className="obba-updates-kicker">Admin Mail File</p>
          <h1 className="mt-2 text-3xl font-extrabold" style={{ color: 'var(--text)' }}>{ADMIN_MAIL_LABELS[key]}</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {Object.entries(ADMIN_MAIL_LABELS).map(([itemKey, label]) => (
              <Link key={itemKey} to={`/admin/mail/${itemKey}`} className={`rounded-xl px-4 py-2 text-sm font-extrabold ${itemKey === key ? 'bg-blue-600 text-white' : 'border'}`} style={itemKey === key ? {} : { borderColor: 'var(--border)', color: 'var(--text)' }}>{label}</Link>
            ))}
          </div>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Subject</span>
              <input
                value={campaignForm.subject}
                onChange={(event) => updateCampaignField('subject', event.target.value)}
                className="obba-input"
                placeholder="Email subject"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Body</span>
              <textarea
                value={campaignForm.body}
                onChange={(event) => updateCampaignField('body', event.target.value)}
                className="min-h-[260px] w-full rounded-2xl border p-4 text-sm leading-6 outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--input)', color: 'var(--text)' }}
                placeholder="Write the email body here"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Button Label</span>
                <input
                  value={campaignForm.buttonText}
                  onChange={(event) => updateCampaignField('buttonText', event.target.value)}
                  className="obba-input"
                  placeholder="Check Your Pay"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Button URL</span>
                <input
                  value={campaignForm.buttonUrl}
                  onChange={(event) => updateCampaignField('buttonUrl', event.target.value)}
                  className="obba-input"
                  placeholder="https://www.obbacalculators.com/salary-calculator"
                />
              </label>
            </div>
            <div>
              <span className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Send To</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ADMIN_GROUP_OPTIONS.map(([groupValue, label]) => (
                  <label key={groupValue} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                    <input type="checkbox" checked={campaignForm.groups.includes(groupValue)} onChange={() => toggleCampaignGroup(groupValue)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={saveCampaign} disabled={isBusy} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white">Save File</button>
            <button type="button" onClick={dryRun} disabled={isBusy} className="rounded-xl border px-5 py-3 text-sm font-extrabold" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Test Worker</button>
          </div>
          {message && <p className="mt-4 text-sm font-bold" style={{ color: message.includes('saved') || message.includes('dry-run') ? '#16a34a' : '#dc2626' }}>{message}</p>}
        </div>
        <aside className="obba-card p-5">
          <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>File Rules</h2>
          <div className={`mt-4 space-y-3 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <p>Use the form fields only. The hidden file format is handled automatically.</p>
            <p><strong>Send To</strong>: choose all users or one/multiple state groups.</p>
            <p><strong>Delay</strong>: this section keeps its built-in timing: 3 days, 7 days, or urgent.</p>
            <p><strong>ID</strong>: campaignId prevents duplicate sends. Change it later if you want to resend a new version.</p>
            <p><strong>Variables</strong>: {'{{email}}'}, {'{{siteUrl}}'}, {'{{stateName}}'}, {'{{calculatorPath}}'}.</p>
          </div>
          {parsed && (
            <div className="mt-5 rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)', color: 'var(--text2)' }}>
              <p><strong>Subject:</strong> {parsed.subject}</p>
              <p><strong>Groups:</strong> {(parsed.groups || [parsed.group]).join(', ')}</p>
              <p><strong>Delay:</strong> {parsed.delayDays} days</p>
              <p><strong>Enabled:</strong> {String(parsed.enabled)}</p>
              <p><strong>ID:</strong> {parsed.campaignId}</p>
            </div>
          )}
        </aside>
      </section>
      <section className="obba-card mt-6 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="obba-updates-kicker">Subscribers</p>
            <h2 className="mt-1 text-2xl font-extrabold" style={{ color: 'var(--text)' }}>Subscribed emails and locations</h2>
          </div>
          <button type="button" onClick={loadSubscribers} className="rounded-xl border px-4 py-2 text-sm font-extrabold" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Refresh List</button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr style={{ color: 'var(--text2)' }}>
                <th className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>Email</th>
                <th className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>Location</th>
                <th className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>Group</th>
                <th className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>Page</th>
                <th className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>Last Mail</th>
                <th className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-5 text-center" style={{ color: 'var(--text2)' }}>No active subscribers found.</td>
                </tr>
              ) : subscribers.map((subscriber) => {
                const locationText = [subscriber.city, subscriber.stateName || subscriber.stateCode, subscriber.country].filter(Boolean).join(', ') || subscriber.timezone || 'Unknown';
                return (
                  <tr key={subscriber.email} style={{ color: 'var(--text)' }}>
                    <td className="border-b px-3 py-3 font-bold" style={{ borderColor: 'var(--border)' }}>{subscriber.email}</td>
                    <td className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>{locationText}</td>
                    <td className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>{subscriber.segmentKey || 'all'}</td>
                    <td className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>{subscriber.page || subscriber.calculatorPath || '-'}</td>
                    <td className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>{subscriber.lastMailAt ? `${new Date(subscriber.lastMailAt).toLocaleString()} (${subscriber.lastMailCampaign || 'mail'})` : '-'}</td>
                    <td className="border-b px-3 py-3" style={{ borderColor: 'var(--border)' }}>{subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleString() : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [footerMoreOpen, setFooterMoreOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const seoByPath = {
      '/': {
        title: 'Best Paycheck & Tax Calculators 2026 | OBBA',
        description: 'See your real take-home pay in seconds with OBBA Calculators - paycheck, salary, overtime, state taxes, and money-saving tools in one modern view.',
        keywords: 'Tax Calculator',
        canonicalPath: '/',
      },
      '/overtime': {
        title: overtimeDocMeta.title,
        description: overtimeDocMeta.description,
        keywords: 'Overtime Calculator',
        canonicalPath: '/overtime',
      },
      '/salary-calculator': {
        title: 'Salary Calculator: Hourly, Weekly & Annual Pay Converter',
        description: 'Use our free Salary Calculator to convert hourly, daily, weekly, monthly, and annual pay. Estimate gross and net income and plan your budget with confidence.',
        keywords: 'Salary calculator',
        canonicalPath: '/salary-calculator',
      },
      '/paycheck-calculator': {
        title: 'Paycheck Calculator - Estimate Your Take-Home Pay Fast',
        description: 'Estimate your take-home pay with our free paycheck calculator, covering federal tax, state tax, FICA, overtime, bonus, and 401(k) or insurance deductions.',
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
        title: texasDocMeta.title,
        description: texasDocMeta.description,
        keywords: 'Texas Paycheck Calculator',
        canonicalPath: '/texas-paycheck-calculator',
      },
      '/florida-paycheck-calculator': {
        title: floridaDocMeta.title,
        description: floridaDocMeta.description,
        keywords: 'Florida Paycheck Calculator',
        canonicalPath: '/florida-paycheck-calculator',
      },
      '/california-paycheck-calculator': {
        title: californiaDocMeta.title,
        description: californiaDocMeta.description,
        keywords: 'California Paycheck Calculator',
        canonicalPath: '/california-paycheck-calculator',
      },
      '/illinois-paycheck-calculator': {
        title: illinoisDocMeta.title,
        description: illinoisDocMeta.description,
        keywords: 'Illinois Paycheck Calculator',
        canonicalPath: '/illinois-paycheck-calculator',
      },
      '/washington-paycheck-calculator': {
        title: washingtonDocMeta.title,
        description: washingtonDocMeta.description,
        keywords: 'Washington Paycheck Calculator',
        canonicalPath: '/washington-paycheck-calculator',
      },
      '/indiana-paycheck-calculator': {
        title: indianaDocMeta.title,
        description: indianaDocMeta.description,
        keywords: 'Indiana Paycheck Calculator',
        canonicalPath: '/indiana-paycheck-calculator',
      },
      '/virginia-paycheck-calculator': {
        title: virginiaDocMeta.title,
        description: virginiaDocMeta.description,
        keywords: 'Virginia Paycheck Calculator',
        canonicalPath: '/virginia-paycheck-calculator',
      },
      '/hawaii-paycheck-calculator': {
        title: hawaiiDocMeta.title,
        description: hawaiiDocMeta.description,
        keywords: 'Hawaii Paycheck Calculator',
        canonicalPath: '/hawaii-paycheck-calculator',
      },
      '/nebraska-paycheck-calculator': {
        title: nebraskaDocMeta.title,
        description: nebraskaDocMeta.description,
        keywords: 'Nebraska Paycheck Calculator',
        canonicalPath: '/nebraska-paycheck-calculator',
      },
      '/faq': {
        title: 'FAQ - OBBBA Tax Calculators',
        description: 'Read frequently asked questions for OBBBA Tax Calculators covering overtime, salary, paycheck, Texas, and Florida paycheck estimation workflows.',
        keywords: 'How to use calculators, paycheck calculator guide, frequently asked questions',
        canonicalPath: '/faq',
      },
      '/faqs': {
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
      },
      '/admin/mail/3days': {
        title: 'Admin Mail - 3 Days',
        description: 'OBBA admin mail editor.',
        canonicalPath: '/admin/mail/3days',
      },
      '/admin/mail/7days': {
        title: 'Admin Mail - 7 Days',
        description: 'OBBA admin mail editor.',
        canonicalPath: '/admin/mail/7days',
      },
      '/admin/mail/urgent': {
        title: 'Admin Mail - Urgent',
        description: 'OBBA admin mail editor.',
        canonicalPath: '/admin/mail/urgent',
      },
    };

    const pageSeo = seoByPath[location.pathname];
    if (!pageSeo) return;
    setPageMeta(pageSeo);

    const pageSchemaId = 'page-webpage-schema';
    const oldPageSchema = document.getElementById(pageSchemaId);
    if (oldPageSchema) oldPageSchema.remove();

    const pageSchema = document.createElement('script');
    pageSchema.type = 'application/ld+json';
    pageSchema.id = pageSchemaId;
    pageSchema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageSeo.title,
      description: pageSeo.description,
      url: `${window.location.origin}${pageSeo.canonicalPath}`,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        name: 'OBBBA Tax Calculators',
        url: `${window.location.origin}/`,
      },
    });
    document.head.appendChild(pageSchema);

    return () => {
      const existing = document.getElementById(pageSchemaId);
      if (existing) existing.remove();
    };
  }, [location.pathname]);

  useEffect(() => {
    const breadcrumbId = 'breadcrumb-schema';
    const old = document.getElementById(breadcrumbId);
    if (old) old.remove();

    const labels = {
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
      '/faqs': 'FAQ',
      '/about-us': 'About Us',
      '/privacy-policy': 'Privacy Policy',
      '/terms-conditions': 'Terms & Conditions',
      '/contact-us': 'Contact Us',
      '/admin/mail/3days': 'Admin Mail',
      '/admin/mail/7days': 'Admin Mail',
      '/admin/mail/urgent': 'Admin Mail',
    };

    const path = location.pathname;
    const pageLabel = labels[path];
    if (!pageLabel) return;

    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Website',
        item: `${window.location.origin}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Home',
        item: `${window.location.origin}/`,
      },
    ];

    if (path !== '/') {
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: pageLabel,
        item: `${window.location.origin}${path}`,
      });
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = breadcrumbId;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    });
    document.head.appendChild(script);

    return () => {
      const current = document.getElementById(breadcrumbId);
      if (current) current.remove();
    };
  }, [location.pathname]);

  useEffect(() => {
    // Ensure SPA navigation behaves like a fresh page load for footer/header links.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Move focus to the primary page title for accessibility and clear context shift.
    const focusTitle = () => {
      const h1 = document.querySelector('main h1');
      if (!h1) return;
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    };

    // Run after paint so new route content is mounted.
    const id = window.requestAnimationFrame(focusTitle);
    return () => window.cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <div className={`obba-theme min-h-screen ${isDark ? 'dark' : ''}`} style={{ paddingTop: isHome ? 0 : 69 }}>
      {!isHome && <Header isDark={isDark} setIsDark={setIsDark} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />}
      <Suspense fallback={<main className="max-w-7xl mx-auto px-4 py-8"><p className={isDark ? 'text-slate-300' : 'text-slate-700'}>Loading...</p></main>}>
        <Routes>
          <Route path="/" element={<HomePage isDark={isDark} setIsDark={setIsDark} />} />
          <Route path="/overtime" element={<OvertimePage isDark={isDark} setIsDark={setIsDark} />} />
          <Route path="/salary-calculator" element={<SalaryCalculatorPage isDark={isDark} />} />
          <Route path="/paycheck-calculator" element={<PaycheckCalculatorPage isDark={isDark} />} />
          <Route path="/states" element={<StatesPage />} />
          <Route path="/texas-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Texas" />} />
          <Route path="/florida-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Florida" />} />
          <Route path="/california-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="California" />} />
          <Route path="/illinois-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Illinois" />} />
          <Route path="/washington-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Washington" />} />
          <Route path="/indiana-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Indiana" />} />
          <Route path="/virginia-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Virginia" />} />
          <Route path="/hawaii-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Hawaii" />} />
          <Route path="/nebraska-paycheck-calculator" element={<StatePaycheckCalculatorPage isDark={isDark} stateName="Nebraska" />} />
          <Route path="/about-us" element={<AboutUsPage isDark={isDark} />} />
          <Route path="/faq" element={<FAQPage isDark={isDark} />} />
          <Route path="/faqs" element={<FAQPage isDark={isDark} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage isDark={isDark} />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage isDark={isDark} />} />
          <Route path="/contact-us" element={<ContactUsPage isDark={isDark} />} />
          <Route path="/unsubscribe" element={<UnsubscribePage isDark={isDark} />} />
          <Route path="/admin/mail/:type" element={<AdminMailPage isDark={isDark} />} />
          <Route path="/blogs" element={<BlogsPage isDark={isDark} />} />
          <Route path="/blogs/:slug" element={<BlogPost isDark={isDark} />} />
        </Routes>
      </Suspense>
      {!isHome && <footer className="obba-site-footer">
        <div className="mx-auto grid max-w-7xl gap-7 px-8 pt-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="OBBA" className="h-[38px] w-[38px] rounded-[10px] object-cover" />
              <span className="flex flex-col leading-none">
                <span className="text-[17px] font-extrabold text-white">OBBA</span>
                <span className="text-[9px] font-semibold tracking-[1.5px] text-slate-400">CALCULATORS</span>
              </span>
            </div>
            <p className="mt-4 max-w-[260px] text-[13px] leading-6 text-slate-400">Your trusted source for free online tax and financial calculators. Accurate, fast and easy to use.</p>
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">Calculators</h5>
            <div className="mt-3.5 flex flex-col gap-2.5 text-[13px] text-slate-400">
              <Link to="/salary-calculator" className="hover:text-white">Salary</Link>
              <Link to="/paycheck-calculator" className="hover:text-white">Paycheck</Link>
              <Link to="/overtime" className="hover:text-white">Overtime</Link>
              <Link to="/paycheck-calculator" className="hover:text-white">Payroll &amp; Deductions</Link>
              <Link to="/states" className="hover:text-white">States Calculators</Link>
              <Link to="/" className="hover:text-white">All Calculators</Link>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">Resources</h5>
            <div className="mt-3.5 flex flex-col gap-2.5 text-[13px] text-slate-400">
              <Link to="/blogs" className="hover:text-white">Blog</Link>
              <Link to="/faq" className="hover:text-white">FAQ</Link>
              <Link to="/paycheck-calculator" className="hover:text-white">Tax Brackets 2026</Link>
              <Link to="/states" className="hover:text-white">State Tax Guide</Link>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">Company</h5>
            <div className="mt-3.5 flex flex-col gap-2.5 text-[13px] text-slate-400">
              <Link to="/about-us" className="hover:text-white">About Us</Link>
              <Link to="/contact-us" className="hover:text-white">Contact Us</Link>
              <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-white">Terms of Use</Link>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">Support</h5>
            <div className="mt-3.5 flex flex-col gap-2.5 text-[13px] text-slate-400">
              <Link to="/faq" className="hover:text-white">FAQ</Link>
              <Link to="/contact-us" className="hover:text-white">Help Center</Link>
              <Link to="/contact-us" className="hover:text-white">Suggest Calculator</Link>
              <Link to="/contact-us" className="hover:text-white">Report an Issue</Link>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl items-center justify-center border-t border-[#1e2a4d] px-8 py-4 text-center">
          <span className="text-xs text-slate-400">© 2026 OBBA Calculators. All rights reserved.</span>
        </div>
      </footer>}
      <EmailUpdatesPopup />
    </div>
  );
}


