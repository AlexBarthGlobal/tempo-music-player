import React from 'react';

const SingleCollection = (props) => {
    const {collectionId, collectionName, collectionArt, selectCollectionAndChangeScreen, isActive, hasSession, BPM} = props;
    // console.log(selectCollection)
    let sessionStatus = null;
    if (isActive(collectionId)) sessionStatus = <div>Playing at {BPM} BPM</div>
    else if (hasSession(collectionId)) sessionStatus = <div>Resume at {BPM} BPM</div>
    else sessionStatus = <div>Start new session!</div>
    return (
        <div onClick={() => selectCollectionAndChangeScreen(collectionId)}>
            <div>
                <img className='collectionImage' src={collectionArt} /*onLoad={}*/></img>
            </div>
            {collectionName}
            {sessionStatus}
        </div>
    )
};

export default SingleCollection;