// src/App.jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import ArchiveView from './ArchiveView';
import DigimonDetail from './DigimonDetail'; 
import { useDigimonArchive } from './useDigimonArchive';

// --- MAIN APPLICATION COMPONENT ---
const App = () => {
  const { urlState, navigateTo } = useDigimonArchive();
  const [isAuthReady, setIsAuthReady] = useState(false); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthReady(true); 
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  let ContentComponent;
  switch (urlState.page) {
    case 'archive':
      ContentComponent = <ArchiveView />; 
      break;
    case 'detail':
      ContentComponent = <DigimonDetail />;
      break;
    case 'landing':
    default:
      ContentComponent = <LandingPage onNavigate={navigateTo} isAuthReady={isAuthReady} />;
      break;
  }

  return (
    <div className="min-h-screen"> 
      {ContentComponent}
    </div>
  );
};

export default App;