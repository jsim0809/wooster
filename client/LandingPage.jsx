import React from 'react';

function LandingPage() {
  return (
    <main>
      <div id="sample-ui">
        <div id="logged-in-text" style={{visibility: 'hidden'}}>Logged in as jsim0809 (Log out)</div>
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
      </div>
      <div id="login">
        Log in with Spotify
      </div>
    </main>
  );
}

export default LandingPage;