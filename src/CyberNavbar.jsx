// src/CyberNavbar.jsx (UPDATED FOR WRAPPER PATTERN)
import React, { useState } from 'react';
import { BookOpen, Dna, Home, Menu, X } from 'lucide-react';

// Helper component for navigation links
const NavLink = ({ onNavigate, pageName, children, Icon, onClick }) => (
    <button
        onClick={onClick ? onClick : () => onNavigate(pageName)}
        className="flex items-center px-4 py-3 text-base font-mono uppercase tracking-wider text-text-low/80 
                    hover:text-accent-cyan hover:bg-dark-void/50 transition rounded-md w-full md:w-auto md:text-sm md:px-2 md:py-1.5"
    >
        <Icon className="w-5 h-5 mr-3 md:w-4 md:h-4 md:mr-1.5" />
        {children}
    </button>
);

// Main Navbar Component (Now accepts children and customElement)
// The 'onNavigate' prop is only needed if the default links are shown.
const CyberNavbar = ({ onNavigate, customElement, children }) => { // <--- Added customElement and children
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

    const navigateAndCloseMenu = (pageName) => {
        if (onNavigate) {
            onNavigate(pageName);
        }
        setIsMenuOpen(false);
    }
    
    // Define the elements to show in the right slot:
    // If a customElement is provided, show it. Otherwise, show the default links.
    const rightSideContent = customElement ? customElement : (
        // Desktop Navigation Links
        <div className="hidden md:flex space-x-1">
            <NavLink onClick={() => navigateAndCloseMenu('landing')} Icon={Home}>HOME</NavLink>
            <NavLink onClick={() => navigateAndCloseMenu('archive')} Icon={BookOpen}>ARCHIVE</NavLink>
            <NavLink onClick={() => navigateAndCloseMenu('planner')} Icon={Dna}>PLANNER</NavLink>
        </div>
    );

    return (
        <>
            <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-dark-panel/90 border-b border-accent-cyan/30 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 h-16 flex items-center justify-between">
                    
                    {/* Logo/Title (Always visible and responsive) */}
                    <button 
                        onClick={() => navigateAndCloseMenu('landing')}
                        className="flex items-center font-regal text-xl sm:text-2xl tracking-wider hover:text-accent-blue transition p-2"
                    >
                        <span className='text-accent-blue'>DIGIMON</span>
                        <span className='ml-1 text-accent-cyan'>CHRONICON</span>
                    </button>
                    
                    {/* Desktop/Custom Content Slot */}
                    {rightSideContent}

                    {/* Mobile Menu Button (Visible on mobile) - Only show if standard links are present */}
                    {!customElement && (
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-accent-cyan hover:text-accent-blue p-2 rounded-md"
                            aria-label="Toggle navigation menu"
                        >
                            {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                        </button>
                    )}
                </div>

                {/* Mobile Menu Dropdown (Only show if standard links are present) */}
                {!customElement && (
                    <div className={`md:hidden absolute top-16 left-0 w-full bg-dark-panel/95 backdrop-blur-lg border-b border-accent-cyan/30 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                        <div className="flex flex-col p-2">
                            <NavLink onClick={() => navigateAndCloseMenu('landing')} Icon={Home}>HOME</NavLink>
                            <NavLink onClick={() => navigateAndCloseMenu('archive')} Icon={BookOpen}>ARCHIVE</NavLink>
                            <NavLink onClick={() => navigateAndCloseMenu('planner')} Icon={Dna}>PLANNER</NavLink>
                        </div>
                    </div>
                )}
            </nav>
            {/* THIS IS THE CRITICAL LINE: Renders the content wrapped by the Navbar */}
            <main>{children}</main> 
        </>
    );
};

export default CyberNavbar;