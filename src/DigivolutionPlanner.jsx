// src/DigivolutionPlanner.jsx
import React, { useState, useMemo, useRef, useCallback } from 'react'; 
import { Dna, PlusCircle, Trash2, Search, Zap, CheckCircle, BarChart, Download } from 'lucide-react'; 
import { useDigimonArchive } from './useDigimonArchive';
import html2canvas from 'html2canvas';

// --- IMPORT CORE LOGIC ---
import { findShortestPath } from './digivolution-utils'; 

// --- IMPORT NAVBAR AND SUB-COMPONENTS ---
import CyberNavbar from './CyberNavbar'; // <-- IMPORT CYBER NAVBAR
import { 
    CyberInput, 
    PrimaryPlannerButton, 
    RecessedPanel, 
    PlannerSearchDropdownV2, 
    DigimonSelectionPreview, 
    PathRenderer,
} from './DigivolutionPlanner.components';


// -------------------------------------------------------------------
// --- MAIN COMPONENT ---
// -------------------------------------------------------------------

// Receive the onNavigate prop, as passed from App.jsx
const DigivolutionPlanner = ({ onNavigate }) => {
    // Destructure navigateTo from the hook, but prioritize the onNavigate prop
    // NOTE: If you need navigateTo elsewhere for local logic, keep it, but for nav, use the prop.
    const { allDigimon } = useDigimonArchive();
    
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

    const pathContentRef = useRef(null); 

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
        
        if (isFocused && term.length <= 1) {
            return allDigimon.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(0, 100);
        }
        
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
    
    const handleBlur = useCallback((
        setter,     
        searchName,     
        setSelectedName 
    ) => {
        setTimeout(() => {
            setter(false);
            
            const validSelection = allDigimon.find(d => d.name === searchName);

            if (validSelection) {
                setSelectedName(validSelection.name);
            } else {
                setSelectedName('');
                if (setSelectedName === setStartDigimonName) setStartSearchTerm('');
                if (setSelectedName === setTargetDigimonName) setTargetSearchTerm('');
            }
        }, 150);
    }, [allDigimon]); 


    const handleCalculatePath = () => {
        if (startDigimonName && targetDigimonName) {
            const paths = findShortestPath(startDigimonName, targetDigimonName, allDigimon);
            setCalculatedPaths(paths);
            
            if (paths.length === 0 && startDigimonName !== targetDigimonName) {
                alert(`No path found from ${startDigimonName} to ${targetDigimonName}. This means the Digimon are not linked through any evolution or devolution chain.`);
            }
        } else {
            alert("Please select both a Start and a Target Digimon.");
        }
    };
    
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
            
            {/* 1. Navbar: Use the shared CyberNavbar component */}
            <CyberNavbar onNavigate={onNavigate} /> 

            {/* 2. Title Section (moved down, no longer fixed header) */}
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
                                onBlur={() => handleBlur(setIsStartFocused, startSearchTerm, setStartDigimonName)} 
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
                                onBlur={() => handleBlur(setIsTargetFocused, targetSearchTerm, setTargetDigimonName)}
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