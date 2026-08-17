"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getBlogsApi, BlogPost } from "@/services/blogApi";

const CATEGORIES = [
  "All",
  "Mental Health",
  "Therapy",
  "Self Care",
  "Mindfulness",
  "Psychology",
  "Wellness",
  "General",
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getBlogsApi({
        page: currentPage,
        limit: 6,
        search: search.trim() || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        status: "published",
      });

      if (res && res.blogs) {
        setBlogs(res.blogs);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
        }
      } else {
        setBlogs([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch blogs from backend:", err);
      setBlogs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">

      <main className="flex-1">
        {/* Hero Banner Header */}
        <section className="bg-gradient-to-r from-primary via-secondary to-[#0F3D2B] text-white py-14 sm:py-20 relative overflow-hidden">
          <div className="site-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" /> Mental Health Insights
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white">
              Resource Hub & Articles
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Explore evidence-based articles, therapist insights, and self-care strategies designed for your well-being journey.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles by topic, keyword, or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition cursor-pointer shadow-xs"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Category Filters */}
        <section className="site-container py-8 border-b border-slate-200/60 bg-white shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-secondary text-white border-secondary shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="site-container py-12">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-tertiary text-secondary flex items-center justify-center mx-auto border border-secondary/20">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-foreground text-lg">No Articles Found</h3>
              <p className="text-xs text-slate-500">
                We couldn't find any articles matching your search query or category filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
                className="px-5 py-2.5 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition shadow-2xs cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b) => {
                const articleHref = `/blogs/${b.slug || b._id || b.id}`;
                return (
                  <article
                    key={b._id || b.id || b.slug}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Cover Thumbnail */}
                      <Link href={articleHref} className="relative h-48 w-full bg-slate-100 block overflow-hidden">
                        <img
                          src={b.coverImage || "/hero.png"}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-secondary backdrop-blur-xs border border-secondary/20 shadow-2xs">
                            {b.category}
                          </span>
                        </div>
                      </Link>

                      {/* Article Info */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                          <span>By {b.author || "MentalCare Team"}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {b.readTime || 5} min read
                          </span>
                        </div>

                        <h2 className="font-bold text-foreground text-base sm:text-lg line-clamp-2 group-hover:text-secondary transition-colors">
                          <Link href={articleHref}>{b.title}</Link>
                        </h2>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {b.summary || (b.content ? b.content.slice(0, 120) + "..." : "")}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Read Button */}
                    <div className="p-5 pt-0">
                      <Link
                        href={articleHref}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors border-t border-slate-100 pt-4 w-full"
                      >
                        Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls (Always visible when blogs exist) */}
          {blogs.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-2 py-10">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(p - 1, 1));
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => {
                    setCurrentPage(pg);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    currentPage === pg
                      ? "bg-secondary text-white border-secondary shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
