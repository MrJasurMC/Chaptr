import { LuArrowRight, LuBookOpen, LuCheck, LuDatabase, LuLibrary, LuLock, LuPenLine, LuSparkles } from "react-icons/lu";
import { Link } from "react-router-dom";
const groups = [[LuBookOpen, "For readers", "Preview any book for free, unlock only what's worth finishing, and keep every purchase in one library."], [LuPenLine, "For interested parties", "Join our community and upload a book once. Chaptr handles previews, access, and payments automatically."], [LuDatabase, "For us", "A working example of auth, access control, and a real database behind a clean interface."]];
const values = [[LuLock, "No blind purchases", "Every book opens to a real, unedited preview — the same pages a paying reader gets, not a curated highlight reel."], [LuLibrary, "Own what you buy", "Once unlocked, a book stays in your library for good. No expiring access, no re-purchasing after a subscription lapses."]];
const steps = [["01", "Open the first page", "Every title starts with a genuine preview. No signup, no sales pitch, no guessing."], ["02", "Find your next read", "Take your time with the writing, discover new voices, and keep browsing until something clicks."], ["03", "Unlock what stays with you", "Pay once for the full book and return to it whenever you want from your personal library."]];
const About = () => {
  return <div className="max-w-5xl mx-auto px-6 py-12 sm:py-20">
      <section className="relative overflow-hidden rounded-2xl border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface px-6 py-12 sm:px-12 sm:py-16 mb-20">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs tracking-[0.18em] uppercase text-gold mb-6">
            <LuSparkles /> Built for curious readers
          </div>
          <h1 className="font-serif italic text-5xl sm:text-7xl leading-[0.95] mb-7">A bookstore you can read before you buy.</h1>
          <p className="text-lg leading-relaxed text-paper-sub dark:text-ink-sub max-w-2xl">
            Chaptr makes discovering books feel less like shopping and more like reading. Start anywhere, read something real, and only pay when a story earns its place on your shelf.
          </p>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-5 mb-20">
        {[["100%", "real previews"], ["1×", "pay once"], ["∞", "return visits"]].map(([number, label]) => <div key={label} className="border-l-2 border-gold pl-5 py-2">
            <p className="font-serif text-4xl">{number}</p>
            <p className="text-sm text-paper-sub dark:text-ink-sub">{label}</p>
          </div>)}
      </section>

      <section className="max-w-3xl mb-20">
        <p className="text-xs tracking-[0.2em] uppercase mb-4 text-gold">Why Chaptr</p>
        <h2 className="font-serif italic text-3xl sm:text-4xl mb-6">Reading should come with proof, not promises.</h2>
        <p className="text-base leading-relaxed mb-6 text-paper-sub dark:text-ink-sub">
        Chaptr exists for one simple reason: nobody should have to buy a book blind. Every title here opens straight to page one, free, no account needed. You read a real sample, not a summary or a star rating — and only pay if the book actually earns it.
        </p>
        <p className="text-base leading-relaxed mb-6 text-paper-sub dark:text-ink-sub">
        It's a small publishing platform with real accounts, a real catalog, and a real payment gate — built around one idea: reading should come with proof, not just promises. Most reading apps ask you to trust a cover, a blurb, and a handful of reviews before you spend anything. Chaptr skips the trust exercise and just hands you the book.
        </p>
        <p className="text-base leading-relaxed text-paper-sub dark:text-ink-sub">
        Under the hood, every book is stored page by page, so the platform knows exactly where the free preview ends and the paid content begins — no watermarked screenshots, no crippled PDF, just the same reading experience whether you've unlocked the book or not.
        </p>
      </section>

      <section className="mb-20">
        <p className="text-xs tracking-[0.2em] uppercase mb-5 text-gold">How it works</p>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map(([number, title, description]) => <div key={number} className="p-6 rounded-lg border border-paper-border dark:border-ink-border">
              <p className="text-gold font-mono text-sm mb-8">{number}</p>
              <h3 className="font-serif italic text-2xl mb-3">{title}</h3>
              <p className="text-sm leading-relaxed text-paper-sub dark:text-ink-sub">{description}</p>
            </div>)}
        </div>
      </section>

      <p className="text-xs tracking-[0.2em] uppercase mb-5 text-gold">Who it's for</p>
      <div className="grid sm:grid-cols-3 gap-5 mb-20">
        {groups.map(([Icon, t, d]) => <div key={t} className="p-5 rounded-lg border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
            <Icon className="text-xl text-gold mb-3" />
            <p className="font-serif italic text-lg mb-2">{t}</p>
            <p className="text-sm text-paper-sub dark:text-ink-sub leading-relaxed">{d}</p>
          </div>)}
      </div>

      <p className="text-xs tracking-[0.2em] uppercase mb-5 text-gold">What we believe</p>
      <div className="grid sm:grid-cols-2 gap-5">
        {values.map(([Icon, t, d]) => <div key={t} className="p-5 rounded-lg border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
            <Icon className="text-xl text-gold mb-3" />
            <p className="font-serif italic text-lg mb-2">{t}</p>
            <p className="text-sm text-paper-sub dark:text-ink-sub leading-relaxed">{d}</p>
          </div>)}
      </div>
      <section className="mt-20 rounded-2xl bg-gold px-7 py-10 text-center text-ink sm:px-12">
        <LuCheck className="mx-auto text-2xl mb-3" />
        <h2 className="font-serif italic text-3xl mb-3">Your next favourite book might be one page away.</h2>
        <p className="mb-6 opacity-80">No pressure. Just open a book and see where it takes you.</p>
        <Link to="/categories" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-paper transition-opacity hover:opacity-90">
          Explore the collection <LuArrowRight />
        </Link>
      </section>
    </div>;
};
export default About;
