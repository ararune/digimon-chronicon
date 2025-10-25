// src/ArchiveView.jsx
import React from 'react';
import { useDigimonArchive } from './useDigimonArchive';
import ArchiveHeader from './ArchiveHeader';
import FilterControls from './FilterControls';
import DigimonGrid from './DigimonGrid';
import PaginationControls from './PaginationControls';

const ArchiveView = () => {
    const {
        digimonList, totalItems, totalPages, 
        searchTerm, filterGeneration, filterAttribute, currentPage, 
        allGenerations, allAttributes, allDigimon, 
        handleSearchChange, handleFilterChange, handlePageChange, navigateTo,
        navigateToDetail 
    } = useDigimonArchive(); 

    return (
        <div className="p-8 min-h-screen bg-dark-void text-white">
            
            <ArchiveHeader totalItems={totalItems} onNavigate={navigateTo} />
            <FilterControls
                searchTerm={searchTerm}
                filterGeneration={filterGeneration}
                filterAttribute={filterAttribute}
                allGenerations={allGenerations}
                allAttributes={allAttributes}
                allDigimon={allDigimon} 
                handleSearchChange={handleSearchChange}
                handleFilterChange={handleFilterChange}
                // --- FIX: Pass the function down to FilterControls ---
                navigateToDetail={navigateToDetail} 
            />

            <DigimonGrid 
                digimonList={digimonList} 
                totalItems={totalItems} 
                onCardClick={navigateToDetail} 
            />

            <PaginationControls 
                currentPage={currentPage} 
                totalPages={totalPages} 
                handlePageChange={handlePageChange}
            />
        </div>
    );
};

export default ArchiveView;