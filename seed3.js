const axios = require('axios')
const {db, Song, User, Collection, CollectionSession, Listened, UserCollection} = require ('./server/db/index')

const seed = async () => {
    try {   
        await db.sync({force: true}) // {alter: true}

        const turnUp = await Collection.create({
            collectionName: 'Turn Up',
            collectionOwner: 'Tempo Music Player',
            collectionArtUrl: 'https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/http___cdn.cnn.com_cnnnext_dam_assets_210701131326-worlds-largest-yacht--credit--winch-design-3.jpg'
        });

        const beachChill = await Collection.create({
            collectionName: 'Beach Chill',
            collectionOwner: 'Tempo Music Player',
            collectionArtURL: 'https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/16927716876_bf44bf456f_b.jpg'
        })

        const mobTies = await Song.create({
            songName: 'Mob Ties',
            artistName: 'wxlf',
            albumName: 'DMIYC',
            BPM: 154,
            duration: 188,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/154+mob+ties/mob-ties+by+wxlf+Artlist.mp3",
            artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/154+mob+ties/ab67616d0000b273dfed31f80f4112eecf8c273e.jfif"
        });

        await turnUp.addSong(mobTies);

        /////

        const sycosis = await Song.create({
            songName: 'A.N.C.',
            artistName: 'sycosis',
            albumName: 'A.N.C.',
            BPM: 180,
            duration: 218,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/A.N.C.+180/a.n.c+by+sycosis+Artlist.mp3",
            artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/A.N.C.+180/ab67616d0000b273bb30b473efe9e9681d368b22.jfif"
        });

        await turnUp.addSong(sycosis);

        /////

        const showYou = await Song.create({
            songName: 'Show You',
            artistName: 'D Mills',
            albumName: 'Agape',
            BPM: 90,
            duration: 239,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Agape+show+you+90/agape-(show-you)+by+d-mills+Artlist.mp3",
            artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Agape+show+you+90/ab67616d0000b2731baa4cc899159f74e1cc892d.jfif"
        });

        await turnUp.addSong(showYou);

        /////

        const angels = await Song.create({
            songName: 'Angels',
            artistName: 'wxlf',
            albumName: 'DMIYC',
            BPM: 137,
            duration: 126,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Angels+137/angels+by+wxlf+Artlist.mp3",
            artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Angels+137/ab67616d0000b273dfed31f80f4112eecf8c273e.jfif"
        });

        await turnUp.addSong(angels);

     /////

     const bedroom = await Song.create({
        songName: 'Bedroom',
        artistName: 'Raquel Castro, The Wildcardz',
        albumName: 'Bedroom Jams',
        BPM: 168,
        duration: 200,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Bedroom+168/bedroom---no-lead-vocals+by+raquel-castro+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Bedroom+168/ab67616d0000b2732cde1ecdce111d06e85a8133.jfif"
    });

    await turnUp.addSong(bedroom);

    /////

    const bigLeagues = await Song.create({
        songName: 'Big Leagues',
        artistName: 'Vic Sage',
        albumName: 'Big Leagues',
        BPM: 149,
        duration: 103,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Big+leagues+vic+sage+149/big-leagues+by+vic-sage+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Big+leagues+vic+sage+149/af86f76264c17a4bdd3e0462490ef614.640x640x1.png"
    });

    await turnUp.addSong(bigLeagues);

    /////

    const byMyself = await Song.create({
        songName: 'By Myself',
        artistName: 'Nate Rose',
        albumName: 'By Myself',
        BPM: 128,
        duration: 160,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/By+Myself+128/by-myself+by+nate-rose+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/By+Myself+128/ab67616d0000b27314e1e2719d21185f63e56f30.jfif"
    });

    await turnUp.addSong(byMyself);

    /////

    const caution = await Song.create({
        songName: 'Caution',
        artistName: 'Skrxlla',
        albumName: 'Cold Fashion',
        BPM: 120,
        duration: 129,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Cauton+Skrxlla+120/caution+by+skrxlla+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Cauton+Skrxlla+120/bc51b456de8b2b73a96584f65d7195ac.300x300x1.jpg"
    });

    await turnUp.addSong(caution);

    /////

    const chase = await Song.create({
        songName: 'Chase ft. Kirko Bangz',
        artistName: 'Vic Sage',
        albumName: 'Chase',
        BPM: 137,
        duration: 140,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Chase+137/chase+by+vic-sage+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Chase+137/ab67616d0000b273a464ae77f9fa5f30c88176ed.jfif"
    });

    await turnUp.addSong(chase);

    /////

    const comfortable = await Song.create({
        songName: 'Comfortable',
        artistName: 'James Gardin',
        albumName: 'Comfortable',
        BPM: 110,
        duration: 185,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Comfortable+110/comfortable-feat-sareem-poems+by+james-gardin+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Comfortable+110/ab67616d00001e0229640382a2b60da5d403216d.jfif"
    });

    await turnUp.addSong(comfortable);

    /////

    const designer = await Song.create({
        songName: 'Designer',
        artistName: 'Vic Sage',
        albumName: 'B-Sides',
        BPM: 152,
        duration: 115,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Designer+152/designer+by+vic-sage+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Designer+152/ab67616d0000b2736003452d33948192f07cb730.jfif"
    });

    await turnUp.addSong(designer);

    /////

    const egos = await Song.create({
        songName: 'Egos',
        artistName: 'Nate Rose',
        albumName: 'Egos',
        BPM: 162,
        duration: 133,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/egos+nate+rose+162/egos+by+nate-rose+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/egos+nate+rose+162/Nate-Rose-Egos-artwork-faeton-music.jpg"
    });

    await turnUp.addSong(egos);

    /////

    const feeling = await Song.create({
        songName: 'Feeling',
        artistName: 'MILANO',
        albumName: 'ambience',
        BPM: 120,
        duration: 141,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Feeling+120/feeling+by+milano+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Feeling+120/ab67616d0000b273d7f1d7ad109ed7e957ca766f.jfif"
    });

    await turnUp.addSong(feeling);

    /////

    const getOnDown = await Song.create({
        songName: 'Get On Down',
        artistName: 'Moarn',
        albumName: 'Electro Beats',
        BPM: 95,
        duration: 229,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Get+On+Down+95/get-on-down+by+moarn+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Get+On+Down+95/ab67616d0000b273f16d27d22ebc106f9693aa4e.jfif"
    });

    await turnUp.addSong(getOnDown);

    /////

    const goGetTheMoney = await Song.create({
        songName: 'Go Get The Money',
        artistName: 'Ateller',
        albumName: 'Phase One',
        BPM: 142,
        duration: 174,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Go+Get+the+money+142/go-get-the-money+by+ateller+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Go+Get+the+money+142/ab67616d0000b27354b017388f87b137277ac151.jfif"
    });

    await turnUp.addSong(goGetTheMoney);

    /////

    const iDoThisAlot = await Song.create({
        songName: 'I Do This A Lot',
        artistName: 'Nate Rose',
        albumName: 'I Do This A Lot',
        BPM: 131,
        duration: 173,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/I+do+This+a+lot+131/i-do-this-a-lot+by+nate-rose+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/I+do+This+a+lot+131/ab67616d0000b2735aa1d857442f7c26afe4c6e2.jfif"
    });

    await turnUp.addSong(iDoThisAlot);

    /////

    const knowStuff = await Song.create({
        songName: 'Know Stuff',
        artistName: 'Nate Rose',
        albumName: 'Know Stuff',
        BPM: 155,
        duration: 133,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Know+Stuff+155/know-stuff+by+nate-rose+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Know+Stuff+155/ab67616d0000b2733b55f87673672fd3f5cf1333.jfif"
    });

    await turnUp.addSong(knowStuff);

    /////

    const makeMyMove = await Song.create({
        songName: 'Make My Move (Instrumental) ft. King Marino',
        artistName: 'Oliver Michael, King Marino',
        albumName: 'Make My Move',
        BPM: 146,
        duration: 126,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Make+My+move+146/make-my-move---instrumental-version+by+oliver-michael+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Make+My+move+146/ab67616d0000b27396b96eb2c22ca3fb7d4f61ff.jfif"
    });

    await turnUp.addSong(makeMyMove);

    /////

    const mikeJ = await Song.create({
        songName: 'Mike J',
        artistName: 'Vic Sage',
        albumName: 'Glow',
        BPM: 120,
        duration: 162,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Mike+J+120/mike-j+by+vic-sage+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Mike+J+120/ab67616d0000b2733049bc2a34c2141912b6b20d.jfif"
    });

    await turnUp.addSong(mikeJ);

    /////

    const mistakes = await Song.create({
        songName: 'Mistakes',
        artistName: 'wxlf',
        albumName: 'Mistakes',
        BPM: 139,
        duration: 194,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/mistakes+wxlf+139/mistakes+by+wxlf+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/mistakes+wxlf+139/439434_Wxlf_-_Wxlf_-_A.jpg"
    });

    await turnUp.addSong(mistakes);

    /////

    const mood = await Song.create({
        songName: 'Mood',
        artistName: 'Wearethegood',
        albumName: 'Big Mood Attitude',
        BPM: 152,
        duration: 142,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Mood+152/mood+by+wearethegood+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Mood+152/fc27c98c07c1ef5af856cbf970029f01.499x499x1.jpg"
    });

    await turnUp.addSong(mood);

    /////

    const moon = await Song.create({
        songName: 'Moon',
        artistName: 'Vic Sage',
        albumName: 'Moon',
        BPM: 130,
        duration: 148,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Moon+130/moon+by+vic-sage+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Moon+130/ab67616d0000b27341a8f435abe485e670fb6dc9.jfif"
    });

    await turnUp.addSong(moon);

    /////

    const needed = await Song.create({
        songName: 'Needed',
        artistName: 'Sajan Nauriyal',
        albumName: 'Needed',
        BPM: 117,
        duration: 222,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Needed+117/needed+by+sajan-nauriyal+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Needed+117/ab67616d0000b273c16aec5d19b9415ae27a0784.jfif"
    });

    await turnUp.addSong(needed);

    /////

    const ocean = await Song.create({
        songName: 'Ocean ft. Wessly',
        artistName: 'Vic Sage, Wessly',
        albumName: 'Ocean',
        BPM: 155,
        duration: 199,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/ocean+vic+sage+155/ocean+by+vic-sage+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/ocean+vic+sage+155/5d4106469e676dd47d90ae7938b4f453.700x700x1.jpg"
    });

    await turnUp.addSong(ocean);

    /////

    const ranch = await Song.create({
        songName: 'Ranch',
        artistName: 'Nate Rose',
        albumName: 'Ranch',
        BPM: 168,
        duration: 140,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Ranch+168/ranch+by+nate-rose+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Ranch+168/ab67616d0000b2737dc7bc3709b98b92d03ceaf4.jfif"
    });

    await turnUp.addSong(ranch);

    /////

    const rookieOfTheYear = await Song.create({
        songName: 'Rookie of the year',
        artistName: 'wxlf',
        albumName: 'Undefined',
        BPM: 138,
        duration: 171,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Rookie+of+the+year+138/rookie-of-the-year+by+wxlf+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Rookie+of+the+year+138/ab67616d0000b273162827443bd8ecd5caa3d821.jfif"
    });

    await turnUp.addSong(rookieOfTheYear);

    /////

    const running = await Song.create({
        songName: 'Running ft. Hush',
        artistName: 'Nate Rose, Hush',
        albumName: 'Running',
        BPM: 160,
        duration: 176,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Running+160/running-feat-hush+by+nate-rose+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Running+160/ab67616d0000b273204f944cc31c47f3c95978b1.jfif"
    });

    await turnUp.addSong(running);

    /////

    const smallTalk = await Song.create({
        songName: 'Small Talk',
        artistName: 'Nate Rose',
        albumName: 'Small Talk',
        BPM: 120,
        duration: 197,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Small+Talk+120/small-talk+by+nate-rose+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Small+Talk+120/ab67616d0000b273c8db0b9566e75faaa9e230d6.jfif"
    });

    // await turnUp.addSong(smallTalk);

    /////

    const theLights = await Song.create({
        songName: 'The Lights',
        artistName: 'Ateller',
        albumName: 'Phase One',
        BPM: 162,
        duration: 197,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/The+lights+162/the-lights+by+ateller+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/The+lights+162/ab67616d0000b27354b017388f87b137277ac151.jfif"
    });

    // await turnUp.addSong(theLights);

    /////

    const trust = await Song.create({
        songName: 'Trust',
        artistName: 'Sajan Nauriyal',
        albumName: 'Perspective',
        BPM: 130,
        duration: 164,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Trust+130/trust+by+sajan-nauriyal+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Trust+130/ab67616d0000b27389f2df9806e3492adc372ede.jfif"
    });

    // await turnUp.addSong(trust);

    /////

    const underrated = await Song.create({
        songName: 'Underrated',
        artistName: 'Michael Hampton, Ty Brasel, Hyper Fenton',
        albumName: 'Underrated',
        BPM: 120,
        duration: 222,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Underrated+120/underrated+by+fvmeless+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Underrated+120/ab67616d0000b273ba7708c4272eab525a4caffb.jfif"
    });

    // await turnUp.addSong(underrated);

    /////

    const verano = await Song.create({
        songName: 'Verano',
        artistName: 'wxlf',
        albumName: 'DMIYC',
        BPM: 180,
        duration: 180,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Verano+180/verano+by+wxlf+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Verano+180/ab67616d0000b273dfed31f80f4112eecf8c273e.jfif"
    });

    // await turnUp.addSong(verano);

    /////

    const mobTies = await Song.create({
        songName: 'Woodwork',
        artistName: 'Vic Sage',
        albumName: 'B-Sides',
        BPM: 152,
        duration: 121,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Woodwork+152/woodwork+by+vic-sage+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Woodwork+152/ab67616d0000b2736003452d33948192f07cb730.jfif"
    });

    // await turnUp.addSong(mobTies);

    /////

    const yeahThatsMe = await Song.create({
        songName: "Yeah That's Me!",
        artistName: 'Frank Bentley',
        albumName: "Yeah That's Me!",
        BPM: 140,
        duration: 104,
        songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Yeah+that's+me+140/yeah-thats-me!+by+frank-bentley+Artlist.mp3",
        artURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TempoMusicPlayer/Yeah+that's+me+140/545819_Frank_Bentley_-_Yeah_That's_Me!_-_A.jpg"
    });

    // await turnUp.addSong(yeahThatsMe);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    const mobTies = await Song.create({
        songName: '',
        artistName: '',
        albumName: '',
        BPM: ,
        duration: ,
        songURL: "",
        artURL: ""
    });

    await turnUp.addSong(mobTies);

    /////

    await turnUp.addSong(mobTies);
        
    } catch (err) {
        console.log(err)
    }
}

seed();