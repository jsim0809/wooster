import React, { useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';

function Player({ accessToken, deviceId, currentUser }) {
  

  // Love Story by Taylor Swift
  const LOVE_STORY = 'spotify:track:1vrd6UOGamcKNGnSHJQlSt';
  const GETAWAY_CAR = 'spotify:track:0VE4kBnHJUgtMf0dy6DRmW';

  const testHandlePlayClick = () => {
    axios({
      method: 'put',
      url: 'https://api.spotify.com/v1/me/player/play?' +
        queryString.stringify({
          device_id: deviceId,
        }),
      data: JSON.stringify({
        uris: [LOVE_STORY, GETAWAY_CAR],
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const handlePlayClick = () => {
    axios(`/api/${currentUser.spotifyUserId}`)
      .then((response) => {
        
      })
      .catch((err) => {
        console.error('Failed to retrieve user data.');
      })
  }

  return (
    <div id="play-button" className="pointer">
      <button type="button "onClick={handlePlayClick}>Play</button>
    </div>
  );
}

export default Player;
