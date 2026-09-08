import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuSparkles, LuWallet, LuBookmark } from "react-icons/lu";
import BookCard from "../components/BookCard";
import { fetchBooks } from "../store/booksSlice";
import api from "../api/axios";
const perks = [[LuSparkles, "Free preview, always", "Read the first two pages of any book before spending a cent."], [LuWallet, "Pay per book, not per month", "No subscription. Unlock the ones you actually want to finish."], [LuBookmark, "Pick up where you left off", "Your progress is saved automatically, on any device."]];
const toc = [["I", "Open any book, free"], ["II", "Read first pages free, decide later"], ["III", "Keep only what's worth it"]];
const stats = [["10k+", "pages waiting to be discovered"], ["100%", "of every book starts free"], ["0", "subscriptions or hidden catches"]];
const fallbackQuotes = [["A beautiful way to find books I actually want to finish.", "Maya R.", "Early reader"], ["The free opening pages make choosing my next read feel effortless.", "Jon Bell", "Chaptr member"], ["No endless browsing. Just good stories and a library that feels like mine.", "Nora K.", "Book lover"]];
const Home = () => {
  const dispatch = useDispatch();
  const {
    items = [],
    loading,
    error
  } = useSelector(state => state.books);
  const [realQuotes, setRealQuotes] = useState([]);
  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);
  useEffect(() => {
    api.get("/reviews").then(res => {
      const withComments = res.data.filter(r => r.comment && r.comment.trim().length > 0).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).map(r => {
        const text = r.comment.trim();
        const truncated = text.length > 140 ? `${text.slice(0, 140).trim()}...` : text;
        return [truncated, r.user?.name || "Reader", r.book?.title ? `Read ${r.book.title}` : "Chaptr member"];
      });
      setRealQuotes(withComments);
    }).catch(() => setRealQuotes([]));
  }, []);
  const quotes = realQuotes.length > 0 ? realQuotes : fallbackQuotes;
  const shelf = items.length ? [...items, ...items] : [];
  return <div className="overflow-hidden">
      <section className="relative px-6 pt-28 pb-32 md:pt-36 md:pb-40">
        <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-[120px] opacity-40 animate-glow pointer-events-none" style={{
        background: "radial-gradient(circle, #D4A54A 0%, transparent 70%)"
      }} />

        <div className="relative max-w-6xl mx-auto" style={{
        perspective: "2400px"
      }}>
          <div className="grid md:grid-cols-2 min-h-[520px] md:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-paper-border dark:border-ink-border">
            <div className="origin-right bg-paper-surface dark:bg-ink-surface p-10 md:p-16 flex flex-col justify-center animate-open-left" style={{
            transformStyle: "preserve-3d"
          }}>
              <p className="text-xs tracking-[0.25em] uppercase mb-6 text-gold">Chapter One, free of charge</p>
              <ol className="space-y-7">
                {toc.map(([num, label], i) => <li key={num} className="flex items-baseline gap-4 opacity-0 animate-fade-up" style={{
                animationDelay: `${1.1 + i * 0.15}s`
              }}>
                    <span className="font-serif italic text-gold text-lg">{num}</span>
                    <span className="text-base md:text-lg text-paper-sub dark:text-ink-sub">{label}</span>
                  </li>)}
              </ol>
            </div>

            <div className="origin-left bg-paper-bg dark:bg-ink-bg p-10 md:p-16 flex flex-col justify-center animate-open-right" style={{
            transformStyle: "preserve-3d"
          }}>
              <h1 className="font-serif italic text-5xl md:text-6xl lg:text-7xl leading-[1.02] mb-7 opacity-0 animate-fade-up" style={{
              animationDelay: "1.3s"
            }}>
                Read the first chapter.
                <br />
                <span className="not-italic font-normal">Decide if it's yours to keep.</span>
              </h1>
              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-lg text-paper-sub dark:text-ink-sub opacity-0 animate-fade-up" style={{
              animationDelay: "1.45s"
            }}>
                Every title on Chaptr opens straight to page one. No teaser, no summary — the real thing, free, until you're ready to unlock the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-up" style={{
              animationDelay: "1.6s"
            }}>
                <a href="#shelf" className="px-6 py-4 rounded-md text-base font-medium bg-gold text-ink-bg hover:brightness-110 hover:-translate-y-0.5 transition">
                  Browse the library
                </a>
                <a href="#how-it-works" className="px-6 py-4 rounded-md text-base border border-paper-border dark:border-ink-border hover:border-gold transition">
                  How it works
                </a>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-6 h-full bg-gradient-to-r from-black/20 via-black/5 to-transparent dark:from-black/50 pointer-events-none" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid sm:grid-cols-3 gap-px overflow-hidden rounded-xl border border-paper-border dark:border-ink-border bg-paper-border dark:bg-ink-border">
          {stats.map(([number, label]) => <div key={number} className="bg-paper-surface dark:bg-ink-surface p-9 md:p-11 text-center">
              <p className="font-serif italic text-5xl md:text-6xl text-gold mb-3">{number}</p>
              <p className="text-base text-paper-sub dark:text-ink-sub">{label}</p>
            </div>)}
        </div>
      </section>

      <section id="shelf" className="pb-32 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 flex items-baseline justify-between mb-6">
          <h2 className="font-serif italic text-3xl md:text-4xl">On the shelf this week</h2>
          <a className="text-sm text-gold hover:underline" href="#shelf-grid">See all →</a>
        </div>

        <div className="group relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-paper-bg dark:from-ink-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-paper-bg dark:from-ink-bg to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 w-max animate-shelf-scroll group-hover:[animation-play-state:paused] px-6" aria-label="Featured books">
            {shelf.map((b, i) => <div key={`${b.id}-${i}`} className="w-52 md:w-56 shrink-0 transition-transform duration-300 hover:-translate-y-3 hover:rotate-1">
                <BookCard book={b} />
              </div>)}
            {loading && <p className="text-sm text-paper-sub dark:text-ink-sub py-8">Curating this week’s shelf…</p>}
            {!loading && error && <p className="text-sm text-paper-sub dark:text-ink-sub py-8">We couldn’t load the shelf. Please try again.</p>}
            {!loading && !error && shelf.length === 0 && <p className="text-sm text-paper-sub dark:text-ink-sub py-8">No books yet — add some from the admin panel.</p>}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="relative overflow-hidden rounded-xl border border-paper-border dark:border-ink-border bg-gold p-8 md:p-12 text-ink-bg">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-ink-bg/10" />
          <div className="absolute right-20 -bottom-24 h-48 w-48 rounded-full border-[24px] border-ink-bg/10" />
          <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-8">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-70">A better way to browse</p>
              <h2 className="font-serif italic text-4xl md:text-5xl mb-4">Your next favourite book is closer than you think.</h2>
              <p className="max-w-xl leading-relaxed opacity-80">Skip the pressure of picking perfectly. Open a story, spend a few quiet minutes with it, and let the pages make the case.</p>
            </div>
            <a href="/categories" className="inline-flex justify-center rounded-md bg-ink-bg px-6 py-4 text-paper-bg font-medium hover:-translate-y-0.5 hover:brightness-110 transition">
              Start reading free
            </a>
          </div>
        </div>
      </section>

      <section id="shelf-grid" className="max-w-6xl mx-auto px-6 pb-32 scroll-mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-3 text-gold">From the reading room</p>
            <h2 className="font-serif italic text-4xl md:text-5xl">Stories worth staying for.</h2>
          </div>
          <span className="hidden sm:block text-sm text-paper-sub dark:text-ink-sub">What readers are saying</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map(([quote, name, role], i) => <figure key={i} className="p-7 rounded-lg border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
              <div className="text-gold text-lg mb-5" aria-hidden="true">✦ ✦ ✦</div>
              <blockquote className="font-serif italic text-2xl leading-snug mb-8">“{quote}”</blockquote>
              <figcaption className="text-sm">
                <span className="block font-medium">{name}</span>
                <span className="text-paper-sub dark:text-ink-sub">{role}</span>
              </figcaption>
            </figure>)}
        </div>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto px-6 pb-32 scroll-mt-24">
        <div className="max-w-xl mb-12">
          <p className="text-xs tracking-[0.2em] uppercase mb-3 text-gold">How it works</p>
          <h2 className="font-serif italic text-4xl md:text-5xl mb-5">Three steps, no catch.</h2>
          <p className="text-sm text-paper-sub dark:text-ink-sub">
            Chaptr isn't a subscription and it isn't a sample-then-guess store. You read first, on every single title, and you only pay for the ones that earned it.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {perks.map(([Icon, t, d], i) => <div key={t} className="relative p-8 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface transition hover:border-gold/60 hover:-translate-y-1 hover:shadow-lg">
              <span className="absolute top-5 right-5 font-serif italic text-2xl text-gold/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon className="text-xl text-gold mb-4" aria-hidden="true" />
              <p className="font-serif text-lg mb-2">{t}</p>
              <p className="text-sm text-paper-sub dark:text-ink-sub leading-relaxed">{d}</p>
            </div>)}
        </div>

        <div className="grid sm:grid-cols-2 gap-10 p-8 rounded-lg border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
          <div>
            <p className="font-serif italic text-xl mb-3">Why not just a subscription?</p>
            <p className="text-sm text-paper-sub dark:text-ink-sub leading-relaxed">
              Because most books in a subscription pile go unread. Chaptr charges per book instead, so the price only shows up once you've decided the story is worth finishing — and writers get paid per reader who actually kept reading, not per person who scrolled past.
            </p>
          </div>
          <div>
            <p className="font-serif italic text-xl mb-3">What happens after I unlock a book?</p>
            <p className="text-sm text-paper-sub dark:text-ink-sub leading-relaxed">
              It's yours. The full text stays in your library, your reading position is saved automatically, and you can pick it back up from any device you're signed into — no re-buying, no re-downloading.
            </p>  
          </div>
        </div>

        <div className="relative overflow-hidden mt-16 p-10 md:p-14 rounded-xl bg-ink-bg text-paper-bg text-center">
          <div className="absolute -right-20 -top-24 w-64 h-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs tracking-[0.25em] uppercase text-gold mb-4">Your next chapter starts here</p>
            <h2 className="font-serif italic text-3xl md:text-4xl mb-4">Find a story that stays with you.</h2>
            <p className="max-w-md mx-auto text-sm text-paper-bg/70 mb-7">Browse freely, read honestly, and keep the books that earn a place on your shelf.</p>
            <a href="#shelf" className="inline-block px-6 py-3 rounded-md text-sm font-medium bg-gold text-ink-bg hover:brightness-110 transition">Explore the shelf</a>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;