import React, { useState } from 'react';

function Sidebar() {
  const [dimmerArray, setDimmerArray] = useState(['', '', '', '']);

  const handleMouseEnter = (event) => {
    setDimmerArray(dimmerArray.map((dimmer, index) => {
      if (index == event.currentTarget.id) {
        return '';
      } else {
        return 'dimmed'
      }
    }));
  };

  const handleMouseLeave = (event) => {
    setDimmerArray(['', '', '', '']);
  };

  return (
    <nav>
      <img id="wooster-music" src="assets/wooster-music.svg" alt="Wooster Music" />
      <ul>
        <li id="0" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={dimmerArray[0]}>Music Player</li>
        <li id="1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={dimmerArray[1]}>Your Music</li>
        <li id="2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={dimmerArray[2]}>What is Wooster?</li>
        <li id="3" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={dimmerArray[3]}>About / Contact</li>
      </ul>
      <div id="dark-mode-text">
        Dark mode
        <img src="assets/dark-light-mode.svg" alt="Dark mode"/>
      </div>
    </nav>
  )
}

export default Sidebar;
