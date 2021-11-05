import React from 'react'
import { isBrowser, isMobile } from 'react-device-detect';
import secondsToTimestamp from './secondsToTimestamp'
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

{/* <button onClick={() => selectSong(songURL)}>{playingURL === songURL ? 'Stop' : 'Play'}</button>
<button onClick={!inCollection ? () => addSongToCollection(songId) : () => removeSongFromCollection(songId)}>{!inCollection ? 'Add' : 'Remove'}</button> */}


const BrowseSongsSingleSong = (props) => {
    const {songId, songName, artistName, albumName, BPM, duration, songURL, artURL, addSongToCollection, removeSongFromCollection, inCollection, playingStatus, playingURL, selectSong} = props
    return (
        <tr>
            <td className='removeSongCrossContainer'>{!inCollection ? <AddIcon className={isBrowser ? 'removeSongCross' : 'removeSongCrossMobile'} onClick={() => addSongToCollection(songId)} /> : <ClearIcon className={isBrowser ? 'removeSongCross' : 'removeSongCrossMobile'} onClick={() => removeSongFromCollection(songId)}/>}</td>
            <td className='singleSongInfo'>
                <img className='collectionSongImg' src={artURL} />
                <div className='singleSongVertical centerVertical touchPaddingBottomSong'>
                    <div>{songName}</div>
                    <div>{artistName}</div>
                </div>
            </td>
            {isBrowser ? <td>{albumName}</td> : null}
            <td>{BPM}</td>
            <td>{secondsToTimestamp(duration)}</td>
        </tr>
    )
};

export default BrowseSongsSingleSong