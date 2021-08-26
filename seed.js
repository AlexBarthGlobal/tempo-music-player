const {db} = require ('./server/db/index')

const {Songs} = require('./server/db/index')

const seed = async () => {
    try {   
        await db.sync({ force: true})

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