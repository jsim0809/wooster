import React from 'react';
import LandingPage from './LandingPage.jsx';
import PromptForFirstSong from './PromptForFirstSong.jsx';
import Player from './Player.jsx';

function Main({ currentState }) {
  switch (currentState.value) {
    case 'landing':
      return <LandingPage />;
    case 'promptForFirstSong':
      return <PromptForFirstSong />;
    case 'readyToPlay':
    case 'playing':
    case 'paused':
      return <Player currentState={currentState} />;
  }
}

export default Main;