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
  likes,
  songQueue,
  setSongQueue,
  playSameSong,
  playNextSong,
  like,
  unlike,
  dislike
}) {

  const pluralize = (artists) => {
    return artists?.map(artist => artist.name).join(', ');
  };

  let playerDisplay;
  switch (state.value) {
    case 'landing':
      playerDisplay = <LandingPage />;
      break;
    case 'promptForFirstSong':
      playerDisplay = (
        <PromptForFirstSong
          lightOrDark={lightOrDark}
          sendEvent={sendEvent}
          accessToken={accessToken}
          user={user}
          like={like}
          setSongQueue={setSongQueue}
          pluralize={pluralize}
        />
      );
      break;
    default:
      playerDisplay = (
        <Player
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
          pluralize={pluralize}
        />
      )
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