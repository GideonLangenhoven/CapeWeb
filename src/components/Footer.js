import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Star,
  Heart
} from 'lucide-react';
import '../styles/Footer2.css';
import SplitRevealLogo from './SplitRevealLogo';

const LATEST_NEWS = [
  {
    id: 1,
    title: 'The all-powerful Pointing has no control about',
    date: 'Oct 16, 2025',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 2,
    title: 'Even the all-powerful Pointing has no control',
    date: 'Oct 18, 2025',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

const BEST_SELLER = {
  title: 'Grilled Beef with potatoes',
  rating: 5,
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600&h=400'
};

const SectionTitle = ({ children }) => (
  <h3 className="footer2__title">{children}</h3>
);

const SocialIcon = ({ Icon, href = '#' }) => (
  <a className="footer2__social" href={href}>
    <Icon size={18} />
  </a>
);

const FooterInput = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFgbHHM63wG-WrNwFrwzzLoj0kv6r7MD9RHPDFhTAVeS-8Y2UopbSVrzacie8GuZARg/exec';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: 'Subscriber',
          guideType: 'footer-subscribe'
        }),
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="footer2__input">
      <input
        type="email"
        placeholder={status === 'success' ? 'Subscribed!' : "Enter email address"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'success'}
      />
      <button type="button" aria-label="Subscribe" onClick={handleSubscribe} disabled={status === 'submitting' || status === 'success'}>
        <Send size={16} />
      </button>
    </div>
  );
};

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFakeInsta = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockData = Array(6)
        .fill(null)
        .map((_, i) => ({
          id: i,
          url: `https://images.unsplash.com/photo-${1515000000000 + i * 100000}?auto=format&fit=crop&q=80&w=300&h=300`,
          link: '#'
        }));
      setPosts(mockData);
      setLoading(false);
    };

    fetchFakeInsta();
  }, []);

  if (loading) {
    return (
      <div className="footer2__insta footer2__insta--loading">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="footer2__insta-skel" />
        ))}
      </div>
    );
  }

  return (
    <div className="footer2__insta">
      {posts.map((post) => (
        <a key={post.id} href={post.link} className="footer2__insta-tile">
          <img src={post.url} alt="Instagram Post" />
          <span className="footer2__insta-overlay" />
        </a>
      ))}
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="footer2">
      <div className="footer2__glow footer2__glow--one" />
      <div className="footer2__glow footer2__glow--two" />

      <div className="footer2__inner">
        <div className="footer2__top">
          <div className="footer2__brand-block">
            <SplitRevealLogo />
          </div>
          <div className="footer2__socials">
            <SocialIcon Icon={Twitter} />
            <SocialIcon Icon={Facebook} />
            <SocialIcon Icon={Instagram} />
            <SocialIcon Icon={Linkedin} />
          </div>
        </div>

        <div className="footer2__grid">
          <div className="footer2__col">
            <SectionTitle>Contact Info</SectionTitle>
            <ul className="footer2__list">
              <li className="footer2__list-item">
                <MapPin size={20} />
                <span>301 Long Street Cape Town</span>
              </li>
              <li className="footer2__list-item">
                <Phone size={20} />
                <span>0716145061</span>
              </li>
              <li className="footer2__list-item">
                <Mail size={20} />
                <span>info@capeweb.com</span>
              </li>
            </ul>
            <FooterInput />
          </div>

          <div className="footer2__col">
            <SectionTitle>Latest Resources</SectionTitle>
            <div className="footer2__news">
              <a href="/resources" className="footer2__news-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="footer2__news-thumb">
                  <img src="https://images.unsplash.com/photo-1611746347311-585aad8486a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="WhatsApp Automation" />
                </div>
                <div>
                  <h4>The WhatsApp Goldmine</h4>
                  <div className="footer2__news-meta">
                    <span>Automation</span>
                  </div>
                </div>
              </a>
              <a href="/resources" className="footer2__news-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="footer2__news-thumb">
                  <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Time Trap" />
                </div>
                <div>
                  <h4>The "Time-for-Money" Trap</h4>
                  <div className="footer2__news-meta">
                    <span>Strategy</span>
                  </div>
                </div>
              </a>
              <a href="/resources" className="footer2__news-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="footer2__news-thumb">
                  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="2026 Extinction" />
                </div>
                <div>
                  <h4>The 2026 Extinction Event</h4>
                  <div className="footer2__news-meta">
                    <span>Future Tech</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="footer2__col">
            <SectionTitle>Quick Links</SectionTitle>
            <ul className="footer2__list">
              <li className="footer2__list-item"><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a></li>
              <li className="footer2__list-item"><a href="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a></li>
              <li className="footer2__list-item"><a href="/work" style={{ color: 'inherit', textDecoration: 'none' }}>Work</a></li>
              <li className="footer2__list-item"><a href="/resources" style={{ color: 'inherit', textDecoration: 'none' }}>Resources</a></li>
              <li className="footer2__list-item"><a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer2__bottom">
          <p>Copyright © {new Date().getFullYear()} All rights reserved.</p>
          <div className="footer2__made">
            <span>This template is made with</span>
            <Heart size={14} className="footer2__heart" />
            <span>by</span>
            <a href="#" className="footer2__link footer2__link--inline">
              YourBrand
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
