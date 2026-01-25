import React from 'react';

export default function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 300 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E2E2E2" />
                    <stop offset="50%" stopColor="#9CA3AF" />
                    <stop offset="100%" stopColor="#4B5563" />
                </linearGradient>
            </defs>

            {/* Main WOW Text */}
            <g transform="translate(20, 10)">
                {/* W (Left) */}
                <path d="M10 10 L35 80 L50 30 L65 80 L90 10 H115 L80 95 H50 L35 50 L20 95 H-15 L-40 10 H-15"
                    fill="url(#silver-gradient)" stroke="#374151" strokeWidth="2"
                    transform="translate(45, 0)" />

                {/* O (Center with Arrow) */}
                <circle cx="150" cy="55" r="35" fill="none" stroke="url(#silver-gradient)" strokeWidth="12" />
                <circle cx="150" cy="55" r="35" stroke="#374151" strokeWidth="1" opacity="0.5" />

                {/* Arrow inside O */}
                <path d="M150 35 L125 60 H140 V75 H160 V60 H175 L150 35Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1" />

                {/* W (Right) */}
                <path d="M10 10 L35 80 L50 30 L65 80 L90 10 H115 L80 95 H50 L35 50 L20 95 H-15 L-40 10 H-15"
                    fill="url(#silver-gradient)" stroke="#374151" strokeWidth="2"
                    transform="translate(210, 0)" />
            </g>

            {/* Main Brand Text */}
            <text x="150" y="100" textAnchor="middle" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="900" fill="#111827">
                WOW-SELLERBOOST
            </text>

            {/* Slogan */}
            <text x="150" y="115" textAnchor="middle" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="600" fill="#4B5563" letterSpacing="1.5">
                CREATE. PUBLISH. PROSPER.
            </text>
        </svg>
    );
}
