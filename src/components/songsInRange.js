const shuffle = (array) => {   // Fisher-Yates (aka Knuth) Shuffle
    if (!array.length) return [];
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    };

    return array;
};
  
const songsInRange = (listened, collectionSongs, BPM, checkNearbyRange) => {
    const newSongs = [];
    const checkForSongs = () => {
        for (const currSong of collectionSongs) {
            if (currSong.BPM < BPM - 2) continue;
            if (listened[currSong.id]) continue;
            if (currSong.BPM > BPM + 3) break;
            newSongs.push(currSong);
        };
    };

    if (checkNearbyRange) {
        let inc = 1;
        while (!newSongs.length && inc <= 3) {
            checkNearbyRange === 'up' ? BPM++ : BPM--;
            checkForSongs();
            inc++;
        };
    } else checkForSongs();
    
    const randomizedSongs = shuffle(newSongs);
    return [randomizedSongs, BPM]
};

export default songsInRange