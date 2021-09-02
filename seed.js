const axios = require('axios')
const {db, Song, User, Collection} = require ('./server/db/index')

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

        const aSong = await Song.create({
            songName: 'Test Song'
        })

        const anotherSong = await Song.create({
            songName: 'AnotherSong'
        })

        // await axios.post('http://localhost:8080/api/addsong', {
        //     songName: 'newSong',
        //     artistName: 'randomArtist'
        // })
        
        const alex = await User.findByPk(1);
        const newCollection = await Collection.create({
            collectionName: 'TestCollection',
            collectionOwner: alex.dataValues.id
        })

        alex.addCollection(newCollection)



    } catch (err) {
        console.log(err)
    }
}

seed();