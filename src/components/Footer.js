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

const FooterInput = () => (
  <div className="footer2__input">
    <input type="email" placeholder="Enter email address" />
    <button type="button" aria-label="Subscribe">
      <Send size={16} />
    </button>
  </div>
);

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
            <h2 className="footer2__brand">
              Brand<span className="footer2__brand-dot">.</span>
            </h2>
            <p className="footer2__lede">
              Elevating digital experiences with bold aesthetics and seamless functionality.
            </p>
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
                <span>203 Fake St. Mountain View, San Francisco, California, USA</span>
              </li>
              <li className="footer2__list-item">
                <Phone size={20} />
                <span>+2 392 3929 210</span>
              </li>
              <li className="footer2__list-item">
                <Mail size={20} />
                <span>info@yourdomain.com</span>
              </li>
            </ul>
            <FooterInput />
          </div>

          <div className="footer2__col">
            <SectionTitle>Latest News</SectionTitle>
            <div className="footer2__news">
              {LATEST_NEWS.map((news) => (
                <div key={news.id} className="footer2__news-item">
                  <div className="footer2__news-thumb">
                    <img src={news.image} alt="News thumb" />
                  </div>
                  <div>
                    <h4>{news.title}</h4>
                    <div className="footer2__news-meta">
                      <span>{news.date}</span>
                      <span className="footer2__dot">•</span>
                      <span>{news.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="footer2__col">
            <SectionTitle>Best Sellers</SectionTitle>
            <div className="footer2__card">
              <div className="footer2__card-media">
                <img src={BEST_SELLER.image} alt={BEST_SELLER.title} />
                <div className="footer2__card-badge">Top Rated</div>
              </div>
              <h4 className="footer2__card-title">{BEST_SELLER.title}</h4>
              <div className="footer2__stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < BEST_SELLER.rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="footer2__col">
            <div className="footer2__insta-head">
              <SectionTitle>Instagram</SectionTitle>
              <a href="#" className="footer2__link">
                Follow Us
              </a>
            </div>
            <InstagramFeed />
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
