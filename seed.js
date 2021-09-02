const {db} = require ('./server/db/index')
const axios = require('axios')
const {Song, User} = require('./server/db/index')

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

        // const aSong = await Song.create({
        //     songName: 'Test Song'
        // })

        // const anotherSong = await Song.create({
        //     songName: 'AnotherSong'
        // })

    } catch (err) {
        console.log(err)
    }
}

seed();