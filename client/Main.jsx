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
        <div>Sleep</div>
        <div>Dislike</div>
        <div>Play</div>
        <div>Like</div>
        <div>Woo!</div>
      </div>
    </main> 
  )
}

export default Main;