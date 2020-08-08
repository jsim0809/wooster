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
import { createSkeleton } from '../database.js';

function App() {
  const URL_HASH = queryString.parse(window.location.hash);
  const [currentState, sendEvent] = useMachine(woosterMachine);
  const [accessToken, setAccessToken] = useState(URL_HASH.access_token);
  const [refreshToken, setRefreshToken] = useState(URL_HASH.refresh_token);
  const [deviceId, setDeviceId] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    spotify_user_id: '',
    email: '',
    songs: {},
  });
  const [playbackState, setPlaybackState] = useState({
    track_window: {
      current_track: '',
    },
    timestamp: 0,
    position: 0,
  });
  const [playbackLog, setPlaybackLog] = useState({
    currentSongId: '',
    startTimestamp: 0,
    latestPosition: 0,
    readyToPost: false,
  });

  // Triggered effect: Runs once on component mount.
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

  // Triggered effect: Runs when Spotify reports a change in playback state.
  // Updates the playbackLog, which keeps track of listening time so we can update the database with it..
  useEffect(() => {
    if (!playbackLog.currentSongId) {
      setPlaybackLog({
        currentSongId: playbackState.track_window.current_track.id,
        startTimestamp: playbackState.timestamp,
        latestPosition: playbackState.position,
        readyToPost: false,
      });
    } else if (playbackLog.currentSongId == playbackState.track_window.current_track.id) {
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

  // Triggered effect: Runs whenever playBacklog.readyToPost changes.
  // When playbackLog.readyToPost is true,
  // Post song listen timestamp and duration to database.
  // Then clear current song log so that we can log the next song's data.
  useEffect(() => {
    if (playbackLog.readyToPost) {
      axios({
        method: 'post',
        url: `/api/${currentUser.spotifyUserId}/song`,
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
        .catch((error) => {
          setPlaybackLog({
            currentSongId: playbackState.track_window.current_track.id,
            startTimestamp: playbackState.timestamp,
            latestPosition: playbackState.position,
            readyToPost: false,
          });
        });
    }
  }, [playbackLog.readyToPost]);

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
        setAccessToken(response.data.access_token);
      });
  };

  // Helper function: Grab basic user information from Spotify and populate database if needed, then state.
  const initializeUser = () => {
    // Get the user data from Spotify.
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.data)
      // Use that data to grab the database's object for that user.
      .then((userData) => {
        axios({
          method: 'get',
          url: `/api/${userData.id}`,
        })
          .then((response) => response.data)
          .then((databaseObject) => {
            // But if no such object exists...
            if (!Object.keys(databaseObject).length) {
              // Create a new skeleton object for that user.
              axios({
                method: 'post',
                url: `/api/${userData.id}/new`,
              })
              // Then, grab that skeleton object.
                .then(() => {
                  grabUserObjectAndSaveItToState(userData.id, userData.email);
                });
            // If it does exist though, just grab it and save it to state.
            } else {
              grabUserObjectAndSaveItToState(userData.id, userData.email);
            }
          });
      });
  };

  // Helper function. Grabs user object from database and saves it to state.
  // If needed, updates a user's email in the database.
  const grabUserObjectAndSaveItToState = (spotifyUserId, usersCurrentSpotifyEmail) => {
    axios({
      method: 'get',
      url: `/api/${spotifyUserId}`,
    })
    // And save it to state.
      .then((response) => response.data)
      .then((databaseObject) => {
        setCurrentUser(databaseObject.Item);
        if(databaseObject.Item.email !== usersCurrentSpotifyEmail) {
          axios({
            method: 'put',
            url: `/api/${spotifyUserId}/email`,
            data: {
              email: usersCurrentSpotifyEmail,
            },
          });
        }
      });
  };

  // Triggered effect: Runs when currentUser is set (when initializing user).
  useEffect(() => {
    axios({
      method: 'get',
      url: `/api/${currentUser.spotifyUserId}`,
    })
      .then((response) => {
        if (!Object.keys(response.data).length) {
          axios({
            method: 'post',
            url: `/api/${currentUser.spotifyUserId}`,
          });
        }
      })
      .then(() => {

      })
  }, [currentUser]);


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
        console.log('Playback state:', retrievedPlaybackState);
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
            currentUser={currentUser}
          />
        </div>
      </div>
    )
  }
}

export default App;