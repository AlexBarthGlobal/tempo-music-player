import React from 'react';

const SingleCollection = (props) => {
    const {collectionName, collectionArt, setState} = props;
    return (
        <div>
            <div>




            </div>
            <div>
                <div>
                    <img onClick={() => setState()} className='collectionImage' src={collectionArt}></img>
                </div>
                {collectionName}
            </div>
        </div>
    )
};

export default SingleCollection;