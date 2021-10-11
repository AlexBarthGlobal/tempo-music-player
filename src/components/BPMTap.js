import React, {useState, useEffect} from 'react'

const BPMTap = (props) => {
    const [timeAverage, setTimeAverage] = useState(null)
    const [clicks, setClicks] = useState(0)
    const [showText, setShowText] = useState(true)
    const [counter, setCounter] = useState(0)
    const [recentClickDate, setRecentClickDate] = useState(null)


    const resetTapPad = () => {
        setClicks(0)
        setCounter(0)
        setShowText(true)
        setRecentClickDate(null)
        setTimeAverage(0)
    }

    useEffect(() => {
        resetTapPad();
    }, [props.resetTapPadTrigger])

    useEffect(() => {
        let timer;
        if (clicks >= 2) {
            timer = setTimeout(() => setCounter(counter + 1), 1000);
        };
        if (counter >= 3) resetTapPad();
        return () => clearTimeout(timer)
    }, [counter, clicks >= 2]);

    const stopCounter = () => setCounter(0);

    function mouseDown() {
        const currDate = (new Date()).getTime()
        setClicks(clicks + 1);
        if (recentClickDate) {
            const difference = currDate - recentClickDate;
            if (!timeAverage) setTimeAverage(difference);
            else setTimeAverage(((timeAverage * (clicks-1)) + difference) / clicks);
            props.setLocalBPM(Math.round(60000/(timeAverage ? timeAverage : difference)))
        };
        setRecentClickDate(currDate);
        setShowText(false)
        stopCounter()
    };

    return (
        <div>
        <div className='BPMTapPad' onMouseDown={mouseDown}>
            <p className='BPMTapPadText noSelect'>{showText ? 'Tap' : null}</p>
        </div>
        </div>
    )
}

export default BPMTap