const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const secret = require('./secret.keys.js');

const app = express();
const PORT = 1234;

const client_id = secret.WOOSTER_CLIENT_ID;
const client_secret = secret.WOOSTER_CLIENT_SECRET;
const redirect_uri = 'http://localhost:1234/callback';

app.use(express.static(`${__dirname}/client/dist`));
app.use(cors());
app.use(cookieParser());

/**
 * Generates a random base-62 string to be used as a cookie.
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateCookie = (length) => {
  let cookie = '';
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    cookie += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }

  return cookie;
};

/**
 * Login route.
 * Client requests authorization from Spotify.
 
 * This app reads the following information from user's account:
  * user-read-currently-playing: The song that is currently playing.
  * user-top-read: The user's top artists and tracks.
  * user-read-recently-played: The user's recently-played tracks.
  * user-read-email: The user's email address and username.

 */
app.get('/login', (req, res) => {

  const state = generateCookie(16);
  res.cookie('spotify_auth_state', state);

  var scope = 'user-read-currently-playing user-top-read user-read-recently-played user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({ 
      response_type: 'code', 
      client_id: client_id, 
      scope: scope, 
      redirect_uri: redirect_uri, 
      state: state 
    })); 
});


/**
 * Login route.
 * Client checks state cookie, requests refresh and access tokens from Spotify, and connects to Spotify API.
 */
app.get('/callback', (req, res) => {

  // Client check state cookie, then requests refresh and access tokens.
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie('spotify_auth_state');
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // Client uses the access token to access the Spotify Web API.
        request.get(options, (error, response, body) => {
          console.log(body);
        });

        // We also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', (req, res) => {

  // Client uses refresh token to request access token.
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.query.refresh_token
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send({
        'access_token': body.access_token
      });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Wooster is listening on port ${PORT}.`);
})