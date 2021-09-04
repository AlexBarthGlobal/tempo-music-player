import React from 'react';
import {connect} from 'react-redux'
import SingleCollection from './SingleCollection'

class Collections extends React.Component {

    render() {
        console.log('props from collections', this.props)
        const {collections} = this.props.musicInfo;
        

        const collectionComponents = [];
        for (const key in collections) {
            const collection = collections[key];
            if (!collection.collectionName) break;
            collectionComponents.push(<SingleCollection collectionName={collection.collectionName} collectionArt={collection.collectionArtUrl} key={key}/>)
        };

        return (
            <div>
                <div className='screenTitle'>
                    Collections
                </div>
                <div className='collections'>
                    {collectionComponents}
                </div>
            </div>
        )
    };

}

const mapStateToProps = (state) => {
    return { 
        user: state.userReducer.user,
        musicInfo: state.musicReducer
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    
  })

export default connect(mapStateToProps, mapDispatchToProps)(Collections)