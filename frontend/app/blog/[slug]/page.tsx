"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPost, type BlogPost } from '@/app/lib/api';

// Minimal markdown renderer — good enough for the post shapes we seed.
// Handles: # / ## / ### headings, blank-line paragraphs, **bold**, and *italic*.
function renderMarkdown(src: string) {
  const blocks = src.split(/\n\s*\n/);

  const inline = (text: string) => {
    const parts: (string | { bold?: string; italic?: string })[] = [];
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const token = m[0];
      if (token.startsWith('**')) parts.push({ bold: token.slice(2, -2) });
      else parts.push({ italic: token.slice(1, -1) });
      last = m.index + token.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.map((p, i) =>
      typeof p === 'string' ? (
        <React.Fragment key={i}>{p}</React.Fragment>
      ) : p.bold ? (
        <strong key={i} className="text-starlight">{p.bold}</strong>
      ) : (
        <em key={i} className="text-stardust-light">{p.italic}</em>
      ),
    );
  };

  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="font-heading text-lg text-starlight mt-8 mb-3">
          {inline(trimmed.slice(4))}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="font-heading text-xl text-starlight mt-10 mb-4">
          {inline(trimmed.slice(3))}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={i} className="font-heading text-2xl md:text-3xl text-starlight mt-6 mb-5">
          {inline(trimmed.slice(2))}
        </h1>
      );
    }
    return (
      <p key={i} className="text-stardust leading-relaxed mb-5">
        {inline(trimmed)}
      </p>
    );
  });
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPost(slug)
      .then(setPost)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <main className="min-h-screen bg-parchment-texture text-starlight">
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-nebula-purple/5 blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-stardust-light/70 hover:text-starlight text-xs font-heading tracking-widest uppercase mb-10 transition-colors"
          >
            <span aria-hidden>←</span> Back to Field Notes
          </Link>

          {loading ? (
            <div className="scroll-card p-8 md:p-10 space-y-5">
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/3 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-4 w-4/6 rounded" />
            </div>
          ) : !post ? (
            <div className="text-center py-20 glass-card max-w-md mx-auto">
              <div className="text-5xl mb-5 opacity-60">🔍</div>
              <h3 className="font-heading text-xl text-starlight mb-2">Post Not Found</h3>
              <p className="text-stardust text-sm max-w-sm mx-auto">
                That entry may have been unpublished or never existed.
              </p>
            </div>
          ) : (
            <article className="scroll-card p-8 md:p-10">
              <p className="text-stardust-light/60 text-[10px] font-heading tracking-widest uppercase mb-3">
                {formatDate(post.createdAt)}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl text-starlight mb-6 leading-tight">
                {post.title}
              </h1>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {post.tags.map((tag) => (
                    <span key={tag} className="iron-tag text-[10px] border-none">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="w-full h-px bg-linear-to-r from-nebula-purple/20 via-nebula-blue/20 to-transparent mb-8" />
              <div>{renderMarkdown(post.content)}</div>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
