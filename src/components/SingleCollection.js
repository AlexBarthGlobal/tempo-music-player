import React from 'react';

const SingleCollection = (props) => {
    const {collectionId, collectionName, collectionArt, selectCollectionAndChangeScreen, isActive, BPM} = props;
    // console.log(selectCollection)
    const resume = isActive(collectionId) ? <div>Resume at {BPM} BPM</div> : null;
    return (
        <div onClick={() => selectCollectionAndChangeScreen(collectionId)}>
            <div>
                <img className='collectionImage' src={collectionArt}></img>
            </div>
            {collectionName}
            {resume}
        </div>
    )
};

export default SingleCollection;