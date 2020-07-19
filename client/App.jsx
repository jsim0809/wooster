import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import woosterMachine from './woosterMachine.js';

import WelcomeToWooster from './WelcomeToWooster.jsx';
import Header from './Header.jsx';
import Login from './Login.jsx';

function App() {
  const [currentState, sendEvent] = useMachine(woosterMachine);

  useEffect(() => {
    setTimeout(() => {
      sendEvent('ANIMATION_DONE');
    }, 6250);
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
  }
}

export default App;