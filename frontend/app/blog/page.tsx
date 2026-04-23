"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts, type BlogPost } from '@/app/lib/api';
import ScrollReveal from '@/app/components/ScrollReveal';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <main className="min-h-screen bg-parchment-texture text-starlight">
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-nebula-purple/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-[300px] h-[300px] bg-nebula-blue/5 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <h1 className="section-heading mb-4">Field Notes</h1>
            <p className="text-center text-stardust max-w-2xl mx-auto mb-14 text-sm leading-relaxed">
              Short entries on automation, embedded systems, and the occasional
              AI tinkering session.
            </p>
          </ScrollReveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="scroll-card h-[260px] p-6 space-y-4">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-5/6 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-28 glass-card max-w-md mx-auto">
              <div className="text-5xl mb-5 opacity-60">📝</div>
              <h3 className="font-heading text-xl text-starlight mb-2">No Posts Yet</h3>
              <p className="text-stardust text-sm max-w-sm mx-auto">
                The log is quiet for now. New entries will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <ScrollReveal key={post.id} delay={index * 100} variant="scale">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="scroll-card group h-full flex flex-col p-6 md:p-8 transition-all duration-500 hover:ring-1 hover:ring-nebula-purple/20"
                  >
                    <p className="text-stardust-light/60 text-[10px] font-heading tracking-widest uppercase mb-3">
                      {formatDate(post.createdAt)}
                    </p>
                    <h3 className="font-heading text-lg md:text-xl text-starlight font-bold mb-3 group-hover:text-nebula-purple-light transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-stardust text-sm leading-relaxed line-clamp-3 mb-5">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="iron-tag text-[10px] border-none">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
