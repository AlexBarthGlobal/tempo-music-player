import React from 'react';
import {connect} from 'react-redux'
import SingleCollection from './SingleCollection'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'
import {deleteCollectionThunk, removeCollectionThunk} from '../redux/musicDispatchers'
import Modal from 'react-modal'
import { isBrowser } from 'react-device-detect';
import StyledButton from './StyledButton'
import Input from '@mui/material/Input';

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

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    deleteCollection = async (evt) => {
        evt.preventDefault();
        await this.props.deleteCollection(this.state.tempSelectedCollection, !!(this.props.activeSession && this.props.activeSession.collectionId === this.state.tempSelectedCollection));
        this.setState({confirmDelete: false, tempSelectedCollection: '', tempSelectedCollectionName: '', confirmYes: ''})
    };

    removeCollection = async (evt) => {
        evt.preventDefault();
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
        console.log('COLLECTIONS', this.props)
        const isActive = (collectionId) => {
            return (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.collectionId === collectionId)
        };
        const hasSession = (collectionId) => {
            return (this.props.musicInfo.collections[collectionId] && this.props.musicInfo.collections[collectionId].collectionSessions.length)
        };
        const selectCollectionAndChangeScreen = (collectionId) => {
            if (isActive(collectionId)) {
                this.props.selectCollectionAndChangeScreen(collectionId, 'PlayerScreen')
            } else this.props.selectCollectionAndChangeScreen(collectionId, 'CollectionSongs')
        };
        
        const {collections} = this.props.musicInfo;
        const collectionComponents = [];
        for (const key in collections) {
            collectionComponents.push(collections[key]);
        };
        collectionComponents.sort((a,b) => {
            a = new Date(a.userCollections ? a.userCollections.createdAt : a.createdAt);
            b = new Date(b.userCollections ? b.userCollections.createdAt: b.createdAt);
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
        });
        let i = 0;
        for (const collection of collectionComponents) {
            collectionComponents[i] = <SingleCollection selectCollectionAndChangeScreen={selectCollectionAndChangeScreen} isActive={isActive} hasSession={hasSession} collectionId={collection.id} collectionName={collection.collectionName} collectionArt={collection.collectionArtUrl} BPM={hasSession(collection.id) ? this.props.musicInfo.collections[collection.id].collectionSessions[0].currBPM : null} editMode={this.props.editMode} removeCollection={this.selectForRemove} deleteCollection={this.selectForDelete} userOwns={collection.collectionOwner === this.props.user.id} key={collection.id}/>   
            i++;
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
                        height: '180px',
                        position: 'absolute',
                        width: '50vw',
                        minWidth: '255px',
                        maxWidth: '558px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        top: '28%',
                        border: '1px solid #00000096',
                        paddingBottom: '30px',
                        backgroundColor: `rgb(52 52 52 ${isBrowser ? '/ 82%' : ''})`,
                        backdropFilter: 'blur(5px)'
                    },
                    overlay: {
                        backgroundColor: '#36363614',
                        zIndex: 2
                    }
                }
            }
            >
            <form onSubmit={this.removeCollection}>
                <div className='modalText modalTextPaddingParagraph specialWordBreak'>Are you sure you want to remove {this.state.tempSelectedCollectionName} from your collections?</div>
                <div>
                    <StyledButton title='Remove' type='submit' />
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
                        height: '270px',
                        position: 'absolute',
                        width: '50vw',
                        minWidth: '255px',
                        maxWidth: '558px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        top: '28%',
                        border: '1px solid #00000096',
                        paddingBottom: '30px',
                        backgroundColor: `rgb(52 52 52 ${isBrowser ? '/ 82%' : ''})`,
                        backdropFilter: 'blur(5px)'
                    },
                    overlay: {
                        backgroundColor: '#36363614',
                        zIndex: 2
                    }
                }   
            }
        >
        <div>
            <div className='modalText modalTextPaddingParagraph specialWordBreak'>Are you sure you want to delete {this.state.tempSelectedCollectionName}?</div>
            <div className='modalText modalTextPaddingParagraph'>This will also remove it for users that have this collection shared with them.</div>
            <form onSubmit={this.deleteCollection}>
                <div className='modalText modalTextPadding'>Enter "CONFIRM"</div>
                <div>
                    <Input className='browseSongsInput' 
                                        sx={{
                                            fontFamily: 'inherit',
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'rgb(160, 160, 160)' },
                                            ':after': { borderBottomColor: 'white' },
                                            }} inputProps={{ spellCheck: false, style: { textAlign: 'center' }}} name='confirmYes' value={this.state.confirmYes} onChange={this.handleChange} variant="outlined" />
                </div>
                <div>
                    <StyledButton title='Delete' type='submit' disabled={this.state.confirmYes !== 'CONFIRM'} />
                </div>
            </form>
        </div>
        </Modal>
        return (
            
            <div>         
                {removeCollectionModal}
                {deleteCollectionModal}
                <div className='screenTitle collectionsTitle'>
                    Collections
                </div>
                {collectionComponents.length ? <div className={`collections ${isBrowser ? null : 'clearFooterPaddingMobile'}`}>
                    {collectionComponents}
                </div> : <div id='noCollectionsYet'>No collections yet. Create a new one!</div>}
                
            </div>     
        )
    };
};

const mapStateToProps = (state) => {
    return { 
        user: state.userReducer.user,
        musicInfo: state.musicReducer,
        activeSession: state.musicReducer.activeSession
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    selectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen)),
    deleteCollection: (collectionId, isActiveBool) => dispatch(deleteCollectionThunk(collectionId, isActiveBool)),
    removeCollection: (collectionId, isActiveBool) => dispatch(removeCollectionThunk(collectionId, isActiveBool))
  })

export default connect(mapStateToProps, mapDispatchToProps)(Collections)