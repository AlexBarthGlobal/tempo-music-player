import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const SingleCollection = (props) => {
    const {collectionId, collectionName, collectionArt, selectCollectionAndChangeScreen, isActive, hasSession, BPM, editMode, removeCollection, deleteCollection, userOwns} = props;

    let sessionStatus = null;
    if (isActive(collectionId)) sessionStatus = <div className='isPlaying'>Playing at {BPM} BPM</div>
    else if (hasSession(collectionId)) sessionStatus = <div className='resumeStatus'>Resume at {BPM} BPM</div>
    else sessionStatus = <div>Start new session</div>
    return (
        <div className='singleCollection'>
            <div className='singleCollectionInnerContainer' onClick={() => selectCollectionAndChangeScreen(collectionId)}>
                <div className='imgAndStatus'>
                    <img className='collectionImage' src={collectionArt} /*onLoad={}*/></img>
                    <div className='sessionStatus'>{sessionStatus}</div>
                </div>
                <div className='collectionName'>{collectionName}</div>  
            </div>
            <div>{props.editMode ? userOwns ? <ClearIcon id='collectionClearIcon' sx={{fontSize: 25}} onClick={() => deleteCollection(collectionId)} /> : <ClearIcon id='collectionClearIcon' onClick={() => removeCollection(collectionId)}/> : null}</div>
        </div>
    )
};

export default SingleCollection;