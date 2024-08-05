import React from 'react';
import Hero from '../components/Hero';
import Intro from '../components/Intro';
import Services from '../components/Services';
import Cta from '../components/Cta';
import DCFExplanation from '../components/DCFExplanation';

function HomePage() {
  return (
    <div className="bg-neutral-950">
      <Hero />
      <Intro />
      <DCFExplanation />
      <Services />
      <Cta />
    </div>
  );
}

export default HomePage;
