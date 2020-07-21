import React, { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import queryString from 'query-string';
import woosterMachine from './woosterMachine.js';

import WelcomeToWooster from './WelcomeToWooster.jsx';
import Header from './Header.jsx';
import Login from './Login.jsx';
import PlayButton from './PlayButton.jsx';

function App() {
  const URL_HASH = queryString.parse(window.location.hash);
  const [currentState, sendEvent] = useMachine(woosterMachine);
  const [accessToken, setAccessToken] = useState(URL_HASH.access_token);
  const [refreshToken, setRefreshToken] = useState(URL_HASH.refresh_token);

  useEffect(() => {
    if (accessToken) {
      sendEvent('ALREADY_LOGGED_IN');
    } else {
      setTimeout(() => {
        sendEvent('ANIMATION_DONE');
      }, 6000);
    }
  }, []);

  const animationCancel = () => {
    sendEvent('ANIMATION_DONE');
  }

  if (currentState.matches('intro')) {
    return (
      <div id="body-section" onClick={animationCancel}>
        <div id="body-grid">
          <WelcomeToWooster />
        </div>
      </div>
    );
  } else if (currentState.matches('landing')) {
    return (
      <div id="body-section">
        <div id="body-grid">
          <Header />
          <Login />
        </div>
      </div>
    );
  } else if (currentState.matches('loggedInNotPlaying')) {
    return (
      <div id="body-section">
        <div id="body-grid">
          <Header />
          <PlayButton />
        </div>
      </div>
    )
  }
}

export default App;