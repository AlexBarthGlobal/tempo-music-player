import React from 'react';

const SingleCollection = (props) => {
    const {collectionId, collectionName, collectionArt, selectCollectionAndChangeScreen, isActive, hasSession, BPM, editMode, removeCollection, deleteCollection, userOwns} = props;
    // console.log(selectCollection)
    let sessionStatus = null;
    if (isActive(collectionId)) sessionStatus = <div>Playing at {BPM} BPM</div>
    else if (hasSession(collectionId)) sessionStatus = <div>Resume at {BPM} BPM</div>
    else sessionStatus = <div>Start new session!</div>
    return (
        <div>
            <div onClick={() => selectCollectionAndChangeScreen(collectionId)}>
                <div>
                    <img className='collectionImage' src={collectionArt} /*onLoad={}*/></img>
                </div>
                {collectionName}
                {sessionStatus}
            </div>
            <div>{props.editMode ? userOwns ? <button onClick={() => deleteCollection(collectionId)}>Delete</button> : <button onClick={() => removeCollection(collectionId)}>Remove</button> : null}</div>
        </div>
    )
};

export default SingleCollection;