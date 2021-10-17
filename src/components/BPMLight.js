import React, {useState, useEffect} from 'react'

let interval;
const BPMLight = (props) => {
    const [blink, setBlink] = useState(false)

    useEffect (() => {
        if (!props.playing) {
            clearInterval(interval)
            blinkPace();
            return () => {
                clearInterval(interval)
            }
        }
    }, [props.metronomeSound, props.playing])

    useEffect (() => {
        clearInterval(interval)
        blinkPace();
        return () => {
            clearInterval(interval);
        }
    }, [props.localBPM])

    const blinkPace = () => {
        interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 100)
        }, Math.round((60/props.localBPM)*1000))
    };

    return (
        <div className={blink ? 'BPMLightActive' : 'BPMLight'}>
            
        </div>
    )
}

export default BPMLight

// let interval;
// export default class BPMLight extends React.Component {
//     constructor(props) {
//         super()
//         this.state = {
//             blink: false,
//             blinkBPM: props.localBPM
//         };
        
//         this.blinkPace = this.blinkPace.bind(this)
//     };

//     blinkPace() {
//         interval = setInterval(() => {
//             this.setState({blink: true});
//             setTimeout(() => this.setState({blink: false}), 100)
//         }, Math.round((60/this.state.blinkBPM)*1000))
//     }

//     componentDidUpdate() {
//         // if ((this.props.metronomeSound && !this.props.playing)) {
//         //     clearInterval(interval);
//         //     this.blinkPace();
//         // };
//         console.log('THIS.PROPS.LOCALBPM', this.props.localBPM)
//         if (this.props.localBPM !== this.state.blinkBPM) {
//             clearInterval(interval)
//             this.setState({blinkBPM: this.props.localBPM})
//             this.blinkPace();
//         };
//     };

//     componentDidMount() {
//         this.blinkPace();
//         console.log('BPMLIGHT', this.state.blinkBPM)
//     }

//     componentWillUnmount() {
//         clearInterval(interval)
//     }

//     render() {
//         return (
//             <div className={this.state.blink ? 'BPMLightActive' : 'BPMLight'}>
            
//             </div>
//         )
//     };
// };