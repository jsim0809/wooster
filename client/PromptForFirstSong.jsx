import React, { useState } from 'react';
import axios from 'axios';

function PromptForFirstSong({
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
        currentSongId,
        benchTimestamp: moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
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
    <main>
      <div id="logged-in-text">Logged in as jsim0809 (Log out)</div>
      <div id="now-playing-text">Now Playing</div>
      <div id="song-box">
        <img src="assets/album-image-example.jpg" />
        <div id="song-box-text">
          <div id="song-title">I Like It Like That</div>
          <div id="song-artists">Hot Chelle Rae</div>
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
    </main>
  );
}

export default PromptForFirstSong;
