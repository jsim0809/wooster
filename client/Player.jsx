import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Player({
  lightOrDark,
  currentState,
  sendEvent,
  accessToken,
  currentUserId,
  currentSong,
  usersLikedSongs,
  setUsersLikedSongs,
  noPlayList,
  setNoPlayList,
  songQueue,
  setSongQueue,
  firstSong,
  playSameSong,
  playNextSong,
  pluralizeArtists
}) {

  const handleFirstPlayClick = () => {
    setSongQueue({
      ...songQueue,
      playing: true,
    });
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
        playNextSong();
      });
  };

  // const handleBenchClick = () => {
  //   console.log('Bench sent.');
  //   axios({
  //     method: 'post',
  //     url: `/api/${currentUserId}/bench`,
  //     data: {
  //       currentSongId: currentSong?.id,
  //       benchTimestamp: moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
  //     },
  //   })
  //     .then(() => {
  //       setNoPlayList({
  //         ...noPlayList,
  //         [currentSong?.id]: true,
  //       });
  //     });
  // };

  let playPauseButtonDisplay;
  let songBoxDisplay;
  switch (currentState.value) {
    case ('readyToPlay'):
      playPauseButtonDisplay = (
        <img className={`control-bar-play-pause ${lightOrDark}`} onClick={handleFirstPlayClick} src="assets/play.svg" />
      );
      songBoxDisplay = (
        <div id="song-box">
          <img src={firstSong.album?.images[1].url} />
          <div id="song-box-text">
            <div id="song-title">{firstSong.name}</div>
            <div id="song-artists">{pluralizeArtists(firstSong.artists)}</div>
          </div>
        </div>
      );
      break;
    case ('playing'):
      playPauseButtonDisplay = (
        <img className={`control-bar-play-pause ${lightOrDark}`} onClick={handlePauseClick} src="assets/pause.svg" />
      );
      songBoxDisplay = (
        <div id="song-box">
          <img src={currentSong?.album.images[0].url} />
          <div id="song-box-text">
            <div id="song-title">{currentSong?.name}</div>
            <div id="song-artists">{pluralizeArtists(currentSong?.artists)}</div>
          </div>
        </div>
      );
      break;
    case ('paused'):
      playPauseButtonDisplay = (
        <img className={`control-bar-play-pause ${lightOrDark}`} onClick={handlePlayClick} src="assets/play.svg" />
      );
      songBoxDisplay = (
        <div id="song-box">
          <img src={currentSong?.album.images[0].url} />
          <div id="song-box-text">
            <div id="song-title">{currentSong?.name}</div>
            <div id="song-artists">{pluralizeArtists(currentSong?.artists)}</div>
          </div>
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
        {songBoxDisplay}
        <div id="control-bar">
          <img className={`control-bar-dislike ${lightOrDark}`} onClick={handleDislikeClick} src="assets/dislike.svg" />
          <img className={`control-bar-skip-back ${lightOrDark}`} onClick={playSameSong} src="assets/replay.svg" />
          {playPauseButtonDisplay}
          <img className={`control-bar-skip-forward ${lightOrDark}`} onClick={playNextSong} src="assets/skip-forward.svg" />
          <img className={`control-bar-like ${lightOrDark}`} onClick={handleLikeClick} src="assets/like.svg" />
          <hr className="control-bar-line" />
        </div>
      </div>
    </main>
  );
}

export default Player;
