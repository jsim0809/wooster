import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';

function PromptForFirstSong({ sendEvent, accessToken, currentUserId, usersLikedSongs, setUsersLikedSongs, populateSongs }) {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchField, setSearchField] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);

  const MAX_RESULTS = 10;

  useEffect(() => {
    const selectedSong = searchResults[selectedIndex - 1];
    if (selectedSong) {
      setSearchField(`${pluralizeArtists(selectedSong.artists)} – ${selectedSong.name}`);
      setSelectedSong(selectedSong);
    };
  }, [selectedIndex]);

  const handleChange = (event) => {
    const { value } = event.currentTarget;
    setSearchField(value);
    if (value) {
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search?' +
          queryString.stringify({
            q: value.split(' ').join('+'),
            type: 'track',
            market: 'from_token',
            limit: MAX_RESULTS,
          }),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.data.tracks.items)
        .then((searchResults) => {
          setSearchResults(searchResults);
          setSelectedIndex(0);
          setSelectedSong(null);
        });
    } else {
      setSearchResults([]);
      setSelectedIndex(0);
      setSelectedSong(null);
    }
  };

  const handleBlur = () => {
    if (!searchField) {
      setSearchResults([]);
      setSelectedIndex(0);
      setSelectedSong(null);
    }
  }

  const pluralizeArtists = (artists) => {
    return artists.map(artist => artist.name).join(', ');
  };

  const handleKeyDown = (event) => {
    console.log(event.key);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (selectedIndex === MAX_RESULTS) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (selectedIndex === 0) {
        setSelectedIndex(MAX_RESULTS);
      } else {
        setSelectedIndex(selectedIndex - 1);
      }
    }
  };

  const handleMouseEnter = (event) => {
    setSelectedIndex(Number(event.currentTarget.getAttribute('name')));
  }

  const handleSongClick = (event) => {
    setSearchResults([]);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios({
      method: 'post',
      url: `/api/${currentUserId}/song/new`,
      data: {
        currentSongId: selectedSong.id,
        artists: selectedSong.artists.map(artist => artist.name),
        name: selectedSong.name,
      },
    })
      .then(() => {
        axios({
          method: 'post',
          url: `/api/${currentUserId}/like`,
          data: {
            currentSongId: selectedSong.id,
          },
        })
          .then(() => {
            console.log('Posting new song to liked list');
            setUsersLikedSongs([
              ...usersLikedSongs,
              selectedSong.id
            ])
          });
      });
  };

  useEffect(() => {
    if (usersLikedSongs.length) {
      populateSongs();
    }
  }, [usersLikedSongs]);

  const resultsDisplay = searchResults.map((result, index) => {
    if (selectedIndex === index + 1) {
      return (
        <div 
          className="selected-song" 
          key={index + 1} 
          name={index + 1} 
          onMouseEnter={handleMouseEnter}
          onClick={handleSongClick}>
            {`${pluralizeArtists(result.artists)} – ${result.name}`}
        </div>
      )
    } else {
      return (
        <div 
          key={index + 1} 
          name={index + 1} 
          onMouseEnter={handleMouseEnter}
          onClick={handleSongClick}>
            {`${pluralizeArtists(result.artists)} – ${result.name}`}
        </div>
      )
    }
  })

  return (
    <main>
      <div id="sample-ui">
        <div id="logged-in-text" style={{ visibility: 'hidden' }}>Logged in as samantha (Log out)</div>
        <div id="main-title" className="blurred">Now Playing</div>
        <div id="song-box" className="blurred">
          <img src="assets/album-image-example.jpg" />
          <div id="song-box-text">
            <div id="song-title">I Like It Like That</div>
            <div id="song-artists">Hot Chelle Rae</div>
          </div>
        </div>
        <div id="control-bar" className="blurred">
          <img className="control-bar-dislike" src="assets/dislike.svg" />
          <img className="control-bar-skip-back" src="assets/skip-back.svg" />
          <img className="control-bar-play-pause" src="assets/play.svg" />
          <img className="control-bar-skip-forward" src="assets/skip-forward.svg" />
          <img className="control-bar-like" src="assets/like.svg" />
          <hr className="control-bar-line" />
        </div>
      </div>
      <div id="prompt-for-first-song">
        <div id="logged-in-text">
          Logged in as {currentUserId} (<a id="logout" href='/'>Log out</a>)
        </div>
        <div id="main-title">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <input type="text" 
              onChange={handleChange} 
              onKeyDown={handleKeyDown} 
              onBlur={handleBlur} 
              value={searchField} 
            />
            <div id="search-results" className={searchResults.length ? 'active' : ''}>
              {resultsDisplay}
            </div>
          </form>
        </div>
        <div id="main-box">
          <div>
            <img src="assets/arrow.svg" alt="" />
          </div>
          <div>
            <div className="search-instructions">It looks like you're new to Wooster.</div>
            <div className="search-instructions">Type in a song you like and hit Enter!</div>
          </div>
          <div></div>
        </div>
      </div>
    </main>
  );
}

export default PromptForFirstSong;