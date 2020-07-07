import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import woosterMachine from './woosterMachine.js';

function App() {
  const [currentState, sendEvent] = useMachine(woosterMachine);

  useEffect(() => {
    setTimeout(() => {
      sendEvent('ANIMATION_DONE');
    }, 3000);
  }, []);

  if (currentState.matches('intro')) {
    return (
      <div>Welcome to Wooster</div>
    );
  } else if (currentState.matches('landing')) {
    return (
      <div>Log in</div>
    );
  }
}

export default App;