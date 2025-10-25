// src/App.jsx
import React from 'react'; // Removed useState, useEffect as isAuthReady is gone
import LandingPage from './LandingPage';
import ArchiveView from './ArchiveView';
import DigimonDetail from './DigimonDetail'; 
import DigivolutionPlanner from './DigivolutionPlanner'; // ⬅️ 1. IMPORT THE PLANNER COMPONENT
import { useDigimonArchive } from './useDigimonArchive';

// --- MAIN APPLICATION COMPONENT ---
const App = () => {
  // useDigimonArchive handles the state logic for page navigation
  const { urlState, navigateTo } = useDigimonArchive();
  
  // ⬅️ 2. REMOVED: const [isAuthReady, setIsAuthReady]...
  // ⬅️ 2. REMOVED: useEffect...

  let ContentComponent;
  switch (urlState.page) {
    case 'archive':
      ContentComponent = <ArchiveView />; 
      break;
    case 'detail':
      ContentComponent = <DigimonDetail />;
      break;
    case 'planner': // ⬅️ 1. ADD THE NEW CASE FOR 'planner'
      // You may need to pass props to your planner component here
      ContentComponent = <DigivolutionPlanner />; 
      break;
    case 'landing':
    default:
      // Since isAuthReady is removed, we just pass the navigation function
      ContentComponent = <LandingPage onNavigate={navigateTo} />; 
      break;
  }

  return (
    <div className="min-h-screen"> 
      {ContentComponent}
    </div>
  );
};

export default App;