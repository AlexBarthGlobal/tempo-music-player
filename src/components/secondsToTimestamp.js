const secondsToTimestamp = (timeInSeconds) => {
    const calc = timeInSeconds/60;
    minutes = Math.floor(calc);
    seconds = Math.floor((calc % 1)*60)
    return minutes + ':' + seconds;
};

export default secondsToTimestamp;