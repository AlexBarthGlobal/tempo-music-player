const {db} = require ('./server/db/index')
const {Songs} = require('./server/db/index')
const {Users} = require('./server/db/index')
const axios = require('axios')

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

        const aSong = await Songs.create({
            songName: 'Test Song'
        })

        const anotherSong = await Songs.create({
            songName: 'AnotherSong'
        })

    } catch (err) {
        console.log(err)
    }
}

seed();