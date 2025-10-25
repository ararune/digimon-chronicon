// src/FilterControls.jsx
import React, { useMemo } from 'react';
import { Search, Filter, Database, X } from 'lucide-react'; 

const FilterControls = ({ 
    searchTerm, filterGeneration, filterAttribute, 
    allGenerations, allAttributes, 
    handleSearchChange, handleFilterChange 
}) => {
    
    // Sort attributes to prioritize common ones
    const sortedAttributes = useMemo(() => {
        const priority = ['All', 'Vaccine', 'Data', 'Virus', 'Free', 'Variable', 'No Data'];
        return allAttributes.sort((a, b) => {
            const indexA = priority.indexOf(a);
            const indexB = priority.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [allAttributes]);

    // Button style utility for thematic toggles
    const getButtonStyle = (currentValue, filterValue) => {
        return currentValue === filterValue
            ? 'bg-accent-blue text-dark-panel shadow-xl shadow-accent-blue/50 ring-2 ring-accent-blue/70 font-mono' 
            : 'bg-dark-panel text-text-low border border-gray-700 hover:bg-dark-void/50 hover:text-accent-cyan font-mono'; 
    };

    const handleClearSearch = () => handleSearchChange('');

    return (
        <div className="flex flex-col gap-6 mb-8">
            {/* Search Input */}
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="ENTER DIGIMON NAME..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-dark-panel border border-gray-700 rounded-md text-white placeholder-text-low focus:ring-0 focus:outline-none transition duration-200 font-mono tracking-wider"
                    style={{ 
                        boxShadow: searchTerm.length > 0 ? '0 0 10px rgba(77, 182, 255, 0.5)' : 'none',
                        transition: 'box-shadow 0.2s'
                    }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                {searchTerm && (
                    <button 
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-cyan hover:text-accent-blue"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Generation Filter */}
            <div>
                <h3 className="text-accent-cyan text-sm mb-2 flex items-center font-regal tracking-wider"><Filter size={16} className="mr-2" /> DATA GENERATION:</h3>
                <div className="flex flex-wrap gap-2">
                    {allGenerations.map(gen => (
                        <button
                            key={gen}
                            onClick={() => handleFilterChange('gen', gen)}
                            className={`py-1.5 px-3 text-sm font-semibold rounded-md transition duration-200 ${getButtonStyle(filterGeneration, gen)}`}
                        >
                            {gen}
                        </button>
                    ))}
                </div>
            </div>

            {/* Attribute Filter */}
            <div>
                <h3 className="text-accent-cyan text-sm mb-2 flex items-center font-regal tracking-wider"><Database size={16} className="mr-2" /> ATTRIBUTE TYPE:</h3>
                <div className="flex flex-wrap gap-2">
                    {sortedAttributes.map(attr => (
                        <button
                            key={attr}
                            onClick={() => handleFilterChange('attr', attr)}
                            className={`py-1.5 px-3 text-sm font-semibold rounded-md transition duration-200 ${getButtonStyle(filterAttribute, attr)}`}
                        >
                            {attr}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterControls;