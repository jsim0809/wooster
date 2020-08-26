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
  const [state, sendEvent] = useMachine(woosterMachine);
  const [windowDimensions, setWindowDimensions] = useState([window.innerWidth, window.innerHeight])
  const [lightOrDark, setLightOrDark] = useState('light');
  const [accessToken, setAccessToken] = useState(URL_HASH.access_token);
  const [refreshToken, setRefreshToken] = useState(URL_HASH.refresh_token);
  const [deviceId, setDeviceId] = useState('');
  const [user, setUser] = useState({});
  const [playlists, setPlaylists] = useState({});
  const [likesList, setLikesList] = useState({});
  const [dislikesList, setDislikesList] = useState({});
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [stale, setStale] = useState([]);
  const [songQueue, setSongQueue] = useState([]);
  const [playbackState, setPlaybackState] = useState({});

  // Triggered effect: Runs once on component mount.
  // Adds a listener for window size.
  // Detect logged-in state, removes access codes from URL bar, and runs initialization code.
  useEffect(() => {
    if (accessToken) {
      window.location.hash = '';
      window.addEventListener('resize', handleResize);
      sendEvent('LOGGED_IN');
      initializeRefreshLoop();
      initializeUser();
      initializeSpotifyPlayer();
    }
  }, []);

  // // Initializing helper functions, including the refresh loop.

  // Stores the window size in state so we can respond to size changes.
  const handleResize = () => {
    setWindowDimensions([window.innerWidth, window.innerHeight]);
  }

  // Spotify access tokens last for 60 minutes. Every 55 minutes, grab a new one.
  const initializeRefreshLoop = () => {
    setInterval(getNewToken, moment.duration(55, 'm').asMilliseconds());
  }

  // Helper function: Use our refresh token to request a new access token.
  const getNewToken = () => {
    axios({
      method: 'get',
      url: '/refresh?' +
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
      .then((response) => {
        setUser(response.data);
        axios({
          method: 'get',
          url: 'https://api.spotify.com/v1/me/playlists?limit=50',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            setPlaylists(response.data);
          });
      });
  };

  // When playlists are set, identify the user's "Liked on Wooster" and "Disliked on Wooster" playlists.
  useEffect(() => {
    if (playlists.items) {
      let l, d;
      for (let playlist of playlists.items) {
        if (playlist.name === 'Liked from Wooster') {
          l = playlist;
        } else if (playlist.name === 'Disliked from Wooster') {
          d = playlist;
        }
        if (l && d) {
          break;
        }
      }

      if (l) {
        axios({
          method: 'get',
          url: `https://api.spotify.com/v1/playlists/${l.id}/tracks`,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
          .then((response) => {
            setLikesList(l);
            if (response.data.items.length) {
              setLikes(response.data.items.map(item => item.track));
            } else {
              sendEvent('NO_LIKES');
            }
          });
      } else {
        axios({
          method: 'post',
          url: `https://api.spotify.com/v1/users/${user.id}/playlists`,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            name: 'Liked from Wooster',
            description: 'Your liked songs on Wooster. You can edit this list to customize your Wooster experience.',
            public: false,
          }),
        })
          .then((response) => {
            setLikesList(response.data);
            sendEvent('NO_LIKES');
          });
      }

      if (d) {
        axios({
          method: 'get',
          url: `https://api.spotify.com/v1/playlists/${d.id}/tracks`,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
          .then((response) => {
            setDislikesList(d);
            setDislikes(response.data.items);
          });
      } else {
        axios({
          method: 'post',
          url: `https://api.spotify.com/v1/users/${user.id}/playlists`,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            name: 'Disliked from Wooster',
            description: 'Your disliked songs on Wooster. You can edit this list to customize your Wooster experience.',
            public: false,
          }),
        })
          .then((response) => {
            setDislikesList(response.data);
          });
      }
    }
  }, [playlists]);

  // When likes are populated, populate the songQueue, but don't start playing yet.
  useEffect(() => {
    if (likes.length && (state.matches('readyToPlay') || state.matches('firstSongSelected'))) {
      populateSongs();
    }
  }, [likes, state]);

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
    return likes[Math.floor(Math.random() * likes.length)];
  };

  const populateSongs = () => {
    const randomSong1 = getRandomLikedSong();
    setSongQueue([randomSong1]);
  };

  useEffect(() => {
    console.log('songqueue has been set to,', songQueue);
    if (songQueue.length === 1) {
      const randomSong2 = getRandomLikedSong();
      loadThreeSongs(songQueue[0], randomSong2);
    }
    if (songQueue.length > 1 
      && (state.matches('playing') 
        || state.matches('firstSongSelected'
        || state.matches('songSelected')))) {
      if (![...dislikes, ...stale].find((dislikedSong) => {
        console.log('0', dislikedSong)
        console.log('1', songQueue[0])
        return dislikedSong?.id === songQueue[0].id;
      })) {
        axios({
          method: 'put',
          url: 'https://api.spotify.com/v1/me/player/play?' +
            queryString.stringify({
              device_id: deviceId,
            }),
          data: JSON.stringify({
            uris: [`spotify:track:${songQueue[0].id}`],
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
  }, [songQueue, state]);

  const loadThreeSongs = (song1, song2) => {
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/recommendations?' +
        queryString.stringify({
          limit: 100,
          seed_tracks: `${song1.id},${song2.id}`,
        }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        let middleSong = response.data.tracks.find((recommendation) => {
          return ![...dislikes, ...stale].find((dislikedSong) => {
            console.log('2', dislikedSong)
            console.log('3', recommendation)
            return dislikedSong?.id === recommendation.id;
          });
        }) ?? getRandomLikedSong();
        setSongQueue([song1, middleSong, song2]);
      });
  };

  useEffect(() => {
    if (playbackState.paused && playbackState.restrictions.disallow_resuming_reasons?.[0] === 'not_paused') {
      playNextSong();
    }
  }, [playbackState]);

  // Triggers the play of the same song by resetting songQueue.
  const playSameSong = () => {
    setSongQueue(songQueue.slice());
    sendEvent('SONG_ENDED');
  }

  // Triggers the play of the next song by moving the song queue forward.
  const playNextSong = () => {
    setStale([
      ...stale,
      songQueue[0]
    ])
    setSongQueue(songQueue.slice(1));
    sendEvent('SONG_ENDED');
  }

  const like = (event, id = songQueue[0].id) => {
    axios({
      method: 'post',
      url: `https://api.spotify.com/v1/playlists/${likesList.id}/tracks`,
      data: JSON.stringify({
        uris: [`spotify:track:${id}`],
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        refreshLikes();
      });
  }

  const unlike = () => {
    axios({
      method: 'delete',
      url: `https://api.spotify.com/v1/playlists/${likesList.id}/tracks`,
      data: JSON.stringify({
        tracks: [
          { uri: `spotify:track:${songQueue[0].id}` }
        ],
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        refreshLikes();
      });
  }

  const dislike = () => {
    axios({
      method: 'post',
      url: `https://api.spotify.com/v1/playlists/${dislikesList.id}/tracks`,
      data: JSON.stringify({
        uris: [`spotify:track:${songQueue[0].id}`],
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        refreshDislikes();
        playNextSong();
      });
  }

  const refreshLikes = () => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${likesList.id}/tracks`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setLikes(response.data.items.map(item => item.track));
      });
  }

  const refreshDislikes = () => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${dislikesList.id}/tracks`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setDislikes(response.data.items.map(item => item.track));
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
          lightOrDark={lightOrDark}
          state={state}
          sendEvent={sendEvent}
          accessToken={accessToken}
          user={user}
          likes={likes}
          songQueue={songQueue}
          setSongQueue={setSongQueue}
          playSameSong={playSameSong}
          playNextSong={playNextSong}
          like={like}
          unlike={unlike}
          dislike={dislike}
        />
      </div>
    );
  }
}

export default App;
