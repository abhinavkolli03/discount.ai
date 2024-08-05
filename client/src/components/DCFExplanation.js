import React from 'react';
import { Link } from 'react-router-dom';
import img from '../media/dcfExample.png'; // Placeholder image
import img2 from '../media/dcfflow.png'; // Placeholder image

const DCFExplanation = () => {
  return (
    <div className="m-auto max-w-6xl p-2 md:p-12 bg-neutral-950" id='dcf'>
      <div className="flex flex-col lg:flex-row py-8 justify-center lg:text-center" data-aos="fade-up">
        <div className="lg:w-1/2 flex flex-col lg:mx-4 justify-center items-center">
          <h3 className="text-3xl text-sky-50 font-bold">What is a DCF?</h3>
          <img alt="DCF example" className="rounded my-4" src={img} />
        </div>
        <div className="flex-col my-4 text-left lg:text-left lg:my-0 lg:justify-center w-full lg:w-1/2 px-8" data-aos="zoom-in" data-aos-delay="500">
          <p className='my-3 text-xl text-sky-200 font-semibold'>
            A Discounted Cash Flow (DCF) analysis is a valuation method used to estimate the value of an investment based on its expected future cash flows. DCF analysis attempts to figure out the value of an investment today, based on projections of how much money it will generate in the future.
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row py-8 justify-center lg:text-left" data-aos="fade-up">
        <div className="lg:w-1/2 flex flex-col lg:mx-4 justify-center items-center">
          <h3 className="text-3xl text-sky-50 font-bold">Why Automate DCF Analysis?</h3>
          <img alt="Automated DCF example" className="rounded my-4" src={img2} />
        </div>
        <div className="flex-col my-4 text-left lg:text-left lg:my-0 lg:justify-center w-full lg:w-1/2 px-8" data-aos="zoom-in" data-aos-delay="500">
          <p className='my-3 text-xl text-sky-200 font-semibold'>
            Our automated DCFs provide a comprehensive template generated directly from live financial data, including macros that allow you to easily alter the numbers. This automation saves time and ensures accuracy, enabling you to focus on making informed investment decisions.
          </p>
          <p className='my-3 text-xl text-sky-200 font-semibold'>
            Additionally, you can analyze these DCFs with our LLM tools, which offer insightful evaluations, summarize critical data, and guide you through your analysis with clarity and precision.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DCFExplanation;
