import { Send } from "lucide-react";

export default function Newsletter() {
  return (
    <div className="bg-tertiary rounded-3xl p-6 sm:p-8 lg:p-12 mt-10 sm:mt-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xs">
      {/* Text Content */}
      <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2.5">
          Subscribe to our Newsletter
        </h2>
        <p className="text-foreground/70 text-xs sm:text-sm md:text-base max-w-md">
          Get the latest insights, resources, and updates from our mental health professionals delivered directly to your inbox.
        </p>
      </div>

      {/* Form */}
      <div className="lg:w-1/2 w-full flex flex-col items-center lg:items-end">
        <form className="w-full max-w-md flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-white border border-black/10 rounded-full px-5 py-3 sm:py-3.5 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-xs sm:text-sm shadow-xs"
            required
          />
          <button
            type="submit"
            className="bg-secondary text-white font-semibold rounded-full px-6 py-3 sm:py-3.5 hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shrink-0 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Subscribe
          </button>
        </form>
        <p className="text-foreground/50 text-[11px] mt-3 w-full max-w-md text-center sm:text-left sm:px-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
