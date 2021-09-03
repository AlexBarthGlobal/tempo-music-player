import React from 'react';

const SingleCollection = (props) => {
    const {collectionName, collectionArt} = props;
    return (
        <div>
            <div>




            </div>
            <div>
                <div>
                    <img className='collectionImage' src={collectionArt}></img>
                </div>
                {collectionName}
            </div>
        </div>
    )
};

export default SingleCollection;