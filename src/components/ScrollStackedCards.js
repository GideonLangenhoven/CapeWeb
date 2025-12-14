import React, { useMemo } from 'react';
import { useModal } from '../context/ModalContext';
import '../styles/ScrollStackedCards.css';

const servicesData = [
  {
    id: 1,
    slug: "shopify-speed-audit",
    title: "Performance First",
    accent: "98+ Lighthouse",
    description: "Shopify and web builds tuned for Core Web Vitals, instant loads, and conversion-first UX.",
    services: [
      {
        label: "Speed audits & fixes",
        detail: "We check under the hood of your website finding heavy files or messy code slowing things down. Then we fix them so your site loads instantly—keeping customers happy.",
        benefit: "If your site takes more than 3 seconds to load, 53% of mobile users leave. Speed isn't just nice to have; it's the difference between a sale and a bounce.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Core Web Vitals 98+",
        detail: "This is Google's official scorecard for your website's health. We optimize your site to score an A+ (98/100), proving to Google that your site is stable, fast, and user-friendly.",
        benefit: "Google ranks fast sites higher. A 98+ score is your VIP pass to better visibility and lower ad costs.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Edge caching & image optimization",
        detail: "We store copies of your website on servers all over the world (the 'Edge'). Whether a customer clicks from New York or London, your site loads instantly from a server nearby.",
        benefit: "Global speed means global sales. Plus, optimized images define a premium brand experience that builds trust.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Conversion-focused UX/UI",
        detail: "We design websites that clearly guide visitors to the 'Buy' button. No confusion, no clutter—just a smooth path from 'Investigate' to 'Checkout'.",
        benefit: "A pretty site is useless if it doesn't sell. Frictionless design directly increases your revenue per visitor.",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
      }
    ],
    color: "#fde047"
  },
  {
    id: 2,
    slug: "seo-2025-beyond-keywords",
    title: "SEO that Sticks",
    accent: "Structured & Fast",
    description: "Technical SEO plus fast pages and content systems so rankings hold and traffic compounds.",
    services: [
      {
        label: "Technical SEO & schema",
        detail: "Imagine your website is a library book. Technical SEO is the catalog system that helps the librarian (Google) find you instantly. 'Schema' is just a digital sticky note that tells Google, \"Hey, this is a recipe,\" or \"This is a product,\" so you show up with stars and prices in search results.",
        benefit: "Google can't rank what it can't understand. Clear data signals help you dominate the search results with rich snippets that attract more clicks.",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Content briefs & outlines",
        detail: "Writing without a plan is like building a house without blueprints. A content brief is your roadmap. It tells you exactly what questions your customers are asking, so every word you write solves a problem and helps you get found—no guessing required.",
        benefit: "Random blogging wastes money. Strategic content answers real user intent, building authority that lasts for years, not days.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Internal linking & sitemaps",
        detail: "Think of your website as a city. Internal links are the roads connecting your buildings (pages). A sitemap is the GPS that shows Google the whole map at once. Strong connections ensure nobody (and no search bot) ever gets lost on the way to your checkout page.",
        benefit: "A well-connected site keeps users browsing longer. This signals to Google that your content is valuable, boosting your overall rankings.",
        image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Local & international SEO",
        detail: "Want to be famous in your neighborhood or around the world? Local SEO puts you on the map when neighbors search 'near me.' International SEO translates your site's technical settings so customers in other countries feel right at home.",
        benefit: "You need to be visible where your customers are. Whether that's down the street or across the ocean, targeted SEO drives relevant foot traffic and clicks.",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
      }
    ],
    color: "#22d3ee"
  },
  {
    id: 3,
    slug: "ai-agents-sales-team",
    title: "Automation Built-In",
    accent: "Bookings & Follow-ups",
    description: "Automated assistants capture, qualify, and follow up across chat, email, and WhatsApp.",
    services: [
      {
        label: "AI chat + WhatsApp automations",
        detail: "Imagine a receptionist who never sleeps. We build AI assistants that answer questions, vet leads, and book appointments instantly—24/7/365.",
        benefit: "Modern customers expect instant answers. If you make them wait, they go to a competitor. Speed to lead effectively doubles your sales opportunities.",
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Lead routing & CRM sync",
        detail: "No more copy-pasting customer info. We connect your website forms directly to your sales database (CRM), organizing every lead automatically so your sales team knows exactly who to call.",
        benefit: "Lost leads mean lost revenue. Automation ensures every potential customer is captured, tracked, and nurtured without manual error.",
        image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Booking flows & reminders",
        detail: "Let customers book time on your calendar without the 'email ping-pong.' Our system handles the scheduling and sends automatic reminders so people actually show up.",
        benefit: "Frictionless booking fills calendars. Automated reminders reduce no-shows by up to 40%, directly protecting your revenue.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Reply playbooks & SOPs",
        detail: "We script the perfect responses for common questions. Your team gets a 'cheat sheet' to reply faster and more consistently, keeping your brand voice professional.",
        benefit: "Consistency builds trust. When every team member sounds like your best salesperson, your close rates go up.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
      }
    ],
    color: "#f472b6"
  },
  {
    id: 4,
    slug: "future-digital-branding",
    title: "Content that Converts",
    accent: "StoryBrand Ready",
    description: "Narratives, design, and landing pages that explain value clearly and move people to act.",
    services: [
      {
        label: "StoryBrand messaging",
        detail: "Most websites ramble. We clarify your message using the StoryBrand framework: Your Customer is the Hero, You are the Guide, and you have a Plan to help them win.",
        benefit: "Confusion is the enemy of conversion. When customers clearly understand how you solve their problem, they buy.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Landing pages & funnels",
        detail: "We build dedicated pages for your ads that do one thing: sell. No distractions, just a compelling offer and a clear path to purchase.",
        benefit: "Sending traffic to a homepage is wasteful. Targeted landing pages align with ad intent, converting clicks into customers at a much higher rate.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Design systems & brand kits",
        detail: "We create a 'LEGO kit' for your brand—fonts, colors, and buttons that always match. This keeps your look consistent whether it's an Instagram post or a billboard.",
        benefit: "A consistent brand looks professional and trustworthy. It also speeds up production, letting you launch new campaigns in minutes, not days.",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Video/visual asset direction",
        detail: "We help you choose visuals that support your story, not just decorate the page. From product shots to explainer videos, we ensure every pixel sells.",
        benefit: "Humans process visuals 60,000x faster than text. High-quality visual assets hook attention immediately in a distracted world.",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80"
      }
    ],
    color: "#fb923c"
  },
  {
    id: 5,
    slug: "roi-custom-web-dev",
    title: "Care Plans that Care",
    accent: "Ship • Learn • Improve",
    description: "Ongoing iterations, testing, and reporting to keep performance and growth compounding.",
    services: [
      {
        label: "Monthly CRO & UX tweaks",
        detail: "Websites aren't 'set and forget.' We make small, smart changes every month—like moving a button or simplifying a form—to squeeze more sales from your existing traffic.",
        benefit: "Incremental improvements compound over time. A 1% improvement every week doubles your results in a year.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "A/B testing & analytics",
        detail: "We stop guessing and start proving. We show version A to half your visitors and version B to the other half to see which one makes more money.",
        benefit: "Data beats opinion. Testing ensures you only invest budget in layout and copy changes that are proven to generate revenue.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Roadmap & release management",
        detail: "We plan your website's future like a software product. Organized updates means you always know what feature or fix is coming next, without the chaos.",
        benefit: " predictable growth avoids panic. A clear roadmap keeps your digital presence evolving ahead of competitors.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
      },
      {
        label: "Performance monitoring",
        detail: "We install digital 'security cameras' that watch your site 24/7. If speed drops or a page breaks, we know (and fix it) before your customers even notice.",
        benefit: "Downtime costs money and trust. Proactive monitoring ensures your digital storefront is always open and ready for business.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
      }
    ],
    color: "#4ade80"
  }
];

export default function ScrollStackedCards({ selectedService }) {
  const { openModal } = useModal();
  const stripeColors = useMemo(() => servicesData.map(s => s.color), []);

  // Calculate enough scrollable area so all sticky cards can stack without disappearing
  const containerMinHeight = useMemo(() => {
    const cardHeight = 60; // vh
    const offsetStep = 5; // vh
    const buffer = 20; // vh
    return `calc(${cardHeight}vh + ${(servicesData.length - 1) * offsetStep}vh + ${buffer}vh)`;
  }, []);

  const openServiceModal = (card, service) => {
    openModal(
      <div className="service-modal">
        {service.image && (
          <div className="service-modal__image-wrapper">
            <img
              src={service.image}
              alt={service.label}
              className="service-modal__image"
              loading="lazy"
            />
          </div>
        )}
        <div className="service-modal__eyebrow">{card.title}</div>
        <h3>{service.label}</h3>
        <p>{service.detail}</p>

        {service.benefit && (
          <div className="service-modal__benefit">
            <h4>Why it matters</h4>
            <p>{service.benefit}</p>
          </div>
        )}
      </div>,
      { size: 'medium' }
    );
  };

  return (
    <>
      {/* Color Stripes at the top */}
      <div className="stacked-stripes">
        {stripeColors.map((color, i) => (
          <div key={i} style={{ backgroundColor: color }}></div>
        ))}
      </div>

      {/* Stacked Cards Container */}
      <div
        className="stacked-sections-container"
        style={{
          minHeight: containerMinHeight
        }}
      >
        {servicesData.map((card, index) => {
          const topOffset = index * 5; // vh
          return (
            <div
              key={card.id}
              id={`service-${card.slug}`}
              className={`stacked-section-card ${selectedService === card.slug ? 'is-target' : ''}`}
              style={{
                top: `${topOffset}vh`,
                backgroundColor: card.color,
                zIndex: index + 1
              }}
            >
              <div className="stacked-card-content">
                <div className="card-header">
                  <h2>{card.title}</h2>
                  <span className="card-accent">{card.accent}</span>
                  <a href="/contact" className="card-cta">
                    Let&apos;s Talk <span className="arrow">→</span>
                  </a>
                </div>

                <div className="card-body">
                  <div className="card-description">
                    <p>{card.description}</p>
                  </div>

                  <div className="card-services-list">
                    {card.services.map((service, i) => (
                      <button
                        key={service.label}
                        type="button"
                        className="service-item"
                        onClick={() => openServiceModal(card, service)}
                        aria-label={`Why ${service.label} matters`}
                      >
                        {service.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
