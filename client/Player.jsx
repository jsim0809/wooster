import React, { useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';

function Player({ accessToken, deviceId, playbackState, setPlaybackState }) {
  

  // Love Story by Taylor Swift
  const LOVE_STORY = 'spotify:track:1vrd6UOGamcKNGnSHJQlSt';
  const GETAWAY_CAR = 'spotify:track:0VE4kBnHJUgtMf0dy6DRmW';

  const handlePlayClick = () => {
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

  return (
    <div id="play-button" className="pointer">
      <button onClick={handlePlayClick}>Play</button>
    </div>
  );
}

export default Player;
