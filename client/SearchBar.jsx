import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';

function SearchBar({ 
  sendEvent, 
  accessToken, 
  like, 
  setSongQueue, 
  pluralize, 
  parent, 
  setSearchIsActive 
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchField, setSearchField] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);

  const MAX_RESULTS = 10;

  useEffect(() => {
    const song = searchResults[selectedIndex - 1];
    if (song) {
      setSearchField(`${pluralize(song.artists)} – ${song.name}`);
      setSelectedSong(song);
    }
  }, [selectedIndex]);

  const handleEntry = (event) => {
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
        .then((response) => {
          setSearchResults(response.data.tracks.items);
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

  const handleKeyDown = (event) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (parent === 'PromptForFirstSong') {
      like(null, selectedSong.id);
    } else {
      setSongQueue([selectedSong]);
    }
    setSearchResults([]);
    if (setSearchIsActive) {
      setSearchIsActive(false);
    }
    sendEvent('SELECTED');
  };

  const resultsDisplay = searchResults.map((result, index) => {
    return (
      <div
        className={selectedIndex === index + 1 ? 'selected-song' : ''}
        key={index + 1}
        name={index + 1}
        onMouseEnter={handleMouseEnter}
        onClick={handleSubmit}>
        {`${pluralize(result.artists)} – ${result.name}`}
      </div>
    )
  });

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <div>Testing</div>
      <input type="text"
        onChange={handleEntry}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        value="Hello"
        autoFocus
      />
      <div id="search-results" className={searchResults.length ? 'active' : ''}>
        {resultsDisplay}
      </div>
    </form>
  );
}

export default SearchBar;