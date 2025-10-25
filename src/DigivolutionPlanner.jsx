// src/DigivolutionPlanner.jsx
import React, { useState, useMemo } from 'react';
// Assuming useDigimonArchive is available in the root src directory
import { useDigimonArchive } from './useDigimonArchive'; 
import { Search, Save, Award, Dna, ArrowDown, Zap, Shield, Brain, Gauge, ChevronDown, X } from 'lucide-react';

// --- DUMMY DATA AND LOGIC (Replace with real pathfinding logic) ---
// This placeholder data mimics Kuramon -> Pagumon -> ... path from your reference image.
const DUMMY_ALL_DIGIMON = [
    { name: 'Kuramon', image_path: '/images/kuramon.png', type: 'Unidentified', hp: 287, sp: 256, atk: 155, def: 105, int: 125, spi: 100 },
    { name: 'Pagumon', image_path: '/images/pagumon.png', type: 'Lesser', hp: 294, sp: 384, atk: 110, def: 100, int: 200, spi: 135 },
    { name: 'Gabumon', image_path: '/images/gabumon.png', type: 'Data' },
    { name: 'Garurumon', image_path: '/images/garurumon.png', type: 'Data' },
    { name: 'WereGarurumon', image_path: '/images/weregarurumon.png', type: 'Vaccine' },
    { name: 'MetalGarurumon', image_path: '/images/metalgarurumon.png', type: 'Data' },
    { name: 'Choromon', image_path: '/images/choromon.png', type: 'Machine' },
];

const DUMMY_PATH_RESULT = [
    { name: 'Kuramon', image_path: '/images/kuramon.png', type: 'Unidentified', hp: 287, sp: 256, atk: 155, def: 105, int: 125, spi: 100, condition: null },
    { name: 'Pagumon', image_path: '/images/pagumon.png', type: 'Lesser', hp: 294, sp: 384, atk: 110, def: 100, int: 200, spi: 135, condition: 'Digivolution • No specific condition' },
    { name: 'Gabumon', image_path: '/images/gabumon.png', type: 'Data', hp: 450, sp: 300, atk: 250, def: 200, int: 180, spi: 150, condition: 'Digivolution • 1 or higher 280+ Max SP' },
    { name: 'Garurumon', image_path: '/images/garurumon.png', type: 'Data', hp: 600, sp: 400, atk: 350, def: 300, int: 250, spi: 220, condition: 'Digivolution • Level 16' },
];
// --- END DUMMY DATA ---


// --- DigimonSelector Component (Integrated) ---
const DigimonSelector = ({ label, selectedDigimon, onSelect, onClear, allDigimon }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDigimon = useMemo(() => {
        return (allDigimon || [])
            .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 5);
    }, [searchTerm, allDigimon]);

    const handleSelect = (digimon) => {
        onSelect(digimon);
        setIsDropdownOpen(false);
        setSearchTerm(digimon.name); // Keep selected name in input field
    };
    
    // Clear handler
    const handleClear = (e) => {
        e.stopPropagation();
        setSearchTerm('');
        onClear();
        setIsDropdownOpen(true); // Open selector again after clearing
    };
    
    // If a Digimon is selected, show the rich selection box
    if (selectedDigimon) {
        return (
            <div className="w-full">
                <p className="text-sm text-gray-400 mb-1 font-regal tracking-wider">{label}</p>
                <div className="bg-gray-800 p-4 border border-amber-600/50 flex justify-between items-center h-28 relative">
                    <div className="flex items-center space-x-4">
                        <img 
                            src={selectedDigimon.image_path} 
                            alt={selectedDigimon.name} 
                            className="w-16 h-16 object-contain" 
                        />
                        <div>
                            <p className="text-xl font-regal text-white">{selectedDigimon.name}</p>
                            <p className="text-sm text-gray-400">{selectedDigimon.type}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleClear}
                        className="absolute top-1 right-1 text-gray-500 hover:text-red-500 transition"
                        title="Clear selection"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    // Default selector input when no Digimon is chosen
    return (
        <div className="w-full relative">
            <p className="text-sm text-gray-400 mb-1 font-regal tracking-wider">{label}</p>
            
            <div className="relative">
                <input
                    type="text"
                    placeholder="Select a Digimon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay to allow click on results
                    className="w-full bg-gray-800 text-white px-4 py-3 border border-gray-700/50 focus:border-amber-500/50 transition focus:outline-none"
                />
                <ChevronDown className={`absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180 text-amber-500' : 'text-gray-500'}`} />
            </div>
            
            {/* Dropdown List */}
            {isDropdownOpen && searchTerm.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-amber-500 shadow-xl max-h-60 overflow-y-auto">
                    
                    {filteredDigimon.length > 0 ? (
                        filteredDigimon.map((digimon) => (
                            <div
                                key={digimon.name}
                                // onMouseDown prevents onBlur from firing immediately
                                onMouseDown={(e) => { e.preventDefault(); handleSelect(digimon); }}
                                className="flex items-center p-3 hover:bg-amber-600/20 cursor-pointer transition space-x-3 border-b border-gray-800"
                            >
                                <img 
                                    src={digimon.image_path} 
                                    alt={digimon.name} 
                                    className="w-8 h-8 object-contain" 
                                />
                                <div>
                                    <p className="text-white font-regal leading-tight">{digimon.name}</p>
                                    <p className="text-xs text-gray-400">{digimon.type}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-3 text-gray-500">No results found.</p>
                    )}
                </div>
            )}
        </div>
    );
};


// --- PathStep Component ---
const PathStep = ({ digimon, index }) => {
    const isFirst = index === 0;

    const statMap = [
        { key: 'hp', Icon: Award, label: 'HP' },
        { key: 'sp', Icon: Gauge, label: 'SP' },
        { key: 'atk', Icon: Zap, label: 'ATK' },
        { key: 'def', Icon: Shield, label: 'DEF' },
        { key: 'int', Icon: Brain, label: 'INT' },
        { key: 'spi', Icon: Gauge, label: 'SPI' },
    ];

    return (
        <div className="flex flex-col items-center w-full">
            {/* 1. Digivolution Condition/Arrow (Not for first step) */}
            {!isFirst && (
                <>
                    <div className="flex items-center justify-center p-2 text-sm text-amber-300 bg-gray-800 border-t-2 border-b-2 border-amber-600/50 w-full mb-4">
                        <ArrowDown className="w-4 h-4 mr-2" />
                        <span className="font-mono">{digimon.condition}</span>
                    </div>
                    <ArrowDown className="w-5 h-5 text-amber-500 mb-4" />
                </>
            )}

            {/* 2. Digimon Card */}
            <div className="bg-gray-800 p-4 border border-gray-700 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <img 
                            src={digimon.image_path} 
                            alt={digimon.name} 
                            className="w-16 h-16 object-contain" 
                        />
                        <div>
                            <p className="text-2xl font-regal text-white">{digimon.name}</p>
                            <p className="text-sm text-gray-400">{digimon.type}</p>
                        </div>
                    </div>
                    {/* Placeholder for Stats/Type/Etc */}
                    <div className="text-right mt-2 sm:mt-0">
                        <span className="text-xs font-mono text-amber-400">#001</span>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center border-t border-gray-700 pt-3">
                    {statMap.map(stat => (
                        <div key={stat.key} className="p-1">
                            <p className="text-xs font-regal text-amber-300 uppercase">{stat.label}</p>
                            <p className="text-lg font-bold text-white">{digimon[stat.key]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Main DigivolutionPlanner Component ---
const DigivolutionPlanner = () => {
    // const { allDigimon, findShortestPath } = useDigimonArchive(); // Use real hook
    const allDigimon = DUMMY_ALL_DIGIMON; 

    const [startForm, setStartForm] = useState(null);
    const [targetForm, setTargetForm] = useState(null);
    const [pathResult, setPathResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const calculatePath = () => {
        if (!startForm || !targetForm) return;

        setIsLoading(true);
        setPathResult(null);

        // Simulate API/logic call delay
        setTimeout(() => {
            if (startForm.name === 'Kuramon' && targetForm.name === 'Garurumon') {
                setPathResult(DUMMY_PATH_RESULT);
            } else if (startForm.name === 'Kuramon' && targetForm.name === 'Choromon') {
                setPathResult([
                    DUMMY_ALL_DIGIMON.find(d => d.name === 'Kuramon'),
                    DUMMY_ALL_DIGIMON.find(d => d.name === 'Choromon')
                ].map((d, i) => ({ 
                    ...d, 
                    // Add dummy stats for Choromon
                    hp: 250, sp: 300, atk: 120, def: 90, int: 150, spi: 110,
                    condition: i === 1 ? 'Digivolution • Level 1 required' : null 
                })));
            } else {
                setPathResult([]); // No path found
            }
            setIsLoading(false);
        }, 1000);
    };

    const isCalculateDisabled = !startForm || !targetForm || isLoading;

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                
                <h1 className="text-4xl font-regal tracking-wider text-white border-b-2 border-amber-500 pb-2 mb-8 flex items-center">
                    <Dna className="w-7 h-7 mr-3 text-amber-500" /> Digivolution Planner
                </h1>

                {/* Selection Area (Path Navigator) */}
                <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-xl border border-gray-800/50 mb-12">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
                        <h2 className="text-xl font-regal text-amber-400 flex items-center">
                            <Search className="w-5 h-5 mr-2" /> Path Navigator
                        </h2>
                        <button className="text-sm text-gray-400 flex items-center hover:text-amber-300 transition">
                            <Save className="w-4 h-4 mr-1" /> Saved (0)
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <DigimonSelector 
                            label="Starting Form"
                            selectedDigimon={startForm}
                            onSelect={setStartForm}
                            onClear={() => setStartForm(null)}
                            allDigimon={allDigimon}
                        />
                        <DigimonSelector 
                            label="Target Form"
                            selectedDigimon={targetForm}
                            onSelect={setTargetForm}
                            onClear={() => setTargetForm(null)}
                            allDigimon={allDigimon}
                        />
                    </div>

                    <button
                        onClick={calculatePath}
                        disabled={isCalculateDisabled}
                        className={`w-full py-3 text-xl font-bold uppercase tracking-widest rounded-md transition-all duration-300 flex items-center justify-center
                            ${isCalculateDisabled
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/50'
                            }`}
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Calculating...</span>
                        ) : (
                            <>
                                <Award className="w-5 h-5 mr-3" />
                                Calculate Shortest Path
                            </>
                        )}
                    </button>
                </div>

                {/* Transformation Path Results */}
                {pathResult && (
                    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-xl border border-amber-500/50">
                        <h2 className="text-2xl font-regal text-amber-500 mb-6 border-b border-gray-700 pb-2">
                            Transformation Path
                        </h2>

                        {pathResult.length > 0 ? (
                            <div className="space-y-4">
                                {/* Display Path */}
                                {pathResult.map((digimon, index) => (
                                    <PathStep 
                                        key={digimon.name + index} 
                                        digimon={digimon} 
                                        index={index} 
                                    />
                                ))}
                                
                                {/* Save Button */}
                                <div className="text-center pt-4">
                                    <button className="py-2 px-6 bg-amber-600 text-gray-900 font-bold rounded-md flex items-center mx-auto hover:bg-amber-500 transition">
                                        <Save className="w-4 h-4 mr-2" /> Save this path
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xl text-red-400 p-4 text-center">
                                ERROR: No digivolution path found between {startForm.name} and {targetForm.name}.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigivolutionPlanner;