import React from 'react';

export default function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 450 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" /> {/* Violet-600 */}
                    <stop offset="100%" stopColor="#4F46E5" /> {/* Indigo-600 */}
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Icon Container */}
            <g transform="translate(10, 10)">
                {/* Background Shape (Rounded Rect) */}
                <rect x="0" y="0" width="80" height="80" rx="24" fill="url(#purple-gradient)" />

                {/* Sparkle Symbol */}
                <path
                    d="M40 20 C40 20 45 35 60 40 C45 45 40 60 40 60 C40 60 35 45 20 40 C35 35 40 20 40 20 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Small Dot */}
                <circle cx="28" cy="58" r="4" fill="white" />

                {/* Plus sign detail (top right) */}
                <path d="M58 22 L62 22 M60 20 L60 24" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Text Group */}
            <g transform="translate(110, 55)">
                {/* Main Text */}
                <text
                    fontSize="42"
                    fontFamily="'Inter', sans-serif"
                    fontWeight="800"
                    fill="#111827"
                    letterSpacing="-0.5"
                >
                    <tspan>WOW</tspan> <tspan fontWeight="400">AI Smart Detail</tspan>
                </text>

                {/* Sub Text */}
                <text
                    x="2"
                    y="30"
                    fontSize="18"
                    fontFamily="'Inter', sans-serif"
                    fontWeight="500"
                    fill="#6B7280"
                >
                    AI Smart Detail
                </text>
            </g>
        </svg>
    );
}
