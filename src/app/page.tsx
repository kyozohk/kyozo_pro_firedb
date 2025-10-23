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
  PricingSection,
  FixedFooter
} from "@/components/landing";

export default function Home() {
  return (
    <div className="w-full">
      <Hero text="Discover Your Creative Universe" />
      <BackgroundImages />
      <FeatureCard />
      <div className="my-80 w-full bg-white dark:bg-background">
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
              { text: 'House' },
              { text: 'Electronic' },
              { text: 'Flamenco' },
              { text: 'Funk' },
              { text: 'Jazz' },
              { text: 'Classical' },
            ]
          },
          {
            category: 'classicism',
            items: [
              { text: 'Surrealism' },
              { text: 'Abstract' },
              { text: 'Pop Art' },
              { text: 'Bauhaus' },
              { text: 'Expressionism' },
              { text: 'Futurism' },
            ]
          },
          {
            category: 'jewelry',
            items: [
              { text: 'Drawing' },
              { text: 'Pottery' },
              { text: 'Sculpting' },
              { text: 'Painting' },
              { text: 'Jewelry' },
              { text: 'Weaving' },
            ]
          },
          {
            category: 'vintage',
            items: [
              { text: 'Haute Couture' },
              { text: 'Goth' },
              { text: 'Sportswear' },
              { text: 'Chic' },
              { text: 'Vintage' },
              { text: 'Streetwear' },
            ]
          },
          {
            category: 'minimal',
            items: [
              { text: 'Opera' },
              { text: 'Dance' },
              { text: 'Theatre' },
              { text: 'Slam Poetry' },
              { text: 'Improv' },
              { text: 'Stand-up' },
            ]
          }
        ]}
      />
     
      <BottomText text="Join the Kyozo creative universe" fontSize="6rem" fontWeight={700} />
      <FixedFooter />
    </div>
  );
}
