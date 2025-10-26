// src/FilterControls.jsx
import React, { useMemo } from 'react';
import { Search, Filter, Database, X } from 'lucide-react'; 
import SearchDropdown from './SearchDropdown'; 

const FilterControls = ({ 
    searchTerm, filterGeneration, filterAttribute, 
    allGenerations, allAttributes, allDigimon, 
    handleSearchChange, handleFilterChange, 
    navigateToDetail 
}) => {
    
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

    const suggestions = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2) return [];

        const term = searchTerm.toLowerCase();
        
        return allDigimon
            .filter(d => d.name.toLowerCase().includes(term))
            .slice(0, 8); 
    }, [searchTerm, allDigimon]);

    const handleSelectSuggestion = (name) => {
        handleSearchChange(''); 
        
        setTimeout(() => {
            navigateToDetail(name);
        }, 50); 
    };
    // ------------------------------------------------------------------

    const getButtonStyle = (currentValue, filterValue) => {
        return currentValue === filterValue
            ? 'bg-accent-blue text-dark-panel shadow-xl shadow-accent-blue/50 ring-2 ring-accent-blue/70 font-mono' 
            : 'bg-dark-panel text-text-low border border-gray-700 hover:bg-dark-void/50 hover:text-accent-cyan font-mono'; 
    };

    const handleClearSearch = () => handleSearchChange('');

    return (
        <div className="flex flex-col gap-6 mb-8">
            {/* Search Input and Dropdown Container (Relative) */}
            <div className="relative w-full z-20"> 
                <input
                    type="text"
                    placeholder="ENTER DIGIMON NAME..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 
                               bg-dark-panel/50 text-white placeholder-text-low font-mono tracking-wider 
                               rounded-none border-2 border-accent-cyan/40 focus:outline-none 
                               focus:border-accent-blue/80 transition duration-200 shadow-lg shadow-dark-void/50"
                    style={{ 
                        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.6), 0 0 5px rgba(51, 230, 204, 0.1)',
                    }}
                />
                
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                
                {searchTerm && (
                    <button 
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-cyan hover:text-accent-blue z-30"
                    >
                        <X size={20} />
                    </button>
                )}
                
                {/* RENDER THE DROPDOWN */}
                {searchTerm.length >= 2 && suggestions.length > 0 && (
                    <SearchDropdown 
                        suggestions={suggestions} 
                        onSelect={handleSelectSuggestion} 
                    />
                )}
            </div>
            
            <p className="text-xs font-mono text-text-low -mt-4">
                QUERY: **{searchTerm || '_AWAITING_INPUT_'}**
            </p>

            {/* Generation Filter*/}
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