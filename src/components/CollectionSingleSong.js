import React from 'react'

const CollectionSingleSong = (props) => {
    const {songId, songName, artistName, albumName, BPM, duration, artURL, editMode, removeSongFromCollection, listenedBool} = props
    //convert duration into minutes & seconds



        return (
            <li>
                {songName} {artistName} {albumName} {BPM} {duration} {editMode ? null : listenedBool ? 'Listened' : null} {editMode ? <button onClick={() => removeSongFromCollection(songId)}>Remove</button> : null}
            </li>
        )
};

export default CollectionSingleSong