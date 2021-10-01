import React from 'react'

const BrowseSongsSingleSong = (props) => {
    const {songId, songName, artistName, albumName, BPM, duration, artURL, addSongToCollection, removeSongFromCollection, inCollection} = props
    //convert duration into minutes & seconds
    console.log('Song in collection?', songName, inCollection)
        return (
            <li>
                {songName} {artistName} {albumName} {BPM} {duration}
                <button onClick={!inCollection ? () => addSongToCollection(songId) : () => removeSongFromCollection(songId)}>{!inCollection ? 'Add' : 'Remove'}</button>
            </li>
            
        )
};

export default BrowseSongsSingleSong