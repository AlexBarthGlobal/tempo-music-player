import React, {useState, useEffect} from 'react'

let interval;
const BPMLight = (props) => {
    const [blink, setBlink] = useState(false)

    useEffect (() => {
        clearInterval(interval)
        blinkPace();
        return () => {
            clearInterval(interval)
        }
    }, [props.metronomeSound, props.playing, props.localBPM])

    const blinkPace = () => {
        interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 100)
        }, Math.round((60/props.localBPM)*1000))
    };

    return (
        <div className={blink ? 'BPMLightActive' : 'BPMLight'}></div>
    )
}

export default BPMLight