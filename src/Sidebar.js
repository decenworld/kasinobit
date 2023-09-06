import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faImage, faHandshake, faHashtag, faBook } from '@fortawesome/free-solid-svg-icons';


const sidebarStyle = {
  width: '256px',
  background: '#171617',
  color: 'gray',
  fontWeight: '700',
};

const news = {
  marginTop: '0px',
};



const Menu = () => {
  const listStyle = {
      fontSize: '0.9rem',

    listStyle: 'none',
    padding: '0.6rem',
    cursor: 'pointer', // Add a cursor pointer on hover
    transition: 'background-color 0.3s', // Smooth transition for the hover effect
  };

    const news = {
    marginTop: '20px',
  };



  const handleItemHover = (e) => {
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Change the background color on hover
  };

  const handleItemLeave = (e) => {
    e.target.style.backgroundColor = 'transparent'; // Reset the background color when not hovering
  };

  return (
    <div style={sidebarStyle}>
      <ul>
        <li style={listStyle} onMouseEnter={handleItemHover} onMouseLeave={handleItemLeave}>
                    <FontAwesomeIcon icon={faCoins} style={{ marginRight: '10px' }} />
   <span style={{marginTop: "10px"}}>Coin Flip</span>
        </li>

        <li style={listStyle} onMouseEnter={handleItemHover} onMouseLeave={handleItemLeave}>
                    <FontAwesomeIcon icon={faImage} style={{ marginRight: '10px' }} />

          NFTs
        </li>

        <li style={listStyle} onMouseEnter={handleItemHover} onMouseLeave={handleItemLeave}>
                              <FontAwesomeIcon icon={faHandshake} style={{ marginRight: '10px' }} />

          Token ICO
          
        </li>
        <hr>
        </hr>
           <li style={listStyle} onMouseEnter={handleItemHover} onMouseLeave={handleItemLeave}>
                              <FontAwesomeIcon icon={faHashtag} style={{ marginRight: '10px' }} />

          Twitter
          
        </li>
            <li style={listStyle} onMouseEnter={handleItemHover} onMouseLeave={handleItemLeave}>
                              <FontAwesomeIcon icon={faBook} style={{ marginRight: '10px' }} />

          Docs
          
        </li>
        {/* Add more list items as needed */}
      </ul>
    </div>
  );
};

export default Menu;

