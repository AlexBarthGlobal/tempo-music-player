import React from 'react';

const SingleCollection = (props) => {
    const {collectionId, collectionName, collectionArt, selectCollectionAndChangeScreen} = props;
    // console.log(selectCollection)
    return (
        <div onClick={() => selectCollectionAndChangeScreen(collectionId)}>
            <div>
                <img className='collectionImage' src={collectionArt}></img>
            </div>
            {collectionName}
        </div>
    )
};

export default SingleCollection;