import React from 'react';
import SearchBar from './SearchBar.jsx';

function PromptForFirstSong({
  lightOrDark,
  sendEvent,
  accessToken,
  user,
  like,
  pluralize,
}) {
  return (
    <main>
      <div id="sample-ui">
        <div id="logged-in-text" style={{ visibility: 'hidden' }}>Logged in as samantha (Log out)</div>
        <div id="main-title" className="blurred">Now Playing</div>
        <div id="song-box" className="blurred">
          <img src="assets/album-image-example.jpg" />
          <div id="song-box-text">
            <div id="song-title">I Like It Like That</div>
            <div id="song-artists">Hot Chelle Rae</div>
          </div>
        </div>
        <div id="control-bar" className="blurred">
          <img className="control-bar-dislike" src="assets/dislike.svg" />
          <img className="control-bar-skip-back" src="assets/skip-back.svg" />
          <img className="control-bar-play-pause" src="assets/play.svg" />
          <img className="control-bar-skip-forward" src="assets/skip-forward.svg" />
          <img className="control-bar-like" src="assets/like.svg" />
          <hr className="control-bar-line" />
        </div>
      </div>
      <div id="prompt-for-first-song">
        <div id="logged-in-text">
          Logged in as {user.id} (<a id="logout" href='/'>Log out</a>)
        </div>
        <div id="main-title">
          <SearchBar 
            sendEvent={sendEvent}
            accessToken={accessToken}
            like={like}
            pluralize={pluralize}
          />
        </div>
        <div id="main-box">
          <div>
            <img className={lightOrDark} src="assets/arrow.svg" alt="" />
          </div>
          <div>
            <div className="search-instructions">It looks like you're new to Wooster.</div>
            <div className="search-instructions">Type in a song you like and hit Enter!</div>
          </div>
          <div></div>
        </div>
      </div>
    </main>
  );
}

export default PromptForFirstSong;