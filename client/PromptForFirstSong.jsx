import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PromptForFirstSong({ accessToken, currentUserId, usersLikedSongs, setUsersLikedSongs, populateSongs }) {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchField, setSearchField] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);

  const MAX_RESULTS = 5;

  useEffect(() => {
    const selectedSong = searchResults[selectedIndex - 1];
    console.log(selectedSong);
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
            limit: 5,
          }),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.data.tracks.items)
        .then((searchResults) => {
          setSearchResults(searchResults);
        });
    } else {
      setSearchResults([]);
    }
  };

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
        <div className="selected-song" key={index + 1}>{`${pluralizeArtists(result.artists)} – ${result.name}`}</div>
      )
    } else {
      return (
        <div key={index + 1}>{`${pluralizeArtists(result.artists)} – ${result.name}`}</div>
      )
    }
  })


  // next steps : handle selection and submit

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
        <div id="logged-in-text">Logged in as {currentUserId} (Log out)</div>
        <div id="main-title">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} onKeyDown={handleKeyDown} value={searchField} />
            {resultsDisplay}
          </form>
        </div>
      </div>
    </main>




  );
}

export default PromptForFirstSong;