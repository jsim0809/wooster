import React, { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import axios from 'axios';
import queryString from 'query-string';
import $script from 'scriptjs';
import moment from 'moment-timezone';

import woosterMachine from './woosterMachine.js';

import WindowTooSmall from './WindowTooSmall.jsx';
import Sidebar from './Sidebar.jsx';
import Main from './Main.jsx';

function App() {
  const URL_HASH = queryString.parse(window.location.hash);
  const [currentState, sendEvent] = useMachine(woosterMachine);
  const [windowDimensions, setWindowDimensions] = useState([window.innerWidth, window.innerHeight])
  const [accessToken, setAccessToken] = useState(URL_HASH.access_token);
  const [refreshToken, setRefreshToken] = useState(URL_HASH.refresh_token);
  const [deviceId, setDeviceId] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [usersLikedSongs, setUsersLikedSongs] = useState([]);
  const [noPlayList, setNoPlayList] = useState({});
  const [songQueue, setSongQueue] = useState({});
  const [firstSong, setFirstSong] = useState({});
  const [playbackState, setPlaybackState] = useState({});
  const [playbackLog, setPlaybackLog] = useState({});
  const [lightOrDark, setLightOrDark] = useState('light');

  useEffect(() => {
    function handleResize() {
      setWindowDimensions([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', handleResize);
  }, []);

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
    setInterval(getNewToken, moment.duration(55, 'm').asMilliseconds());
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
            // But if no such object exists..
            if (!Object.keys(databaseObject).length) {
              // Create a new skeleton object for that user.
              axios({
                method: 'post',
                url: `/api/${userData.id}/new`,
                data: {
                  email: userData.email,
                  country: userData.country,
                }
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
                      setCurrentUser(databaseObject.Item);
                    });
                });
              // If it does exist though, just grab it and save it to state.
            } else {
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
            }
          });
      });
  };

  // When currentUser is set, populate the user's liked and banned songs.
  useEffect(() => {
    if (currentUser.spotify_user_id) {
      const likes = [];
      const bans = {};
      for (let songId in currentUser.songs) {
        const benches = currentUser.songs[songId].benches;
        if (currentUser.songs[songId].liked === false ||
          moment(benches[benches.length - 1], "MMM D [']YY [–] h[:]mm[:]ssa").add(3, 'M').isAfter()) {
          bans[songId] === true;
        } else if (currentUser.songs[songId].liked) {
          likes.push(songId);
        }
      }
      setNoPlayList(bans);
      if (!likes.length) {
        sendEvent('NO_LIKES');
      } else {
        setUsersLikedSongs(likes);
      }
    }
  }, [currentUser]);

  // When likes are populated, populate the songQueue, but don't start playing yet.
  useEffect(() => {
    if (usersLikedSongs.length && currentState.value === 'readyToPlay') {
      populateSongs(false);
    }
  }, [usersLikedSongs]);

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
      });
    };
  };

  // // Handle song queueing and playing

  const getRandomLikedSong = () => {
    console.log('Got random liked song: ', usersLikedSongs[Math.floor(Math.random() * usersLikedSongs.length)])
    return usersLikedSongs[Math.floor(Math.random() * usersLikedSongs.length)];
  };

  // const LOVE_STORY = '1vrd6UOGamcKNGnSHJQlSt';
  // const NIGHT_CHANGES = '5O2P9iiztwhomNh8xkR9lJ';
  // const GETAWAY_CAR = '0VE4kBnHJUgtMf0dy6DRmW';

  const populateSongs = (playNow) => {
    const randomSong1 = getRandomLikedSong();
    if (!playNow) {
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/tracks/' + randomSong1,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.data)
        .then((song) => {
          setFirstSong(song);
        })
    }

    setSongQueue({
      playing: playNow,
      songs: [randomSong1]
    });
  };

  useEffect(() => {
    if (songQueue.songs?.length === 1) {
      const randomSong2 = getRandomLikedSong();
      loadThreeSongs(songQueue.songs[0], randomSong2);
    }
    if (songQueue.songs?.length > 1 && songQueue.playing) {
      if (!noPlayList[songQueue[0]]) {
        axios({
          method: 'put',
          url: 'https://api.spotify.com/v1/me/player/play?' +
            queryString.stringify({
              device_id: deviceId,
            }),
          data: JSON.stringify({
            uris: [`spotify:track:${songQueue.songs[0]}`],
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
      } else {
        playNextSong();
      }
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
      .then((response) => response.data.tracks)
      .then((recommendations) => {
        let middleSong = recommendations.find((song) => {
          return !noPlayList[song.id];
        }) ?? getRandomLikedSong();
        setSongQueue({
          ...songQueue,
          songs: [song1, middleSong.id, song2],
        });
      });
  };

  // // Handle song logging

  // Triggered effect: Runs when Spotify reports a change in playback state.
  // Updates the playbackLog, which keeps track of listening time so we can update the database with it..
  useEffect(() => {
    // If song is just starting, initialize the playback log.
    if (playbackLog.currentSongId !== playbackState.track_window?.current_track.id) {
      setPlaybackLog({
        currentSongId: playbackState.track_window.current_track.id,
        startTimestamp: moment().tz('America/Los_Angeles').format("MMM D [']YY [–] h[:]mm[:]ssa z"),
        latestPosition: moment.duration(playbackState.position).seconds(),
        readyToPost: false,
      });
      // Attempt to post the song skeleton (if it doesn't exist in DB yet);
      axios({
        method: 'post',
        url: `/api/${currentUser.spotify_user_id}/song/new`,
        data: {
          currentSongId: playbackState.track_window.current_track.id,
          artists: playbackState.track_window.current_track.artists.map(artist => artist.name),
          name: playbackState.track_window.current_track.name,
        },
      });
      //Add the song to the noPlayList so it doesn't play again this session.
      setNoPlayList({
        ...noPlayList,
        [playbackState.track_window.current_track.id]: true,
      });
      // If song ended naturally, log the playtime.
    } else if (playbackState.paused && playbackState.restrictions.disallow_resuming_reasons?.[0] === 'not_paused') {
      setPlaybackLog({
        ...playbackLog,
        latestPosition: Math.max(playbackLog.latestPosition, moment.duration(playbackState.position).seconds()),
        readyToPost: true,
      });
      // If song is somewhere in the middle, update the latest listening position.
    } else if (playbackLog.currentSongId === playbackState.track_window?.current_track.id) {
      setPlaybackLog({
        ...playbackLog,
        latestPosition: Math.max(playbackLog.latestPosition, moment.duration(playbackState.position).seconds()),
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
        url: `/api/${currentUser.spotify_user_id}/song`,
        data: playbackLog,
      })
        .then(() => {
          playNextSong();
        });
    }
  }, [playbackLog.readyToPost]);

  // Triggers the play of the same song by resetting songQueue.
  const playSameSong = () => {
    setSongQueue({
      ...songQueue,
      songs: songQueue.songs.slice(),
    });
  }

  // Triggers the play of the next song by moving the song queue forward.
  const playNextSong = () => {
    setSongQueue({
      ...songQueue,
      songs: songQueue.songs.slice(1),
    });
  }

  // // Render page based on state machine.

  if (windowDimensions[0] < 900 || windowDimensions[1] < 680) {
    return (
      <div id="wooster" className={lightOrDark}>
        <WindowTooSmall />
      </div>
    )
  } else {
    return (
      <div id="wooster" className={`${lightOrDark} panel-layout`}>
        <Sidebar lightOrDark={lightOrDark} setLightOrDark={setLightOrDark} />
        <Main 
          currentState={currentState} 
          sendEvent={sendEvent}
          accessToken={accessToken}
          currentUserId={currentUser.spotify_user_id} 
          currentSong={playbackState.track_window?.current_track}
          usersLikedSongs={usersLikedSongs}
          setUsersLikedSongs={setUsersLikedSongs}
          noPlayList={noPlayList}
          setNoPlayList={setNoPlayList}
          songQueue={songQueue}
          setSongQueue={setSongQueue}
          firstSong={firstSong}
          populateSongs={populateSongs}
          playSameSong={playSameSong}
          playNextSong={playNextSong}
        />
      </div>
    );
  }
}

export default App;
