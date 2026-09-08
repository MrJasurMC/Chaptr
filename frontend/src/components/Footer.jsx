import { Link } from "react-router-dom";
import { PiBookOpenTextDuotone } from "react-icons/pi";
import { LuMail } from "react-icons/lu";
const Footer = () => {
  return <footer className="border-t border-paper-border dark:border-ink-border">
      <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <PiBookOpenTextDuotone className="text-xl text-gold" />
            <span className="font-serif text-lg tracking-wide">Chaptr</span>
          </div>
          <p className="text-sm text-paper-sub dark:text-ink-sub leading-relaxed">
            Read the first chapter free. Pay only for the ones worth finishing.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-gold mb-4">Explore</p>
          <ul className="space-y-2.5 text-sm text-paper-sub dark:text-ink-sub">
            <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-gold transition">About</Link></li>
            <li><a href="/#shelf" className="hover:text-gold transition">Browse books</a></li>
            <li><a href="/#how-it-works" className="hover:text-gold transition">How it works</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-gold mb-4">Account</p>
          <ul className="space-y-2.5 text-sm text-paper-sub dark:text-ink-sub">
            <li><Link to="/login" className="hover:text-gold transition">Sign in</Link></li>
            <li><Link to="/register" className="hover:text-gold transition">Create an account</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-gold mb-4">Get in touch</p>
          <a href="mailto:example@gmail.com" className="flex items-center gap-2 text-sm text-paper-sub dark:text-ink-sub hover:text-gold transition">
            <LuMail size={14} /> example@gmail.com
          </a>
        </div>
      </div>

      <div className="border-t border-paper-border dark:border-ink-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-paper-sub dark:text-ink-sub">
          <p>© {new Date().getFullYear()} Chaptr.</p>
          <p>A reading platform, not a subscription.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
