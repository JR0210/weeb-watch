import React from "react";

const BlurredSvg = () => {
  return (
    <svg
      id="visual"
      viewBox="0 0 960 540"
      width="960"
      height="540"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      className="w-full h-full"
    >
      <defs>
        <filter id="blur1" x="-10%" y="-10%" width="120%" height="120%">
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="163"
            result="effect1_foregroundBlur"
          ></feGaussianBlur>
        </filter>

        {/* Define Animations */}
        <style type="text/css">
          {`
            @keyframes move-1 {
              0%, 100% {
                transform: translate(0, 0);
              }
              50% {
                transform: translate(-30px, -30px);
              }
            }
            @keyframes move-2 {
              0%, 100% {
                transform: translate(0, 0);
              }
              50% {
                transform: translate(20px, 20px);
              }
            }
            @keyframes move-3 {
              0%, 100% {
                transform: translate(0, 0);
              }
              50% {
                transform: translate(-20px, 30px);
              }
            }
            @keyframes move-4 {
              0%, 100% {
                transform: translate(0, 0);
              }
              50% {
                transform: translate(30px, -20px);
              }
            }
            @keyframes move-5 {
              0%, 100% {
                transform: translate(0, 0);
              }
              50% {
                transform: translate(-15px, 15px);
              }
            }
            @keyframes move-6 {
              0%, 100% {
                transform: translate(0, 0);
              }
              50% {
                transform: translate(10px, -10px);
              }
            }
            .animate-move-1 {
              animation: move-1 6s ease-in-out infinite;
            }
            .animate-move-2 {
              animation: move-2 6s ease-in-out infinite;
            }
            .animate-move-3 {
              animation: move-3 6s ease-in-out infinite;
            }
            .animate-move-4 {
              animation: move-4 6s ease-in-out infinite;
            }
            .animate-move-5 {
              animation: move-5 6s ease-in-out infinite;
            }
            .animate-move-6 {
              animation: move-6 6s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      <rect width="960" height="540" fill="#22222200" fillOpacity="0.2"></rect>
      <g filter="url(#blur1)">
        <circle
          cx="525"
          cy="490"
          fill="#444444"
          fillOpacity="0.5"
          r="363"
          className="animate-move-1"
        ></circle>
        <circle
          cx="302"
          cy="89"
          fill="#222222"
          fillOpacity="0.4"
          r="363"
          className="animate-move-2"
        ></circle>
        <circle
          cx="80"
          cy="24"
          fill="#888888"
          fillOpacity="0.5"
          r="363"
          className="animate-move-3"
        ></circle>
        <circle
          cx="771"
          cy="240"
          fill="#444444"
          fillOpacity="0.5"
          r="363"
          className="animate-move-4"
        ></circle>
        <circle
          cx="544"
          cy="300"
          fill="#222222"
          fillOpacity="0.4"
          r="363"
          className="animate-move-5"
        ></circle>
        <circle
          cx="761"
          cy="466"
          fill="#888888"
          fillOpacity="0.5"
          r="363"
          className="animate-move-6"
        ></circle>
      </g>
    </svg>
  );
};

export default BlurredSvg;
