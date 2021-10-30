const secondsToTimestamp = (timeInSeconds) => {
    const calc = timeInSeconds/60;
    const minutes = Math.floor(calc);
    let seconds = Math.round((calc % 1)*60);
    if (seconds < 10) seconds = '0' + seconds;
    return minutes + ':' + seconds
};

export default secondsToTimestamp;