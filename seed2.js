const axios = require('axios')
const {db, Song, User, Collection, CollectionSession, Listened, UserCollection} = require ('./server/db/index')

const seed = async () => {
    try {   
        await db.sync({force: true}) // {alter: true}

        //create alex@gmail.com
        await axios.post('http://localhost:8080/auth/register', {
            pw: "12345", 
            uname: "alex@gmail.com"
        })

        const alex = await User.findByPk(1);

        const firstListened = await Listened.create({   // Previously listened songs in general.
            timeListened: 0
        })

        await alex.setListened(firstListened);

        const firstCollection = await Collection.create({
            collectionName: 'First Collection',
            collectionOwner: 1
        });

        await alex.addCollection(firstCollection);

        const fastLane = await Song.create({
            songName: 'FastLane',
            artistName: 'FENDI FRADO',
            BPM: 132,
            duration: 101,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/FastLane1.1.mp3"
        });

        const boomIt = await Song.create({
            songName: 'BoomIt',
            artistName: 'FENDI FRADO',
            BPM: 134,
            duration: 249,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Boomit3.mp3"
        });

        const diorInstrumental = await Song.create({
            songName: 'Dior Instrumental',
            artistName: '808Melo',
            albumName: 'Meet The Woo 2',
            BPM: 142,
            duration: 216,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Pop-Smoke-Dior-Instrumental-Prod.-By-808Melo.mp3"
        });

        const invincibleInstrumental = await Song.create({
            songName: 'Invincible Instrumental',
            artistName: 'Yoz Beatz',
            albumName: 'Meet The Woo 2',
            BPM: 143,
            duration: 187,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Pop-Smoke-Invincible-Instrumental-Prod.-By-Yoz-Beatz.mp3"
        });

        const proud = await Song.create({
            songName: 'Proud',
            artistName: 'Money Man',
            albumName: '6 Hours 2',
            BPM: 145,
            duration: 149,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Money+Man+%E2%80%9CProud%E2%80%9D+(6+Hours+2).mp3",
            plays: 20
        });

        const lost = await Song.create({
            songName: 'Lost',
            artistName: 'Money Man',
            albumName: '6 Hours 2',
            BPM: 145,
            duration: 152,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Money+Man+%E2%80%9CLost%E2%80%9D+(6+Hours+2).mp3",
            plays: 14
        });

        const LLC = await Song.create({
            songName: 'LLC',
            artistName: 'Money Man',
            BPM: 162,
            duration: 148,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Money+Man+%E2%80%9CLLC%E2%80%9D.mp3",
            plays: 10
        });

        const aura = await Song.create({
            songName: 'Aura',
            artistName: 'Money Man',
            albumName: '6 Hours 2',
            BPM: 144,
            duration: 140,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Money+Man+%E2%80%9CAura%E2%80%9D+(6+Hours+2).mp3",
            plays: 8
        });

        const woah = await Song.create({
            songName: 'Woah',
            artistName: 'Lil Baby',
            albumName: 'My Turn',
            BPM: 144,
            duration: 187,
            songURL: "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Lil+Baby+-+Woah+(Official+Music+Video).mp3"
        });


        await firstCollection.addSong(fastLane);
        await firstCollection.addSong(boomIt);
        await firstCollection.addSong(diorInstrumental);
        await firstCollection.addSong(invincibleInstrumental);
        await firstCollection.addSong(proud);
        await firstCollection.addSong(lost);
        await firstCollection.addSong(LLC);
        await firstCollection.addSong(woah);
        await firstCollection.addSong(aura);

        // await firstListened.addSong(diorInstrumental);
        // await firstListened.addSong(boomIt);
        // await firstListened.addSong(fastLane);  // most recent
        
        // const firstSession = await CollectionSession.create({
        //     active: true,
        //     currBPM: 142,
        //     playIdx: 3
        // });

        // await setTimeout(() => {  firstSession.addSong(boomIt) }, 1000);
        // await setTimeout(() => {  firstSession.addSong(diorInstrumental); }, 1000);
        // await setTimeout(() => {  firstSession.addSong(fastLane); }, 1000);     // most recent

        // // const firstS = await CollectionSession.findByPk(1)
        // // const fastLa = await Song.findByPk(1)
        // // await setTimeout(() => {  firstS.addSong(fastLa); }, 1000);

        // firstCollection.addCollectionSession(firstSession);   // Previously listened songs from that specific collection. (previous songs)
        // alex.addCollectionSession(firstSession);







        // const secondCollection = await Collection.create({
        //     collectionName: 'Second Collection',
        //     collectionOwner: 1
        // });

        // await alex.addCollection(secondCollection);

        // const secondSession = await CollectionSession.create({
        //     active: false,
        //     currBPM: 117
        // });

        // await secondCollection.addSong(fastLane);
        // await secondCollection.addSong(LLC);
        // await secondCollection.addSong(woah);
        // await secondCollection.addSong(proud);

        // secondCollection.addCollectionSession(secondSession)
        // alex.addCollectionSession(secondSession)

        //

        // const thirdCollection = await Collection.create({
        //     collectionName: 'Third Collection',
        //     collectionOwner: 1
        // });

        // const proud = await Song.findByPk(5)
        // const lost = await Song.findByPk(6)
        // const LLC = await Song.findByPk(7)


        // await thirdCollection.addSong(proud);
        // await thirdCollection.addSong(lost);
        // await thirdCollection.addSong(LLC);

        // alex.addCollection(thirdCollection)

        
    } catch (err) {
        console.log(err)
    }
}

seed();