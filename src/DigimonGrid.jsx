// src/DigimonGrid.jsx
import React from 'react';
import { Database } from 'lucide-react'; 

// Generation colors adjusted to be lighter for better contrast on a dark background
const getGenerationColor = (generation) => {
    switch (generation) {
        case 'Baby': return 'bg-dark-panel text-text-low border-gray-700 hover:border-text-low';
        case 'In-Training': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700 hover:border-yellow-300';
        case 'Rookie': return 'bg-blue-900/50 text-blue-300 border-blue-700 hover:border-blue-300';
        case 'Champion': return 'bg-green-900/50 text-green-300 border-green-700 hover:border-green-300';
        case 'Ultimate': return 'bg-purple-900/50 text-purple-300 border-purple-700 hover:border-purple-300';
        case 'Mega': return 'bg-red-900/50 text-red-300 border-red-700 hover:border-red-300';
        default: return 'bg-dark-panel text-gray-600 border-gray-700';
    }
};

const DigimonGrid = ({ digimonList, totalItems, onCardClick }) => ( 
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-10">
        {digimonList.map((digimon) => (
            <div 
                key={digimon.id} 
                onClick={() => onCardClick(digimon.name)} 
                // REVISED: Stronger shadow/glow on hover, using a more defined dark-panel border
                className="p-4 bg-dark-panel rounded-xl shadow-lg border border-gray-800 
                            hover:shadow-2xl hover:shadow-accent-blue/50 hover:border-accent-blue/80 
                            transition-all duration-300 text-center relative overflow-hidden group cursor-pointer" 
            >
                
                {/* Image Container - REVISED: Simpler circle border */}
                <div className="w-28 h-28 mx-auto mb-3 p-1 
                                bg-dark-void rounded-full 
                                border-2 border-accent-blue/30 
                                group-hover:border-accent-cyan transition-colors duration-300">
                    <img 
                        src={digimon.image_path} 
                        alt={digimon.name} 
                        className="w-full h-full object-contain" 
                    />
                </div>

                {/* Name and Generation Tag */}
                <h2 className="text-lg font-bold text-accent-blue group-hover:text-white transition-colors font-sans truncate">
                    {digimon.name}
                </h2>
                <span className={`text-xs font-semibold py-0.5 px-2 rounded border transition duration-300 ${getGenerationColor(digimon.generation)}`}>
                    {digimon.generation}
                </span>
                
                {/* Cinematic Hover Effect - REVISED: Using font-mono for consistency */}
                <div className="absolute inset-0 bg-dark-void/90 flex items-center justify-center 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                     <p className="text-xs text-accent-blue font-mono tracking-widest">
                         // V I E W _ D A T A _
                     </p>
                </div>
            </div>
        ))}

        {/* No Results Message */}
        {totalItems === 0 && (
            <div className="col-span-full py-16 text-center text-text-low">
                <Database className="w-12 h-12 mx-auto mb-4 text-accent-cyan" />
                <p className="text-xl font-regal text-accent-cyan">NO DIGITAL MONSTERS FOUND.</p>
                <p className='font-mono text-sm'>
                    <span className='text-accent-blue'> &gt; </span> Archive search failed. Adjust parameters.
                </p>
            </div>
        )}
    </div>
);

export default DigimonGrid;