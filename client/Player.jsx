import React, { useState } from 'react';
import axios from 'axios';

function Player({ currentState, sendEvent, accessToken, currentUserId, currentSongId }) {

  const handlePauseClick = () => {
    axios({
      method: 'put',
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        sendEvent('PAUSE');
      });
  };

  const handlePlayClick = () => {
    axios({
      method: 'put',
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        sendEvent('PLAY');
      });
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

  if (currentState.matches('playing')) {
    return (
      <>
        <div id="play-button" className="pointer">
          <button type="button" onClick={handlePauseClick}>Pause</button>
        </div>
  
        <div id="like-button" className="pointer">
          <button type="button" onClick={handleLikeClick}>Thumbs Up</button>
        </div>
      </>
    );
  } else if (currentState.matches('paused')) {
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
