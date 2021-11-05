import React from 'react'
import { isBrowser, isMobile } from 'react-device-detect';
import secondsToTimestamp from './secondsToTimestamp'
import ClearIcon from '@mui/icons-material/Clear';

const CollectionSingleSong = (props) => {
    const {songId, songName, artistName, albumName, BPM, duration, artURL, editMode, removeSongFromCollection, listenedBool} = props
        return (
            <tr>
                <td className='removeSongCrossContainer'>{editMode ? <ClearIcon className={isBrowser ? 'removeSongCross' : 'removeSongCrossMobile'} onClick={() => removeSongFromCollection(songId)} /> : null}</td>
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

export default CollectionSingleSong