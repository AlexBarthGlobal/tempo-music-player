import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {searchSongsThunk, addSongToCollectionThunk, removeSongFromCollectionThunk, popOneFromActiveSessionSongsThunk, applySongsInRange, addSongsInRangeThunk, enqueueSongThunk} from '../redux/musicDispatchers'
import BrowseSongsSingleSong from './BrowseSongsSingleSong'
import songsInRange from '../components/songsInRange'
import PreviewPlayer from '../components/PreviewPlayer'
import BPMSlider from '../components/BPMSlider'
import {setPlayingTrueThunk, setPlayingFalseThunk} from '../redux/playerDispatchers'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { isBrowser } from 'react-device-detect';
import Input from '@mui/material/Input';

const BrowseSongs = (props) => {
    const [searchInput, setSearchInput] = useState('')
    const [BPMInput, setBPMInput] = useState(props.musicInfo.activeSession ? props.musicInfo.activeSession.currBPM : 140)
    const [playing, setPlaying] = useState(false)
    const [songURL, setSongURL] = useState(null)
    const [disabledBPM, setDisabledBPM] = useState(false)
    const [prevBPM, setPrevBPM] = useState(140)
    const [counter, setCounter] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (props.playing) {
            setSongURL(null);
            setPlaying(false);
        };
    }, [props.playing])

    const selectSong = (selectedSongURL) => {
        props.pause();
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

    let timer;

    useEffect(() => {
        setLoading(true)
        timer = setTimeout(() => setCounter(counter + 1), 1000)
        return () => clearTimeout(timer);
    }, [searchInput, BPMInput, counter])

    useEffect(() => {
        setCounter(0);
    }, [searchInput, BPMInput])

    useEffect(async () => {
        if (counter >= 1) {
            clearTimeout(timer);
            await props.searchSongs(searchInput, Number(BPMInput))
            setLoading(false)
        };
    }, [counter])

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

    const setBrowseBPMInput = async (newBPM) => {
        if (!disabledBPM) setBPMInput(newBPM)
        else return;
    };

    const toggleDisabledBPM = () => {
        if (disabledBPM) {
            setBPMInput(prevBPM)
            setDisabledBPM(false);
        } else {
            setPrevBPM(BPMInput)
            setBPMInput(null)
            setDisabledBPM(true);
        }
    }

    const songs = [];
    if (props.searchedSongs) {
        let idx = 0;
        for (const song of props.searchedSongs) {
            songs.push(<BrowseSongsSingleSong key={idx} songId={song.id} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} songURL={song.songURL} artURL={song.artURL} addSongToCollection={addSongToCollection} removeSongFromCollection={removeSongFromCollection} inCollection={checkIfInCollection(song.id)} selectSong={selectSong} playingStatus={playing} playingURL={songURL} />)
            idx++;
        };
    };

    return (
        <div>
            <PreviewPlayer songURL={songURL} previewEnded={previewEnded} />
            <div className='screenTitle browseSongsTitle'>
                Add songs to {props.selectedCollectionInfo.collectionName}
            </div>
            <div className='centerThis'>
                <div>
                    <Input className='browseSongsInput' 
                        sx={{
                            fontSize: 22,
                            color: 'white',
                            ':not($focused)': { borderBottomColor: 'white' },
                            ':before': { borderBottomColor: 'grey' },
                            ':after': { borderBottomColor: 'white' },
                        }} inputProps={{ spellCheck: false, style: { textAlign: 'center' }}} name='searchInput' placeholder="Search" value={searchInput} onChange={handleChange} variant="outlined" />
                </div>
                <div>
                    <BPMSlider localBPM={BPMInput} setLocalBPM={setBrowseBPMInput} toggleDisabledBPM={toggleDisabledBPM} disabledBPM={disabledBPM}/>
                </div>
            </div>
            <div>
                {loading ? <div className='bars2'></div>:songs.length ? <table className={`collectionSongsTable ${isBrowser ? 'collectionSongsTableDesktop clearFooterPaddingDesktopSongs' : 'clearFooterPaddingMobile'}`}>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            {isBrowser ? <th>Album</th> : null}
                            <th>BPM</th>
                            <th id='durationIconContainer'><AccessTimeIcon id='durationIcon' /></th>
                        </tr>
                        {songs}
                    </tbody>
                </table> : <div className='browseSongsAlert'>Try a different Song, Album, Artist or BPM</div>}
            </div>
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