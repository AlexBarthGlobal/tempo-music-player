import React from 'react'
import { isBrowser, isMobile } from 'react-device-detect';
import secondsToTimestamp from './secondsToTimestamp'
import ClearIcon from '@mui/icons-material/Clear';

const CollectionSingleSong = (props) => {
    const {songId, songName, artistName, albumName, BPM, duration, artURL, editMode, removeSongFromCollection, listenedBool, songIsPlaying} = props

    const specialClassName = songIsPlaying ? 'isPlaying' : listenedBool ? 'listenedCollectionSong' : null
    
        return (
            <tr id='singleSongRow'>
                <td className='removeSongCrossContainer'>{editMode ? <ClearIcon className={isBrowser ? 'removeSongCross' : 'removeSongCrossMobile'} onClick={() => removeSongFromCollection(songId)} /> : null}</td>
                <td className='singleSongInfo'>
                    <img className='collectionSongImg' src={artURL} />
                    <div className='singleSongVertical centerVertical touchPaddingBottomSong'>
                        <div className={specialClassName}>{songName}</div>
                        <div className={specialClassName}>{artistName}</div>
                    </div>
                </td>
                {isBrowser ? <td className={specialClassName}>{albumName}</td> : null}
                <td className={specialClassName}>{BPM}</td>
                <td className={specialClassName}>{secondsToTimestamp(duration)}</td>
            </tr>
        )
};

export default CollectionSingleSong