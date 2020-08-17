import React from 'react';

function Main() {
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
        <img className="control-bar-sleep" src="assets/sleep.svg" />
        <img className="control-bar-dislike" src="assets/dislike.svg" />
        <img className="control-bar-play-pause" src="assets/play.svg" />
        <img className="control-bar-like" src="assets/like.svg" />
        <img className="control-bar-woo" src="assets/woo!.svg" />
        <hr className="control-bar-line" />
      </div>
    </main> 
  )
}

export default Main;