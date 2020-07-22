import React from 'react';
import $script from 'scriptjs';
import axios from 'axios';

function Player({ accessToken }) {
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

  // Love Story by Taylor Swift
  const LOVE_STORY = 'spotify:track:1vrd6UOGamcKNGnSHJQlSt';

  const handlePlayClick = () => {
    axios({
      method: 'put',
      url: 'https://api.spotify.com/v1/me/player/play',
      data: {
        context_uri: LOVE_STORY,
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    })
  }

  return (
    <div id="play-button" className="pointer">
      <button onClick={handlePlayClick}>Play</button>
    </div>
  )
}

export default Player;
