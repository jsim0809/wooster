import React from 'react';

function LandingPage() {
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
      <div id="login">
        <div id="logged-in-text" style={{ visibility: 'hidden' }}>Logged in as samantha (Log out)</div>
        <div id="main-title">Welcome to Wooster Music Player</div>
        <div id="login-box">
          <div id="main-subtitle">To get started, log in with your Spotify Premium account.</div>
          <img src="assets/login-button-rectangular.svg" alt="Log in with Spotify"/>
          <div></div>
        </div>

      </div>
    </main>
  );
}

export default LandingPage;