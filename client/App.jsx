import React, { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import axios from 'axios';
import queryString from 'query-string';
import $script from 'scriptjs';

import woosterMachine from './woosterMachine.js';

import Header from './Header.jsx';
import Login from './Login.jsx';
import FakePlayer from './FakePlayer.jsx';
import Player from './Player.jsx';

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
  const [usersLikedSongs, setUsersLikedSongs] = useState([]);
  const [songQueue, setSongQueue] = useState([]);
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
      initializeRefreshLoop();
      initializeUser();
      initializeSpotifyPlayer();
    }
  }, []);

  // // Initializing the refresh loop

  // Spotify access tokens last for 60 minutes. Every 55 minutes, grab a new one.
  const initializeRefreshLoop = () => {
    setInterval(getNewToken, 3300000);
  }

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

  // // Initializing the user

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
                  axios({
                    method: 'get',
                    url: `/api/${userData.id}`,
                  })
                    // And save it to state.
                    .then((response) => response.data)
                    .then((databaseObject) => {
                      if (databaseObject.Item.email !== userData.email) {
                        axios({
                          method: 'put',
                          url: `/api/${userData.id}/email`,
                          data: {
                            email: userData.email,
                          },
                        });
                      }
                      setCurrentUser(databaseObject.Item);
                    });
                });
              // If it does exist though, just grab it and save it to state.
            } else {
              setCurrentUser(databaseObject.Item);
            }
          });
      });
  };

  // // Initializing Spotify's Web Player

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

  // // Handle song queueing and playing

  const getRandomLikedSong = () => {
    return usersLikedSongs[Math.floor(Math.random() * usersLikedSongs)];
  };

  const LOVE_STORY = '1vrd6UOGamcKNGnSHJQlSt';
  const NIGHT_CHANGES = '5O2P9iiztwhomNh8xkR9lJ';
  const GETAWAY_CAR = '0VE4kBnHJUgtMf0dy6DRmW';

  const populateSongs = () => {
    setSongQueue([LOVE_STORY, NIGHT_CHANGES, GETAWAY_CAR]);
    // const randomSong1 = getRandomLikedSong();
    // setSongQueue([randomSong1]);
  };

  useEffect(() => {
    if (songQueue.length === 1) {
      const randomSong2 = getRandomLikedSong();
      loadThreeSongs(songQueue[0], randomSong2);
    }
    if (songQueue.length > 1) {
      axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play?' +
          queryString.stringify({
            device_id: deviceId,
          }),
        data: JSON.stringify({
          uris: [`spotify:track:${songQueue[0]}`],
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then(() => {
          sendEvent('PLAY');
        });
    }
  }, [songQueue]);

  const loadThreeSongs = (song1, song2) => {
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/recommendations?' +
        queryString.stringify({
          limit: 100,
          seed_tracks: `${song1},${song2}`,
        }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.tracks)
      .then((recommendations) => {
        let middleSong = recommendations.find((song) => {
          return currentUser.songs[song.id].liked !== false;
        }) ?? getRandomLikedSong();
        setSongQueue([song1, middleSong, song2]);
      });
  };

  // // Handle song logging

  // Triggered effect: Runs when Spotify reports a change in playback state.
  // Updates the playbackLog, which keeps track of listening time so we can update the database with it..
  useEffect(() => {
    // If song is just starting, initialize the playback log.
    if (playbackLog.currentSongId !== playbackState.track_window.current_track.id) {
      setPlaybackLog({
        currentSongId: playbackState.track_window.current_track.id,
        startTimestamp: playbackState.timestamp,
        latestPosition: playbackState.position,
        readyToPost: false,
      });
      // If song is somewhere in the middle, update the latest listening position.
    } else if (playbackState.paused && playbackState.restrictions.disallow_resuming_reasons?.[0] === 'not_paused') {
      setPlaybackLog({
        ...playbackLog,
        latestPosition: Math.max(playbackLog.latestPosition, playbackState.position),
        readyToPost: true,
      });
    } else if (playbackLog.currentSongId === playbackState.track_window.current_track.id) {
      setPlaybackLog({
        ...playbackLog,
        latestPosition: Math.max(playbackLog.latestPosition, playbackState.position),
      });
      // If song ended naturally, log the playtime.
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
        url: `/api/${currentUser.spotify_user_id}/song/new`,
        data: {
          currentSongId: playbackLog.currentSongId,
          artists: playbackLog.track_window.current_track.artists.map(artist => artist.name),
          name: playbackLog.track_window.current_track.name,
        },
      })
        .then(() => {
          axios({
            method: 'post',
            url: `/api/${currentUser.spotify_user_id}/song`,
            data: playbackLog,
          })
            .then(() => {
              playNextSong();
            })
        })
    }
  }, [playbackLog.readyToPost]);

  // Triggers the play of the next song by moving the song queue forward.
  const playNextSong = () => {
    setSongQueue(songQueue.slice(1));
  }

  // // Handle page rendering.

  // Render page based on state machine.

  if (currentState.matches('landing')) {
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
          <FakePlayer
            populateSongs={populateSongs}
          />
        </div>
      </div>
    )
  } else if (currentState.matches('playing')) {
    return (
      <div id="body-section">
        <div id="body-grid">
          <Header />
          <Player
            currentUserId={currentUser.spotify_user_id}
            currentSongId={playbackLog.currentSongId}
          />
        </div>
      </div>
    )
  }
}

export default App;
