import React from 'react';
import {connect} from 'react-redux'
import SingleCollection from './SingleCollection'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'
import {deleteCollectionThunk, removeCollectionThunk} from '../redux/musicDispatchers'
import Modal from 'react-modal'

class Collections extends React.Component {
    constructor(props) {
        super()
        this.state = {
            confirmRemove: false,
            confirmDelete: false,
            tempSelectedCollection: '',
            tempSelectedCollectionName: '',
            confirmYes: ''
        };

        this.removeCollection = this.removeCollection.bind(this);
        this.deleteCollection = this.deleteCollection.bind(this);
        this.selectForRemove = this.selectForRemove.bind(this);
        this.selectForDelete = this.selectForDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    // async componentDidUpdate(prevProps) {
    //     if (prevProps.editMode && !this.props.editMode) {
    //         
    //     };
    // };

    deleteCollection = async (evt) => {
        evt.preventDefault();
        /*await*/ console.log('deleting collection', this.state.tempSelectedCollection) //call thunk
        await this.props.deleteCollection(this.state.tempSelectedCollection, !!(this.props.activeSession && this.props.activeSession.collectionId === this.state.tempSelectedCollection));
        this.setState({confirmDelete: false, tempSelectedCollection: '', tempSelectedCollectionName: '', confirmYes: ''})
    };

    removeCollection = async (evt) => {
        evt.preventDefault();
        /*await*/ console.log('removing collection', this.state.tempSelectedCollection) //call thunk
        await this.props.removeCollection(this.state.tempSelectedCollection, !!(this.props.activeSession && this.props.activeSession.collectionId === this.state.tempSelectedCollection));
        this.setState({confirmRemove: false, tempSelectedCollection: '', tempSelectedCollectionName: ''})
    };

    selectForRemove = (collectionId) => {
        this.setState({confirmRemove: true, tempSelectedCollection: collectionId, tempSelectedCollectionName: this.props.musicInfo.collections[collectionId].collectionName})
    };

    selectForDelete = (collectionId) => {
        this.setState({confirmDelete: true, tempSelectedCollection: collectionId, tempSelectedCollectionName: this.props.musicInfo.collections[collectionId].collectionName})
    };

    handleChange = (evt) => {
        this.setState({confirmYes: evt.target.value})
    }

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
            } else this.props.dispatchSelectCollectionAndChangeScreen(collectionId, 'CollectionSongs')
        };
        

        const noCollections = 'No collections yet. Create a new one!'
        const collectionComponents = [];
        for (const key in collections) {
            const collection = collections[key];
            if (!collection.collectionName) break;
            collectionComponents.push(<SingleCollection selectCollectionAndChangeScreen={selectCollectionAndChangeScreen} isActive={isActive} hasSession={hasSession} collectionId={collection.id} collectionName={collection.collectionName} collectionArt={collection.collectionArtUrl} BPM={hasSession(collection.id) ? this.props.musicInfo.collections[collection.id].collectionSessions[0].currBPM : null} editMode={this.props.editMode} removeCollection={this.selectForRemove} deleteCollection={this.selectForDelete} userOwns={collection.collectionOwner === this.props.user.id} key={key}/>)
        };

        const removeCollectionModal = <Modal 
            isOpen={this.state.confirmRemove} 
            onRequestClose={() => this.setState({confirmRemove: false, tempSelectedCollection: '', tempSelectedCollectionName: '', confirmYes: ''})}
            style={
                {
                    content: {
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        // minHeight: '116px',
                        // maxHeight: '14vh',
                        height: '118px',
                        // maxHeight: '116px',
                        position: 'absolute',
                        width: '50vw',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        top: '28%',
                    }
                }
            }
            >
            <form onSubmit={this.removeCollection}>
                <div>Are you sure you want to remove {this.state.tempSelectedCollectionName} from your collections?</div>
                <div>
                    <button type='submit'>Remove</button>
                </div>
            </form>
        </Modal>

        const deleteCollectionModal = <Modal 
            isOpen={this.state.confirmDelete} 
            onRequestClose={() => this.setState({confirmDelete: false, tempSelectedCollection: '', tempSelectedCollectionName: '', confirmYes: ''})}
            style={
                {
                    content: {
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        // minHeight: '116px',
                        // maxHeight: '14vh',
                        height: '118px',
                        // maxHeight: '116px',
                        position: 'absolute',
                        width: '50vw',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        top: '28%',
                    }
                }   
            }
        >
        <div>
            <div>Are you sure you want to delete {this.state.tempSelectedCollectionName}?</div>
            <div>This will also remove it for users that have this collection shared with them.</div>
            <form onSubmit={this.deleteCollection}>
                <div>Enter "CONFIRM":</div>
                <div>
                    <input name='confirmYes' value={this.state.confirmYes} onChange={this.handleChange}></input>
                </div>
                <div>
                    <button type='submit' disabled={this.state.confirmYes !== 'CONFIRM'}>Delete</button>
                </div>
            </form>
        </div>
        </Modal>
    
        return (
            <div>
                {removeCollectionModal}
                {deleteCollectionModal}
                <div className='screenTitle'>
                    Collections
                </div>
                <div className='collections'>
                    {collectionComponents.length ? collectionComponents : noCollections}
                </div>
            </div>
        )
    };
};

const mapStateToProps = (state) => {
    return { 
        user: state.userReducer.user,
        musicInfo: state.musicReducer,
        activeSession: state.musicReducer.activeSession
        // screenInfo: state.screenReducer
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    dispatchSelectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen)),
    deleteCollection: (collectionId, isActiveBool) => dispatch(deleteCollectionThunk(collectionId, isActiveBool)),
    removeCollection: (collectionId, isActiveBool) => dispatch(removeCollectionThunk(collectionId, isActiveBool))
  })

export default connect(mapStateToProps, mapDispatchToProps)(Collections)