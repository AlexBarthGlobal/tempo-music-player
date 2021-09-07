import React from 'react';
import {connect} from 'react-redux'
import SingleCollection from './SingleCollection'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'

class Collections extends React.Component {

    render() {
        console.log('props from collections', this.props)
        const {collections} = this.props.musicInfo;
        const isActive = (collectionId) => {
            return (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.collectionId === collectionId)
        };
        const selectCollectionAndChangeScreen = (collectionId) => {
            if (isActive(collectionId)) {
                this.props.dispatchSelectCollectionAndChangeScreen(collectionId, 'PlayerScreen')
            } else this.props.dispatchSelectCollectionAndChangeScreen(collectionId, 'Tempo')
        };
        

        const noCollections = 'No collections yet. Create a new one!'
        const collectionComponents = [];
        for (const key in collections) {
            const collection = collections[key];
            if (!collection.collectionName) break;
            collectionComponents.push(<SingleCollection selectCollectionAndChangeScreen={selectCollectionAndChangeScreen} isActive={isActive} collectionId={collection.id} collectionName={collection.collectionName} collectionArt={collection.collectionArtUrl} BPM={isActive(collection.id) ? this.props.musicInfo.activeSession.currBPM : null} key={key}/>)
        };

        return (
            <div>
                <div className='screenTitle'>
                    Collections
                </div>
                <div className='collections'>
                    {collectionComponents.length ? collectionComponents : noCollections}
                </div>
            </div>
        )
    };

}

const mapStateToProps = (state) => {
    return { 
        user: state.userReducer.user,
        musicInfo: state.musicReducer,
        // screenInfo: state.screenReducer
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    dispatchSelectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen))
  })

export default connect(mapStateToProps, mapDispatchToProps)(Collections)