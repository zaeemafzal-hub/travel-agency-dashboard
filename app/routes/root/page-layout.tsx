import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";

const features = [
  {
    icon: "✦",
    title: "AI-Crafted Itineraries",
    desc: "Tell us your vibe — budget, interests, group type — and our AI builds a full trip plan in seconds.",
  },
  {
    icon: "🗺",
    title: "Interactive World Map",
    desc: "Visualize your journey across the globe with pinned destinations and route previews.",
  },
  {
    icon: "📸",
    title: "Curated Destination Photos",
    desc: "Every trip comes with stunning photography pulled from the world's best travel imagery.",
  },
  {
    icon: "📅",
    title: "Day-by-Day Planning",
    desc: "Morning, afternoon, evening — your schedule is broken down with local recommendations.",
  },
];

const destinations = [
  { name: "Pakistan", tag: "Adventure", bg: "bg-image-card-1" },
  { name: "Japan", tag: "Culture", bg: "bg-image-card-2" },
  { name: "Italy", tag: "Luxury", bg: "bg-image-card-3" },
  { name: "Morocco", tag: "Budget", bg: "bg-image-card-4" },
];

const PageLayout = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-light-200 font-figtree overflow-x-hidden">
      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-100"
            : "bg-transparent"
        }`}
      >
        <div className="wrapper flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/assets/icons/logo.svg" alt="logo" className="size-8" />
            <span className="text-xl font-bold text-dark-100">Tourvisto</span>
          </a>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-16-semibold text-dark-200 hover:text-primary-100 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/trips/create")}
              className="button-class !h-10 !px-5 !rounded-lg text-white p-16-semibold"
            >
              Create Trip
            </button>
            <button onClick={handleLogout} className="cursor-pointer ml-1">
              <img
                src="/assets/icons/logout.svg"
                alt="logout"
                className="size-5 opacity-60 hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative w-full min-h-screen flex items-center bg-hero bg-cover bg-center"
      >
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-linear200 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-200/60 via-transparent to-transparent pointer-events-none" />

        <div className="wrapper relative z-10 pt-28 pb-20">
          <div className="max-w-[640px] flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full w-fit border border-white/30">
              ✦ Powered by Groq AI
            </span>

            <h1 className="p-72-bold text-white leading-tight drop-shadow-lg">
              Travel Smarter,{" "}
              <span className="text-primary-100">Not Harder.</span>
            </h1>

            <p className="text-lg md:text-xl font-normal text-white/80 max-w-[480px] leading-relaxed">
              Generate personalized travel itineraries in seconds. Tell us your
              destination, budget, and interests — we handle the rest.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => navigate("/trips/create")}
                className="button-class !h-12 !px-8 !rounded-xl text-white p-18-semibold shadow-200 hover:scale-[1.02] transition-transform"
              >
                <img
                  src="/assets/icons/magic-star.svg"
                  alt=""
                  className="size-5"
                />
                Generate My Trip
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="button-class-secondary !h-12 !px-8 !rounded-xl p-18-semibold text-dark-100 hover:scale-[1.02] transition-transform"
              >
                View Dashboard
              </button>
            </div>

            {/* stats row */}
            <div className="flex gap-8 mt-4">
              {[
                { value: "10K+", label: "Trips Generated" },
                { value: "190+", label: "Countries" },
                { value: "4.9★", label: "User Rating" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-bold text-white">{value}</span>
                  <span className="text-sm text-white/60">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-white/50 text-xs">Scroll</span>
          <div className="w-px h-8 bg-white/30" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="wrapper py-20 flex flex-col gap-12">
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="text-primary-100 text-sm font-semibold uppercase tracking-widest">
            Why Tourvisto
          </span>
          <h2 className="p-40-semibold text-dark-100">
            Everything you need for the perfect trip
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-[20px] p-6 flex flex-col gap-4 shadow-400 hover:shadow-200 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-3xl">{icon}</span>
              <h3 className="text-lg font-semibold text-dark-100">{title}</h3>
              <p className="text-sm font-normal text-gray-100 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section className="bg-dark-200 py-20">
        <div className="wrapper flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <span className="text-primary-100 text-sm font-semibold uppercase tracking-widest">
                Destinations
              </span>
              <h2 className="p-40-semibold text-white">Popular Right Now</h2>
            </div>
            <button
              onClick={() => navigate("/trips")}
              className="button-class-secondary !h-10 !px-6 !rounded-lg p-16-semibold text-dark-100 w-fit"
            >
              View All Trips →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {destinations.map(({ name, tag }, i) => (
              <div
                key={name}
                className="relative rounded-[20px] overflow-hidden h-[260px] group cursor-pointer"
                onClick={() => navigate("/trips/create")}
              >
                {/* colored placeholder backgrounds matching card images */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105`}
                  style={{
                    backgroundImage: `var(--background-image-card-${i + 1})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-200/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-widest">
                    {tag}
                  </span>
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <img
                    src="/assets/icons/magic-star.svg"
                    alt=""
                    className="size-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="wrapper py-20 flex flex-col gap-12">
        <div className="flex flex-col gap-3 items-center text-center">
          <span className="text-primary-100 text-sm font-semibold uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="p-40-semibold text-dark-100 max-w-lg">
            Your dream trip in 3 simple steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gray-200 z-0" />

          {[
            {
              step: "01",
              title: "Pick Your Destination",
              desc: "Choose from 190+ countries on our interactive world map.",
              icon: "/assets/icons/location-mark.svg",
            },
            {
              step: "02",
              title: "Set Your Preferences",
              desc: "Budget, travel style, interests, group type — customize everything.",
              icon: "/assets/icons/calendar.svg",
            },
            {
              step: "03",
              title: "Get Your Itinerary",
              desc: "AI generates a complete day-by-day plan with photos instantly.",
              icon: "/assets/icons/magic-star.svg",
            },
          ].map(({ step, title, desc, icon }) => (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center text-center gap-4"
            >
              <div className="size-20 rounded-full bg-primary-50 flex items-center justify-center shadow-100">
                <img src={icon} alt={title} className="size-8" />
              </div>
              <span className="text-xs font-bold text-primary-100 tracking-widest">
                STEP {step}
              </span>
              <h3 className="text-lg font-semibold text-dark-100">{title}</h3>
              <p className="text-sm text-gray-100 leading-relaxed max-w-[220px]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="wrapper pb-20">
        <div className="bg-primary-100 rounded-[24px] px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-8 right-24 size-32 rounded-full bg-white/10 pointer-events-none" />

          <div className="flex flex-col gap-3 max-w-lg relative z-10">
            <h2 className="p-30-bold text-white">
              Ready to plan your next adventure?
            </h2>
            <p className="text-white/80 text-base font-normal">
              Join thousands of travelers who plan smarter with Tourvisto.
            </p>
          </div>
          <button
            onClick={() => navigate("/trips/create")}
            className="relative z-10 bg-white !rounded-xl px-8 h-12 p-18-semibold text-primary-100 hover:scale-[1.02] transition-transform shadow-200 whitespace-nowrap flex items-center gap-2"
          >
            <img src="/assets/icons/magic-star.svg" alt="" className="size-5" />
            Start Planning Free
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 py-8">
        <div className="wrapper footer-container">
          <a href="/" className="flex items-center gap-2">
            <img src="/assets/icons/logo.svg" alt="logo" className="size-7" />
            <h1 className="text-base font-bold text-dark-100">Tourvisto</h1>
          </a>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-100 hover:text-dark-100 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/trips")}
              className="text-sm text-gray-100 hover:text-dark-100 transition-colors"
            >
              Trips
            </button>
            <button
              onClick={() => navigate("/trips/create")}
              className="text-sm text-gray-100 hover:text-dark-100 transition-colors"
            >
              Create Trip
            </button>
          </div>
          <p className="text-xs text-gray-100">
            © {new Date().getFullYear()} Tourvisto. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
