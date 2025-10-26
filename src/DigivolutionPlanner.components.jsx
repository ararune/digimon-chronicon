// src/DigivolutionPlanner.components.jsx
import React from 'react'; 
import { Search, Zap, CheckCircle, Waypoints, ArrowRight, List, Grid, XCircle } from 'lucide-react'; 

// Utility function to map color prop to static Tailwind classes
const getColorClass = (colorClass) => {
    if (colorClass.includes('cyan')) return 'text-accent-cyan';
    if (colorClass.includes('blue')) return 'text-accent-blue';
    if (colorClass.includes('green')) return 'text-green-400';
    return 'text-white'; // Default fallback
};

// --- ATTRIBUTE ICON MAP ---
export const ATTRIBUTE_ICONS = {
    Data: 'src/icons/data.png', 
    Free: 'src/icons/free.png',
    Vaccine: 'src/icons/vaccine.png',
    Virus: 'src/icons/virus.png',
};

export const ALL_ATTRIBUTES = ['Data', 'Free', 'Vaccine', 'Virus'];


// -------------------------------------------------------------------
// --- SUB-COMPONENTS (Moved from DigivolutionPlanner.jsx) ---
// -------------------------------------------------------------------

// Styled Input Component 
export const CyberInput = ({ value, onChange, placeholder, Icon, children, onFocus, onBlur }) => (
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

// Styled Primary Action Button - AESTHETIC FIX APPLIED HERE
export const PrimaryPlannerButton = ({ onClick, children, Icon, colorClass = 'text-accent-blue', disabled }) => {
    
    // Define base colors (RGB) for subtle shadows
    const baseColorRgb = colorClass.includes('cyan') ? '51, 230, 204' : 
                         colorClass.includes('green') ? '16, 185, 129' : 
                         '77, 182, 255'; 
    
    // Define Tailwind classes for hover/text based on colorClass
    const hoverClass = colorClass.includes('cyan') ? 'hover:shadow-cyan-400/50 hover:border-accent-cyan' : 
                       colorClass.includes('green') ? 'hover:shadow-green-400/50 hover:border-green-400' : 
                       'hover:shadow-blue-400/50 hover:border-accent-blue';

    const buttonBg = 'bg-dark-panel/40';
    
    return (
        <button
            onClick={onClick}
            disabled={disabled} 
            className={`
                w-full py-4 px-8 text-xl font-bold uppercase tracking-widest 
                rounded-none transition-all duration-300 transform 
                flex items-center justify-center 
                ${buttonBg} backdrop-blur-sm 
                ${getColorClass(colorClass)} 
                font-mono disabled:opacity-40 disabled:cursor-not-allowed
                
                // Base styles for sleek look
                border border-white/10 
                shadow-lg shadow-dark-void/70
                
                // Interactive styles
                hover:scale-[1.005]
                ${hoverClass}
                hover:shadow-2xl
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-void focus:ring-opacity-80
            `}
            style={{ 
                // Using subtle custom box-shadows for the 'sleek' look
                boxShadow: `
                    0 4px 15px rgba(0, 0, 0, 0.3),            /* General depth */
                    inset 0 0 15px rgba(255, 255, 255, 0.05), /* Inner subtle light */
                    0 0 5px rgba(${baseColorRgb}, 0.3)        /* Extremely faint colored glow */
                `,
                // Adding a focused ring style 
                '--tw-ring-color': `rgba(${baseColorRgb}, 0.8)`,
            }}
        >
            <Icon className="w-6 h-6 mr-3" />
            {children}
        </button>
    );
};

// Recessed Panel Container
export const RecessedPanel = ({ title, children, Icon }) => (
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


// Planner Search Dropdown V2 with Filters and View Switch
export const PlannerSearchDropdownV2 = ({ suggestions, onSelect, activeFilter, setFilter, view, setView }) => {
    if (!suggestions) return null;

    const filteredSuggestions = React.useMemo(() => {
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
                        // FIX: Prevent focus loss when clicking filter buttons
                        onMouseDown={(e) => e.preventDefault()} 
                        onClick={() => setFilter(null)}
                        className={`text-xs px-2 py-1 rounded-full font-mono transition ${!activeFilter ? 'bg-accent-blue text-dark-void' : 'bg-dark-void/50 text-text-low hover:bg-accent-blue/20'}`}
                        title="Show All Attributes"
                    >
                        ALL
                    </button>
                    {ALL_ATTRIBUTES.map(attr => (
                        <button
                            // FIX: Prevent focus loss when clicking filter buttons
                            onMouseDown={(e) => e.preventDefault()} 
                            key={attr}
                            onClick={() => setFilter(attr)}
                            className={`w-7 h-7 p-0.5 rounded-full transition relative group ${activeFilter === attr ? 'bg-accent-cyan border-2 border-accent-blue' : 'bg-dark-void/50 border border-transparent hover:bg-accent-cyan/30'}`}
                            title={`Filter by ${attr}`}
                        >
                            {/* Assuming ATTRIBUTE_ICONS[attr] is a valid path string */}
                            {ATTRIBUTE_ICONS[attr] ? (
                                <img src={ATTRIBUTE_ICONS[attr]} alt={attr} className='w-full h-full object-contain' />
                            ) : (
                                <Zap className="w-full h-full text-text-low p-0.5" />
                            )}
                        </button>
                    ))}
                </div>

                {/* View Switch */}
                <div className="flex space-x-2">
                    <button
                        // FIX: Prevent focus loss when clicking view buttons
                        onMouseDown={(e) => e.preventDefault()} 
                        onClick={() => setView('list')}
                        className={`p-1 rounded transition ${view === 'list' ? 'text-accent-cyan bg-accent-cyan/20' : 'text-text-low hover:text-accent-cyan'}`}
                        title="List View"
                    >
                        <List className='w-5 h-5' />
                    </button>
                    <button
                        // FIX: Prevent focus loss when clicking view buttons
                        onMouseDown={(e) => e.preventDefault()} 
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
export const DigimonSelectionPreview = ({ digimon, colorClass, onClear }) => {
    if (!digimon) return null;
    
    const textColorClass = getColorClass(colorClass);

    return (
        <div className={`mt-4 p-3 flex items-center justify-between bg-dark-panel/50 rounded-lg shadow-lg`}>
            <div className='flex items-center'>
                <div className="w-12 h-12 flex-shrink-0 mr-4 p-1 bg-dark-void/50 rounded-lg border border-accent-cyan/20">
                    {digimon.image_path || digimon.url ? (
                        <img src={digimon.image_path || digimon.url} alt={digimon.name} className="w-full h-full object-contain" />
                    ) : (
                        // Use static class instead of dynamic concatenation
                        <Zap className={`w-full h-full ${textColorClass}/80 p-1`} /> 
                    )}
                </div>
                <div>
                    {/* Use static class instead of dynamic concatenation */}
                    <h4 className={`text-xl font-regal ${textColorClass}`}>{digimon.name}</h4>
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
export const InfographicConnector = ({ steps }) => (
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
export const PathNode = ({ digimon, isStart, isTarget }) => {
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
export const PathRenderer = ({ path, pathIndex }) => {
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