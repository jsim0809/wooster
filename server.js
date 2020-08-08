const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const queryString = require('query-string');

const secret = require('./secret.keys.js');
const database = require('./database.js');

const app = express();
const PORT = 1234;

const { WOOSTER_CLIENT_ID, WOOSTER_CLIENT_SECRET } = secret;
const REDIRECT_URI = 'http://localhost:1234/callback';

app.use(express.static('docs'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

/**
 * Generates a random base-62 string to be used as a cookie.
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let result = '';
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return result;
};

/**
 * Login route.
 * Client requests authorization from Spotify.
 
 * This app reads the following information from user's account:
  
 * streaming: Allows you to stream music!
 * user-read-email: The user's email address and username.
 * user-read-private: The user's subscription details (Premium or Free).
 * user-top-read: The user's top artists and tracks. Used to generate random seeds.
 * user-read-playback-position: Used to track how long you listen to each track in seconds.
 * user-read-currently-playing: Used to properly flag likes, unlikes,  and woos.
 * user-read-recently-played: Recently played tracks. For liking and unliking songs that you recently played.
 * user-modify-playback-state: Allows Wooster to start and stop songs.

 * Scopes documentation at https://developer.spotify.com/documentation/general/guides/scopes/
 */
app.get('/login', function (req, res) {
  // Generate a random string.
  const state = generateRandomString(16);
  // Place it on a cookie in the response object.
  res.cookie('spotify_auth_state', state);

  // Define the scopes we are going to request.
  var scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-top-read',
    'user-read-playback-position',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-modify-playback-state',
  ];

  // Pass all of the above into the redirect URL to Spotify's authorization servers.
  res.redirect('https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type: 'code',
      client_id: WOOSTER_CLIENT_ID,
      scope: scopes.join('%20'),
      redirect_uri: REDIRECT_URI,
      state: state
    }));
});

/**
 * After the user logs in, they are redirected back to my /callback route.
 */
app.get('/callback', (req, res) => {
  const { code, state, error } = req.query;
  const storedState = req.cookies ? req.cookies['spotify_auth_state'] : undefined;

  // If the cookie still matches (login succeeded), send Wooster's ID and secret to Spotify's music API servers.
  if (error) {
    res.redirect('/#' +
      queryString.stringify({
        error: error,
      }));
  } else if (!state || state !== storedState) {
    res.redirect('/#' +
      queryString.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie('spotify_auth_state');

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: queryString.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      headers: {
        'Authorization': 'Basic ' + Buffer.from(WOOSTER_CLIENT_ID + ':' + WOOSTER_CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        const { access_token, refresh_token } = response.data;

        // Pass our approved credentials to the URL bar to make further requests.
        res.redirect('/#' +
          queryString.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      })
      .catch((error) => {
        res.redirect('/#' +
          queryString.stringify({
            error: 'invalid_token'
          }));
      });
  }
});

// When necessary, the client will request a new access token from us. We use their refresh token to request it from Spotify.
app.get('/api/refresh', (req, res) => {
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(WOOSTER_CLIENT_ID + ':' + WOOSTER_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: queryString.stringify({
      grant_type: 'refresh_token',
      refresh_token: req.query.refresh_token,
    }),
  })
    .then((response) => {
      res.status(200).send({
        'access_token': response.data.access_token,
      });
    });
});


// Grab a user's entire data object
app.get('/api/:spotify_user_id', (req, res) => {
  database.getData(req.params.spotify_user_id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// Create the skeleton of a user's data object
app.post('/api/:spotify_user_id/new', (req, res) => {
  database.createSkeleton(req.params.spotify_user_id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// Update the user's email in the database.
app.put('/api/:spotify_user_id/email', (req, res) => {
  const { email } = req.body;
  database.updateEmail(req.params.spotify_user_id, email, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// Record the song that a user just listened to.
app.post('/api/:spotify_user_id/song', (req, res) => {
  const { currentSongId, startTimestamp, latestPosition } = req.body;
  database.recordSongPlayTime(req.params.spotify_user_id, currentSongId, startTimestamp, latestPosition, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// Woo a song.
app.post('/api/:spotify_user_id/woo', (req, res) => {
  const { currentSongId, wooTimestamp } = req.body;
  database.woo(req.params.spotify_user_id, currentSongId, wooTimestamp, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// Bench a song.
app.post('/api/:spotify_user_id/bench', (req, res) => {
  const { currentSongId, benchTimestamp } = req.body;
  database.bench(req.params.spotify_user_id, currentSongId, benchTimestamp, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Wooster is listening on port ${PORT}.`);
});
