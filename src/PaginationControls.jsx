// src/PaginationControls.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'; 

const PaginationControls = ({ currentPage, totalPages, handlePageChange }) => {
    if (totalPages <= 1) return null;

    const renderPageButtons = () => {
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        const buttons = [];
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`py-1 px-3 text-sm font-bold rounded-md transition duration-200 font-mono 
                             ${i === currentPage 
                                ? 'bg-accent-blue text-dark-void shadow-lg ring-2 ring-accent-blue/70' // Active state: Blue and bright
                                : 'bg-dark-panel text-gray-300 hover:bg-dark-void border border-gray-700 hover:shadow-inner hover:shadow-accent-cyan/20' // Inactive state: Dark and subtle hover
                             }`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    // Base class for navigation arrows (first, prev, next, last)
    const arrowBaseClass = "p-2 rounded-md bg-dark-panel text-accent-cyan disabled:text-gray-600 disabled:cursor-not-allowed transition border border-gray-700 hover:bg-dark-void/50 hover:shadow-md hover:shadow-accent-cyan/20";

    return (
        <div className="flex justify-center items-center space-x-2 sm:space-x-4">
            {/* First Page Button */}
            <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={arrowBaseClass}
            >
                <ChevronsLeft className="w-5 h-5" />
            </button>

            {/* Previous Page Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={arrowBaseClass}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Dynamic Page Buttons */}
            <div className='hidden sm:flex space-x-2'>
                {renderPageButtons()}
            </div>
            
            <span className="text-sm sm:hidden font-bold font-mono text-gray-300">
                {currentPage} <span className="text-text-low">OF</span> {totalPages}
            </span>

            {/* Next Page Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={arrowBaseClass}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Last Page Button */}
            <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={arrowBaseClass}
            >
                <ChevronsRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default PaginationControls;