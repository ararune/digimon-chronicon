// src/SearchDropdown.jsx
import React from 'react';
import { Database } from 'lucide-react';

// --- UTILITY FUNCTIONS (Defined here for self-containment) ---
const getGenerationColorClass = (generation) => {
    switch (generation) {
        case 'Baby': return 'text-text-low';
        case 'In-Training': return 'text-yellow-400';
        case 'Rookie': return 'text-blue-400';
        case 'Champion': return 'text-green-400';
        case 'Ultimate': return 'text-purple-400';
        case 'Mega': return 'text-red-400';
        default: return 'text-text-low';
    }
};

const getAttributeClass = (attribute) => {
    switch (attribute) {
        case 'Vaccine': return 'bg-green-600/50 text-green-200';
        case 'Data': return 'bg-blue-600/50 text-blue-200';
        case 'Virus': return 'bg-red-600/50 text-red-200';
        case 'Free': return 'bg-yellow-600/50 text-yellow-200';
        default: return 'bg-gray-600/50 text-gray-200';
    }
};
// -----------------------------------------------------------


const SearchDropdown = ({ suggestions, onSelect }) => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="absolute z-40 mt-1 w-full bg-dark-panel/95 backdrop-blur-sm rounded-lg shadow-2xl shadow-accent-blue/50 overflow-hidden 
                        max-h-80 overflow-y-auto border border-accent-cyan/30">
            {suggestions.map((digimon) => (
                <div
                    key={digimon.name}
                    onClick={() => onSelect(digimon.name)}
                    className="flex items-center p-3 cursor-pointer transition duration-150 hover:bg-accent-blue/20 hover:shadow-md border-b border-dark-void/50 last:border-b-0"
                >
                    {/* 1. Icon Image */}
                    <div className="w-10 h-10 flex-shrink-0 mr-3 rounded-full overflow-hidden bg-dark-void/70 p-0.5 border border-accent-cyan/50">
                        {digimon.image_path || digimon.url ? (
                            <img 
                                src={digimon.image_path || digimon.url} 
                                alt={digimon.name} 
                                className="w-full h-full object-contain" 
                            />
                        ) : (
                            <Database className="w-full h-full text-text-low p-1.5" />
                        )}
                    </div>
                    
                    {/* 2. Name and Generation */}
                    <div className="flex-grow min-w-0 pr-2">
                        <p className="text-gray-100 text-base font-regal leading-tight truncate">
                            {digimon.name}
                        </p>
                        <p className={`text-xs font-mono ${getGenerationColorClass(digimon.generation)}`}>
                            {digimon.generation}
                        </p>
                    </div>

                    {/* 3. Attribute Tag */}
                    <div className={`text-xs font-mono px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 ${getAttributeClass(digimon.attribute)}`}>
                        {digimon.attribute}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchDropdown;