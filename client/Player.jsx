import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Player({
  lightOrDark,
  state,
  sendEvent,
  accessToken,
  user,
  songQueue,
  playSameSong,
  playNextSong,
  like,
  dislike,
  pluralize
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
    if (state.value === 'playing') {
      axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }
    sendEvent('PLAY');
  };

  let playPauseButtonDisplay;
  if (state.value === 'playing') {
    playPauseButtonDisplay = (
      <img className={`control-bar-play-pause ${lightOrDark}`} onClick={handlePauseClick} src="assets/pause.svg" />
    );
  } else {
    playPauseButtonDisplay = (
      <img className={`control-bar-play-pause ${lightOrDark}`} onClick={handlePlayClick} src="assets/play.svg" />
    );
  }


return (
  <main>
    <div id="player">
      <div id="logged-in-text">
        Logged in as {user.id} (<a id="logout" href='/'>Log out</a>)
        </div>
      <div id="main-title">Now Playing</div>
      <div id="song-box">
        <img src={songQueue[0]?.album?.images[1].url} />
        <div id="song-box-text">
          <div id="song-title">{songQueue[0]?.name}</div>
          <div id="song-artists">{pluralize(songQueue[0]?.artists)}</div>
        </div>
      </div>
      <div id="control-bar">
        <img className={`control-bar-dislike ${lightOrDark}`} onClick={dislike} src="assets/dislike.svg" />
        <img className={`control-bar-skip-back ${lightOrDark}`} onClick={playSameSong} src="assets/replay.svg" />
        {playPauseButtonDisplay}
        <img className={`control-bar-skip-forward ${lightOrDark}`} onClick={playNextSong} src="assets/skip-forward.svg" />
        <img className={`control-bar-like ${lightOrDark}`} onClick={like} src="assets/like.svg" />
        <hr className="control-bar-line" />
      </div>
    </div>
  </main>
);
}

export default Player;
