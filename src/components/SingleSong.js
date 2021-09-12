import React from 'react'

const SingleSong = (props) => {
    const {songName, artistName, albumName, BPM, duration, artURL} = props
    //convert duration into minutes & seconds
        return (
            <ol>
                {songName} {artistName} {albumName} {BPM} {duration}
            </ol>
        )
};

export default SingleSong