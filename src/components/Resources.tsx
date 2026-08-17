"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { getBlogsApi, BlogPost } from "@/services/blogApi";

export default function Resources() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const autoScrollPlugin = useRef(
    AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true, startDelay: 0 })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [autoScrollPlugin.current]
  );

  useEffect(() => {
    const fetchHomepageBlogs = async () => {
      setLoading(true);
      try {
        const res = await getBlogsApi({ status: 'published', limit: 5 });
        if (res && res.blogs && res.blogs.length > 0) {
          const formatted = res.blogs.slice(0, 5).map((b: BlogPost) => ({
            id: b._id || b.id || b.slug,
            slug: b.slug || b._id || b.id,
            category: b.category || 'Mental Health',
            date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
            title: b.title,
            image: b.coverImage || '/hero.png',
          }));
          setArticles(formatted);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error('Failed to fetch home page blogs from backend:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageBlogs();
  }, []);

  // Re-initialize Embla Carousel when data is loaded
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, articles]);

  if (!loading && articles.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  // Duplicate items for continuous seamless infinite scrolling loop if 5 or fewer items
  const displayArticles = articles.length > 0 && articles.length < 6 
    ? [...articles, ...articles, ...articles] 
    : articles;

  return (
    <section>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12 mt-10 sm:mt-16">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="inline-block bg-secondary/10 text-secondary font-semibold text-[11px] tracking-wider uppercase rounded-full px-4 py-1.5 mb-3">
            From Our Blog
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-2">
            Resources for your well-being
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base lg:text-lg">
            Insights, tips & guidance from our mental health experts.
          </p>
        </div>
        <Link 
          href="/blogs"
          className="shrink-0 px-6 py-2.5 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-tertiary transition-colors cursor-pointer text-sm inline-block text-center"
        >
          View All Articles
        </Link>
      </div>

      {/* Infinite Articles Carousel */}
      <div className="relative group">
        <div
          ref={emblaRef}
          className="overflow-hidden pb-4"
        >
          <div className="flex touch-pan-y flex-row -ml-4 sm:-ml-6">
            {displayArticles.map((article, index) => {
              const articleHref = `/blogs/${article.slug || article.id}`;
              return (
                <div
                  key={`${article.id}-${index}`}
                  className="flex-[0_0_82%] sm:flex-[0_0_300px] lg:flex-[0_0_25%] pl-4 sm:pl-6 min-w-0"
                >
                  <div className="h-full bg-white rounded-2xl shadow-xs border border-black/[0.04] overflow-hidden flex flex-col group/card transition-transform hover:-translate-y-1 hover:shadow-md">
                    {/* Image Container */}
                    <Link href={articleHref} className="w-full h-[160px] sm:h-[180px] relative overflow-hidden bg-gray-100 block">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                          {article.category}
                        </span>
                        <span className="text-[11px] font-medium text-foreground/40">
                          {article.date}
                        </span>
                      </div>

                      <h3 className="font-bold text-secondary text-[15px] leading-snug mb-6 flex-grow line-clamp-2">
                        <Link href={articleHref} className="hover:text-primary transition-colors">
                          {article.title}
                        </Link>
                      </h3>

                      <Link
                        href={articleHref}
                        className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
                      >
                        Read More <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


