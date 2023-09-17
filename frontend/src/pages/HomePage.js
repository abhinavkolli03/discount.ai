import React from 'react';
import Hero from '../components/Hero';
import Intro from '../components/Intro';
import Services from '../components/Services';
import Cta from '../components/Cta';
import EcommerceCards from '../components/EcommerceCards';

function HomePage() {
    return (
        <div>
            <Hero />
            <Intro />
            <Services />
            <Cta />
            <EcommerceCards />
        </div>
    );
  }
  
  export default HomePage;
  