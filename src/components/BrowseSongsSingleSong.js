import React from 'react'

const BrowseSongsSingleSong = (props) => {
    const {songName, artistName, albumName, BPM, duration, artURL} = props
    //convert duration into minutes & seconds
        return (
            <li>
                {songName} {artistName} {albumName} {BPM} {duration}
            </li>
        )
};

export default BrowseSongsSingleSong