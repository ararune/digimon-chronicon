// src/ArchiveHeader.jsx
import React from 'react';
import { BookOpen } from 'lucide-react'; 

const ArchiveHeader = ({ totalItems, onNavigate }) => (
    // Added a subtle cyan inner shadow/glow to the bottom border for a digital edge
    <header className="mb-8 pb-4 border-b border-accent-blue/50" style={{ boxShadow: '0 4px 10px -5px rgba(51, 230, 255, 0.15)' }}>
        <div 
            onClick={() => onNavigate('landing')}
            className="cursor-pointer group inline-block"
        >
            {/* Added style for a text shadow/glow effect on the main title */}
            <h1 
                className="text-5xl text-accent-blue font-regal tracking-wider flex items-center transition-opacity group-hover:opacity-75"
                style={{ textShadow: '0 0 8px rgba(77, 182, 255, 0.5)' }}
            >
                <BookOpen className="w-8 h-8 mr-4 text-accent-cyan" /> Digital Monster Archive
            </h1>
        </div>
        
        {/* Retained: text-low */}
        <p className="text-text-low mt-2 italic text-lg font-sans">
            Viewing {totalItems} Entries
        </p>
    </header>
);

export default ArchiveHeader;