import { Machine } from 'xstate';

const woosterMachine = Machine({
  id: 'wooster',
  initial: 'landing',
  states: {
    landing: {
      on: {
        LOGGED_IN: 'readyToPlay',
      }
    },
    readyToPlay: {
      on: {
        NO_LIKES: 'promptForFirstSong',
        PLAY: 'playing',
      }
    },
    promptForFirstSong: {
      ENTERED: 'playing',
    },
    playing: {
      on: {
        PAUSE: 'paused',
      }
    },
    paused: {
      on: {
        PLAY: 'playing',
      }
    }
  },
});

export default woosterMachine;