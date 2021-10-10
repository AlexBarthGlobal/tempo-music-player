import React, {useState, useEffect} from 'react'

const BPMTap = (props) => {
    const [timeAverage, setTimeAverage] = useState(0)
    const [clicks, setClicks] = useState(0)
    const [showText, setShowText] = useState(true)
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        if (clicks >= 2) {
            //calculate a new BPM
            // props.setLocalBPM()
        }
    }, [clicks])

    useEffect(() => {
        let timer;
        if (clicks >= 2) {
            timer = setTimeout(() => setCounter(counter + 1), 1000);
        };
        if (counter >= 3) {
            setClicks(0)
            setCounter(0)
            setShowText(true)
            //props.setLocalBPM
        };
        return () => clearTimeout(timer)
    }, [counter, clicks >= 2]);

    const startCounter = () => setCounter(counter+1)
    const stopCounter = () => setCounter(0);

    function mouseDown() {
        setShowText(false)
        setClicks(clicks + 1);
        stopCounter()
        // wait2Seconds();
    };

    console.log('TAPPER')
    return (
        <div>
        <button onClick={() => stopCounter()}>Stop</button>
        <div className='BPMTapPad' onMouseDown={() => mouseDown()} onMouseUp={() => console.log('Up')}>
            <p>{counter}</p>
            
            <p className='BPMTapPadText'>{showText ? 'Tap' : null}</p>
        </div>
        </div>
    )
}

export default BPMTap