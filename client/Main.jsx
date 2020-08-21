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
  songQueue,
  setSongQueue,
  firstSong,
  populateSongs
}) {
  
  const pluralizeArtists = (artists) => {
    return artists?.map(artist => artist.name).join(', ');
  };

  let playerDisplay;
  switch (currentState.value) {
    case 'landing':
      playerDisplay = <LandingPage />;
      break;
    case 'promptForFirstSong':
      playerDisplay = (
        <PromptForFirstSong
          accessToken={accessToken}
          currentUserId={currentUserId}
          usersLikedSongs={usersLikedSongs}
          setUsersLikedSongs={setUsersLikedSongs}
          populateSongs={populateSongs}
          pluralizeArtists={pluralizeArtists}
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
          currentSong={currentSong}
          usersLikedSongs={usersLikedSongs}
          setUsersLikedSongs={setUsersLikedSongs}
          noPlayList={noPlayList}
          setNoPlayList={setNoPlayList}
          songQueue={songQueue}
          setSongQueue={setSongQueue}
          firstSong={firstSong}
          populateSongs={populateSongs}
          pluralizeArtists={pluralizeArtists}
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