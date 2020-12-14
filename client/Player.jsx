import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar.jsx';

function Player({
  lightOrDark,
  state,
  sendEvent,
  accessToken,
  user,
  likes,
  stale,
  setStale,
  songQueue,
  setSongQueue,
  playSameSong,
  playNextSong,
  like,
  unlike,
  dislike,
  pluralize,
  progressBarAnimationKey
}) {
  const [searchIsActive, setSearchIsActive] = useState(false);

  const handleSearchClick = () => {
    setSearchIsActive(!searchIsActive);
  }

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
    if (state.matches('paused')) {
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

  let nowPlayingOrSearchBarDisplay;
  if (searchIsActive) {
    nowPlayingOrSearchBarDisplay = (
      <>
        <img onClick={handleSearchClick} className="lowered-search-icon" src="assets/search.svg" />
        <SearchBar
          sendEvent={sendEvent}
          accessToken={accessToken}
          like={like}
          stale={stale}
          setStale={setStale}
          setSongQueue={setSongQueue}
          pluralize={pluralize}
          parent="Player"
          setSearchIsActive={setSearchIsActive}
        />
      </>
    );
  } else {
    nowPlayingOrSearchBarDisplay = (
      <>
        Now Playing
        <img onClick={handleSearchClick} src="assets/search.svg" />
      </>
    );
  }
  
  let playOrPauseButtonDisplay;
  let progressBar;
  if (state.matches('playing') || state.matches('resumed')) {
    playOrPauseButtonDisplay = (
      <img className={`control-bar-play-pause ${lightOrDark}`} onClick={handlePauseClick} src="assets/pause.svg" />
    );
    progressBar = (
      <div key={progressBarAnimationKey} className={`control-bar-progress-indicator playing`} style={{'animationDuration': songQueue[0]?.duration_ms + 'ms'}}></div>
    );
  } else {
    playOrPauseButtonDisplay = (
      <img className={`control-bar-play-pause ${lightOrDark}`} onClick={handlePlayClick} src="assets/play.svg" />
    );
    progressBar = (
      <div key={progressBarAnimationKey} className={`control-bar-progress-indicator`} style={{'animationDuration': songQueue[0]?.duration_ms + 'ms'}}></div>
    );
  }

  let likeButtonDisplay;
  if (likes.find(song => song.id === songQueue[0]?.id)) {
    likeButtonDisplay = <img className={`control-bar-like-selected ${lightOrDark}`} onClick={unlike} src="assets/like-selected.svg" />;
  } else {
    likeButtonDisplay = <img className={`control-bar-like ${lightOrDark}`} onClick={like} src="assets/like.svg" />;
  }


  return (
    <main>
      <div id="player">
        <div id="logged-in-text">
          Logged in as {user.display_name} (<a id="logout" href='/'>Log out</a>)
        </div>
        <div id="main-title">
          {nowPlayingOrSearchBarDisplay}
        </div>
        <div id="song-box">
          <img src={songQueue[0]?.album?.images[1]?.url} />
          <div id="song-box-text">
            <div id="song-title">{songQueue[0]?.name}</div>
            <div id="song-artists">{pluralize(songQueue[0]?.artists)}</div>
          </div>
        </div>
        <div id="control-bar">
          <img className={`control-bar-dislike ${lightOrDark}`} onClick={dislike} src="assets/dislike.svg" />
          <img className={`control-bar-skip-back ${lightOrDark}`} onClick={playSameSong} src="assets/replay.svg" />
          {playOrPauseButtonDisplay}
          <img className={`control-bar-skip-forward ${lightOrDark}`} onClick={playNextSong} src="assets/skip-forward.svg" />
          {likeButtonDisplay}
          <div className="control-bar-line"></div>
          {progressBar}
        </div>
      </div>
    </main>
  );
}

export default Player;
