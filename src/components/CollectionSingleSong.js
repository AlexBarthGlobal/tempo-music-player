import React from 'react'

const CollectionSingleSong = (props) => {
    const {songId, songName, artistName, albumName, BPM, duration, artURL, editMode, listenedBool, removeSongFromCollection} = props
    //convert duration into minutes & seconds



        return (
            <li>
                {songName} {artistName} {albumName} {BPM} {duration} {editMode ? null : listenedBool ? <button onClick={() => console.log('Remove from listened')}>Listened</button> : null} {editMode ? <button onClick={() => removeSongFromCollection(songId)}>Remove</button> : null}
            </li>
        )
};

export default CollectionSingleSong