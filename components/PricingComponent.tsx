"use client";

import { motion } from "motion/react";
import React, { useState } from "react";

const PriceDemoUI = () => {

  return (
    <motion.div
      className="mx-auto max-w-screen px-4 py-12 lg:px-6 lg:py-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black">Less than the cost of rejection therapy</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Pricing Card 1 */}
        <div className="bg-white text-gray-900 border-2 border-black shadow-[8px_8px_0_black] rounded-3xl p-6 xl:p-8 flex flex-col space-y-8">
          <h3 className="text-lg font-normal text-black">Free</h3>
          <div className="relative flex items-baseline justify-center">
            <span className="text-5xl font-extrabold">$0</span>
            <span className="ml-2 text-gray-600">/month</span>
            
          </div>
          <p className="text-sm font-light text-gray-600">
            The <span className="bg-blue-100 font-bold text-blue-600 px-1 rounded">Free</span> plan gets you ready. The others get you hired.
          </p>
          <a className="bg-gray-900 text-white text-sm font-semibold text-center p-3 w-full rounded-md shadow-sm cursor-pointer hover:-translate-y-1 transition">
            Go to dashboard
          </a>
          <ul className="text-sm text-left text-gray-600 space-y-4">
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>10,000 visitors</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>Unlimited widgets</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>All analytics features</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>Priority support</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>Lifetime updates</span>
            </li>
          </ul>
        </div>

        {/* Pricing Card 2 */}
        <div className="bg-[#D8FA6D] text-gray-900 rounded-3xl border-2 border-black shadow-[8px_8px_0_black] p-6 xl:p-8 flex flex-col space-y-8">
          <h3 className="text-lg font-normal text-black"><span className="bg-black font-bold text-[#D8FA6D] px-1 rounded">Recommended</span></h3>
          <div className="flex relative flex-col sm:flex-row items-center justify-center text-center sm:text-left">
            <span className="text-3xl sm:text-5xl font-extrabold mr-2">$20</span>
            <span className="text-gray-600">/month</span>
            <div className="absolute top-0 right-0">
              <div className="relative">
                <span
                  className="cursor-pointer text-gray-600"
                  
                >
                  USD
                </span>
                
              </div>
            </div>
          </div>
          <p className="text-sm font-light text-gray-600">
            The sweet spot between <span className="bg-white font-bold text-black px-1 rounded">just enough</span> and <span className="bg-white font-bold text-black px-1 rounded">way too much</span>.
          </p>
          <a className="bg-gray-900 text-white text-sm font-semibold text-center p-3 w-full rounded-md shadow-sm cursor-pointer hover:-translate-y-1 transition">
            Get started
          </a>
          <ul className="text-sm text-left text-gray-600 space-y-4">
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>10,000 visitors</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>Unlimited widgets</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>All analytics features</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>Priority support</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon /> <span>Lifetime updates</span>
            </li>
          </ul>
        </div>

        {/* Pricing Card 3 */}
        <div className="bg-[#ff0651da] text-gray-900 rounded-3xl p-6 xl:p-8 border-2 border-black shadow-[8px_8px_0_black] flex flex-col space-y-8">
          <h3 className="text-lg font-normal text-white">Supporter</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left relative">
            <span className="text-3xl sm:text-5xl font-extrabold mr-2 text-white">$59</span>
            <span className=" text-white">/month</span>
            <div className="absolute top-0 right-0">
              <div className="relative">
                <span
                  className="cursor-pointer text-white"
                  
                >
                  USD
                </span>
                
              </div>
            </div>
          </div>
          <p className="text-sm font-light text-white">
            Only upgrade if you <span className="bg-white font-bold text-red-500 px-1 rounded">love</span> us more than your money.
          </p>
          <a className="text-gray-900 bg-white text-sm font-semibold text-center p-3 w-full rounded-md shadow-sm cursor-pointer hover:-translate-y-1 transition">
            Get started
          </a>
          <ul className="text-sm text-left text-white space-y-4">
            <li className="flex items-center space-x-3">
              <CheckIcon2 /> <span>10,000 visitors</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon2 /> <span>Unlimited widgets</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon2 /> <span>All analytics features</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon2 /> <span>Priority support</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckIcon2 /> <span>Lifetime updates</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const CheckIcon = () => (
  <svg
    className="h-5 w-5 bg-gray-900 text-white p-0.5 rounded-full"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon2 = () => (
    <svg
      className="h-5 w-5 text-gray-900 bg-white p-0.5 rounded-full"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const CheckIcon1 = () => (
    <svg
      className="h-5 w-5 text-white bg-blue-600 p-0.5 rounded-full"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

export default PriceDemoUI;