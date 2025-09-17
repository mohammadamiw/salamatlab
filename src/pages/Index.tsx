import React from 'react';
import Header from '@/components/Header';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import QuickAccess from '@/components/QuickAccess';
import Services from '@/components/Services';
import Articles from '@/components/Articles';
import CityDoctors from '@/components/CityDoctors';
import PartnerOrganizations from '@/components/PartnerOrganizations';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';
import FloatingActionButton from '@/components/FloatingActionButton';
import InstagramBubble from '@/components/InstagramBubble';
import WaveDivider from '@/components/WaveDivider';
import EnhancedReveal from '@/components/EnhancedReveal';
import StaggeredReveal from '@/components/StaggeredReveal';
import PageLoadAnimation from '@/components/PageLoadAnimation';
import HeroShowcase from '@/components/HeroShowcase';

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    console.log('Attempting to scroll to:', sectionId);
    const element = document.getElementById(sectionId);
    console.log('Found element:', element);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      console.error('Element not found with id:', sectionId);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <CanonicalTag path="/" />
      <MetaTags
        title="آزمایشگاه تشخیص پزشکی سلامت | بهترین پزشکان شهرقدس | آزمایش آنلاین"
        description="آزمایشگاه تشخیص پزشکی سلامت - بهترین پزشکان متخصص در شهرقدس. خدمات آزمایشگاهی، نمونه‌گیری در منزل، نوبت آنلاین پزشکان اورولوژی، ارتوپدی، زنان و زایمان"
        keywords="آزمایشگاه سلامت, پزشک شهرقدس, آزمایش خون, نمونه‌گیری در منزل, پزشک اورولوژی شهرقدس, پزشک ارتوپدی قدس, آزمایشگاه تشخیص پزشکی, نوبت آنلاین پزشک"
        ogImage="https://www.salamatlab.com/salamatlab-homepage-preview.jpg"
        path="/"
      />
      <LocalBusinessSchema />
      <Header />
      
      {/* Hero Section with page load animation */}
      <PageLoadAnimation delay={100}>
        <HeroShowcase onScrollToServices={() => scrollToSection('services')} />
      </PageLoadAnimation>
      
      <div className="hidden md:block"><WaveDivider /></div>
      
      {/* Quick Access Section */}
      <div className="py-10 md:py-16 bg-muted/40">
        <EnhancedReveal direction="up" delay={200}>
          <QuickAccess />
        </EnhancedReveal>
      </div>
      <div className="hidden md:block"><WaveDivider className="text-muted" /></div>
      
      {/* Services Section */}
      <div id="services" className="py-10 md:py-16 bg-accent/20">
        <EnhancedReveal direction="scale" delay={300}>
          <Services />
        </EnhancedReveal>
      </div>
      <div className="hidden md:block"><WaveDivider className="text-accent" /></div>
      
      {/* Articles Section */}
      <div id="articles" className="py-10 md:py-16 bg-secondary/40">
        <EnhancedReveal direction="left" delay={400}>
          <Articles />
        </EnhancedReveal>
      </div>
      <div className="hidden md:block"><WaveDivider className="text-muted" /></div>
      
      {/* City Doctors Section */}
      <div className="py-10 md:py-16 bg-accent/20">
        <EnhancedReveal direction="right" delay={500}>
          <CityDoctors />
        </EnhancedReveal>
      </div>
      <div className="hidden md:block"><WaveDivider className="text-accent" /></div>
      
      {/* Partner Organizations Section */}
      <div id="partners" className="py-10 md:py-16 bg-card">
        <EnhancedReveal direction="up" delay={600}>
          <PartnerOrganizations />
        </EnhancedReveal>
      </div>
      <div className="hidden md:block"><WaveDivider className="text-muted" /></div>
      
      {/* Reviews Section */}
      <div className="py-10 md:py-16 bg-muted/50">
        <EnhancedReveal direction="fade" delay={700}>
          <Reviews />
        </EnhancedReveal>
      </div>
      <WaveDivider className="text-muted" />
      
      <Footer />
      <FloatingActionButton />
      <InstagramBubble handle="salamatlab" profileUrl="https://www.instagram.com/salamatlab" />
    </div>
  );
};

export default Index;