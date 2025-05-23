
import React from 'react';

// Custom icon representing a list or table, perhaps with a small 'P(x)' hint
export const TableListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75A2.25 2.25 0 016 4.5h12A2.25 2.25 0 0120.25 6.75v10.5A2.25 2.25 0 0118 19.5H6A2.25 2.25 0 013.75 17.25V6.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15" />
  </svg>
);
