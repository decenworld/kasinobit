import React from 'react';
import logo from './assets/img/logo.png';

const headerStyle = {
  backgroundColor: '#171617',
};

const coinimg = {
  margin: '0',
  width: '125px',
    height: '125px',

  color: 'white',
  paddingLeft: '3rem',
};

const Header = () => {
  return (
    <header style={headerStyle}>
            <img src={logo} style={coinimg} alt="Heads" />

      {/* Add other header content as needed */}
    </header>
  );
};

export default Header;
