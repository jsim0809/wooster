import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import PromptForFirstSong from './PromptForFirstSong.jsx';
import Player from './Player.jsx';
import UnderConstruction from './UnderConstruction.jsx';

function Main({ 
  currentState, 
  sendEvent, 
  accessToken, 
  currentUserId, 
  currentSong,
  usersLikedSongs, 
  setUsersLikedSongs, 
  noPlayList,
  setNoPlayList,
  populateSongs
}) {
  
  let playerDisplay;
  switch (currentState.value) {
    case 'landing':
      playerDisplay = <LandingPage />;
      break;
    case 'promptForFirstSong':
      playerDisplay = (
        <PromptForFirstSong
          sendEvent={sendEvent}
          accessToken={accessToken}
          currentUserId={currentUserId}
          usersLikedSongs={usersLikedSongs}
          setUsersLikedSongs={setUsersLikedSongs}
          populateSongs={populateSongs}
        />
      );
      break;
    case 'readyToPlay':
    case 'playing':
    case 'paused':
      playerDisplay = (
        <Player 
          currentState={currentState}
          sendEvent={sendEvent}
          accessToken={accessToken}
          currentUserId={currentUserId}
          currentSongId={currentSong}
          usersLikedSongs={usersLikedSongs}
          setUsersLikedSongs={setUsersLikedSongs}
          noPlayList={noPlayList}
          setNoPlayList={setNoPlayList}
          populateSongs={populateSongs}
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