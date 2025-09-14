
import React from 'react';

interface MonkeyIconProps extends React.SVGProps<SVGSVGElement> {
  isScreaming?: boolean;
}

export const MonkeyIcon: React.FC<MonkeyIconProps> = ({ isScreaming = false, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="Clickable monkey icon"
      {...props}
    >
      <g>
        {/* Head */}
        <path
          d="M78.5,86.2C68.9,94,56.7,97,46,95.6c-11.9-1.6-22.3-8.5-28.1-18.4C10.2,65.3,8.4,51.8,13.8,40.1 c5.2-11.3,16-19,28.2-20.5c12.2-1.5,24.4,4.2,31.4,14.6C82.4,46.5,84.6,60.8,78.5,86.2z"
          fill="#8c6d4e"
        />
        {/* Face */}
        <path
          d="M68,77.3c-7,6.8-16,9.8-25.2,8.2c-9.2-1.6-17.1-7.9-21.6-16.1c-5.8-10.6-6.8-23.3-2.6-34.5 c4-10.7,12.9-17.6,23.3-17.9c10.5-0.3,20.6,5.7,26.6,14.3C75,48.7,76.5,62.8,68,77.3z"
          fill="#f3d4a0"
        />
        {/* Ears */}
        <path
          d="M82,53.2c-1.2,10.9-10.4,22.2-22,23.7c-0.8,0.1-1.6,0.1-2.4,0.2c-3.1,1.1-6.4,1.8-9.7,1.9 c2,8.5,7.9,15.6,16,19.2c11.9,5.3,26.3,1.3,33-8.8C101.9,77.8,92.5,58.5,82,53.2z"
          fill="#8c6d4e"
        />
        <path
          d="M18,53.2c1.2,10.9,10.4,22.2,22,23.7c0.8,0.1,1.6,0.1,2.4,0.2c3.1,1.1,6.4,1.8,9.7,1.9 c-2,8.5-7.9,15.6-16,19.2C24.2,101.5,9.8,97.5,3,87.4C-8.9,75.8,1.5,58.5,18,53.2z"
          fill="#8c6d4e"
        />
        {/* Eyes */}
        <circle cx="38" cy="53" r="5" fill="#231f20" />
        <circle cx="62" cy="53" r="5" fill="#231f20" />
        {/* Mouth */}
        {isScreaming ? (
          <ellipse cx="50" cy="72" rx="14" ry="8" fill="#a03232" />
        ) : (
          <path
            d="M38,70 Q50,78 62,70"
            stroke="#231f20"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  );
};
