import React from 'react';
import {connect} from 'react-redux'
import SingleCollection from './SingleCollection'
import {selectCollection} from '../redux/screenDispatchers'

class Collections extends React.Component {

    render() {
        console.log('props from collections', this.props)
        const {collections} = this.props.musicInfo;

        const noCollections = 'No collections yet. Create a new one!'
        const collectionComponents = [];
        for (const key in collections) {
            const collection = collections[key];
            if (!collection.collectionName) break;
            collectionComponents.push(<SingleCollection selectCollection={this.props.selectCollection} collectionId={collection.id} collectionName={collection.collectionName} collectionArt={collection.collectionArtUrl} key={key}/>)
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
    selectCollection: (collectionId) => dispatch(selectCollection(collectionId))
  })

export default connect(mapStateToProps, mapDispatchToProps)(Collections)