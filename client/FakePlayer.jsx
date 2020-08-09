import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';

function FakePlayer({ accessToken, deviceId, populateSongs }) {


  // Sample songs
  const LOVE_STORY = 'spotify:track:1vrd6UOGamcKNGnSHJQlSt';
  const NIGHT_CHANGES = 'spotify:track:5O2P9iiztwhomNh8xkR9lJ';
  const GETAWAY_CAR = 'spotify:track:0VE4kBnHJUgtMf0dy6DRmW';

  const testhandlePlayClick = () => {
    axios({
      method: 'put',
      url: 'https://api.spotify.com/v1/me/player/play?' +
        queryString.stringify({
          device_id: deviceId,
        }),
      data: JSON.stringify({
        uris: [LOVE_STORY, NIGHT_CHANGES, GETAWAY_CAR],
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const handlePlayClick = () => {
    populateSongs();
  }

  const handleLikeClick = () => {
    console.log('beep');
  }

  // TODO: CHECK IF THE USER HAS ANY LIKED SONGS. IF NOT, PROMPT THEM FOR ONE!

  return (
    <>
    <div id="play-button" className="pointer">
      <button type="button" onClick={testhandlePlayClick}>Play</button>
    </div>

    <div id="like-button" className="pointer">
      <button type="button" onClick={handleLikeClick}>Thumbs Up</button>
    </div>
    </>
  );
}

export default FakePlayer;
