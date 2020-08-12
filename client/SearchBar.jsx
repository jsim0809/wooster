import React, { useState } from 'react';
import axios from 'axios';

function SearchBar() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (event) => {
    setSearch(event.currentTarget.value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // axios
    // clear form
  };

  return (
    <div id="search-container">
      <p>It looks like you're new to Wooster.</p>
      <form autocomplete="off" onSubmit={handleSubmit}>
        <label htmlFor="search-bar">Find a song to start with:</label>
        <input type="text" onChange={handleChange} value={search} />
        <input type="submit" value="Go" />
        {suggestions}
      </form>
    </div>
  );
}

export default SearchBar;
