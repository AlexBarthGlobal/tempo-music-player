import React from 'react';

const SingleCollection = (props) => {
    const {collectionId, collectionName, collectionArt} = props;
    return (
        <div onClick={() => console.log(`${collectionId}`)}>
            <div>
                <img className='collectionImage' src={collectionArt}></img>
            </div>
            {collectionName}
        </div>
    )
};

export default SingleCollection;