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
        SELECTED: 'songSelected',
      }
    },
    promptForFirstSong: {
      on: {
        SELECTED: 'firstSongSelected',
      }
    },
    firstSongSelected: {
      on: {
        PLAY: 'playing',
      }
    },
    playing: {
      on: {
        PAUSE: 'paused',
        SELECTED: 'songSelected',
      }
    },
    paused: {
      on: {
        PLAY: 'resumed',
        SELECTED: 'songSelected',
        SONG_ENDED: 'playing',
      }
    },
    resumed: {
      on: {
        PAUSE: 'paused',
        SELECTED: 'songSelected',
        SONG_ENDED: 'playing',
      }
    },
    songSelected: {
      on: {
        PLAY: 'playing',
      }
    },
  },
});

export default woosterMachine;