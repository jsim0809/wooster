import React from 'react';

function Sidebar() {
  return (
    <nav>
      <img id="wooster-music" src="assets/wooster-music.svg" alt="Wooster Music" />
      <ul>
        <li>Music Player</li>
        <li>Your Music</li>
        <li>What is Wooster?</li>
        <li>About / Contact</li>
      </ul>
      <div id="dark-mode-text">
        Dark mode
        <img src="assets/dark-light-mode.svg" alt="Dark mode"/>
      </div>
    </nav>
  )
}

export default Sidebar;
