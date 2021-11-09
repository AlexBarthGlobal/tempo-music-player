import React from 'react';
import {connect} from 'react-redux'

class PreviewPlayer extends React.Component {
    constructor() {
        super()
    };

    componentDidUpdate = () => {
        if (this.props.volume || this.props.volume === 0) this.songPreview.volume = this.props.volume;
    };

    render() {
        const previewPlayer = <audio src={this.props.songURL} preload="auto" autoPlay={true} onEnded={() => this.props.previewEnded()} ref={(element) => {this.songPreview = element}}/>
        if (this.songPreview) {
            if (this.props.songURL === null) this.songPreview.pause();
        };
        return (
            <div>
                {previewPlayer}
            </div>
        )
    };
};

const mapStateToProps = (state) => {
    return {
        volume: state.playerReducer.volume
    }
};

export default connect(mapStateToProps)(PreviewPlayer)