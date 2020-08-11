import React from 'react';
import axios from 'axios';

function Player({ currentUserId, currentSongId }) {

  const handlePlayClick = () => {
    // Pause / Play
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
      <button type="button" onClick={handlePlayClick}>Pause</button>
    </div>

    <div id="like-button" className="pointer">
      <button type="button" onClick={handleLikeClick}>Thumbs Up</button>
    </div>
    </>
  );
}

export default Player;
