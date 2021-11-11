import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import {fetchActiveCollectionSongs, removeSongFromCollectionThunk, updateCollectionNameThunk} from '../redux/musicDispatchers';
import {changeScreenThunk} from '../redux/screenDispatchers'
import CollectionSingleSong from './CollectionSingleSong'
import Modal from 'react-modal'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'
import Metronome from '../icons/metronome.svg'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { isBrowser } from 'react-device-detect';
import StyledButton from './StyledButton'
import Input from '@mui/material/Input';

const CollectionSongs = (props) => {
    const [loading, setLoading] = useState(true);
    const [collectionName, setCollectionName] = useState(props.musicInfo.collections[props.selectedCollection].collectionName)
    const [editedCollectionName, setEditedCollectionName] = useState(props.musicInfo.collections[props.selectedCollection].collectionName)
    const [exited, setExited] = useState(false)

    useEffect(async () => {
        window.scrollTo(0, 0);
        await props.fetchActiveCollectionSongs(props.selectedCollection);
        setLoading(false);
    }, [])

    useEffect(async () => {
        if (!exited && editedCollectionName !== props.musicInfo.collections[props.selectedCollection].collectionName) {
            setCollectionName(editedCollectionName)
            await props.updateCollectionName(editedCollectionName, props.selectedCollection);
        } else setExited(false);
    }, [props.editMode])

    useEffect(() => {
        if (!props.editMode) {
            return;
        }

        function handleEscape(e) {
            if (e.key === 'Enter') {
                setCollectionName(editedCollectionName)
                props.editModeDone();
                return;
            };

            if (e.key === "Escape") {
                setExited(true);
                setEditedCollectionName(props.musicInfo.collections[props.selectedCollection].collectionName)
                props.editModeDone();
                return;
            };
        };

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape);
    }, [props.editMode])

    const handleChange = (evt) => {
        evt.target.name === 'collectionName' ? setCollectionName(evt.target.value) : setEditedCollectionName(evt.target.value);
    };

    const clearNameOnFocus = () => {
        setEditedCollectionName('')
    };

    const removeSongFromCollection = async (songId) => {
        await props.removeSongFromCollection(props.selectedCollection, songId, !!props.user.listened.songs[songId]);
    };

    const collectionSongs = [];
    if (props.musicInfo.collections[props.selectedCollection].songs) {
        for (const [id, song] of props.musicInfo.collections[props.selectedCollection].songs) {
            collectionSongs.push(song);
        };
        collectionSongs.sort((a, b) => a.BPM - b.BPM)
        let idx = 0;
        for (const song of collectionSongs) {
            collectionSongs[idx] = <CollectionSingleSong key={idx} songId={song.id} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} artURL={song.artURL} editMode={props.editMode} removeSongFromCollection={removeSongFromCollection} listenedBool={!!props.user.listened.songs[song.id]} songIsPlaying={props.musicInfo.activeSession && props.musicInfo.activeSession.songs && props.musicInfo.activeSession.songs[props.musicInfo.activeSession.playIdx] && props.musicInfo.activeSession.songs[props.musicInfo.activeSession.playIdx].id === song.id} />
            idx++;
        };
    };

    const loader = <div className='bars2'></div>
    return (
        <div>
            <div className='screenTitle'>
                <div>
                    {props.editMode ? <Input className='browseSongsInput'
                        sx={{
                            fontFamily: 'inherit',
                            fontSize: 30,
                            color: 'white',
                            ':not($focused)': { borderBottomColor: 'white' },
                            ':before': { borderBottomColor: 'rgb(160, 160, 160)' },
                            ':after': { borderBottomColor: 'white' },
                        }} inputProps={{spellCheck: false, style: {textAlign: 'center'}}} name='editedCollectionName' onFocus={clearNameOnFocus} value={editedCollectionName} onChange={handleChange} variant="outlined" /> : collectionName}
                </div>
                <div>
                    <Metronome id='metronomeMain' onClick={() => props.changeScreen('Tempo')} />
                </div>
            </div>
            <div>
                {props.musicInfo.collections[props.selectedCollection].songs && props.musicInfo.collections[props.selectedCollection].songs.size ?
                <table className={`collectionSongsTable ${isBrowser ? 'collectionSongsTableDesktop clearFooterPaddingDesktopSongs' : 'clearFooterPaddingMobile'}`}>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            {isBrowser ? <th>Album</th> : null}
                            <th>BPM</th>
                            <th id='durationIconContainer'><AccessTimeIcon id='durationIcon' /></th>
                        </tr>
                        {collectionSongs}
                    </tbody>
                    </table> : loading ? loader : 
                    <Modal
                        isOpen={true}
                        onRequestClose={() => props.selectCollectionAndChangeScreen(null, 'Collections')}
                        style={
                            {
                                content: {
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '118px',
                                    position: 'absolute',
                                    width: '50vw',
                                    minWidth: '244px',
                                    maxWidth: '518px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    top: '28%',
                                    border: '1px solid #00000096',
                                    paddingBottom: '30px',
                                    backgroundColor: `rgb(52 52 52 ${isBrowser ? '/ 82%' : ''})`,
                                    backdropFilter: 'blur(5px)'
                                },
                                overlay: {
                                    backgroundColor: '#36363614',
                                    zIndex: 2
                                }
                            }
                        }
                    >
                        <div>
                            <div className='modalText modalTextPadding'>No songs in this collection yet!</div>
                            <div className='modalButton'>
                                {props.musicInfo.collections[props.selectedCollection].collectionOwner === props.user.id ? <StyledButton title='Add songs' func={() => props.changeScreen('BrowseSongs')} /> : null}
                            </div>
                            <div className='modalButton'>
                                <StyledButton title='Go back' func={() => props.selectCollectionAndChangeScreen(null, 'Collections')} />
                            </div>
                        </div>
                    </Modal>}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        musicInfo: state.musicReducer,
        screenStr: state.screenReducer.screenStr,
        selectedCollection: state.screenReducer.selectedCollection,
        playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null
    };
};

const mapDispatchToProps = (dispatch) => ({
    fetchActiveCollectionSongs: (collectionId) => dispatch(fetchActiveCollectionSongs(collectionId)),
    changeScreen: (screen) => dispatch(changeScreenThunk(screen)),
    selectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen)),
    removeSongFromCollection: (collectionId, songId, listenedBool) => dispatch(removeSongFromCollectionThunk(collectionId, songId, listenedBool)),
    updateCollectionName: (newCollectionName, collectionId) => dispatch(updateCollectionNameThunk(newCollectionName, collectionId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionSongs)