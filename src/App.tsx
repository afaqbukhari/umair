import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import PortfolioPage from './pages/PortfolioPage';

function App() {
  // Apply initial dark mode class if needed
  useEffect(() => {
    // Check if dark mode is saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Apply dark mode if saved as dark or if system preference is dark and no saved preference
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ThemeProvider>
      <PortfolioPage />
    </ThemeProvider>
  );
}

export default App;