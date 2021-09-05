const axios = require('axios')
const {db, Song, User, Collection, CollectionSession, Listened} = require ('./server/db/index')

const seed = async () => {
    try {   
        await db.sync({force: true})

        //create alex@gmail.com

        await axios.post('http://localhost:8080/auth/register', {
            pw: "12345", 
            uname: "alex@gmail.com"
        })

        const alex = await User.findByPk(1);

        const firstListened = await Listened.create({
            timeListened: 0
        })

        await alex.setListened(firstListened); //One to one

        await axios.post('http://localhost:8080/auth/register', {
            pw: "12345", 
            uname: "alex2@gmail.com"
        })

        const alex2 = await User.findByPk(2);

        const secondListened = await Listened.create({
            timeListened: 0
        })

        await alex2.setListened(secondListened)
        

        const firstCollection = await Collection.create({
            collectionName: 'Cool collection',
            collectionOwner: 1
        })

        const aSong = await Song.create({
            songName: 'Test Song'
        })

        const anotherSong = await Song.create({
            songName: 'AnotherSong'
        })

        secondListened.addSong(anotherSong)

        const thirdSong = await Song.create({
            songName: 'Third Song'
        })

        await firstCollection.addSong(aSong)
        await firstCollection.addSong(anotherSong)

        // await axios.post('http://localhost:8080/api/addsong', {
        //     songName: 'newSong',
        //     artistName: 'randomArtist'
        // })
        
        

        const newSession = await CollectionSession.create({
            currBPM: 143
        })

        await newSession.update({
            active: false
        })

        await firstCollection.addCollectionSession(newSession)
        await alex.addCollectionSession(newSession)

        const secondCollection = await Collection.create({
            collectionName: 'Second Collection',
            collectionOwner: 1
        })

        const secondSession = await CollectionSession.create({
            currBPM: 117
        })

        await secondSession.update({
            active: false
        })

        await secondCollection.addCollectionSession(secondSession)
        await alex.addCollection(secondCollection)
        await alex.addCollectionSession(secondSession)

        
        await firstListened.addSong(aSong);
        await firstListened.addSong(thirdSong);
        await newSession.addSong(aSong);

        await alex.addCollection(firstCollection)


    } catch (err) {
        console.log(err)
    }
}

seed();