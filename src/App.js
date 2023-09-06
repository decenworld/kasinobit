import React, { useState, useEffect } from 'react';
import CoinFlipForm from './CoinFlipForm';
import Header from './Header';
import MobileMenu from './MobileMenu';
import Sidebar from './Sidebar'; // Import the Sidebar component

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  // Function to detect if the user is on a mobile device
  const detectMobile = () => {
    setIsMobile(window.innerWidth <= 768); // You can adjust the breakpoint as needed
  };

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsOpenMobileMenu(!isOpenMobileMenu);
  };

  useEffect(() => {
    // Add an event listener to detect window resize and update the isMobile state
    window.addEventListener('resize', detectMobile);

    // Initial detection on component mount
    detectMobile();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', detectMobile);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <div>
      <Header />
      <div style={appStyle}>
        {isMobile ? (
          <MobileMenu isOpen={isOpenMobileMenu} toggleMenu={toggleMobileMenu} />
        ) : (
          // Render the sidebar on PC
          <Sidebar />
        )}

        <div className="Middle_Container">
          <div className="App">
            <center>
              <CoinFlipForm />
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}

const appStyle = {
  display: 'flex',
  height: '100vh',
};

export default App;
