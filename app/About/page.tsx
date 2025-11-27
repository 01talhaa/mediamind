// app/about/page.tsx
import React from "react";

export default function AboutPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MediaMind",
    url: "https://mediamind.com",
    logo: "https://mediamind.com/logo.png",
    description:
      "MediaMind is a leading social media growth agency offering Instagram followers, Facebook likes, YouTube views, TikTok engagement, and complete social media management services worldwide.",
    sameAs: [
      "https://www.instagram.com/mediamind",
      "https://www.linkedin.com/company/mediamind",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-555-555-5555",
        contactType: "customer service",
      },
    ],
    areaServed: [
      { "@type": "Place", name: "Miami" },
      { "@type": "Place", name: "Los Angeles" },
      { "@type": "Place", name: "New York" },
      { "@type": "Place", name: "Canada" },
      { "@type": "Place", name: "United Kingdom" },
    ],
  };

  return (
    <>
      {/* SEO Schema for Google + LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0F1113] to-[#08090A] text-[#F4F7F5] py-20 px-6 md:px-12 lg:px-20 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          About <span className="text-[#008CE2]">Media</span><span className="text-[#F4F7F5]">Mind</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#F4F7F5]/80">
          Your trusted partner for authentic social media growth and engagement across all platforms.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-[#08090A] text-[#F4F7F5] px-6 md:px-12 lg:px-20 animate-fade-in-up">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Instagram Growth",
              desc: "Authentic followers, likes, and engagement from real, active users.",
            },
            {
              title: "YouTube Optimization",
              desc: "Boost views, subscribers, and watch time with proven strategies.",
            },
            {
              title: "TikTok Virality",
              desc: "Get on the For You page and grow your TikTok presence exponentially.",
            },
            {
              title: "Global Reach",
              desc: "Serving influencers and brands worldwide with authentic social growth.",
            },
            {
              title: "24/7 Support",
              desc: "Round-the-clock customer support to help you succeed.",
            },
            {
              title: "Safe & Secure",
              desc: "100% safe methods that comply with all platform guidelines.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-[#0F1113]/80 border border-[#1F2329] p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transform transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#008CE2]">{feature.title}</h3>
              <p className="text-[#F4F7F5]/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#0F1113] to-[#08090A] text-center text-[#F4F7F5] px-6 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Grow Your Social Media?
        </h2>
        <p className="text-lg text-[#F4F7F5]/80 mb-8">
          Let MediaMind help you reach millions and build an engaged audience.
        </p>
        <a
          href="/contact"
          className="bg-[#008CE2] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#06B9D0] hover:scale-105 shadow-lg transition-all duration-300 inline-block"
        >
          Get in Touch
        </a>
      </section>
    </>
  );
}
