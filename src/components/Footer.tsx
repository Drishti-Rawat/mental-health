import Link from "next/link";
import { Star, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-white pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 mb-16">
          {/* Logo Column */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-10 h-10 fill-current" />
              <span className="font-serif text-3xl font-bold tracking-widest">LOGO</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed pr-4">
              Compassionate care, expert support, better tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold mb-6 text-[15px]">Quick Links</h4>
            <ul className="space-y-3 text-[13px] text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Therapists</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="lg:col-span-3">
            <h4 className="font-bold mb-6 text-[15px]">Our Services</h4>
            <ul className="space-y-3 text-[13px] text-white/70">
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
            <h4 className="font-bold mb-6 text-[15px]">Support</h4>
            <ul className="space-y-3 text-[13px] text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-2">
            <h4 className="font-bold mb-6 text-[15px]">Contact Us</h4>
            <ul className="space-y-4 text-[13px] text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-relaxed">A 34, Lower Ground Floor, Lajpat Nagar 2, Delhi, 110024</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 95357 70007</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@theholdinghands.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10"></div>
      </div>
    </footer>
  );
}
