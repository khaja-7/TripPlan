
import React from 'react';

const Logo = ({ className = "w-10 h-10", textSize = "text-xl", showText = true, lightMode = false }) => {
    return (
        <div className="flex items-center gap-3 select-none hover:opacity-90 transition-opacity cursor-pointer">
            <div
                className={`${className} bg-gradient-to-tr from-teal-500 to-teal-300 rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center text-black relative overflow-hidden group`}
            >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />

                {/* Icon (Plane) */}
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-[60%] h-[60%] transform -rotate-12 group-hover:rotate-0 transition-transform duration-500"
                >
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
            </div>

            {showText && (
                <span className={`${textSize} font-black tracking-tight flex items-center gap-0.5`}>
                    <span className="text-white drop-shadow-md">Trip</span>
                    <span className="text-teal-400">Plan</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
