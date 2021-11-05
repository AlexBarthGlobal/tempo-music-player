import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {searchSongsThunk, addSongToCollectionThunk, removeSongFromCollectionThunk, popOneFromActiveSessionSongsThunk, applySongsInRange, addSongsInRangeThunk, enqueueSongThunk} from '../redux/musicDispatchers'
import BrowseSongsSingleSong from './BrowseSongsSingleSong'
import songsInRange from '../components/songsInRange'
import PreviewPlayer from '../components/PreviewPlayer'
import BPMSlider from '../components/BPMSlider'
import {setPlayingTrueThunk, setPlayingFalseThunk} from '../redux/playerReducer'

const BrowseSongs = (props) => {
    const [searchInput, setSearchInput] = useState('')
    const [BPMInput, setBPMInput] = useState(props.musicInfo.activeSession ? props.musicInfo.activeSession.currBPM : 140)
    const [playing, setPlaying] = useState(false)
    const [songURL, setSongURL] = useState(null)

    useEffect(() => {
        if (props.playing) {
            setSongURL(null);
            setPlaying(false);
        };
    }, [props.playing])

    const selectSong = (selectedSongURL) => {
        props.pause();
        console.log('SelectedURL', selectedSongURL, 'playingURL', songURL)
        if (playing && selectedSongURL === songURL) {
            setSongURL(null);
            setPlaying(false);
        } else {
            setSongURL(selectedSongURL);
            setPlaying(true);
        };  
    };

    const previewEnded = () => {
        setPlaying(false);
        setSongURL(null);
    };

    const handleChange = (evt) => {
        evt.target.name === 'searchInput' ? setSearchInput(evt.target.value) : setBPMInput(evt.target.value);
    };

    useEffect(() => {
        props.searchSongs(searchInput, Number(BPMInput))
    }, [searchInput, BPMInput])

    const checkIfInCollection = (songId) => {
        return props.selectedCollectionInfo.songs.has(songId);
    };

    const addSongToCollection = async (songId) => {
        await props.addSongToCollection(props.selectedCollection, songId);
        if (props.musicInfo.activeSession && props.musicInfo.activeSession.collectionId === props.selectedCollection) {
            const results = songsInRange(props.user.listened.songs, props.musicInfo.collections[props.selectedCollection].songs, props.musicInfo.activeSession.currBPM);
            if (results[0].length) {
                if (props.musicInfo.activeSession.songs[props.musicInfo.activeSession.playIdx+1] === 'undefined') {
                    props.popOneFromActiveSessionSongs();
                    props.addSongsInRange(results[0])
                };
            };
        };
    };

    const removeSongFromCollection = async (songId) => {
        await props.removeSongFromCollection(props.selectedCollection, songId, !!props.user.listened.songs[songId]);
    };

    const songs = [];
    if (props.searchedSongs) {
        console.log('LOOPING AGAIN')
        let idx = 0;
        for (const song of props.searchedSongs) {
            songs.push(<BrowseSongsSingleSong key={idx} songId={song.id} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} songURL={song.songURL} artURL={song.artURL} addSongToCollection={addSongToCollection} removeSongFromCollection={removeSongFromCollection} inCollection={checkIfInCollection(song.id)} selectSong={selectSong} playingStatus={playing} playingURL={songURL} />)
            idx++;
        };
    };

    console.log('Props from browseSongs', props)

    return (
        <div>
            <PreviewPlayer songURL={songURL} previewEnded={previewEnded} />
            <div className='screenTitle'>
                Add Songs to {props.selectedCollectionInfo.collectionName}
            </div>
            <div className='centerThis'>
                <div>
                    <input type='text' name='searchInput' placeholder='Search for songs or artists' value={searchInput} onChange={handleChange}></input>
                </div>
                <div>
                    <BPMSlider localBPM={BPMInput} setLocalBPM={setBPMInput} resetTapPadTrigger={() => console.log('Hi')}/>
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
        musicInfo: state.musicReducer,
        selectedCollection: state.screenReducer.selectedCollection,
        searchedSongs: state.musicReducer.searchedSongs,
        selectedCollectionInfo: state.musicReducer.collections[state.screenReducer.selectedCollection],
        user: state.userReducer.user,
        playing: state.playerReducer.playing,
    };
};
  
const mapDispatchToProps = (dispatch) => ({
    searchSongs: (searchInput, BPMInput) => dispatch(searchSongsThunk(searchInput, BPMInput)),
    addSongToCollection: (collectionId, songId) => dispatch(addSongToCollectionThunk(collectionId, songId)),
    removeSongFromCollection: (collectionId, songId, listenedBool) => dispatch(removeSongFromCollectionThunk(collectionId, songId, listenedBool)),
    popOneFromActiveSessionSongs: () => dispatch(popOneFromActiveSessionSongsThunk()),
    applySongsInRange: (songs) => dispatch(applySongsInRange(songs)),
    addSongsInRange: (songs) => dispatch(addSongsInRangeThunk(songs)),
    enqueueSong: () => dispatch(enqueueSongThunk()),
    play: () => dispatch(setPlayingTrueThunk()),
    pause: () => dispatch(setPlayingFalseThunk()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowseSongs)