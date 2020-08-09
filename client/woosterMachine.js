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
        PLAY: 'playing',
      }
    },
    playing: {
      on: {
        STOP: 'readyToPlay',
      }
    },
  },
});

export default woosterMachine;