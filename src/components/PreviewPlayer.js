import React from 'react';

class PreviewPlayer extends React.Component {
    constructor(props) {
        super()
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



export default PreviewPlayer