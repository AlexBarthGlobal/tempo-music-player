import React from 'react'

const BrowseSongsSingleSong = (props) => {
    const {songId, songName, artistName, albumName, BPM, duration, artURL, addSongToCollection} = props
    //convert duration into minutes & seconds
        return (
            <li>
                {songName} {artistName} {albumName} {BPM} {duration}
                <button onClick={() => addSongToCollection(songId)}>Add</button>
            </li>
            
        )
};

export default BrowseSongsSingleSong