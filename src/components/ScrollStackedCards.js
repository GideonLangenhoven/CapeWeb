
import React, { useRef, useMemo } from 'react';
import '../styles/ScrollStackedCards.css';

const servicesData = [
  {
    id: 1,
    title: "Web Development",
    color: "#3B82F6",
    description: "We build fast, responsive, and scalable websites that drive results. From custom web applications to e-commerce platforms, our development team delivers clean code and seamless user experiences.",
    services: ["Custom Websites", "E-commerce Solutions", "Web Applications", "CMS Development", "API Integration", "Performance Optimization"]
  },
  {
    id: 2,
    title: "AI Automation",
    color: "#EC4899",
    description: "Harness the power of artificial intelligence to streamline your business operations. We implement smart automation solutions that save time, reduce costs, and enhance customer experiences.",
    services: ["Chatbot Development", "Process Automation", "AI Integration", "Machine Learning Solutions", "Predictive Analytics", "Custom AI Tools"]
  },
  {
    id: 3,
    title: "Social Media",
    color: "#22C55E",
    description: "Amplify your brand's voice across all social platforms. Our strategic approach to social media management helps you connect with your audience, build community, and drive engagement.",
    services: ["Content Strategy", "Community Management", "Paid Advertising", "Influencer Marketing", "Analytics & Reporting", "Brand Development"]
  },
  {
    id: 4,
    title: "Email Marketing",
    color: "#F97316",
    description: "Focused on high-impact email campaigns, we manage everything from strategy and content creation to monitoring and reporting. Using MailerLite, our custom newsletters are crafted to engage, convert, and build lasting relationships with your audience.",
    services: ["Campaign Strategy", "List Management", "Segmentation", "Content Creation", "Performance Analytics", "A/B Testing"]
  },
  {
    id: 5,
    title: "Film & Photography",
    color: "#8B5CF6",
    description: "We create high-impact visual content, producing videos and photos that strengthen your brand's presence. Our full-service approach includes strategy, concept development, filming, photography, sound engineering, VFX, and special effects, delivering content that captivates and converts.",
    services: ["Product Photography", "Video Production", "Drone Footage", "Animation & VFX", "Sound Engineering", "Post-Production", "Storyboarding & Concept Development"]
  }
];

export default function ScrollStackedCards() {
  const containerRef = useRef(null);

  // Calculate enough scrollable area so all sticky cards can stack without disappearing
  const containerMinHeight = useMemo(() => {
    const cardHeight = 84; // vh
    const offsetStep = 5; // vh
    const buffer = 40; // vh - keeps last card visible and provides scroll space
    return `calc(${cardHeight}vh + ${(servicesData.length - 1) * offsetStep}vh + ${buffer}vh)`;
  }, []);

  return (
    <>
      <div className="stacked-stripes">
        <div className="stripe-yellow" />
        <div className="stripe-cyan" />
        <div className="stripe-pink" />
        <div className="stripe-orange" />
        <div className="stripe-green" />
      </div>

      <div
        ref={containerRef}
        id="stacked-cards-container"
        className="stacked-sections-container"
        style={{
          minHeight: containerMinHeight,
          transform: 'none', // avoid transformed ancestor breaking sticky
        }}
      >
        {servicesData.map((card, index) => {
          const topOffset = `${index * 5}vh`; // 0, 5vh, 10vh...

          return (
            <div
              key={card.id}
              className="stacked-section-card"
              style={{
                backgroundColor: card.color,
                top: topOffset,
                zIndex: index + 1,
              }}
            >
              <div className="stacked-card-content">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
