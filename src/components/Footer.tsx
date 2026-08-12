import Link from "next/link";
import { Star, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-white pt-12 sm:pt-20 pb-8">
      <div className="site-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-6 mb-12 sm:mb-16">
          {/* Logo Column */}
          <div className="lg:col-span-3 sm:col-span-2 md:col-span-3">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Star className="w-8 h-8 sm:w-9 sm:h-9 fill-current text-tertiary" />
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">MentalCare</span>
            </div>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed pr-4 max-w-sm">
              Compassionate care, expert support, and evidence-based mental health therapy for a better tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold mb-4 sm:mb-6 text-sm sm:text-[15px] text-tertiary">Quick Links</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-[13px] text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/psychologists" className="hover:text-white transition-colors">Therapists</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="lg:col-span-3">
            <h4 className="font-bold mb-4 sm:mb-6 text-sm sm:text-[15px] text-tertiary">Our Services</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-[13px] text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Individual Therapy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Couples Counselling</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Child Therapy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Family Therapy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Online Therapy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Psychological Assessments</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="font-bold mb-4 sm:mb-6 text-sm sm:text-[15px] text-tertiary">Support</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-[13px] text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-2 sm:col-span-2 md:col-span-3">
            <h4 className="font-bold mb-4 sm:mb-6 text-sm sm:text-[15px] text-tertiary">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-[13px] text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-tertiary" />
                <span className="leading-relaxed">A 34, Lower Ground Floor, Lajpat Nagar 2, Delhi, 110024</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-tertiary" />
                <span>+91 95357 70007</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-tertiary" />
                <span>info@mentalcare.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-tertiary" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Bottom Copyright Bar */}
        <div className="w-full h-px bg-white/10 mb-6 sm:mb-8"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} MentalCare. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
