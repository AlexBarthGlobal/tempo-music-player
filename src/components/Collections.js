import React from 'react';
import {connect} from 'react-redux'
import SingleCollection from './SingleCollection'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'

class Collections extends React.Component {

    render() {
        console.log('PROPS FROM COLLECTIONS', this.props)
        const {collections} = this.props.musicInfo;
        const isActive = (collectionId) => {
            return (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.collectionId === collectionId)
        };
        const hasSession = (collectionId) => {
            return (this.props.musicInfo.collections[collectionId] && this.props.musicInfo.collections[collectionId].collectionSessions.length)
        };
        const selectCollectionAndChangeScreen = (collectionId) => {
            if (isActive(collectionId)) {
                this.props.dispatchSelectCollectionAndChangeScreen(collectionId, 'PlayerScreen')
            } /*else if (this.props.musicInfo.collections[collectionId]) this.props.dispatchSelectCollectionAndChangeScreen(collectionId, 'AddSongs')*/
            else this.props.dispatchSelectCollectionAndChangeScreen(collectionId, 'Tempo')
        };
        

        const noCollections = 'No collections yet. Create a new one!'
        const collectionComponents = [];
        for (const key in collections) {
            const collection = collections[key];
            if (!collection.collectionName) break;
            collectionComponents.push(<SingleCollection selectCollectionAndChangeScreen={selectCollectionAndChangeScreen} isActive={isActive} hasSession={hasSession} collectionId={collection.id} collectionName={collection.collectionName} collectionArt={collection.collectionArtUrl} BPM={hasSession(collection.id) ? this.props.musicInfo.collections[collection.id].collectionSessions[0].currBPM : null} key={key}/>)
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
        activeSession: state.musicReducer.activeSession
        // screenInfo: state.screenReducer
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    dispatchSelectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen))
  })

export default connect(mapStateToProps, mapDispatchToProps)(Collections)