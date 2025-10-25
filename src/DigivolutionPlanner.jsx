// src/DigivolutionPlanner.jsx
import React, { useState, useMemo, useRef, useCallback } from 'react'; 
import { ChevronLeft, Dna, PlusCircle, Trash2, Search, Zap, CheckCircle, Waypoints, XCircle, BarChart, ArrowRight, Download, List, Grid } from 'lucide-react'; 
import { useDigimonArchive } from './useDigimonArchive';
import html2canvas from 'html2canvas';

// --- IMPORT CORE LOGIC ---
import { findShortestPath } from './digivolution-utils'; 

// --- ATTRIBUTE ICON MAP (Assuming a structure like this) ---
const ATTRIBUTE_ICONS = {
    Data: 'src/icons/data.png', 
    Free: 'src/icons/free.png',
    Vaccine: 'src/icons/vaccine.png',
    Virus: 'src/icons/virus.png',
};

const ALL_ATTRIBUTES = ['Data', 'Free', 'Vaccine', 'Virus'];


// -------------------------------------------------------------------
// --- SUB-COMPONENTS ---
// -------------------------------------------------------------------
// ... (CyberInput, PrimaryPlannerButton, RecessedPanel, PlannerSearchDropdownV2, 
//      DigimonSelectionPreview, InfographicConnector, PathNode, PathRenderer remain unchanged)
// -------------------------------------------------------------------


// Styled Input Component 
const CyberInput = ({ value, onChange, placeholder, Icon, children, onFocus, onBlur }) => (
    <div className="relative w-full">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-cyan/70" />
        <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={onFocus} 
            onBlur={onBlur} 
            placeholder={placeholder}
            className="w-full py-3 pl-10 pr-4 bg-dark-panel/50 text-white font-mono rounded-none border-2 border-accent-cyan/40 focus:outline-none 
                         focus:border-accent-blue/80 transition shadow-lg shadow-dark-void/50"
            style={{ boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.6), 0 0 5px rgba(51, 230, 204, 0.1)' }}
        />
        {children}
    </div>
);

// Styled Primary Action Button 
const PrimaryPlannerButton = ({ onClick, children, Icon, colorClass = 'text-accent-blue', disabled }) => {
    const baseColorRgb = colorClass.includes('cyan') ? '51, 230, 204' : 
                         colorClass.includes('green') ? '16, 185, 129' : 
                         '77, 182, 255'; 
    
    const buttonBg = 'bg-dark-panel/30';
    
    return (
        <button
            onClick={onClick}
            disabled={disabled} 
            className={`
                w-full py-4 px-8 text-xl font-bold uppercase tracking-widest 
                rounded-none transition-all duration-300 transform 
                flex items-center justify-center 
                ${buttonBg} backdrop-blur-sm 
                ${colorClass} hover:scale-[1.01]
                font-mono disabled:opacity-30 disabled:cursor-not-allowed
                border border-transparent 
            `}
            style={{ 
                boxShadow: `
                    0 0 15px 0 rgba(${baseColorRgb}, 0.6), 
                    inset 0 0 8px 0 rgba(${baseColorRgb}, 0.9)
                `,
                border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}
        >
            <Icon className="w-6 h-6 mr-3" />
            {children}
        </button>
    );
};

// Recessed Panel Container
const RecessedPanel = ({ title, children, Icon }) => (
    <div className="p-6 mb-8 relative">
        <h2 className="text-3xl font-regal tracking-wider text-accent-blue pb-2 mb-6 flex items-center">
            <Icon className="w-6 h-6 mr-3 text-accent-cyan" /> {title}
        </h2>
        <div className='w-full h-px bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent mb-8'></div>
        <div className="relative z-10">
            {children}
        </div>
    </div>
);


// --- NEW COMPONENT: Planner Search Dropdown V2 with Filters and View Switch ---
const PlannerSearchDropdownV2 = ({ suggestions, onSelect, activeFilter, setFilter, view, setView }) => {
    if (!suggestions) return null;

    const filteredSuggestions = useMemo(() => {
        if (!activeFilter) return suggestions;
        return suggestions.filter(d => d.attribute === activeFilter);
    }, [suggestions, activeFilter]);
    
    const scrollbarStyle = "styled-scrollbar-cyber"; 
    
    return (
        <div className="absolute z-40 mt-1 w-full bg-dark-panel/95 backdrop-blur-sm shadow-2xl shadow-accent-blue/50 
                     max-h-80 overflow-hidden border border-accent-cyan/30 rounded-none flex flex-col"> 
            
            {/* Header/Control Panel */}
            <div className='p-2 flex justify-between items-center border-b border-accent-cyan/30 flex-shrink-0'>
                
                {/* Attribute Filters */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter(null)}
                        className={`text-xs px-2 py-1 rounded-full font-mono transition ${!activeFilter ? 'bg-accent-blue text-dark-void' : 'bg-dark-void/50 text-text-low hover:bg-accent-blue/20'}`}
                        title="Show All Attributes"
                    >
                        ALL
                    </button>
                    {ALL_ATTRIBUTES.map(attr => (
                        <button
                            key={attr}
                            onClick={() => setFilter(attr)}
                            className={`w-7 h-7 p-0.5 rounded-full transition relative group ${activeFilter === attr ? 'bg-accent-cyan border-2 border-accent-blue' : 'bg-dark-void/50 border border-transparent hover:bg-accent-cyan/30'}`}
                            title={`Filter by ${attr}`}
                        >
                            <img src={ATTRIBUTE_ICONS[attr] || <Zap />} alt={attr} className='w-full h-full object-contain' />
                        </button>
                    ))}
                </div>

                {/* View Switch */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setView('list')}
                        className={`p-1 rounded transition ${view === 'list' ? 'text-accent-cyan bg-accent-cyan/20' : 'text-text-low hover:text-accent-cyan'}`}
                        title="List View"
                    >
                        <List className='w-5 h-5' />
                    </button>
                    <button
                        onClick={() => setView('grid')}
                        className={`p-1 rounded transition ${view === 'grid' ? 'text-accent-cyan bg-accent-cyan/20' : 'text-text-low hover:text-accent-cyan'}`}
                        title="Grid View"
                    >
                        <Grid className='w-5 h-5' />
                    </button>
                </div>
            </div>

            {/* Suggestions Container */}
            <div className={`p-1.5 overflow-y-auto flex-grow ${scrollbarStyle} ${view === 'grid' ? 'grid grid-cols-3 gap-2' : 'flex flex-col'}`}> 
                {filteredSuggestions.length === 0 ? (
                    <div className='text-center p-4 text-text-low/60 font-mono text-sm'>
                        No Digimon match your search and filter.
                    </div>
                ) : (
                    filteredSuggestions.map((digimon) => (
                        <div
                            key={digimon.name}
                            // Using onMouseDown to register click *before* onBlur fires
                            onMouseDown={(e) => { 
                                e.preventDefault(); // Prevents blur from hiding the dropdown immediately
                                onSelect(digimon.name);
                            }} 
                            className={`cursor-pointer transition duration-150 hover:bg-accent-blue/20 hover:shadow-md border-dark-void/50 ${view === 'list' ? 'flex items-center p-1.5 border-b last:border-b-0' : 'flex flex-col items-center justify-center p-2 rounded-lg bg-dark-void/30'}`} 
                        >
                            <div className={`${view === 'list' ? 'w-6 h-6 mr-2' : 'w-10 h-10 mb-1'} flex-shrink-0 overflow-hidden p-0.5`}> 
                                {digimon.image_path || digimon.url ? (
                                    <img src={digimon.image_path || digimon.url} alt={digimon.name} className="w-full h-full object-contain" />
                                ) : (
                                    <Zap className="w-full h-full text-text-low p-0.5" />
                                )}
                            </div>
                            <p className={`text-gray-100 ${view === 'list' ? 'text-sm' : 'text-xs'} font-regal leading-tight truncate`}> 
                                {digimon.name}
                            </p>
                            {view === 'grid' && (
                                <p className="text-xs font-mono text-text-low/70 mt-0.5">{digimon.attribute || digimon.generation}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Selection Preview
const DigimonSelectionPreview = ({ digimon, colorClass, onClear }) => {
    if (!digimon) return null;

    return (
        <div className={`mt-4 p-3 flex items-center justify-between bg-dark-panel/50 rounded-lg shadow-lg`}>
            <div className='flex items-center'>
                <div className="w-12 h-12 flex-shrink-0 mr-4 p-1 bg-dark-void/50 rounded-lg border border-accent-cyan/20">
                    {digimon.image_path || digimon.url ? (
                        <img src={digimon.image_path || digimon.url} alt={digimon.name} className="w-full h-full object-contain" />
                    ) : (
                        <Zap className={`w-full h-full text-${colorClass}/80 p-1`} />
                    )}
                </div>
                <div>
                    <h4 className={`text-xl font-regal text-${colorClass}`}>{digimon.name}</h4>
                    <p className="text-xs font-mono text-text-low">{digimon.generation || 'Unknown Level'}</p>
                </div>
            </div>
            <button 
                onClick={onClear} 
                className={`text-red-400 hover:text-red-300 transition p-1 rounded-full hover:bg-red-400/10`}
                title={`Clear ${digimon.name}`}
            >
                <XCircle className='w-6 h-6' />
            </button>
        </div>
    );
};

// Horizontal/Wrap Connector for Infographic Flow
const InfographicConnector = ({ steps }) => (
    <div className={`flex flex-col items-center justify-center p-4 relative`}>
        <span className="hidden md:block absolute -top-5 text-accent-cyan text-xs font-mono uppercase tracking-wider">
            STEP {steps}
        </span>
        <div className="relative z-10 p-1 rounded-full bg-dark-void shadow-lg shadow-accent-cyan/20">
            <ArrowRight size={18} strokeWidth={2} className="text-accent-cyan" />
        </div>
        <span className="md:hidden mt-2 text-accent-cyan text-xs font-mono uppercase tracking-wider">
            STEP {steps}
        </span>
    </div>
);

// Path Node Component
const PathNode = ({ digimon, isStart, isTarget }) => {
    const glowColor = isStart ? '51, 230, 204' : isTarget ? '77, 182, 255' : '16, 185, 129';
    const colorClass = isStart ? 'text-accent-cyan' : isTarget ? 'text-accent-blue' : 'text-gray-300';
    
    return (
        <div className="flex flex-col items-center flex-shrink-0 w-36 text-center py-2">
            <div 
                className={`w-28 h-28 mb-2 p-3 flex items-center justify-center rounded-full 
                            transition-all duration-200 bg-dark-panel/40`}
                style={{ 
                    border: `2px solid rgba(${glowColor}, 0.5)`,
                    boxShadow: `0 0 12px rgba(${glowColor}, 0.7)`
                }}
            >
                <div className='w-full h-full p-1 bg-dark-void/50 rounded-full flex items-center justify-center'> 
                    {digimon.image_path || digimon.url ? (
                        <img src={digimon.image_path || digimon.url} alt={digimon.name} className="w-full h-full object-contain" />
                    ) : (
                        <Zap className='w-1/2 h-1/2 text-text-low' />
                    )}
                </div>
            </div>
            <h4 className={`text-base font-regal leading-tight ${colorClass}`}>
                {digimon.name}
            </h4>
            <p className={`text-xs font-mono text-text-low mt-0.5`}>
                {digimon.generation}
            </p>
        </div>
    );
};

// Evolution Path Renderer
const PathRenderer = ({ path, pathIndex }) => {
    if (!path || path.length === 0) return null;

    const elements = path.filter(item => item.name || item.type === 'arrow');

    return (
        <div className="mb-10 pt-6">
            <h3 className="text-xl font-regal text-accent-cyan mb-8 flex items-center">
                <Waypoints className="w-5 h-5 mr-2 text-accent-blue"/> PATH {pathIndex}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-y-6">
                {elements.map((item, index) => {
                    if (item.type === 'arrow') {
                        return (
                            <InfographicConnector 
                                key={`arrow-${pathIndex}-${index}`} 
                                steps={item.steps} 
                            />
                        );
                    }
                    return (
                        <PathNode 
                            key={`node-${pathIndex}-${item.name}`}
                            digimon={item} 
                            isStart={item.isStart} 
                            isTarget={item.isTarget} 
                        />
                    );
                })}
            </div>
        </div>
    );
};

// -------------------------------------------------------------------
// --- MAIN COMPONENT ---
// -------------------------------------------------------------------

const DigivolutionPlanner = () => {
    const { navigateTo, allDigimon } = useDigimonArchive();
    
    // Planner State
    const [startDigimonName, setStartDigimonName] = useState('');
    const [targetDigimonName, setTargetDigimonName] = useState('');
    const [startSearchTerm, setStartSearchTerm] = useState('');
    const [targetSearchTerm, setTargetSearchTerm] = useState('');
    
    // New Dropdown State
    const [startAttributeFilter, setStartAttributeFilter] = useState(null);
    const [targetAttributeFilter, setTargetAttributeFilter] = useState(null);
    const [startView, setStartView] = useState('list'); // 'list' or 'grid'
    const [targetView, setTargetView] = useState('list');
    
    // State: Track focus state to show all suggestions
    const [isStartFocused, setIsStartFocused] = useState(false);
    const [isTargetFocused, setIsTargetFocused] = useState(false);
    const startInputRef = useRef(null);
    const targetInputRef = useRef(null);


    const [calculatedPaths, setCalculatedPaths] = useState([]);

    // REF TARGETING JUST THE CONTENT
    const pathContentRef = useRef(null); 

    // Get Digimon objects for display and validation
    const startDigimonObject = useMemo(() => allDigimon.find(d => d.name === startDigimonName), [startDigimonName, allDigimon]);
    const targetDigimonObject = useMemo(() => allDigimon.find(d => d.name === targetDigimonName), [targetDigimonName, allDigimon]);

    // Calculate number of steps: based on the first path found
    const stepCount = useMemo(() => {
        if (calculatedPaths.length === 0) return 0;
        return calculatedPaths[0].filter(item => item.type === 'arrow').length;
    }, [calculatedPaths]);

    // Logic for Search Suggestions
    const getSuggestions = useCallback((searchTerm, isFocused) => {
        const term = searchTerm.toLowerCase();
        
        // If focused and minimal input, show sorted list (up to 100)
        if (isFocused && term.length <= 1) {
            return allDigimon.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(0, 100);
        }
        
        // Otherwise, filter by search term (up to 100)
        return allDigimon
            .filter(d => d.name.toLowerCase().includes(term))
            .slice(0, 100); 
    }, [allDigimon]);

    const startSuggestions = useMemo(() => getSuggestions(startSearchTerm, isStartFocused), [startSearchTerm, getSuggestions, isStartFocused]);
    const targetSuggestions = useMemo(() => getSuggestions(targetSearchTerm, isTargetFocused), [targetSearchTerm, getSuggestions, isTargetFocused]);

    // Handlers
    const handleSelectStart = (name) => {
        setStartDigimonName(name);
        setStartSearchTerm(name);
        setIsStartFocused(false);
        setCalculatedPaths([]); 
    };

    const handleSelectTarget = (name) => {
        setTargetDigimonName(name);
        setTargetSearchTerm(name);
        setIsTargetFocused(false);
        setCalculatedPaths([]); 
    };

    const handleClearStart = () => {
        setStartDigimonName('');
        setStartSearchTerm('');
        setCalculatedPaths([]);
        setStartAttributeFilter(null);
    };

    const handleClearTarget = () => {
        setTargetDigimonName('');
        setTargetSearchTerm('');
        setCalculatedPaths([]);
        setTargetAttributeFilter(null);
    };
    
    // --- START OF REVISED CODE BLOCK ---
    const handleBlur = useCallback((
        setter,         // e.g., setIsStartFocused
        searchName,     // e.g., startSearchTerm
        setSelectedName // e.g., setStartDigimonName
    ) => {
        // Delay hide to allow onMouseDown (select) on dropdown items to fire first
        setTimeout(() => {
            setter(false);
            
            const validSelection = allDigimon.find(d => d.name === searchName);

            if (validSelection) {
                // If the user typed a valid Digimon name and blurred, treat it as a selection.
                setSelectedName(validSelection.name);
            } else {
                // If the text does not match a valid Digimon, clear both the selected name and the search term.
                setSelectedName('');
                if (setSelectedName === setStartDigimonName) setStartSearchTerm('');
                if (setSelectedName === setTargetDigimonName) setTargetSearchTerm('');
            }
        }, 150);
    }, [allDigimon, setStartDigimonName, setTargetDigimonName, setStartSearchTerm, setTargetSearchTerm]); 



    const handleCalculatePath = () => {
        if (startDigimonName && targetDigimonName) {
            // CALLING THE IMPORTED UTILITY FUNCTION
            const paths = findShortestPath(startDigimonName, targetDigimonName, allDigimon);
            setCalculatedPaths(paths);
            
            if (paths.length === 0 && startDigimonName !== targetDigimonName) {
                alert(`No path found from ${startDigimonName} to ${targetDigimonName}. This means the Digimon are not linked through any evolution or devolution chain.`);
            }
        } else {
            alert("Please select both a Start and a Target Digimon.");
        }
    };
    
    // PNG IMAGE DOWNLOAD 
    const handleDownloadImage = () => {
        if (pathContentRef.current) {
            const input = pathContentRef.current;
            
            html2canvas(input, { 
                scale: 3, 
                logging: false,
                useCORS: true, 
                backgroundColor: '#0a192f', 
                scrollY: -window.scrollY, 
            }).then((canvas) => {
                const image = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                
                a.href = image;
                const fileName = `${startDigimonName}_to_${targetDigimonName}_Path.png`;
                a.download = fileName.replace(/\s+/g, '_'); 
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

            }).catch(error => {
                console.error("Image generation failed:", error);
                alert("Failed to generate PNG image. Check the console for details.");
            });
        }
    };


    const isReadyToCalculate = startDigimonName && targetDigimonName;


    return (
        <div className="min-h-screen bg-dark-void text-white pb-16">
            <style global jsx>{`
                /* Thematic Scrollbar Styling */
                .styled-scrollbar-cyber::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .styled-scrollbar-cyber::-webkit-scrollbar-track {
                    background: rgba(10, 25, 47, 0.5); /* dark-void/50 */
                    border-radius: 10px;
                }
                .styled-scrollbar-cyber::-webkit-scrollbar-thumb {
                    background-color: #33e6cc; /* accent-cyan */
                    border-radius: 10px;
                    border: 2px solid #0a192f; /* dark-void */
                }
                .styled-scrollbar-cyber::-webkit-scrollbar-thumb:hover {
                    background-color: #4db6ff; /* accent-blue */
                }
            `}</style>
            
            {/* Header: Fixed Navigation Bar */}
            <div className="w-full backdrop-blur-md bg-dark-panel/80 sticky top-0 z-30 border-b border-accent-cyan/20">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigateTo('landing')}
                        className="flex items-center text-lg text-accent-blue hover:text-accent-cyan transition font-mono tracking-widest p-2 rounded-lg hover:bg-dark-void/50"
                    >
                        <ChevronLeft className="w-6 h-6 mr-2" /> EXIT PLANNER
                    </button>
                </div>
            </div>

            {/* Title Section */}
            <header className="max-w-6xl mx-auto px-4 mt-12 mb-16 relative z-10 text-center">
                <h1 className="text-6xl sm:text-7xl font-regal tracking-widest text-accent-cyan mb-2 leading-tight drop-shadow-[0_0_8px_rgba(77,182,255,0.7)]">
                    DIGIVOLUTION PLANNER
                </h1>
                <h2 className='text-xl font-mono text-text-low/80'>// MAPPING DIGITAL DESTINY</h2>
            </header>

            {/* Main Content Sections */}
            <main className="max-w-6xl mx-auto px-4">
                
                {/* Search Panel - Define Parameters */}
                <RecessedPanel title="DEFINE EVOLUTION PARAMETERS" Icon={Search}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Start Digimon Selection */}
                        <div className="relative z-20" ref={startInputRef}>
                            <h3 className="text-lg font-regal text-accent-cyan mb-2 flex items-center">
                                <PlusCircle className="w-5 h-5 mr-2" /> START DIGIMON
                            </h3>
                            <CyberInput
                                Icon={Search}
                                value={startSearchTerm} 
                                onChange={(e) => { 
                                    setStartSearchTerm(e.target.value);
                                    // If text changes, un-select the Digimon
                                    if (startDigimonName !== e.target.value) {
                                        setStartDigimonName('');
                                    }
                                }}
                                onFocus={() => setIsStartFocused(true)} 
                                // --- REVISED CALL SITE ---
                                onBlur={() => handleBlur(setIsStartFocused, startSearchTerm, setStartDigimonName)} 
                                // --- END REVISED CALL SITE ---
                                placeholder="Select Starting Digimon..."
                            >
                                {isStartFocused && (
                                    <PlannerSearchDropdownV2 
                                        suggestions={startSuggestions} 
                                        onSelect={handleSelectStart} 
                                        activeFilter={startAttributeFilter}
                                        setFilter={setStartAttributeFilter}
                                        view={startView}
                                        setView={setStartView}
                                    />
                                )}
                            </CyberInput>
                            <DigimonSelectionPreview 
                                digimon={startDigimonObject} 
                                colorClass="accent-cyan" 
                                onClear={handleClearStart}
                            />
                        </div>
                        
                        {/* Target Digimon Selection */}
                        <div className="relative z-20" ref={targetInputRef}>
                            <h3 className="text-lg font-regal text-accent-blue mb-2 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" /> TARGET DIGIMON
                            </h3>
                            <CyberInput
                                Icon={Search}
                                value={targetSearchTerm}
                                onChange={(e) => {
                                    setTargetSearchTerm(e.target.value);
                                    // If text changes, un-select the Digimon
                                    if (targetDigimonName !== e.target.value) {
                                        setTargetDigimonName('');
                                    }
                                }}
                                onFocus={() => setIsTargetFocused(true)} 
                                // --- REVISED CALL SITE ---
                                onBlur={() => handleBlur(setIsTargetFocused, targetSearchTerm, setTargetDigimonName)}
                                // --- END REVISED CALL SITE ---
                                placeholder="Select Target Digimon..."
                            >
                                {isTargetFocused && (
                                    <PlannerSearchDropdownV2 
                                        suggestions={targetSuggestions} 
                                        onSelect={handleSelectTarget} 
                                        activeFilter={targetAttributeFilter}
                                        setFilter={setTargetAttributeFilter}
                                        view={targetView}
                                        setView={setTargetView}
                                    />
                                )}
                            </CyberInput>
                            <DigimonSelectionPreview 
                                digimon={targetDigimonObject} 
                                colorClass="accent-blue" 
                                onClear={handleClearTarget} 
                            />
                        </div>
                    </div>
                    
                    {/* Calculation Button & Full Reset */}
                    <div className="mt-10 pt-6 flex flex-col items-center">
                            <PrimaryPlannerButton 
                                onClick={handleCalculatePath}
                                Icon={Dna}
                                colorClass={isReadyToCalculate ? 'text-green-400' : 'text-gray-500'}
                                disabled={!isReadyToCalculate} 
                            >
                                CALCULATE SHORTEST PATH
                            </PrimaryPlannerButton>
                            <button 
                                onClick={() => { 
                                    setStartDigimonName(''); 
                                    setTargetDigimonName(''); 
                                    setStartSearchTerm(''); 
                                    setTargetSearchTerm(''); 
                                    setCalculatedPaths([]); 
                                    setIsStartFocused(false); 
                                    setIsTargetFocused(false); 
                                    setStartAttributeFilter(null); 
                                    setTargetAttributeFilter(null);
                                }}
                                className="mt-4 text-sm font-mono text-red-400 hover:text-red-300 flex items-center justify-center w-full max-w-sm"
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> FULL RESET
                            </button>
                    </div>
                </RecessedPanel>

                {/* --- PATH OUTPUT SECTION (Infographic Grid Style) --- */}
                <RecessedPanel title="EVOLUTION PATHS" Icon={BarChart}> 
                    
                    {/* REF: The container we want to capture */}
                    <div 
                        className="min-h-64pt-8"
                        ref={pathContentRef} 
                        style={{ background: 'transparent' }} 
                    >
                        
                        {calculatedPaths.length === 0 && (
                            <div className="text-center p-10 text-text-low/70 font-mono">
                                {isReadyToCalculate ? (
                                    <span>&gt; **PRESS CALCULATE TO GENERATE PATH**</span>
                                ) : (
                                    <span>&gt; **AWAITING SELECTION**</span>
                                )}
                            </div>
                        )}

                        {calculatedPaths.map((path, index) => (
                            <React.Fragment key={index}>
                                <PathRenderer path={path} pathIndex={index + 1} />
                                {index < calculatedPaths.length - 1 && (
                                    <div className='w-full h-px my-8 bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent'></div>
                                )}
                            </React.Fragment>
                        ))}
                        
                        {calculatedPaths.length > 1 && (
                            <p className="text-sm font-mono text-green-400 text-center py-4">
                                **{calculatedPaths.length}** EQUALLY SHORT PATHS FOUND.
                            </p>
                        )}
                    </div>
                    
                    {/* Steps Count Display */}
                    <div className="text-center mb-10">
                        <h3 className="text-7xl font-regal text-green-400 tracking-wider drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]">
                            {stepCount}
                        </h3>
                        <p className="text-lg font-mono text-green-400/80">
                            {stepCount === 1 ? 'STEP' : 'STEPS'}
                        </p>
                    </div>
                    
                    {/* Download Button */}
                    {calculatedPaths.length > 0 && (
                        <div className='mt-8 pt-4'>
                            <PrimaryPlannerButton 
                                onClick={handleDownloadImage}
                                Icon={Download}
                                colorClass='text-accent-cyan'
                            >
                                DOWNLOAD PATH (PNG IMAGE)
                            </PrimaryPlannerButton>
                        </div>
                    )}
                </RecessedPanel>

            </main>
        </div>
    );
};

export default DigivolutionPlanner;