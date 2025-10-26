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
      ContentComponent = <ArchiveView onNavigate={navigateTo} />; 
      break;
    case 'detail':
      ContentComponent = <DigimonDetail onNavigate={navigateTo} />;
      break;
    case 'planner':
      ContentComponent = <DigivolutionPlanner onNavigate={navigateTo} />; 
      break;
    case 'landing':
    default:
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