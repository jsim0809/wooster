import React, { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import axios from 'axios';
import queryString from 'query-string';
import $script from 'scriptjs';

import woosterMachine from './woosterMachine.js';

import WelcomeToWooster from './WelcomeToWooster.jsx';
import Header from './Header.jsx';
import Login from './Login.jsx';
import Player from './Player.jsx';

function App() {
  const URL_HASH = queryString.parse(window.location.hash);
  const [currentState, sendEvent] = useMachine(woosterMachine);
  const [accessToken, setAccessToken] = useState(URL_HASH.access_token);
  const [refreshToken, setRefreshToken] = useState(URL_HASH.refresh_token);
  const [activeUser, setActiveUser] = useState({
    spotifyUserId: '',
    email: '',
  })
  const [deviceId, setDeviceId] = useState(null);
  const [playbackState, setPlaybackState] = useState({});
  const [playbackLog, setPlaybackLog] = useState({
    currentSongId: '',
    startTimestamp: 0,
    latestPosition: 0,
    readyToPost: false,
  });

  // Runs on component mount.
  // Detect logged-in state, removes access codes from URL bar, and runs initialization code.
  useEffect(() => {
    if (accessToken) {
      window.location.hash = '';
      sendEvent('LOGGED_IN');
      // Spotify access tokens last for 60 minutes. Every 55 minutes, grab a new one.
      setInterval(getNewToken, 3300000);
      initializeUser();
      initializeSpotifyPlayer();
    } else {
      setTimeout(() => {
        sendEvent('ANIMATION_DONE');
      }, 6000);
    }
  }, []);

  // Runs when Spotify reports a change in playback state.
  // Updates the playbackLog, which keeps track of listening time for updating the database.
  useEffect(() => {
    if (!playbackLog.currentSongId) {
      setPlaybackLog({
        currentSongId: playbackState.track_window.current_track.id,
        startTimestamp: playbackState.timestamp,
        latestPosition: playbackState.position,
        readyToPost: false,
      });
    } else if (playbackLog.currentSongId === playbackState.track_window.current_track.id) {
      setPlaybackLog({
        ...playbackLog,
        latestPosition: Math.max(playbackLog.latestPosition, playbackState.position),
      });
    } else {
      setPlaybackLog({
        ...playbackLog,
        latestPosition: Math.max(playbackLog.latestPosition, playbackState.position),
        readyToPost: true,
      });
    }
  }, [playbackState]);

  // Runs when playBacklog changes.
  // When playbackLog.readyToPost is true,
  // Post song listen timestamp and duration to database.
  // Then clear current song log so that we can log the next song's data.
  useEffect(() => {
    if (playbackLog.readyToPost) {
      axios({
        method: 'post',
        url: `/api/${activeUser}/song`,
        data: playbackLog,
      })
        .then(() => {
          setPlaybackLog({
            currentSongId: playbackState.track_window.current_track.id,
            startTimestamp: playbackState.timestamp,
            latestPosition: playbackState.position,
            readyToPost: false,
          });
        })
        .catch(() => {
          console.error('Server/database error. Did not log last song.')
        });
    }
  }, [playbackLog]);

  // Helper function: Use our refresh token to request a new access token.
  const getNewToken = () => {
      axios({
        method: 'get',
        url: '/api/refresh?' +
          queryString.stringify({
            refresh_token: refreshToken,
          }),
      })
        .then((response) => {
          console.log('Retrieved new access token.');
          setAccessToken(response.data.access_token);
        });
    };

    // Helper function: Grab basic user information and populate state
    const initializeUser = () => {
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          setActiveUser({
            spotifyUserId: response.data.id,
            email: response.data.email,
          })
        })
    };

    // Helper function: Load Spotify's player, and set up listeners to update state while playing song
    const initializeSpotifyPlayer = () => {
      $script('https://sdk.scdn.co/spotify-player.js');
      // Initialize my Player object
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
          name: 'Wooster',
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
        });
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID is not ready for playback', device_id);
        });
        player.addListener('player_state_changed', (retrievedPlaybackState) => {
          console.log(retrievedPlaybackState);
          setPlaybackState(retrievedPlaybackState);
        });

        player.connect().then(success => {
          if (success) {
            console.log(`Wooster is connected to Spotify's Web Playback SDK.`);
          }
        })
      };
    };

    // Helper function: Cancel the animation when the user clicks.
    const animationCancel = () => {
      sendEvent('ANIMATION_DONE');
    }

    // Render page based on state machine.
    if (currentState.matches('intro')) {
      return (
        <div id="body-section" onClick={animationCancel}>
          <div id="body-grid">
            <WelcomeToWooster />
          </div>
        </div>
      );
    } else if (currentState.matches('landing')) {
      return (
        <div id="body-section">
          <div id="body-grid">
            <Header />
            <Login />
          </div>
        </div>
      );
    } else if (currentState.matches('readyToPlay')) {
      return (
        <div id="body-section">
          <div id="body-grid">
            <Header />
            <Player
              accessToken={accessToken}
              deviceId={deviceId}
              playbackState={playbackState}
              setPlaybackState={setPlaybackState}
            />
          </div>
        </div>
      )
    }
  }

  export default App;