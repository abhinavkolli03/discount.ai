import React from 'react';
import { Link } from 'react-router-dom';

const EcommerceCards = () => {
    const plans = [
        { type: 'Free', price: '$0', duration: 'Forever' },
        { type: 'Yearly', price: '$9.99', duration: 'per year' },
        { type: 'Lifetime', price: '$29.99', duration: 'one-time fee' },
    ];

    return (
        <div className="m-auto max-w-6xl p-2 md:p-12 h-5/6" id='pricing'>
            <div className="flex flex-col lg:flex-row py-8 justify-between">
                {plans.map((plan, index) => (
                    <div key={index} className="flex flex-col border bg-blue-200 rounded-lg p-4 w-full lg:w-1/3 m-4" data-aos="fade-up">
                        <h2 className="text-xl lg:text-2xl font-bold text-blue-900 mb-4">{plan.type}</h2>
                        <div className="text-2xl lg:text-3xl mb-4">{plan.price}</div>
                        <div className="text-gray-600 mb-4">{plan.duration}</div>
                        <Link to="/checkout" className="text-white bg-blue-900 hover:bg-blue-800 inline-flex items-center justify-center w-full px-6 py-2 text-lg shadow-xl rounded-2xl sm:w-auto sm:mb-0 group">
                            Choose Plan
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EcommerceCards;
