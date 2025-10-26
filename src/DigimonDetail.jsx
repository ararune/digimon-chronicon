// src/DigimonDetail.jsx
import React from 'react';
import { useDigimonArchive } from './useDigimonArchive';
import { 
    ChevronLeft, Award, BookOpen, Database, Target, Smile, Heart, 
    Zap, Scale, User, Dna, Hexagon 
} from 'lucide-react'; 
import { Heart as HP, Bolt as SP, Shield as DEF, Brain as INT, Zap as ATK, Gauge as SPI, Clock as SPD } from 'lucide-react'; 

import vaccineIcon from './icons/vaccine.png';
import dataIcon from './icons/data.png';
import virusIcon from './icons/virus.png';
import freeIcon from './icons/free.png'; 

import CyberNavbar from './CyberNavbar'; 

const defaultIcon = Database; 

// =============================================================================
// --- UTILITY FUNCTIONS (Defined OUTSIDE Component) ---
// =============================================================================

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

const getAttributeIcon = (attribute) => {
    switch (attribute) {
        case 'Vaccine':
            return { type: 'img', src: vaccineIcon, alt: 'Vaccine Icon', className: 'w-6 h-6' };
        case 'Data':
            return { type: 'img', src: dataIcon, alt: 'Data Icon', className: 'w-6 h-6' };
        case 'Virus':
            return { type: 'img', src: virusIcon, alt: 'Virus Icon', className: 'w-7 h-7' }; 
        case 'Free':
            return { type: 'img', src: freeIcon, alt: 'Free Icon', className: 'w-6 h-6' };
        default:
            return { type: 'lucide', component: defaultIcon }; 
    }
};

const getPersonalityIcon = (personality) => {
    switch (personality) {
        case 'Philanthropy': return Heart; 
        case 'Valor': return Zap; 
        case 'Wisdom': return Target; 
        case 'Amicability': return Smile; 
        default: return User; 
    }
};

const getStatProps = (statName) => {
    switch (statName) {
        case 'HP': return { Icon: HP, iconColor: 'text-red-400', barColor: 'bg-red-500', mutedBg: 'bg-red-900/30' }; 
        case 'SP': return { Icon: SP, iconColor: 'text-blue-400', barColor: 'bg-blue-500', mutedBg: 'bg-blue-900/30' }; 
        case 'ATK': return { Icon: ATK, iconColor: 'text-orange-400', barColor: 'bg-orange-500', mutedBg: 'bg-orange-900/30' }; 
        case 'DEF': return { Icon: DEF, iconColor: 'text-green-400', barColor: 'bg-green-500', mutedBg: 'bg-green-900/30' }; 
        case 'INT': return { Icon: INT, iconColor: 'text-purple-400', barColor: 'bg-purple-500', mutedBg: 'bg-purple-900/30' }; 
        case 'SPI': return { Icon: SPI, iconColor: 'text-cyan-400', barColor: 'bg-cyan-500', mutedBg: 'bg-cyan-900/30' }; 
        case 'SPD': return { Icon: SPD, iconColor: 'text-yellow-400', barColor: 'bg-yellow-500', mutedBg: 'bg-yellow-900/30' }; 
        default: return { Icon: Database, iconColor: 'text-gray-400', barColor: 'bg-gray-500', mutedBg: 'bg-gray-700/30' };
    }
};


// =============================================================================
// --- SUB-COMPONENTS ---
// =============================================================================

const DigimonEvolutionNode = ({ digimon, isCurrent, navigateTo }) => {
    const generationColorClass = getGenerationColorClass(digimon.generation);
    const sizeClasses = "w-28 h-28 sm:w-36 sm:h-36"; 

    const baseShadowClass = 'shadow-md shadow-accent-cyan/10'; 
    const highlightGlow = 'shadow-lg shadow-accent-blue/70 animate-pulse-light-blue-fast'; 
    const hoverGlow = 'group-hover:shadow-xl group-hover:shadow-accent-cyan/50'; 

    return (
        <div 
            onClick={() => navigateTo('detail', digimon.name)} 
            className={`flex flex-col items-center group transition-all duration-200 cursor-pointer w-32 sm:w-40 flex-shrink-0 text-center`}
        >
            <div 
                className={`relative ${sizeClasses} mb-2 bg-dark-panel/40 p-2 flex items-center justify-center rounded-xl 
                            ${baseShadowClass} ${isCurrent ? highlightGlow : hoverGlow}
                            transition-all duration-200`}
            >
                <div className={`w-full h-full p-1 bg-dark-void/50 rounded-lg flex items-center justify-center`}> 
                    {digimon.url || digimon.image_path ? (
                        <img 
                            src={digimon.url || digimon.image_path} 
                            alt={digimon.name} 
                            className="w-full h-full object-contain" 
                        />
                    ) : (
                        <div className="text-text-low text-sm font-mono">NO IMAGE</div>
                    )}
                </div>
            </div>
            
            <h4 className={`text-base sm:text-lg font-regal leading-tight px-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-full ${isCurrent ? 'text-accent-blue font-extrabold' : 'text-gray-300 group-hover:text-accent-cyan'}`}>
                {digimon.name}
            </h4>
            <p className={`text-sm font-mono ${generationColorClass} mt-0.5`}>
                {digimon.generation}
            </p>
        </div>
    );
};

const EvolutionTree = ({ currentDigimon, evolvesFrom, evolvesTo, navigateTo }) => {
    const hasEvolution = evolvesFrom?.length > 0 || evolvesTo?.length > 0;

    if (!hasEvolution) return null;

    const NodeWrapper = ({ children }) => (
        <div className="flex flex-wrap justify-center items-start gap-3 sm:gap-6 px-4">
            {children}
        </div>
    );
    
    const EvolutionLine = () => (
        <div className="relative w-full flex justify-center my-4">
             <div className="w-px h-10 bg-accent-cyan/70 shadow-md shadow-accent-cyan/50"></div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center pt-8 pb-12 relative">
            <h2 className="text-3xl font-regal tracking-wider text-accent-blue pb-2 flex items-center mb-8">
                <Dna className="w-6 h-6 mr-3 text-accent-cyan" /> 
                <span className='pb-1'>DIGIVOLUTION TREE</span>
            </h2>
            
            {evolvesFrom?.length > 0 && (
                <>
                    <NodeWrapper>
                        {evolvesFrom.map((digimon) => (
                            <DigimonEvolutionNode 
                                key={`from-${digimon.name}`}
                                digimon={digimon}
                                isCurrent={false}
                                navigateTo={navigateTo}
                            />
                        ))}
                    </NodeWrapper>
                    <EvolutionLine />
                </>
            )}

            <DigimonEvolutionNode 
                digimon={currentDigimon}
                isCurrent={true}
                navigateTo={navigateTo}
            />

            {evolvesTo?.length > 0 && (
                <>
                    <EvolutionLine />
                    <NodeWrapper>
                        {evolvesTo.map((digimon) => (
                            <DigimonEvolutionNode 
                                key={`to-${digimon.name}`}
                                digimon={digimon}
                                isCurrent={false}
                                navigateTo={navigateTo}
                            />
                        ))}
                    </NodeWrapper>
                </>
            )}
            
            <div className='absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent'></div>
        </div>
    );
};


const StatBar = ({ Icon, statName, value, iconColor, barColor, mutedBg, maxValue = 20000 }) => {
    const percentage = Math.min(100, (value / maxValue) * 100);

    return (
        <div className="flex items-center space-x-4 py-2">
            <div className="flex items-center justify-center w-12 h-12 flex-shrink-0"> 
                <Icon className={`w-6 h-6 ${iconColor} drop-shadow-[0_0_3px_rgba(51,230,204,0.6)]`} />
            </div>
            <div className={`w-56 sm:w-80 flex-grow-0 h-6 ${mutedBg} rounded-none relative overflow-hidden`}
                style={{ boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.7), inset 0 0 3px rgba(77, 182, 255, 0.2)' }}> 
                <div 
                    className={`${barColor} h-full rounded-none transition-all duration-500 ease-out`} 
                    style={{ 
                        width: `${percentage}%`,
                        boxShadow: `0 0 5px rgba(255, 255, 255, 0.1), 0 0 8px ${barColor.split('-')[1]}`,
                    }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-extrabold text-white tracking-widest">
                    {statName}: {value}
                </span>
            </div>
            <span className="text-sm font-mono text-text-low hidden sm:block">
                ({Math.round(percentage)}%)
            </span>
        </div>
    );
};

const BaseStatsGrid = ({ stats }) => {
    if (!stats) return null;

    const statsOrder = ['HP', 'SP', 'ATK', 'DEF', 'INT', 'SPI', 'SPD'];
    const maxStatValue = 20000; 
    const totalStatValue = stats['Total']?.lv99 || 0;

    return (
        <section className="py-12 relative bg-dark-panel/30 backdrop-blur-md 
                             border-2 border-accent-cyan/40 shadow-2xl shadow-accent-blue/40 rounded-lg"> 
            <div className="absolute inset-0 pointer-events-none rounded-lg" 
                style={{ boxShadow: 'inset 0 0 40px rgba(51, 230, 204, 0.08)' }}></div>
            
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <h2 className="text-3xl font-regal tracking-wider text-accent-blue pb-2 mb-8 flex items-center">
                    <Scale className="w-6 h-6 mr-3 text-accent-cyan" /> BASE STATS (LV 99)
                </h2 >
                <div className='w-full h-px bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent mb-6'></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                    {statsOrder.map((statName) => {
                        const stat = stats[statName];
                        if (!stat || !stat.lv99) return null; 
                        const { Icon, iconColor, barColor, mutedBg } = getStatProps(statName);

                        return (
                            <StatBar
                                key={statName}
                                Icon={Icon}
                                statName={statName}
                                value={stat.lv99}
                                iconColor={iconColor}
                                barColor={barColor}
                                mutedBg={mutedBg}
                                maxValue={maxStatValue}
                            />
                        );
                    })}
                </div>
                
                <div className="mt-12 pt-6 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xl font-regal text-accent-cyan tracking-wider">
                        // GRAND_TOTAL_POWER
                    </span>
                    <p className="text-7xl font-extrabold font-mono text-accent-blue"
                        style={{ textShadow: '0 0 15px rgba(77, 182, 255, 0.9), 0 0 5px rgba(255, 255, 255, 0.3)' }}>
                        {totalStatValue}
                    </p>
                    <span className="text-sm font-mono text-text-low">
                        // SUM_OF_LV99_BASE_PARAMETERS
                    </span>
                </div>
            </div>
        </section>
    );
};

const DataCardAbstract = ({ Icon, label, value, valueClass = 'text-gray-300' }) => (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-dark-panel/40 rounded-lg min-w-[120px] text-center backdrop-blur-sm transition hover:bg-dark-panel/60 shadow-data-inner hover:shadow-lg hover:shadow-accent-blue/20"
        style={{ boxShadow: '0 0 5px rgba(77, 182, 255, 0.1)' }}>
        <Icon className="w-6 h-6 mb-2 text-accent-cyan drop-shadow-[0_0_3px_rgba(0,173,181,0.6)]" />
        <span className="font-regal text-text-low text-xs sm:text-sm uppercase tracking-wider mb-1">{label}</span>
        <span className={`text-lg sm:text-xl font-bold font-mono ${valueClass}`}>{value}</span>
    </div>
);

const AttributeInfoCardAbstract = ({ attribute, iconDetails }) => (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-dark-panel/40 rounded-lg min-w-[120px] text-center backdrop-blur-sm transition hover:bg-dark-panel/60 shadow-data-inner hover:shadow-lg hover:shadow-accent-blue/20"
        style={{ boxShadow: '0 0 5px rgba(77, 182, 255, 0.1)' }}>
        {iconDetails.type === 'img' ? (
            <img src={iconDetails.src} alt={iconDetails.alt} className={`mb-2 ${iconDetails.className}`} />
        ) : (
            <iconDetails.component className="w-6 h-6 mb-2 text-accent-cyan drop-shadow-[0_0_3px_rgba(0,173,181,0.6)]" />
        )}
        <span className="font-regal text-text-low text-xs sm:text-sm uppercase tracking-wider mb-1">Attribute</span>
        <span className={`text-lg sm:text-xl font-bold font-mono ${attribute === 'Vaccine' ? 'text-green-300' : attribute === 'Virus' ? 'text-red-300' : 'text-blue-300'}`}>
            {attribute}
        </span>
    </div>
);

const DigimonDescriptionPanel = ({ description }) => (
    <div className="p-6 rounded-lg transition">
        <h3 className="text-xl font-regal text-accent-blue mb-4 flex items-center pb-2">
            <BookOpen className="w-5 h-5 mr-2 text-accent-cyan" /> ARCHIVE ENTRY
        </h3>
        <div className='w-full h-px bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent mb-6'></div>

        <p className="text-gray-400 italic leading-relaxed text-base font-sans">
            {description}
        </p>
    </div>
);

const PersonalityQuadrant = ({ name, traits }) => {
    const Icon = getPersonalityIcon(name);

    return (
        <div className="p-5 rounded-xl bg-dark-panel/30 transition hover:bg-dark-panel/50 relative overflow-hidden backdrop-blur-sm shadow-xl shadow-dark-void/50"
            style={{ border: '1px solid rgba(77, 182, 255, 0.1)', boxShadow: '0 0 15px rgba(77, 182, 255, 0.2)' }}>
            <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: 'inset 0 0 10px rgba(51, 230, 204, 0.15)' }}></div>
            
            <h4 className="text-xl font-regal text-accent-blue mb-3 flex items-center pb-2 relative z-10">
                <Icon className="w-5 h-5 mr-2 text-accent-cyan drop-shadow-[0_0_3px_rgba(0,173,181,0.6)]" /> {name}
            </h4>

            <div className='w-full h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent mb-4'></div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm relative z-10">
                {Object.entries(traits).map(([trait, percentage]) => (
                    <div key={trait} className="flex justify-between items-center text-text-low">
                        <span className="font-sans text-gray-400">{trait}:</span> 
                        <span className={`font-mono font-bold ${percentage !== '0.00%' ? 'text-accent-cyan' : 'text-gray-500'}`}>
                            {percentage}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


// =============================================================================
// --- MAIN COMPONENT ---
// =============================================================================

const DigimonDetail = () => {
    const { selectedDigimon, navigateTo } = useDigimonArchive(); 
    
    if (!selectedDigimon) {
        return (
            <CyberNavbar onNavigate={navigateTo}> 
                <div className="p-8 min-h-screen bg-dark-void text-white flex flex-col items-center justify-center">
                    <p className="text-2xl text-red-500 mb-4 font-regal">ERROR: DIGIMON NOT FOUND.</p>
                    <button
                        onClick={() => navigateTo('archive')}
                        className="mt-6 flex items-center text-xl text-accent-blue hover:text-accent-cyan transition font-mono p-3 rounded-lg bg-dark-panel/50"
                    >
                        <ChevronLeft className="w-6 h-6 mr-3" /> RETURN TO ARCHIVE
                    </button>
                </div>
            </CyberNavbar>
        );
    }

    const { 
        name, image_path, attribute, generation, description, 
        possible_personalities, base_personality, type, base_stats,
        evolves_from, evolves_to 
    } = selectedDigimon; 
    
    const iconDetails = getAttributeIcon(attribute);
    const BasePersonalityIcon = getPersonalityIcon(base_personality);

    return (
        <CyberNavbar onNavigate={navigateTo}>
            <div className="min-h-screen bg-dark-void text-white pb-16">
                
                <div className="max-w-6xl mx-auto px-4 pt-6">
                    <button
                        onClick={() => navigateTo('archive')}
                        className="flex items-center text-lg text-accent-blue hover:text-accent-cyan transition font-mono tracking-widest p-2 rounded-md hover:bg-dark-panel/40"
                    >
                        <ChevronLeft className="w-6 h-6 mr-2" /> 
                        RETURN TO ARCHIVE
                    </button>
                </div>
                
                {/* --- PRIMARY DIGIMON INFO SECTION: Layered Digital Header --- */}
                <header className="max-w-6xl mx-auto px-4 mt-8 mb-16 relative z-10">
                    
                    <div className="relative rounded-xl p-6 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        <div className="col-span-1 flex flex-col justify-start items-center p-4 relative">
                            <div className="relative w-full max-w-[280px] sm:max-w-[350px] aspect-square flex items-center justify-center 
                                             bg-dark-void/70 rounded-3xl overflow-hidden 
                                             animate-pulse-light-blue-fast border border-accent-cyan/10" 
                                            style={{ transform: 'rotate(0deg)' }} 
                            > 
                                {/* Scanning Line Effect */}
                                <div className="absolute top-0 left-0 w-full h-full"> 
                                    <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-blue/80 to-transparent animate-scan-line origin-top"></div>
                                </div>
                                
                                <img 
                                    src={image_path} 
                                    alt={name} 
                                    className="w-full h-full object-contain scale-100" 
                                />
                            </div>
                        </div>

                        {/* Middle Section: Name & Core Metadata */}
                        <div className="lg:col-span-2 flex flex-col justify-start text-center lg:text-left pt-6">
                            <div className='w-full'>
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-regal tracking-widest text-accent-blue mb-2 leading-tight break-words drop-shadow-[0_0_8px_rgba(51,230,204,0.9)]">
                                    {name}
                                </h1>
                            </div>
                            <h2 className='text-lg font-mono text-accent-cyan/70 mb-8'>// DIGITAL TRACE FILE FOUND</h2>

                            {/* Info Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                <DataCardAbstract 
                                    Icon={Award} 
                                    label="Generation" 
                                    value={generation} 
                                    valueClass={getGenerationColorClass(generation)} 
                                />
                                <AttributeInfoCardAbstract 
                                    attribute={attribute} 
                                    iconDetails={iconDetails} 
                                />
                                {base_personality && (
                                    <DataCardAbstract 
                                        Icon={BasePersonalityIcon} 
                                        label="Base Personality" 
                                        value={base_personality} 
                                        valueClass="text-yellow-400"
                                    />
                                )}
                                <DataCardAbstract 
                                    Icon={Hexagon} 
                                    label="Type" 
                                    value={type} 
                                    valueClass="text-accent-cyan" 
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- DIGIMON DESCRIPTION PANEL --- */}
                <section className="max-w-6xl mx-auto px-4 mb-16">
                    <DigimonDescriptionPanel description={description} />
                </section>

                {/* --- EVOLUTION TREE --- */}
                {(evolves_from?.length > 0 || evolves_to?.length > 0) && (
                    <section className="max-w-6xl mx-auto px-4 pb-12">
                        <EvolutionTree 
                            currentDigimon={selectedDigimon}
                            evolvesFrom={evolves_from}
                            evolvesTo={evolves_to}
                            navigateTo={navigateTo}
                        />
                    </section>
                )}

                {/* --- BASE STATS GRID --- */}
                <BaseStatsGrid stats={base_stats} />

                {/* --- PERSONALITY MATRIX --- */}
                {possible_personalities && (
                    <section className="py-12">
                        <div className="max-w-4xl mx-auto px-4">
                            <h2 className="text-3xl font-regal tracking-wider text-accent-blue pb-2 mb-8">
                                PERSONALITY PROBABILITY
                            </h2>
                            <div className='w-full h-px mb-6'></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(possible_personalities).map(([name, traits]) => (
                                    <PersonalityQuadrant key={name} name={name} traits={traits} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

            </div>
        </CyberNavbar>
    );
};

export default DigimonDetail;