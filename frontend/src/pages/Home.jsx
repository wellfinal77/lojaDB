import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const featured = [
  {
    title: 'Summer Collection',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    description: 'Light, breezy, and stylish. Shop the latest summer trends.',
    link: '/products?category=Summer Collection'
  },
  {
    title: "Men's Fashion",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    description: 'Classic and modern looks for every man.',
    link: '/products?category=Men\'s Fashion'
  },
  {
    title: "Women's Fashion",
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    description: 'Elegant, bold, and beautiful styles for every woman.',
    link: '/products?category=Women\'s Fashion'
  }
];

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-animated"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Fashion Store</h1>
          <p className="subtitle">Shop the latest trends in clothing</p>
          <p className="description">
            Discover our curated collection of stylish clothes for every occasion.
            Quality, comfort, and fashion delivered to your door.
          </p>
          <div className="cta-buttons">
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
            <Link to="/cart" className="btn btn-secondary">View Cart</Link>
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="featured-section">
        <h2 className="featured-title">Featured Collections</h2>
        <div className="featured-grid">
          {featured.map((item, idx) => (
            <div className="featured-card" key={idx}>
              <img src={item.image} alt={item.title} className="featured-image" />
              <div className="featured-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={item.link} className="btn btn-featured">
                  Shop {item.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Decorative Wave + Logo */}
      <div className="home-wave">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '80px', display: 'block' }}
        >
          <path d="M0,0 C300,100 900,0 1200,100 L1200,120 L0,120 Z" fill="#f3f4f6" />
        </svg>
        <div className="home-logo-area">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
            alt="Fashion Model"
            className="home-model-photo"
          />
          <svg
            className="home-logo"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="36" fill="url(#logoGradient)" />
            <text
              x="50%"
              y="54%"
              textAnchor="middle"
              fontSize="32"
              fontWeight="bold"
              fill="#fff"
              fontFamily="Inter, sans-serif"
            >
              FS
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;
