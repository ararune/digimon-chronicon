// src/LandingPage.jsx
import React, { useState } from 'react';
import { Database, BookOpen, Dna, ChevronRight } from 'lucide-react'; 
import CyberNavbar from './CyberNavbar'; 

const appId = 'CHRONICON-V.01'; 

const LandingPage = ({ onNavigate }) => {
    // State is no longer strictly needed for hover, but kept for future complexity
    const [isHoveredPrimary, setIsHoveredPrimary] = useState(false);
    const [isHoveredSecondary, setIsHoveredSecondary] = useState(false);

    const isDataReady = true; 

    return (
        <div className="relative flex flex-col min-h-screen bg-dark-void text-white overflow-x-hidden">
            
            {/* 1. Navbar */}
            <CyberNavbar onNavigate={onNavigate} />
            
            {/* 2. Main Content Wrapper */}
            <main className="relative z-0 flex flex-col items-center justify-center flex-grow p-4 sm:p-8 text-center">
                
                {/* Background Overlay - Cleaned up pattern */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                    <div className="absolute inset-0 bg-dark-panel/10"></div>
                    <div className="absolute inset-0" 
                        style={{ background: 'repeating-linear-gradient(45deg, rgba(51, 230, 255, 0.03) 0, rgba(51, 230, 255, 0.03) 2px, transparent 2px, transparent 10px)' }}>
                    </div>
                </div>

                {/* Tapirmon Images */}
                <div className="absolute bottom-[-5%] right-[-5%] z-0 w-64 h-auto opacity-30 animate-float-pulse lg:w-80 xl:w-[400px]">
                    <img 
                        src="/images/tapirmon.png" 
                        alt="Tapirmon Digimon" 
                        className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                </div>
                <div className="absolute top-[5%] left-[-5%] z-0 w-80 h-auto opacity-25 animate-float-pulse-alt lg:w-96 xl:w-[450px] transform -rotate-12">
                    <img 
                        src="/images/tapirmon.png" 
                        alt="Tapirmon Digimon" 
                        className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                </div>
                
                {/* Content Area (Centered) */}
                <div className={`relative z-10 max-w-4xl w-full p-4 md:p-8 transition-opacity duration-1000 ${isDataReady ? 'opacity-100' : 'opacity-0'}`}>
                    
                    {/* Main Title Block */}
                    <div className="mb-16 mt-8 sm:mt-0">
                        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-regal tracking-widest leading-none text-accent-blue drop-shadow-[0_0_10px_rgba(77,182,255,0.7)] animate-fade-in-up">
                            DIGIMON
                        </h1>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-thin tracking-[.3em] mt-3 text-text-low animate-fade-in-up [animation-delay:150ms]">
                            CHRONICON
                        </h2>
                    </div>

                    {/* Tagline Box */}
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-20 font-sans font-light relative animate-fade-in-up [animation-delay:300ms]
                                 bg-dark-void/50 backdrop-blur-sm p-5 border-b-2 border-t-2 border-accent-blue/50"
                                 style={{ boxShadow: 'inset 0 0 20px rgba(77, 182, 255, 0.15)' }} 
                    >
                        <span className="font-mono text-xl text-accent-blue block mb-2 opacity-80"> VIRTUAL_TERMINAL_ONLINE_</span>
                        <span className="text-white font-medium">Connect to the Network.</span> <br/> Digital Destiny Awaits.
                    </p>
                    
                    {/* Buttons Container */}
                    <div className='flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 max-w-xl mx-auto'>
                        
                        {/* Primary Button: ARCHIVE */}
                        <button
                            onClick={() => onNavigate('archive')}
                            // NEW SLEEK EFFECTS: Consistent scale and inner shadow
                            className={`
                                w-full py-4 px-6 text-xl font-bold uppercase tracking-widest 
                                rounded-md transition-all duration-300 transform 
                                shadow-lg flex items-center justify-center 
                                bg-dark-panel border-2 border-accent-blue/50 text-accent-blue 
                                hover:scale-[1.03] hover:text-white hover:shadow-2xl 
                                hover:shadow-accent-blue/40 hover:bg-accent-blue/20
                                animate-fade-in-up [animation-delay:450ms] font-mono
                            `}
                            style={{ 
                                boxShadow: isHoveredPrimary ? 'inset 0 0 15px rgba(77, 182, 255, 0.6)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
                            }}
                            onMouseEnter={() => setIsHoveredPrimary(true)}
                            onMouseLeave={() => setIsHoveredPrimary(false)}
                        >
                            <BookOpen className="w-6 h-6 mr-3" />
                            ARCHIVE
                        </button>

                        {/* Secondary Button: PLANNER */}
                        <button
                            onClick={() => onNavigate('planner')}
                            // NEW SLEEK EFFECTS: Consistent scale and inner shadow
                            className={`
                                w-full py-4 px-6 text-xl font-semibold uppercase tracking-wide 
                                rounded-md bg-dark-panel/50 text-accent-cyan 
                                transition-all duration-300 transform flex items-center justify-center
                                border-2 border-accent-cyan/50
                                hover:scale-[1.03] hover:shadow-lg hover:shadow-accent-cyan/40 hover:bg-accent-cyan/10
                                animate-fade-in [animation-delay:600ms] font-mono
                            `}
                            style={{ 
                                boxShadow: isHoveredSecondary ? 'inset 0 0 15px rgba(51, 230, 255, 0.6)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
                            }}
                            onMouseEnter={() => setIsHoveredSecondary(true)}
                            onMouseLeave={() => setIsHoveredSecondary(false)}
                        >
                            <Dna className="w-5 h-5 mr-2" /> PLANNER <ChevronRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>
            
            <footer className="w-full text-center py-4 bg-dark-panel/50 border-t border-accent-cyan/10">
                <p className="text-xs text-text-low font-mono animate-fade-in [animation-delay:750ms]">
                    STATUS: {isDataReady ? 'ONLINE' : 'BOOTING...'}. APP ID: {appId}
                </p>
            </footer>

            {/* Tailwind CSS Animations */}
            <style jsx>{`
                @keyframes floatPulse {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(10px, 10px) scale(1.02); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                @keyframes floatPulseAlt {
                    0% { transform: translate(0, 0) scale(1) rotate(-12deg); }
                    50% { transform: translate(-10px, 5px) scale(1.02) rotate(-10deg); }
                    100% { transform: translate(0, 0) scale(1) rotate(-12deg); }
                }
                .animate-float-pulse {
                    animation: floatPulse 10s ease-in-out infinite;
                }
                .animate-float-pulse-alt {
                    animation: floatPulseAlt 12s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;