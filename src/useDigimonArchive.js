// src/useDigimonArchive.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import digimonData from './data/digimon.json'; 

const ITEMS_PER_PAGE = 24; 

const useUrlState = () => {
    const [state, setState] = useState(() => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        
        const pageParam = parseInt(params.get('p'));
        const initialPage = isNaN(pageParam) ? 1 : pageParam;

        return {
            page: params.get('page') || 'landing',
            gen: params.get('gen') || 'All',
            attr: params.get('attr') || 'All',
            q: params.get('q') || '',
            p: initialPage,
            
            name: params.get('name') || null, 
        };
    });

    useEffect(() => {
        const handleHashChange = () => {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const pageParam = parseInt(params.get('p'));
            const newPage = isNaN(pageParam) ? 1 : pageParam;

            setState({
                page: params.get('page') || 'landing',
                gen: params.get('gen') || 'All',
                attr: params.get('attr') || 'All',
                q: params.get('q') || '',
                p: newPage,
                name: params.get('name') || null,
            });
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const updateState = useCallback((newState) => {
        setState(prev => {
            const nextState = { ...prev, ...newState };
            const newParams = new URLSearchParams();
            
            // Handle navigation to Landing/Archive
            if (nextState.page === 'landing') {
                window.location.hash = '';
                return { page: 'landing', gen: 'All', attr: 'All', q: '', p: 1, name: null };
            }
            if (nextState.page === 'archive') {
                // When navigating back to archive, clear name param
                nextState.name = null;
            }

            // Always set page type
            newParams.set('page', nextState.page);

            // Add other parameters based on the current page type
            if (nextState.page === 'archive') {
                if (nextState.gen !== 'All') newParams.set('gen', nextState.gen);
                if (nextState.attr !== 'All') newParams.set('attr', nextState.attr);
                if (nextState.q) newParams.set('q', nextState.q);
                if (nextState.p !== 1) newParams.set('p', nextState.p);
            } else if (nextState.page === 'detail' && nextState.name) {
                newParams.set('name', nextState.name);
            }

            window.location.hash = newParams.toString();
            return nextState;
        });
    }, []);

    return [state, updateState];
};


export const useDigimonArchive = () => {
    const [urlState, updateUrlState] = useUrlState();
    const { gen: filterGeneration, attr: filterAttribute, q: searchTerm, p: currentPage, name: selectedName } = urlState;

    const selectedDigimon = useMemo(() => {
        if (!selectedName) return null;
        return digimonData.find(d => d.name === selectedName) || null;
    }, [selectedName]);

    const allGenerations = useMemo(() => {
        const generations = new Set(digimonData.map(d => d.generation).filter(g => g));
        return ['All', ...Array.from(generations).sort()];
    }, []);

    const allAttributes = useMemo(() => {
        const attributes = new Set(digimonData.map(d => d.attribute).filter(a => a));
        return ['All', ...Array.from(attributes).sort()];
    }, []);

    const filteredAndSearchedDigimon = useMemo(() => {
        let result = digimonData;
        if (filterGeneration !== 'All') {
            result = result.filter(d => d.generation === filterGeneration);
        }
        if (filterAttribute !== 'All') {
            result = result.filter(d => d.attribute === filterAttribute);
        }
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter(d => 
                d.name.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return result;
    }, [filterGeneration, filterAttribute, searchTerm]);

    const totalItems = filteredAndSearchedDigimon.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            updateUrlState({ p: 1 });
        } else if (totalPages === 0 && currentPage !== 1) {
            updateUrlState({ p: 1 });
        }
    }, [filteredAndSearchedDigimon, totalPages, currentPage, updateUrlState]); 

    const paginatedDigimon = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredAndSearchedDigimon.slice(startIndex, endIndex);
    }, [filteredAndSearchedDigimon, currentPage]);

    const handleSearchChange = useCallback((term) => {
        updateUrlState({ q: term, p: 1 });
    }, [updateUrlState]);

    const handleFilterChange = useCallback((key, value) => {
        const newState = { [key]: value, p: 1 };
        updateUrlState(newState);
    }, [updateUrlState]);

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateUrlState({ p: newPage });
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    }, [totalPages, updateUrlState]);

    const navigateTo = useCallback((page, name = null) => {
        updateUrlState({ page: page, name: name });
    }, [updateUrlState]);
    
    // 🆕 New Action: Navigate to detail view
    const navigateToDetail = useCallback((name) => {
        navigateTo('detail', name);
    }, [navigateTo]);


    return {
        // Data
        digimonList: paginatedDigimon,
        selectedDigimon, 
        totalItems, totalPages,
        allGenerations, allAttributes,
        
        // State
        searchTerm, filterGeneration, filterAttribute, currentPage,

        // Actions
        handleSearchChange, handleFilterChange, handlePageChange, navigateTo, navigateToDetail, // 🆕 Export the new action
        urlState
    };
};