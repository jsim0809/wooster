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
        SELECTED: 'firstSongSelected',
      }
    },
    paused: {
      on: {
        PLAY: 'resumed',
        SELECTED: 'firstSongSelected',
      }
    }
    ,
    resumed: {
      on: {
        PAUSE: 'paused',
        SELECTED: 'firstSongSelected',
        SONG_ENDED: 'playing',
      }
    }
  },
});

export default woosterMachine;