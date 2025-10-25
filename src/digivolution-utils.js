// src/digivolution-utils.js

/**
 * Finds all shortest paths (in terms of number of steps) between a start and target Digimon
 * using a Breadth-First Search (BFS) algorithm.
 *
 * @param {string} startName 
 * @param {string} targetName 
 * @param {Array<Object>} allDigimon 
 * @returns {Array<Array<Object>>} An array of shortest paths, where each path is an array of formatted Digimon/Arrow objects.
 */
export const findShortestPath = (startName, targetName, allDigimon) => {
    if (!startName || !targetName) return [];

    const digimonMap = new Map();
    allDigimon.forEach(d => digimonMap.set(d.name, d));

    // Handle case where start and target are the same
    if (startName === targetName) {
        const digimon = digimonMap.get(startName);
        return digimon ? [[{ ...digimon, isStart: true, isTarget: true, generation: digimon.generation || 'Start' }]] : [];
    }

    // 1. Build Adjacency List (treating evolutions/devolutions as bidirectional edges)
    const adjacencyList = new Map();
    allDigimon.forEach(digimon => {
        const currentName = digimon.name;
        const neighbors = new Set();
        (digimon.evolves_to || []).forEach(evo => neighbors.add(evo.name));
        (digimon.evolves_from || []).forEach(evo => neighbors.add(evo.name));
        const validNeighbors = Array.from(neighbors).filter(name => digimonMap.has(name));
        adjacencyList.set(currentName, validNeighbors);
    });

    // 2. BFS for Shortest Path(s)
    const queue = [[startName]]; 
    const visited = new Set([startName]);
    let shortestPathLength = Infinity;
    const allShortestPathsNames = [];

    while (queue.length > 0) {
        const currentPath = queue.shift();
        const currentName = currentPath[currentPath.length - 1];

        if (currentPath.length > shortestPathLength) continue;

        if (currentName === targetName) {
            // Found a shortest path (or another path of the same length)
            if (currentPath.length < shortestPathLength) {
                shortestPathLength = currentPath.length;
                allShortestPathsNames.length = 0; // Clear longer paths
                allShortestPathsNames.push(currentPath);
            } else if (currentPath.length === shortestPathLength) {
                allShortestPathsNames.push(currentPath);
            }
            continue; 
        }

        const neighbors = adjacencyList.get(currentName) || [];
        
        for (const nextName of neighbors) {
            const newPath = [...currentPath, nextName];

            if (newPath.length <= shortestPathLength) {
                if (!visited.has(nextName)) {
                     visited.add(nextName);
                     queue.push(newPath);
                } else if (newPath.length === shortestPathLength) {
                     if (!visited.has(nextName) || currentPath.length + 1 < shortestPathLength) {
                         if (!visited.has(nextName)) {
                             visited.add(nextName);
                         }
                         queue.push(newPath);
                     }
                } else {
                     queue.push(newPath); 
                }
            }
        }
    }

    if (allShortestPathsNames.length === 0) return [];

    // 3. Format the found paths
    return allShortestPathsNames.map(pathNames => {
        const formattedPath = [];
        pathNames.forEach((name, index) => {
            const digimon = digimonMap.get(name);
            const node = { 
                ...digimon, 
                image_path: digimon.image_path || digimon.url,
                generation: digimon.generation || (index === 0 ? 'Start' : index === pathNames.length - 1 ? 'Target' : 'Step')
            };
            if (index === 0) node.isStart = true;
            if (index === pathNames.length - 1) node.isTarget = true;
            
            formattedPath.push(node);

            if (index < pathNames.length - 1) {
                formattedPath.push({ type: 'arrow', steps: index + 1 });
            }
        });
        return formattedPath;
    });
};