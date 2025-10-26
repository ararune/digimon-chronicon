// src/ArchiveHeader.jsx
import React from 'react';
import { BookOpen } from 'lucide-react'; 

const ArchiveHeader = ({ totalItems }) => (
    // Removed the bottom border and shadow since the navbar will provide separation.
    <header className="mb-6 pt-2">
        <div className="flex items-center justify-between">
            <h1 
                className="text-4xl text-accent-blue font-regal tracking-wider flex items-center"
                style={{ textShadow: '0 0 8px rgba(77, 182, 255, 0.5)' }}
            >
                <BookOpen className="w-6 h-6 mr-3 text-accent-cyan" /> ARCHIVE DATA
            </h1>
            
            {/* Entry Count: Moved closer to the main content/grid */}
            <p className="text-text-low italic text-lg font-sans">
                // Viewing <span className="text-accent-cyan font-bold not-italic">{totalItems}</span> Entries
            </p>
        </div>
        
        {/* Optional: A subtle separator line */}
        <div className="mt-4 border-b border-accent-blue/30" style={{ boxShadow: '0 4px 10px -5px rgba(51, 230, 255, 0.15)' }}></div>
    </header>
);

export default ArchiveHeader;