import React, { useState } from 'react';
import axios from 'axios';

function Player({
  currentState,
  sendEvent,
  accessToken,
  currentUserId,
  currentSongId,
  usersLikedSongs,
  setUsersLikedSongs,
  noPlayList,
  setNoPlayList
}) {

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
    console.log('Like sent.');
    axios({
      method: 'post',
      url: `/api/${currentUserId}/like`,
      data: {
        currentSongId,
      },
    })
      .then(() => {
        setUsersLikedSongs([
          ...usersLikedSongs,
          currentSongId
        ])
      });
  };

  const handleDislikeClick = () => {
    console.log('Dislike sent.');
    axios({
      method: 'post',
      url: `/api/${currentUserId}/dislike`,
      data: {
        currentSongId,
      },
    })
      .then(() => {
        setNoPlayList({
          ...noPlayList,
          [currentSongId]: true,
        });
      });
  };

  const handleWooClick = () => {
    console.log('Woo sent.');
    axios({
      method: 'post',
      url: `/api/${currentUserId}/woo`,
      data: {
        currentSongId,
        wooTimestamp: Date.now(),
      },
    })
  };

  const handleBenchClick = () => {
    console.log('Bench sent.');
    axios({
      method: 'post',
      url: `/api/${currentUserId}/bench`,
      data: {
        currentSongId,
        benchTimestamp: Date.now(),
      },
    })
      .then(() => {
        setNoPlayList({
          ...noPlayList,
          [currentSongId]: true,
        });
      });
  };

  let playPauseButton;
  if (currentState.matches('playing')) {
    playPauseButton = (
      <div id="play-button" className="pointer">
        <button type="button" onClick={handlePauseClick}>Pause</button>
      </div>
    )
  } else if (currentState.matches('paused')) {
    playPauseButton = (
      <div id="play-button" className="pointer">
        <button type="button" onClick={handlePlayClick}>Play</button>
      </div>
    )
  }

  return (
    <>
      <div id="bench-button" className="pointer">
        <button type="button" onClick={handleBenchClick}>I'm tired of this song</button>
      </div>
      <div id="dislike-button" className="pointer">
        <button type="button" onClick={handleDislikeClick}>Thumbs Down</button>
      </div>
      {playPauseButton}
      <div id="like-button" className="pointer">
        <button type="button" onClick={handleLikeClick}>Thumbs Up</button>
      </div>
      <div id="woo-button" className="pointer">
        <button type="button" onClick={handleWooClick}>Woo!</button>
      </div>
    </>
  );
}

export default Player;
