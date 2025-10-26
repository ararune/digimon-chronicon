// src/ArchiveView.jsx
import React from 'react';
import { useDigimonArchive } from './useDigimonArchive';
import CyberNavbar from './CyberNavbar'; 
import ArchiveHeader from './ArchiveHeader';
import FilterControls from './FilterControls';
import DigimonGrid from './DigimonGrid';
import PaginationControls from './PaginationControls';


const ArchiveView = ({ onNavigate }) => { 
    const {
        digimonList, totalItems, totalPages, 
        searchTerm, filterGeneration, filterAttribute, currentPage, 
        allGenerations, allAttributes, allDigimon, 
        handleSearchChange, handleFilterChange, handlePageChange, 
        navigateToDetail 
    } = useDigimonArchive(); 

    return (
        <div className="min-h-screen bg-dark-void text-white">
            
            <CyberNavbar onNavigate={onNavigate} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                <ArchiveHeader totalItems={totalItems} /> 
                
                <FilterControls
                    searchTerm={searchTerm}
                    filterGeneration={filterGeneration}
                    filterAttribute={filterAttribute}
                    allGenerations={allGenerations}
                    allAttributes={allAttributes}
                    allDigimon={allDigimon} 
                    handleSearchChange={handleSearchChange}
                    handleFilterChange={handleFilterChange}
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
        </div>
    );
};

export default ArchiveView;