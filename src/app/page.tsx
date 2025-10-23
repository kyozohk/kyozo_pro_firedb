'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Hero, 
  BackgroundImages, 
  SlidingCards, 
  FeatureCard, 
  ScrollRevealText, 
  SlidingCard, 
  ParallaxGallery, 
  VideoWall, 
  Toolkit, 
  Marquee, 
  BubbleMarquee, 
  BottomText, 
  PricingSection
} from "@/components/landing";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="container">
      <ThemeToggle />
      <Hero text="Discover Your Creative Universe" />
      <BackgroundImages />
      <FeatureCard />
      <div className="my-80 bg-white dark:bg-background" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
        <ScrollRevealText text="Where creative minds converge" />      
      </div>
      <SlidingCards>
        <SlidingCard
          subtitle="INSIDER ACCESS"
          title="Exclusive access and insights"
          text="Experience the creative world through an insider's lens. Kyozo is an eco-system of creative communities - that gives you exclusive access to updates and insights from the creative luminaries driving cultural evolution."
          button={<Button variant="outline-only" size="medium" href="#">Join the waitlist</Button>}
          content={<VideoWall />}
          backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <SlidingCard
          subtitle="COMMUNITY ACCESS"
          title="Engage with visionary communities"
          text="Join and interact with diverse communities, from niche artistic circles to industry-leading collectives. Engage with passionate individuals who share your creative interests."
          button={<Button variant="outline-only" size="medium" href="#">Join the waitlist</Button>}
          content={<ParallaxGallery />}
          backgroundColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        />
        <SlidingCard
          subtitle="CREATOR TOOLS"
          title="Grow your creative community"
          text="Are you a creative professional, community organizer, or small business owner working within the creative industries? We understand the challenges of nurturing and growing a dedicated audience, so we built KyozoPro, a comprehensive platform that enhances genuine connections and unlocks new opportunities."
          button={<Button variant="outline-only" size="medium" href="#">Join the waitlist</Button>}
          content={<Image src="/card-3.png" alt="Phone" width={600} height={800} style={{objectFit: 'contain', maxHeight: '100%', maxWidth: '100%'}} />}
          backgroundColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        />        
      </SlidingCards>      
      <Toolkit />
      <Marquee 
          categories={[
            {
              category: 'music',
              items: [
                { text: 'Rediscovering your creative passion' },
                { text: 'Prompts to Turbocharge Your Creative Process' },
                { text: 'BPM heartrate and running' },
                { text: 'The creative paradox' },
                { text: 'Rediscovering your creative passion' },
              ]
            },           
          ]}
        />
      
      <PricingSection />      
       
      <BubbleMarquee 
        categories={[
          {
            category: 'music',
            items: [
              { text: 'Rock' },
              { text: 'Jazz' },
              { text: 'R&B' },
              { text: 'Trance' },
              { text: 'Techno' },
              { text: 'Hip Hop' },
              { text: 'Classical' },
            ]
          },
          {
            category: 'classicism',
            items: [
              { text: 'Expressionism' },
              { text: 'Futurism' },
              { text: 'Classicism' },
              { text: 'Cubism' },
              { text: 'Surrealism' },
              { text: 'Dadaism' },
            ]
          },
          {
            category: 'jewelry',
            items: [
              { text: 'Wood Burning' },
              { text: 'Candle-making' },
              { text: 'Crochet' },
              { text: 'Jewelry' },
              { text: 'Pottery' },
              { text: 'Weaving' },
            ]
          },
          {
            category: 'vintage',
            items: [
              { text: 'Chic' },
              { text: 'Grunge' },
              { text: 'Vintage' },
              { text: 'Boho' },
              { text: 'Preppy' },
              { text: 'Streetwear' },
            ]
          },
          {
            category: 'minimal',
            items: [
              { text: 'Stand-ups' },
              { text: 'Musical' },
              { text: 'Digital' },
              { text: 'Theatre' },
              { text: 'Dance' },
              { text: 'Opera' },
            ]
          }
        ]}
      />
     
      <BottomText text="Join the creative universe" fontSize="6rem" fontWeight={700} />
    </div>
  );
}
