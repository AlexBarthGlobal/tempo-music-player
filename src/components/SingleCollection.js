import React from 'react';

const SingleCollection = (props) => {
    const {collectionId, collectionName, collectionArt, selectCollection} = props;
    // console.log(selectCollection)
    return (
        <div onClick={() => selectCollection(collectionId)}>
            <div>
                <img className='collectionImage' src={collectionArt}></img>
            </div>
            {collectionName}
        </div>
    )
};

export default SingleCollection;