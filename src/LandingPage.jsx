// src/LandingPage.jsx
import React, { useState } from 'react';
import { Database, BookOpen, Dna, ChevronRight } from 'lucide-react'; 

const appId = 'CHRONICON-V.01'; 

// Removed isAuthReady from props
const LandingPage = ({ onNavigate }) => {
    const [isHoveredPrimary, setIsHoveredPrimary] = useState(false);
    const [isHoveredSecondary, setIsHoveredSecondary] = useState(false);

    // Simplify the "ready" state to just a data loading/initialization simulation
    const isDataReady = true; 

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center bg-dark-void text-white overflow-hidden">
            {/* Background Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-dark-panel/10"></div>
                <div className="absolute inset-0 animate-pulse-subtle" 
                    style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(51, 230, 255, 0.05) 100px)' }}>
                </div>
            </div>
            
            {/* Content Area */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
                
                {/* Status Indicator (Only shows if NOT Ready - but hardcoded to READY now) */}
                {!isDataReady && (
                    <div className="text-accent-cyan animate-pulse-cyber mb-8 text-xl flex items-center justify-center font-mono tracking-widest">
                        <Database className="w-7 h-7 mr-3 text-accent-cyan" /> 
                        <span className="opacity-70">_INITIALIZING_DATA_STREAM_</span>
                    </div>
                )}
            
                {/* Content area opacity is now controlled by isDataReady, which is true */}
                <div className={`p-8 md:p-12 transition-opacity duration-1000 ${isDataReady ? 'opacity-100' : 'opacity-0'}`}>
                    
                    {/* Main Title */}
                    <h1 className="text-7xl md:text-9xl font-regal tracking-widest leading-tight text-accent-blue drop-shadow-lg shadow-accent-blue/50 animate-fade-in-up">
                        DIGIMON
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-sans font-thin tracking-[.3em] mt-2 mb-10 text-text-low animate-fade-in-up [animation-delay:150ms]">
                        CHRONICON
                    </h2>
            
                    {/* Tagline */}
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-20 font-sans font-light relative animate-fade-in-up [animation-delay:300ms]
                                 bg-dark-void/50 backdrop-blur-sm p-5 border-b-2 border-t-2 border-accent-blue/50"
                                 style={{ boxShadow: 'inset 0 0 20px rgba(77, 182, 255, 0.15)' }} 
                    >
                        <span className="font-mono text-xl text-accent-blue block mb-2 opacity-80"> VIRTUAL_TERMINAL_ONLINE_</span>
                        <span className="text-white font-medium">Connect to the Network.</span> <br/> Digital Destiny Awaits.
                    </p>
            
                    {/* Primary Call to Action Button - ALWAYS ACTIVE */}
                    <button
                        onClick={() => onNavigate('archive')}
                        onMouseEnter={() => setIsHoveredPrimary(true)}
                        onMouseLeave={() => setIsHoveredPrimary(false)}
                        // Removed disabled prop
                        className={`
                            mt-10 py-5 px-12 text-2xl font-bold uppercase tracking-widest 
                            rounded-md transition-all duration-300 transform 
                            shadow-2xl flex items-center justify-center mx-auto
                            bg-dark-panel text-accent-blue hover:scale-[1.05] ring-4 ring-offset-4 ring-accent-blue/50 ring-offset-dark-void hover:text-white
                            ${isHoveredPrimary ? 'shadow-accent-blue/80 bg-accent-blue/20' : 'shadow-accent-blue/30'}
                            animate-fade-in-up [animation-delay:450ms] font-mono
                        `}
                    >
                        <BookOpen className="w-6 h-6 mr-3" />
                        ACCESS ARCHIVE
                    </button>

                    {/* Secondary Call to Action - ALWAYS ACTIVE */}
                    <button
                        onClick={() => onNavigate('planner')} // Now runs immediately
                        onMouseEnter={() => setIsHoveredSecondary(true)}
                        onMouseLeave={() => setIsHoveredSecondary(false)}
                        // Removed disabled prop
                        className={`
                            mt-8 py-3 px-8 text-lg font-semibold uppercase tracking-wide 
                            rounded-md bg-dark-panel/50 text-accent-cyan 
                            transition-all duration-300 transform flex items-center justify-center mx-auto
                            border border-accent-cyan/50
                            hover:bg-accent-cyan/10 hover:shadow-lg hover:shadow-accent-cyan/60 hover:scale-[1.02]
                            ${isHoveredSecondary ? 'shadow-md shadow-accent-cyan/70' : 'shadow-sm shadow-accent-cyan/30'}
                            animate-fade-in [animation-delay:600ms]
                        `}
                    >
                        <Dna className="w-5 h-5 mr-2" /> Digivolution Planner <ChevronRight className="ml-2 w-4 h-4" />
                    </button>

                </div>
                
                <footer className="absolute bottom-4 text-xs text-text-low font-mono animate-fade-in [animation-delay:750ms]">
                    STATUS: {isDataReady ? 'ONLINE' : 'BOOTING...'}. APP ID: {appId}
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;