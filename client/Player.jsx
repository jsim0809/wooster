import React, { useState } from 'react';
import axios from 'axios';

function Player({
  currentState,
  sendEvent,
  accessToken,
  currentUserId,
  currentSong,
  usersLikedSongs,
  setUsersLikedSongs,
  noPlayList,
  setNoPlayList,
  populateSongs
}) {

  const handleFirstPlayClick = () => {
    populateSongs();
  };

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
        currentSongId: currentSong?.id,
      },
    })
      .then(() => {
        setUsersLikedSongs([
          ...usersLikedSongs,
          currentSong?.id
        ])
      });
  };

  const handleDislikeClick = () => {
    console.log('Dislike sent.');
    axios({
      method: 'post',
      url: `/api/${currentUserId}/dislike`,
      data: {
        currentSongId: currentSong?.id,
      },
    })
      .then(() => {
        setNoPlayList({
          ...noPlayList,
          [currentSong?.id]: true,
        });
      });
  };

  const handleWooClick = () => {
    console.log('Woo sent.');
    axios({
      method: 'post',
      url: `/api/${currentUserId}/woo`,
      data: {
        currentSongId: currentSong?.id,
        wooTimestamp: moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
      },
    })
  };

  const handleBenchClick = () => {
    console.log('Bench sent.');
    axios({
      method: 'post',
      url: `/api/${currentUserId}/bench`,
      data: {
        currentSongId: currentSong?.id,
        benchTimestamp: moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
      },
    })
      .then(() => {
        setNoPlayList({
          ...noPlayList,
          [currentSong?.id]: true,
        });
      });
  };

  let playPauseButton;
  switch (currentState.value) {
    case ('readyToPlay'):
      playPauseButton = (
        <div id="play-button" className="pointer">
          <button type="button" onClick={handleFirstPlayClick}>Play</button>
        </div>
      );
    case ('playing'):
      playPauseButton = (
        <div id="play-button" className="pointer">
          <button type="button" onClick={handlePauseClick}>Pause</button>
        </div>
      );
      break;
    case ('paused'):
      playPauseButton = (
        <div id="play-button" className="pointer">
          <button type="button" onClick={handlePlayClick}>Play</button>
        </div>
      );
      break;
  }

  return (
    <main>
      <div id="player">
        <div id="logged-in-text">
          Logged in as {currentUserId} (<a id="logout" href='/'>Log out</a>)
        </div>
        <div id="main-title">Now Playing</div>
        <div id="song-box">
          <img src="___" />
          <div id="song-box-text">
            <div id="song-title">___</div>
            <div id="song-artists">___</div>
          </div>
        </div>
        <div id="control-bar">
          <img className="control-bar-dislike" src="assets/dislike.svg" />
          <img className="control-bar-skip-back" src="assets/skip-back.svg" />
          <img className="control-bar-play-pause" src="assets/play.svg" />
          <img className="control-bar-skip-forward" src="assets/skip-forward.svg" />
          <img className="control-bar-like" src="assets/like.svg" />
          <hr className="control-bar-line" />
        </div>
      </div>
    </main>
  );
}

export default Player;
