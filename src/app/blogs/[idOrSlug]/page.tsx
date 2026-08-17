"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Tag, Sparkles, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getBlogByIdOrSlugApi, BlogPost } from "@/services/blogApi";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = (params?.idOrSlug as string) || "";

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idOrSlug) {
      setLoading(false);
      return;
    }

    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        const res = await getBlogByIdOrSlugApi(idOrSlug);
        if (res && res.blog) {
          setBlog(res.blog);
        } else {
          setBlog(null);
        }
      } catch (err) {
        console.error("API fetch error loading blog detail:", err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">The article you are looking for might have been moved or removed.</p>
          <Link
            href="/blogs"
            className="px-5 py-2.5 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition"
          >
            Back to All Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Published";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">

      <main className="flex-1 pb-16">
        {/* Top Back Navigation Bar */}
        <div className="bg-white border-b border-slate-200/60 py-4">
          <div className="site-container flex items-center justify-between">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-secondary transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Articles
            </Link>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Article Banner Header */}
        <article className="site-container max-w-4xl mx-auto pt-8 sm:pt-12 space-y-6">
          <div className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-foreground tracking-tight leading-tight">
              {blog.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 border-y border-slate-200/80 py-4 font-medium">
              <div className="flex items-center gap-1.5 text-foreground/80 font-bold">
                <User className="w-4 h-4 text-secondary" />
                <span>{blog.author || "MentalCare Team"}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{blog.readTime || 5} min read</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="rounded-3xl overflow-hidden h-64 sm:h-96 w-full bg-slate-100 shadow-md relative">
              <img
                src={blog.coverImage || "/hero.png"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Summary Excerpt Quote */}
          {blog.summary && (
            <div className="p-5 rounded-2xl bg-tertiary/60 border-l-4 border-secondary text-secondary text-sm sm:text-base font-medium italic leading-relaxed">
              "{blog.summary}"
            </div>
          )}

          {/* Main Body Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
            {blog.content}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
