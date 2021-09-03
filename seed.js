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

        await axios.post('http://localhost:8080/auth/register', {
            pw: "12345", 
            uname: "alex2@gmail.com"
        })

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

        const thirdSong = await Song.create({
            songName: 'Third Song'
        })

        firstCollection.addSong(aSong)
        firstCollection.addSong(anotherSong)

        // await axios.post('http://localhost:8080/api/addsong', {
        //     songName: 'newSong',
        //     artistName: 'randomArtist'
        // })
        
        const alex = await User.findByPk(1);
       
        alex.addCollection(firstCollection)

        const newSession = await CollectionSession.create({
            currBPM: 143
        })

        newSession.update({
            active: false
        })

        firstCollection.addCollectionSession(newSession)
        alex.addCollectionSession(newSession)

        const secondCollection = await Collection.create({
            collectionName: 'Second Collection',
            collectionOwner: 1
        })

        const secondSession = await CollectionSession.create({
            currBPM: 117
        })

        secondSession.update({
            active: false
        })

        secondCollection.addCollectionSession(secondSession)
        alex.addCollection(secondCollection)
        alex.addCollectionSession(secondSession)

        const firstListened = await Listened.create({
            timeListened: 0
        })

        alex.setListened(firstListened); //One to one
        firstListened.addSong(aSong);
        newSession.addSong(aSong);


    } catch (err) {
        console.log(err)
    }
}

seed();