import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ lightOrDark, setLightOrDark }) {
  const [dimmerArray, setDimmerArray] = useState(['', '', '', '']);

  const handleMouseEnter = (event) => {
    setDimmerArray(dimmerArray.map((dimmer, index) => {
      if (index == event.currentTarget.getAttribute('name')) {
        return '';
      } else {
        return 'dimmed'
      }
    }));
  };

  const handleMouseLeave = (event) => {
    setDimmerArray(['', '', '', '']);
  };

  const handleDarkModeClick = () => {
    if (lightOrDark === 'light') {
      setLightOrDark('dark');
    } else {
      setLightOrDark('light');
    }
  };

  const darkModeText = lightOrDark === 'light' ? 'Dark mode' : 'Light mode';

  return (
    <nav>
      <img id="wooster-music" className={lightOrDark} src="assets/wooster-music.svg" alt="Wooster Music" />
      <ul>
        <li name="0" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={dimmerArray[0]}>
          <Link to="/">Music Player</Link>
        </li>
        <li name="1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={dimmerArray[1]}>
          <Link to="/your">Your Music</Link>
        </li>
        <li name="2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={dimmerArray[2]}>
          <Link to="/whatiswooster">What is Wooster?</Link>
        </li>
        <li name="3" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={dimmerArray[3]}>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <div id="dark-mode-text">
        {darkModeText}
        <img src="assets/dark-light-mode.svg" className={lightOrDark} alt={darkModeText} onClick={handleDarkModeClick} />
      </div>
    </nav>
  )
}

export default Sidebar;
