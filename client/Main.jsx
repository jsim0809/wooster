import React from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './LandingPage.jsx';
import PromptForFirstSong from './PromptForFirstSong.jsx';
import Player from './Player.jsx';
import UnderConstruction from './UnderConstruction.jsx';

function Main({
  lightOrDark,
  state,
  sendEvent,
  accessToken,
  user,
  likesList,
  dislikesList,
  songQueue,
  playSameSong,
  playNextSong,
  refreshPlaylists
}) {

  const pluralize = (artists) => {
    return artists?.map(artist => artist.name).join(', ');
  };

  const like = (id) => {
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
        refreshPlaylists();
      });
  }

  const dislike = (id) => {
    axios({
      method: 'post',
      url: `https://api.spotify.com/v1/playlists/${dislikesList.id}/tracks`,
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
        refreshPlaylists();
      });
  }

  let playerDisplay;
  switch (state.value) {
    case 'landing':
      playerDisplay = <LandingPage />;
      break;
    case 'promptForFirstSong':
      playerDisplay = (
        <PromptForFirstSong
          lightOrDark={lightOrDark}
          accessToken={accessToken}
          user={user}
          like={like}
          pluralize={pluralize}
        />
      );
      break;
    case 'readyToPlay':
    case 'playing':
    case 'paused':
      playerDisplay = (
        <Player
          lightOrDark={lightOrDark}
          state={state}
          sendEvent={sendEvent}
          accessToken={accessToken}
          user={user}
          songQueue={songQueue}
          playSameSong={playSameSong}
          playNextSong={playNextSong}
          like={like}
          dislike={dislike}
          pluralize={pluralize}
        />
      )
      break;
  }

  return (
    <Switch>
      <Route exact path='/'>
        {playerDisplay}
      </Route>
      <Route exact path='/your'>
        <UnderConstruction />
      </Route>
      <Route exact path='/whatiswooster'>
        <UnderConstruction />
      </Route>
      <Route exact path='/about'>
        <UnderConstruction />
      </Route>
    </Switch>
  )
}

export default Main;