import React from 'react';
import $script from 'scriptjs';

function Player({ accessToken, refreshToken }) {
  // Load Spotify's player
  $script('https://sdk.scdn.co/spotify-player.js');

  // Initialize my Player object
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Wooster Player',
      getOAuthToken: (callback) => {
        callback(accessToken);
      },
    });
    player.connect().then(success => {
      if (success) {
        console.log(`Wooster is connected to Spotify's Web Playback SDK.`);
      }
    })
  };

  return (
    <div id="play-button" className="pointer">
      <button>Play</button>
    </div>
  )
}

export default Player;
