import React from 'react'

const BrowseSongsSingleSong = (props) => {
    const {songId, songName, artistName, albumName, BPM, duration, songURL, artURL, addSongToCollection, removeSongFromCollection, inCollection, playingStatus, playingURL, selectSong} = props
        return (
            <li>
                <button onClick={() => selectSong(songURL)}>{playingURL === songURL ? 'Stop' : 'Play'}</button>
                {songName} {artistName} {albumName} {BPM} {duration}
                <button onClick={!inCollection ? () => addSongToCollection(songId) : () => removeSongFromCollection(songId)}>{!inCollection ? 'Add' : 'Remove'}</button>
            </li>
            
        )
};

export default BrowseSongsSingleSong