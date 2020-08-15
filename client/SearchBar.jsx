import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';

function SearchBar({ accessToken }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState();

  const handleChange = (event) => {
    if (event.currentTarget.value) {
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search?' +
          queryString.stringify({
            q: event.currentTarget.value.split(' ').join('+'),
            type: 'track',
            market: 'from_token',
            limit: 5,
          }),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.data.tracks.items)
        .then((searchResults) => {
          let resultsDisplay = searchResults.map((result, index) => {
            return (
              <div key={index}>{`${pluralizeArtists(result.artists)} – ${result.name}`}</div>
            )
          })
          setSuggestions(resultsDisplay);
        });
    } else {
      setSuggestions([]);
    }
  };

  const pluralizeArtists = (artists) => {
    return artists.map(artist => artist.name).join(', ');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // axios
    // clear form
  };

  // next steps : handle selection and submit

  return (
    <div id="search-container">
      <p>It looks like you're new to Wooster.</p>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <label htmlFor="search-bar">Find a song to start with:</label>
        <input type="text" onChange={handleChange} />
        <input type="submit" value="Go" />
        {suggestions}
      </form>
    </div>
  );
}

export default SearchBar;
