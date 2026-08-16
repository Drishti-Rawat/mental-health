'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Upload, 
  Clock, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Image as ImageIcon,
  TrendingUp,
  Tag
} from 'lucide-react';
import { 
  getBlogsApi, 
  createBlogApi, 
  updateBlogApi, 
  deleteBlogApi, 
  uploadBlogImageApi, 
  BlogPost, 
  BlogStats 
} from '../../../../services/blogApi';

const CATEGORIES = ['Mental Health', 'Therapy', 'Self Care', 'Mindfulness', 'Psychology', 'Wellness', 'General'];

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<BlogStats>({ total: 0, published: 0, drafts: 0, totalViews: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<any>('Mental Health');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [tagsInput, setTagsInput] = useState('');
  const [readTime, setReadTime] = useState<number | string>('');

  // Preview Modal State
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getBlogsApi({
        page: currentPage,
        limit: 9,
        search,
        category: categoryFilter,
        status: statusFilter,
      });

      if (res && res.blogs) {
        setBlogs(res.blogs);
        if (res.stats) setStats(res.stats);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle('');
    setSummary('');
    setContent('');
    setCoverImage('');
    setAuthor('');
    setCategory('Mental Health');
    setStatus('published');
    setTagsInput('');
    setReadTime('');
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSummary(blog.summary || '');
    setContent(blog.content);
    setCoverImage(blog.coverImage || '');
    setAuthor(blog.author || 'MentalCare Editorial Team');
    setCategory(blog.category || 'Mental Health');
    setStatus(blog.status === 'draft' ? 'draft' : 'published');
    setTagsInput(blog.tags ? blog.tags.join(', ') : '');
    setReadTime(blog.readTime || 5);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadBlogImageApi(file, 'blogs');
      if (res && res.url) {
        setCoverImage(res.url);
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to upload image';
      alert(`Image Upload Error: ${msg}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, targetStatus?: 'published' | 'draft') => {
    if (e) e.preventDefault();
    if (!title || !content) {
      alert('Please fill in both Article Title and Article Content before saving.');
      return;
    }

    const finalStatus = targetStatus || status || 'published';

    setFormLoading(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title,
        summary,
        content,
        coverImage,
        author,
        category,
        tags,
        status: finalStatus,
        readTime: Number(readTime) || 5,
      };

      if (editingBlog) {
        const id = editingBlog._id || editingBlog.id!;
        await updateBlogApi(id, payload);
      } else {
        await createBlogApi(payload);
      }

      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      console.error('Save blog failed:', err);
      alert(`Save Error: ${err?.response?.data?.message || err?.message || 'Failed to save blog'}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteBlogApi(id);
      fetchBlogs();
    } catch (err) {
      console.error('Delete blog failed:', err);
    }
  };

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.total,
      subtitle: 'All created posts',
      icon: FileText,
      iconBg: 'bg-tertiary text-secondary border-secondary/20',
    },
    {
      title: 'Published',
      value: stats.published,
      subtitle: 'Live on website',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Drafts',
      value: stats.drafts,
      subtitle: 'Work in progress',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      subtitle: 'Combined readers count',
      icon: TrendingUp,
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-secondary to-[#0F3D2B] text-white p-5 sm:p-6 shadow-sm border border-secondary/30">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-xs">
              <BookOpen className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
                Blog Management
              </h1>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Publish articles, upload images, and manage health resources
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-secondary font-bold text-xs shadow-sm hover:bg-tertiary hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-secondary stroke-[2.5]" />
            <span>Create New Post</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                  {loading ? '...' : card.value}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{card.subtitle}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, content, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          />
        </form>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-secondary cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shrink-0">
            {['all', 'published', 'draft'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-secondary shadow-2xs'
                    : 'text-slate-600 hover:text-foreground'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="py-16 flex justify-center items-center text-slate-400">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-tertiary text-secondary flex items-center justify-center mx-auto border border-secondary/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-foreground text-base">No Blog Articles Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by creating your first article to publish mental health insights.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((b) => {
            const id = b._id || b.id!;
            return (
              <div
                key={id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-secondary/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={b.coverImage || 'https://placehold.co/800x450/0E2F29/ffffff?text=BLOG'}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-secondary backdrop-blur-xs border border-secondary/20">
                        {b.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize border ${
                          b.status === 'published'
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-amber-500 text-white border-amber-600'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-foreground text-sm line-clamp-2 group-hover:text-secondary transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{b.summary || b.content.slice(0, 100)}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-medium">
                      <span>{b.readTime || 5} min read</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Eye className="w-3 h-3 text-slate-400" />
                        {b.views || 0} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Article Card Footer */}
                <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewBlog(b)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => openEditModal(b)}
                    className="w-8 h-8 rounded-xl bg-tertiary text-secondary border border-secondary/20 hover:bg-secondary hover:text-white transition flex items-center justify-center cursor-pointer shadow-2xs"
                    title="Edit Post"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(id)}
                    className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center justify-center cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500 font-semibold px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Fixed Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {editingBlog ? 'Edit Blog Article' : 'Create New Article'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload cover image and compose article content
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Middle Form Content */}
            <form id="blog-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 Ways to Manage Anxiety Daily"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-secondary bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Image Upload (Cloudinary CDN Integration) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-secondary" />
                  Cover Image (Cloudinary Upload or HTTPS URL)
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or upload file"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-secondary"
                  />

                  <label className="px-4 py-2 rounded-xl bg-tertiary text-secondary border border-secondary/20 font-bold text-xs hover:bg-secondary hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {coverImage && (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mt-2">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Excerpt / Summary */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Short summary for search & cards preview..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Article Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Compose full article content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-secondary font-sans"
                />
              </div>

              {/* Author & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Author</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Smith"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Read Time (Mins)</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 5"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="anxiety, therapy, self-care, wellness"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <button type="submit" className="hidden" />
            </form>

            {/* Fixed Modal Footer */}
            <div className="p-4 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={formLoading}
                onClick={() => handleSubmit(undefined, 'draft')}
                className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Save as Draft</span>
              </button>

              <button
                type="button"
                disabled={formLoading}
                onClick={() => handleSubmit(undefined, 'published')}
                className="px-5 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>{formLoading ? 'Saving...' : editingBlog ? 'Update Article' : 'Publish Article'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Fixed Preview Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-tertiary text-secondary border border-secondary/20 inline-block">
                {previewBlog.category}
              </span>
              <button
                onClick={() => setPreviewBlog(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Preview Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                {previewBlog.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span>By {previewBlog.author}</span>
                <span>•</span>
                <span>{previewBlog.readTime} min read</span>
                <span>•</span>
                <span>{previewBlog.views} views</span>
              </div>

              {previewBlog.coverImage && (
                <div className="rounded-2xl overflow-hidden h-64 sm:h-80 w-full bg-slate-100">
                  <img src={previewBlog.coverImage} alt={previewBlog.title} className="w-full h-full object-cover" />
                </div>
              )}

              {previewBlog.summary && (
                <p className="text-sm font-semibold text-slate-700 italic border-l-4 border-secondary pl-4 py-1">
                  {previewBlog.summary}
                </p>
              )}

              <div className="prose max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-2">
                {previewBlog.content}
              </div>
            </div>

            {/* Fixed Preview Footer */}
            <div className="p-4 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end shrink-0">
              <button
                onClick={() => setPreviewBlog(null)}
                className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
