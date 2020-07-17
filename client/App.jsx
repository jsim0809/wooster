import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import woosterMachine from './woosterMachine.js';

import WelcomeToWooster from './WelcomeToWooster.jsx';
import LogIn from './LogIn.jsx';

function App() {
  const [currentState, sendEvent] = useMachine(woosterMachine);

  useEffect(() => {
    // setTimeout(() => {
    //   sendEvent('ANIMATION_DONE');
    // }, 3000);
  }, []);

  if (currentState.matches('intro')) {
    return (
      <WelcomeToWooster />
    );
  } else if (currentState.matches('landing')) {
    return (
      <LogIn />
    );
  }
}

export default App;