const shuffle = (array) => {   // Fisher-Yates (aka Knuth) Shuffle
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    };

    return array;
};
  
const songsInRange = (listened, collectionSongs, BPM) => {
    const newSongs = [];

    for (const key in collectionSongs) {
        const currSong = collectionSongs[key];
        if (currSong.BPM < BPM - 2) continue;
        if (listened[currSong.id]) continue;
        if (currSong.BPM > BPM + 3) break;
        newSongs.push(currSong);
    };

    return shuffle(newSongs);
};

export default songsInRange