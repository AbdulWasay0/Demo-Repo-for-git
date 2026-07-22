import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import heroImg from "@/assets/hero.jpg";
import storyImg from "@/assets/story.jpg";
import char1 from "@/assets/char1.jpg";
import char2 from "@/assets/char2.jpg";
import char3 from "@/assets/char3.jpg";
import enemy1 from "@/assets/enemy1.jpg";
import enemy2 from "@/assets/enemy2.jpg";
import gal1 from "@/assets/gallery1.jpg";
import gal2 from "@/assets/gallery2.jpg";
import gal3 from "@/assets/gallery3.jpg";
import gal4 from "@/assets/gallery4.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "HOLLOWFALL — Fear Has A New Home" },
      { name: "description", content: "HOLLOWFALL is a cinematic psychological survival horror game from Ashen Veil Studios. Coming to PC, PlayStation and Xbox. Wishlist now on Steam." },
      { property: "og:title", content: "HOLLOWFALL — Fear Has A New Home" },
      { property: "og:description", content: "A cinematic psychological horror experience. Explore the derelict town of Hollowfall and uncover what lies beneath." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const NAV = [
  ["Home", "#home"], ["Story", "#story"], ["Features", "#features"],
  ["Characters", "#characters"], ["Enemies", "#enemies"], ["Gallery", "#gallery"],
  ["Trailer", "#trailer"], ["Roadmap", "#roadmap"], ["FAQ", "#faq"], ["Contact", "#contact"],
];

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const flashlight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onMove = (e: MouseEvent) => {
      if (cursor.current) {
        cursor.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
      }
      if (flashlight.current) {
        flashlight.current.style.background = `radial-gradient(circle 260px at ${e.clientX}px ${e.clientY}px, transparent 0%, oklch(0 0 0 / 0.35) 60%, oklch(0 0 0 / 0.75) 100%)`;
      }
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMove);
    // reveal on scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("rise-in");
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* custom cursor */}
      <div ref={cursor} className="pointer-events-none fixed left-0 top-0 z-[200] h-6 w-6 rounded-full mix-blend-difference"
        style={{ background: "oklch(0.98 0.005 20)", boxShadow: "0 0 24px oklch(0.45 0.22 25 / 0.9)" }} />
      {/* flashlight overlay */}
      <div ref={flashlight} className="pointer-events-none fixed inset-0 z-[45]" />
      {/* lightning */}
      <div className="lightning-flash" />

      {/* Loader */}
      <div className={`fixed inset-0 z-[300] flex items-center justify-center bg-background transition-opacity duration-700 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-pulse rounded-full border border-primary/40" style={{ boxShadow: "0 0 60px oklch(0.45 0.22 25 / 0.6)" }} />
          <p className="font-serif-h text-xs text-primary flicker-text">ENTERING HOLLOWFALL…</p>
        </div>
      </div>

      {/* NAV */}
      <header className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${scrolled ? "border-b border-border/40 bg-background/85 backdrop-blur-md" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center border border-primary/60" style={{ boxShadow: "0 0 20px oklch(0.45 0.22 25 / 0.5)" }}>
              <span className="font-serif-h text-primary">H</span>
            </div>
            <span className="font-display text-2xl tracking-[0.2em] text-foreground">HOLLOWFALL</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="font-serif-h text-[11px] text-muted-foreground transition-colors hover:text-primary">{label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href="#steam" className="btn-ghost-h text-xs">DISCORD</a>
            <a href="#steam" className="btn-blood text-xs">WISHLIST</a>
          </div>
          <button className="lg:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <div className="space-y-1.5">
              <div className="h-px w-7 bg-foreground" />
              <div className="h-px w-7 bg-foreground" />
              <div className="h-px w-5 bg-foreground" />
            </div>
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border/40 bg-background/95 px-6 py-6 lg:hidden">
            <div className="flex flex-col gap-4">
              {NAV.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="font-serif-h text-xs text-muted-foreground">{label}</a>
              ))}
              <a href="#steam" className="btn-blood mt-2 text-xs">WISHLIST ON STEAM</a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-shake">
          <img src={heroImg} alt="Hollowfall — the derelict town" className="h-full w-full object-cover opacity-70" style={{ filter: "contrast(1.1) saturate(0.85)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/70" />
        </div>
        <div className="fog-layer" />
        <div className="fog-layer" style={{ animationDuration: "70s", opacity: 0.15 }} />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="eyebrow mb-6 flicker-text" data-reveal>An Ashen Veil Studios Production</p>
          <h1 className="section-title mb-6 text-white" style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", textShadow: "0 0 40px oklch(0.45 0.22 25 / 0.6)" }} data-reveal>
            HOLLOWFALL
          </h1>
          <p className="mx-auto mb-10 max-w-xl font-serif-h text-sm text-muted-foreground md:text-base" data-reveal>
            Fear Has A New Home
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4" data-reveal>
            <a href="#steam" className="btn-blood">◆ WISHLIST ON STEAM</a>
            <a href="#trailer" className="btn-ghost-h">▶ WATCH TRAILER</a>
            <a href="#steam" className="btn-ghost-h">⬇ PLAY DEMO</a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif-h text-[10px] text-muted-foreground">SCROLL</span>
            <div className="h-10 w-px animate-pulse bg-primary/60" />
          </div>
        </div>
      </section>

      {/* STORY / ABOUT */}
      <section id="story" className="relative overflow-hidden py-32">
        <div className="fog-layer" style={{ opacity: 0.1 }} />
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
          <div className="relative" data-reveal>
            <div className="absolute -inset-4 border border-primary/30" />
            <img src={storyImg} alt="A haunted corridor" loading="lazy" className="relative w-full object-cover" style={{ aspectRatio: "4/5", filter: "contrast(1.1)" }} />
            <div className="absolute -bottom-8 -right-8 hidden border border-primary/40 bg-background/80 p-6 backdrop-blur md:block">
              <p className="eyebrow">Chapter I</p>
              <p className="mt-1 font-display text-3xl tracking-wider">The Arrival</p>
            </div>
          </div>
          <div data-reveal>
            <p className="eyebrow mb-4">The Story</p>
            <h2 className="section-title mb-6">
              Some towns<br />
              <span className="text-primary">don't forget.</span>
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Twenty years after the disappearance of her sister, journalist Aria Vale returns
              to Hollowfall — a fog-swallowed town the world tried to erase. What she finds is
              a place where memory bleeds, the dead still whisper, and every locked door
              hides a version of herself she doesn't remember becoming.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              HOLLOWFALL is a psychological survival horror experience built on dread, silence,
              and the terrible weight of what you already know.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
              {[["16+", "AGE RATING"], ["12 HRS", "CAMPAIGN"], ["4", "ENDINGS"]].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl text-primary">{v}</p>
                  <p className="mt-1 font-serif-h text-[10px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative overflow-hidden border-y border-border/40 bg-card/40 py-32">
        <div className="fog-layer" style={{ opacity: 0.08 }} />
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center" data-reveal>
            <p className="eyebrow mb-3">What Awaits You</p>
            <h2 className="section-title">Features</h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-border/30 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["✶", "Psychological Horror", "Story built on dread, guilt, and unreliable memory."],
              ["◈", "Dynamic AI", "Enemies learn your habits and hunt you accordingly."],
              ["✚", "Four Endings", "Every choice bends the fate of Hollowfall."],
              ["◉", "Realistic Lighting", "Ray-traced shadows breathe in the dark with you."],
              ["✻", "Immersive Audio", "Binaural sound design engineered for headphones."],
              ["◐", "Environmental Story", "Every prop, note, and stain is a clue."],
              ["✧", "Puzzle & Ritual", "Solve occult puzzles rooted in the town's lore."],
              ["◇", "Stealth & Survival", "Hide, run, ration — combat is a last resort."],
              ["✦", "Photo Mode", "Capture the horror in cinematic detail."],
            ].map(([icon, title, desc]) => (
              <div key={title} data-reveal className="group relative bg-background/80 p-8 transition-all duration-500 hover:bg-card">
                <div className="mb-4 font-display text-4xl text-primary transition-transform duration-500 group-hover:scale-110">{icon}</div>
                <h3 className="mb-2 font-display text-2xl tracking-wider">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                <div className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARACTERS */}
      <section id="characters" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center" data-reveal>
            <p className="eyebrow mb-3">The Souls Left Behind</p>
            <h2 className="section-title">Characters</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { img: char1, name: "Aria Vale", role: "The Journalist", desc: "Returning to a town she swore she'd never see again." },
              { img: char2, name: "Father Kaine", role: "The Keeper", desc: "He knows what happened. He will not say." },
              { img: char3, name: "Little Wren", role: "The Echo", desc: "A child who shouldn't exist — and yet does." },
            ].map((c) => (
              <div key={c.name} data-reveal className="group relative overflow-hidden border border-border/60 bg-card">
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <img src={c.img} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105" style={{ filter: "grayscale(0.4) contrast(1.15)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="eyebrow mb-1">{c.role}</p>
                  <h3 className="mb-2 font-display text-3xl tracking-wider">{c.name}</h3>
                  <p className="text-sm text-muted-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENEMIES */}
      <section id="enemies" className="relative overflow-hidden border-y border-border/40 py-32">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 30%, oklch(0.45 0.22 25 / 0.4), transparent 60%)" }} />
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center" data-reveal>
            <p className="eyebrow mb-3">Do Not Look Directly</p>
            <h2 className="section-title">The Hollow Ones</h2>
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {[
              { img: enemy1, name: "The Wailer", threat: "HIGH", behavior: "Hunts by sound", weakness: "Cannot cross salt" },
              { img: enemy2, name: "The Warden", threat: "EXTREME", behavior: "Patrols corridors", weakness: "Blind in bright light" },
            ].map((m) => (
              <div key={m.name} data-reveal className="group relative overflow-hidden border border-border/60 bg-card">
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img src={m.img} alt={m.name} loading="lazy" className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-105" style={{ filter: "contrast(1.2) saturate(0.8)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-3xl tracking-wider">{m.name}</h3>
                    <span className="border border-primary/60 bg-primary/10 px-3 py-1 font-serif-h text-[10px] text-primary">THREAT: {m.threat}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
                    <div><p className="eyebrow mb-1 text-[10px]">Behavior</p><p className="text-sm text-muted-foreground">{m.behavior}</p></div>
                    <div><p className="eyebrow mb-1 text-[10px]">Weakness</p><p className="text-sm text-muted-foreground">{m.weakness}</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center" data-reveal>
            <p className="eyebrow mb-3">From The Field Notes</p>
            <h2 className="section-title">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { src: gal1, span: "md:col-span-2 md:row-span-2" },
              { src: gal2, span: "md:row-span-2" },
              { src: gal3, span: "" },
              { src: gal4, span: "md:col-span-2" },
              { src: heroImg, span: "" },
              { src: storyImg, span: "md:row-span-2" },
            ].map((g, i) => (
              <button key={i} data-reveal onClick={() => setLightbox(g.src)} className={`group relative overflow-hidden border border-border/60 ${g.span}`}>
                <img src={g.src} alt={`Hollowfall gameplay ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" style={{ minHeight: "200px", filter: "contrast(1.1)" }} />
                <div className="absolute inset-0 bg-background/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="font-serif-h text-xs text-primary">◉ VIEW</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-[250] flex items-center justify-center bg-background/95 p-8 backdrop-blur-md">
          <img src={lightbox} alt="expanded" className="max-h-full max-w-full border border-primary/40" />
          <button className="absolute right-6 top-6 font-serif-h text-xs text-primary">CLOSE ✕</button>
        </div>
      )}

      {/* TRAILER */}
      <section id="trailer" className="relative overflow-hidden border-y border-border/40 bg-card/30 py-32">
        <div className="fog-layer" style={{ opacity: 0.12 }} />
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="eyebrow mb-3" data-reveal>Official Reveal</p>
          <h2 className="section-title mb-12" data-reveal>The Trailer</h2>
          <div data-reveal className="group relative mx-auto overflow-hidden border border-primary/40" style={{ aspectRatio: "16/9", boxShadow: "0 0 80px oklch(0.45 0.22 25 / 0.3)" }}>
            <img src={heroImg} alt="Trailer thumbnail" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" style={{ filter: "brightness(0.55) contrast(1.15)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="group/btn relative grid h-24 w-24 place-items-center rounded-full border border-primary/60 bg-background/40 backdrop-blur transition-all duration-500 hover:scale-110" style={{ boxShadow: "0 0 60px oklch(0.45 0.22 25 / 0.6)" }}>
                <div className="ml-1 h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-primary" />
              </button>
            </div>
            <div className="absolute bottom-6 left-6 text-left">
              <p className="eyebrow">Official Trailer</p>
              <p className="font-display text-2xl tracking-wider">HOLLOWFALL — Reveal</p>
            </div>
          </div>
        </div>
      </section>

      {/* STEAM */}
      <section id="steam" className="relative py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2">
          <div data-reveal>
            <p className="eyebrow mb-3">Coming Soon</p>
            <h2 className="section-title mb-6">Available On <span className="text-primary">Steam</span></h2>
            <p className="mb-8 text-lg text-muted-foreground">Wishlist HOLLOWFALL now and be the first to descend when the fog lifts.</p>
            <div className="mb-8 grid grid-cols-2 gap-6">
              {[["RELEASE", "Q4 2026"], ["PRICE", "$29.99"], ["PLATFORMS", "PC · PS5 · Xbox"], ["LANGUAGES", "12"]].map(([k, v]) => (
                <div key={k} className="border-l-2 border-primary/60 pl-4">
                  <p className="eyebrow text-[10px]">{k}</p>
                  <p className="mt-1 font-display text-2xl">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="btn-blood">◆ WISHLIST</a>
              <a href="#" className="btn-ghost-h">⬇ DOWNLOAD DEMO</a>
            </div>
          </div>
          <div data-reveal className="border border-border/60 bg-card p-8">
            <p className="eyebrow mb-4">System Requirements</p>
            <div className="space-y-6">
              {[
                { t: "MINIMUM", specs: [["OS", "Windows 10 64-bit"], ["CPU", "Intel i5-8400 / Ryzen 5 2600"], ["RAM", "12 GB"], ["GPU", "GTX 1660 / RX 5600"], ["Storage", "70 GB SSD"]] },
                { t: "RECOMMENDED", specs: [["OS", "Windows 11 64-bit"], ["CPU", "Intel i7-12700 / Ryzen 7 5800X"], ["RAM", "16 GB"], ["GPU", "RTX 3070 / RX 6800"], ["Storage", "70 GB NVMe"]] },
              ].map((s) => (
                <div key={s.t}>
                  <p className="mb-3 font-display text-lg tracking-wider text-primary">{s.t}</p>
                  <div className="space-y-2">
                    {s.specs.map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-border/40 pb-1 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="relative overflow-hidden border-y border-border/40 bg-card/30 py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center" data-reveal>
            <p className="eyebrow mb-3">The Descent</p>
            <h2 className="section-title">Roadmap</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2" />
            {[
              { phase: "2023", title: "Prototype", desc: "First playable vertical slice. The town takes shape.", done: true },
              { phase: "2024", title: "Alpha", desc: "Core mechanics, AI foundation, first chapter locked.", done: true },
              { phase: "2025", title: "Public Demo", desc: "One hour of Hollowfall — free on Steam Next Fest.", done: true },
              { phase: "Q2 2026", title: "Early Access", desc: "Chapters I–III with community-driven refinement.", done: false },
              { phase: "Q4 2026", title: "Full Release", desc: "The full story. All four endings. Console launch to follow.", done: false },
              { phase: "2027", title: "Beyond", desc: "New Game+, DLC 'The Chapel', and free content drops.", done: false },
            ].map((r, i) => (
              <div key={r.title} data-reveal className={`relative mb-10 grid grid-cols-1 gap-4 pl-12 md:grid-cols-2 md:pl-0 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                <div className={i % 2 === 1 ? "md:order-2 md:pl-12" : "md:pr-12"}>
                  <div className="border border-border/60 bg-background p-6">
                    <p className="eyebrow mb-2">{r.phase}</p>
                    <h3 className="mb-2 font-display text-2xl tracking-wider">{r.title}</h3>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
                <div className={`absolute left-2 top-6 h-4 w-4 rotate-45 border md:left-1/2 md:-translate-x-1/2 ${r.done ? "border-primary bg-primary" : "border-primary/50 bg-background"}`} style={r.done ? { boxShadow: "0 0 20px oklch(0.45 0.22 25 / 0.8)" } : {}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="relative py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="eyebrow mb-3" data-reveal>Join The Ritual</p>
          <h2 className="section-title mb-6" data-reveal>Community</h2>
          <p className="mx-auto mb-12 max-w-xl text-muted-foreground" data-reveal>Trade theories. Share your endings. Or just scream into the void with us.</p>
          <div className="mb-12 flex flex-wrap justify-center gap-4" data-reveal>
            {["Discord", "Reddit", "Twitter", "Instagram", "TikTok", "YouTube"].map((s) => (
              <a key={s} href="#" className="btn-ghost-h text-xs">{s}</a>
            ))}
          </div>
          <form data-reveal onSubmit={(e) => e.preventDefault()} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input type="email" required placeholder="your@email.com" className="flex-1 border border-border/60 bg-input px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            <button className="btn-blood text-xs">SUBSCRIBE</button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative border-y border-border/40 bg-card/30 py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center" data-reveal>
            <p className="eyebrow mb-3">Answers From The Dark</p>
            <h2 className="section-title">FAQ</h2>
          </div>
          <div className="space-y-3">
            {[
              ["When does HOLLOWFALL release?", "Full release is planned for Q4 2026, with Early Access in Q2 2026. Wishlist to be notified the moment it drops."],
              ["What platforms will it launch on?", "PC (Steam) at launch, followed by PlayStation 5 and Xbox Series X|S shortly after."],
              ["Is there controller support?", "Yes — full controller support with custom rebinding, including haptics on PS5."],
              ["Is there multiplayer or co-op?", "HOLLOWFALL is a deliberately single-player experience. Fear is meant to be personal."],
              ["What are the system requirements?", "See the Steam section above for full minimum and recommended specs."],
              ["How much will it cost?", "$29.99 USD at launch. The demo will remain free forever."],
              ["Will there be jump scares?", "Sparingly. HOLLOWFALL is built on atmospheric dread, not startles."],
            ].map(([q, a], i) => (
              <details key={i} data-reveal className="group border border-border/60 bg-background">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-display text-lg tracking-wider transition-colors hover:text-primary">
                  <span>{q}</span>
                  <span className="text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="border-t border-border/60 p-5 pt-4 text-sm leading-relaxed text-muted-foreground">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2">
          <div data-reveal>
            <p className="eyebrow mb-3">Send A Message</p>
            <h2 className="section-title mb-6">Contact</h2>
            <p className="mb-8 text-muted-foreground">Press inquiries, partnership requests, or a story to share — we read every letter.</p>
            <div className="space-y-4">
              <div><p className="eyebrow mb-1 text-[10px]">Press</p><p className="font-display text-lg tracking-wider">press@ashenveil.studio</p></div>
              <div><p className="eyebrow mb-1 text-[10px]">Business</p><p className="font-display text-lg tracking-wider">contact@ashenveil.studio</p></div>
              <div><p className="eyebrow mb-1 text-[10px]">Support</p><p className="font-display text-lg tracking-wider">help@ashenveil.studio</p></div>
            </div>
          </div>
          <form data-reveal onSubmit={(e) => e.preventDefault()} className="space-y-4 border border-border/60 bg-card p-8">
            {[["Name", "text"], ["Email", "email"], ["Subject", "text"]].map(([l, t]) => (
              <div key={l}>
                <label className="eyebrow mb-2 block text-[10px]">{l}</label>
                <input required type={t} className="w-full border border-border/60 bg-input px-4 py-3 text-sm focus:border-primary focus:outline-none" />
              </div>
            ))}
            <div>
              <label className="eyebrow mb-2 block text-[10px]">Message</label>
              <textarea required rows={5} className="w-full border border-border/60 bg-input px-4 py-3 text-sm focus:border-primary focus:outline-none" />
            </div>
            <button className="btn-blood w-full">SEND</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border/60 bg-background py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center border border-primary/60">
                  <span className="font-serif-h text-primary">H</span>
                </div>
                <span className="font-display text-2xl tracking-[0.2em]">HOLLOWFALL</span>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">An Ashen Veil Studios production. Fear has a new home.</p>
            </div>
            <div>
              <p className="eyebrow mb-4 text-[10px]">Explore</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Story", "Features", "Characters", "Gallery"].map((l) => (
                  <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-primary">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 text-[10px]">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Press Kit</a></li>
                <li><a href="#" className="hover:text-primary">EULA</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 md:flex-row">
            <p className="font-serif-h text-[10px] text-muted-foreground">© 2026 ASHEN VEIL STUDIOS. ALL RIGHTS RESERVED.</p>
            <p className="font-serif-h text-[10px] text-muted-foreground flicker-text">DO NOT LOOK BEHIND YOU.</p>
          </div>
        </div>
      </footer>
      <ChatbotWidget />
    </div>
  );
}
