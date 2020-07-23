import React, { useState } from 'react';
import $script from 'scriptjs';
import axios from 'axios';
import queryString from 'query-string';

function Player({ accessToken }) {
  const [deviceId, setDeviceId] = useState(null);

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

    // Error listeners
    player.on('initialization_error', ({ message }) => {
      console.error('Failed to initialize', message);
    });
    player.on('authentication_error', ({ message }) => {
      console.error('Failed to authenticate', message);
    });
    player.on('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account', message);
    });
    player.on('playback_error', ({ message }) => {
      console.error('Failed to perform playback', message);
    });

    // Reporting
    player.addListener('ready', ({ device_id }) => {
      setDeviceId(device_id);
      console.log('Connected with Device ID', device_id);
    });
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID is not ready for playback', device_id);
    });
    player.addListener('player_state_changed', ({
      position,
      duration,
      track_window: { current_track }
    }) => {
      console.log('Currently Playing', current_track);
      console.log('Position in Song', position);
      console.log('Duration of Song', duration);
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
      url: 'https://api.spotify.com/v1/me/player/play?' +
        queryString.stringify({
          device_id: deviceId,
        }),
      data: JSON.stringify({
        uris: [LOVE_STORY],
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  };

  return (
    <div id="play-button" className="pointer">
      <button onClick={handlePlayClick}>Play</button>
    </div>
  );
}

export default Player;
