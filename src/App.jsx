// src/App.jsx
import React from 'react'; 
import LandingPage from './LandingPage';
import ArchiveView from './ArchiveView';
import DigimonDetail from './DigimonDetail'; 
import DigivolutionPlanner from './DigivolutionPlanner'; 
import { useDigimonArchive } from './useDigimonArchive';

// --- MAIN APPLICATION COMPONENT ---
const App = () => {
  const { urlState, navigateTo } = useDigimonArchive();

  let ContentComponent;
  switch (urlState.page) {
    case 'archive':
      // FIX: Pass the navigateTo function as onNavigate prop
      ContentComponent = <ArchiveView onNavigate={navigateTo} />; 
      break;
    case 'detail':
      // The Detail view doesn't use the navbar, but it uses other state from the hook
      ContentComponent = <DigimonDetail onNavigate={navigateTo} />;
      break;
    case 'planner':
      // FIX: Pass the navigateTo function as onNavigate prop
      ContentComponent = <DigivolutionPlanner onNavigate={navigateTo} />; 
      break;
    case 'landing':
    default:
      // This was already correct
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