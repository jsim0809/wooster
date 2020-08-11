import React from 'react';
import axios from 'axios';

function FakePlayer({ populateSongs }) {
  const handlePlayClick = () => {
    populateSongs();
  };

  // TODO: CHECK IF THE USER HAS ANY LIKED SONGS. IF NOT, PROMPT THEM FOR ONE!
  return (
    <div id="play-button" className="pointer">
      <button type="button" onClick={handlePlayClick}>Play</button>
    </div>
  );
}

export default FakePlayer;
