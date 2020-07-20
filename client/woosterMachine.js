import { Machine } from 'xstate';

// This machine is completely decoupled from React
const woosterMachine = Machine({
  id: 'wooster',
  initial: 'intro',
  states: {
    intro: {
      on: {
        ANIMATION_DONE: 'landing',
        ALREADY_LOGGED_IN: 'loggedInNotPlaying',
      }
    },
    landing: {
      on: {
        LOGIN_CLICK: 'loggedInNotPlaying',
      }
    },
    loggedInNotPlaying: {
      on: {
        PLAY_CLICK: 'loggedInPlaying',
      }
    },
    loggedInPlaying: {
      on: {
        PAUSE_CLICK: 'loggedInNotPlaying',
      }
    },
  },
});

export default woosterMachine;