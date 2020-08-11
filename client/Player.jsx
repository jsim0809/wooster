import React from 'react';
import axios from 'axios';

function FakePlayer({ accessToken, deviceId,currentUserId, currentSongId, populateSongs }) {

  const handlePlayClick = () => {
    populateSongs();
  };

  const handleLikeClick = () => {
    axios({
      method: 'post',
      url: `/api/${currentUserId}/like`,
      data: {
        currentSongId,
      },
    });
  };

  // TODO: CHECK IF THE USER HAS ANY LIKED SONGS. IF NOT, PROMPT THEM FOR ONE!

  return (
    <>
    <div id="play-button" className="pointer">
      <button type="button" onClick={handlePlayClick}>Play</button>
    </div>

    <div id="like-button" className="pointer">
      <button type="button" onClick={handleLikeClick}>Thumbs Up</button>
    </div>
    </>
  );
}

export default FakePlayer;
