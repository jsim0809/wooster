import { Machine } from 'xstate';

// This machine is completely decoupled from React
const woosterMachine = Machine({
  id: 'wooster',
  initial: 'intro',
  states: {
    intro: {
      on: {
        ANIMATION_DONE: 'landing',
        LOGGED_IN: 'readyToPlay',
      }
    },
    landing: {
      type: 'final',
    },
    readyToPlay: {
      type: 'final',
    },
  },
});

export default woosterMachine;