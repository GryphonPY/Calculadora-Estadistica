
import React from 'react';

// Custom Sigma Icon (uppercase Greek letter Sigma often used for Summation)
// or can be more abstract to represent RV analysis
export const SigmaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 16.5V4.494m-11.105 0A16.11 16.11 0 015.57 12.149M11.506 4.494c.237-.083.481-.15.732-.198M5.57 12.149v1.427c0 .346.166.669.448.866l5.013 2.949c.34.2.77.2 1.11 0l5.013-2.949a1.031 1.031 0 00.448-.866V12.149m-5.013-.309C12.961 11.59 14.62 10.13 15.803 8.433M11.506 4.494 5.57 12.149" />
    {/* Fallback / simpler sigma-like symbol if the above is too complex */}
    {/* <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15M4.5 6.75l7.5 10.5l7.5-10.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 17.25h15" /> */}
  </svg>
);
