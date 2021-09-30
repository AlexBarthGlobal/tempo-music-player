import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {searchSongsThunk} from '../redux/musicDispatchers'
import BrowseSongsSingleSong from './BrowseSongsSingleSong'

const BrowseSongs = (props) => {
    const [searchInput, setSearchInput] = useState('')
    const [BPMInput, setBPMInput] = useState('')

    const handleChange = (evt) => {
        evt.target.name === 'searchInput' ? setSearchInput(evt.target.value) : setBPMInput(evt.target.value);
    };

    useEffect(() => {
        props.searchSongs(searchInput, Number(BPMInput))
    }, [searchInput, BPMInput])

    const checkIfInCollection = () => {

    }

    const addOrRemoveSongFromCollection = (songId) => {

    }

    const songs = [];
    if (props.searchedSongs) {
        let idx = 0;
        for (const song of props.searchedSongs) {
            songs.push(<BrowseSongsSingleSong key={idx} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} artURL={song.artURL} /*inCollection={checkIfInCollection(song.id)*/ />)
            idx++;
        };
    };

    console.log('Props from browseSongs', props)

    return (
        <div>
            <div className='screenTitle'>
                Add Songs to {props.selectedCollectionInfo.collectionName}
            </div>
            <div className='centerThis'>
                <div>
                    <input type='text' name='searchInput' placeholder='Search for songs or artists' value={searchInput} onChange={handleChange}></input>
                </div>
                <div>
                    <input type='number' name='BPMInput' placeholder='BPM' value={BPMInput} onChange={handleChange}></input>
                </div>
            </div>
            <ul style ={{listStyle:'none'}}>
                    {songs}
            </ul>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        selectedCollection: state.screenReducer.selectedCollection,
        searchedSongs: state.musicReducer.searchedSongs,
        selectedCollectionInfo: state.musicReducer.collections[state.screenReducer.selectedCollection]
    };
};
  
const mapDispatchToProps = (dispatch) => ({
    searchSongs: (searchInput, BPMInput) => dispatch(searchSongsThunk(searchInput, BPMInput))
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowseSongs)