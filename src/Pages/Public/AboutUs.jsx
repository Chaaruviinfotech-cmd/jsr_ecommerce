import React from 'react';
import { IoShieldCheckmarkOutline, IoHeartOutline, IoSparklesOutline } from 'react-icons/io5';
import { RiLeafLine, RiTruckLine, RiAwardLine } from 'react-icons/ri';

const AboutUs = () => {
  return (
    <div className="jsr-about-page">
      <div className="jsr-container">
        <div className="jsr-breadcrumb">Home &gt; About Us</div>

        <div className="jsr-about-hero">
          <div className="jsr-about-hero-icon-box">
            <RiLeafLine size={32} />
          </div>
          <h1 className="jsr-about-hero-title">
            About JSR Fruit &amp; Vegetable Company
          </h1>
          <p className="jsr-about-hero-subtitle">
            Cultivating wellness through pesticide-free, sustainably harvested fresh produce.
            From our dedicated farms in Bemetara to your dining table in Raipur and surrounding areas.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="jsr-about-cards-grid">
          <div className="jsr-about-card">
            <div className="jsr-about-icon">🌱</div>
            <h3 className="jsr-about-card-title">100% Farm Fresh</h3>
            <p className="jsr-about-card-desc">
              Harvested every single morning at sunrise to maintain maximum crunch, natural vitamins, and farm sweetness.
            </p>
          </div>

          <div className="jsr-about-card">
            <div className="jsr-about-icon">🧼</div>
            <h3 className="jsr-about-card-title">Hygienic Handling</h3>
            <p className="jsr-about-card-desc">
              Every vegetable, fruit, and oyster mushroom is sorted and sanitized in UV cleanrooms before eco-friendly packing.
            </p>
          </div>

          <div className="jsr-about-card">
            <div className="jsr-about-icon">🚚</div>
            <h3 className="jsr-about-card-title">Same-Day Express</h3>
            <p className="jsr-about-card-desc">
              Our cold-chain delivery fleet ensures farm-to-table arrival in under 3 hours across Chhattisgarh hubs.
            </p>
          </div>
        </div>

        {/* Our Story & Values */}
        <div className="jsr-about-story-section">
          <div className="jsr-story-card">
            <h2 className="jsr-story-title">Our Farming Philosophy</h2>
            <p className="jsr-story-text">
              JSR Fruit &amp; Vegetable Company was born out of a commitment to honest agriculture. We believe that everyone deserves direct access to clean, non-toxic food grown with sustainable soil practices. Our specialized oyster mushroom cultivation and open-field vegetables are nurtured without hazardous synthetic chemicals, preserving soil biology and delivering authentic flavor.
            </p>
            <div className="jsr-story-highlights">
              <div className="jsr-highlight-item">
                <RiAwardLine size={24} className="jsr-highlight-icon" />
                <div>
                  <strong>Certified Quality Standards</strong>
                  <p>Adhering to strict agricultural safety and cleanliness benchmarks.</p>
                </div>
              </div>
              <div className="jsr-highlight-item">
                <IoShieldCheckmarkOutline size={24} className="jsr-highlight-icon" />
                <div>
                  <strong>Direct From Local Farmers</strong>
                  <p>Fair pricing for growers and genuine value for every household.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
