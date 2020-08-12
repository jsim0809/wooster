import React from 'react';

function FakePlayer({ populateSongs }) {
  const handlePlayClick = () => {
    populateSongs();
  };

  return (
    <div id="play-button" className="pointer">
      <button type="button" onClick={handlePlayClick}>Play</button>
    </div>
  );
}

export default FakePlayer;
