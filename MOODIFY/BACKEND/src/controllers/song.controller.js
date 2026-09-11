const songModel = require('../models/song.model')
const id3 = require("node-id3")
const storageService = require('../services/storage.service')

async function uploadSong(req, res) {

    const songBuffer = req.file.buffer
    const {mood} = req.body

    const tags = id3.read(songBuffer)

    const [songFile, posterFile] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/Backend-1/moodify/songs"
        }),
        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + ".jpeg",
            folder: "/Backend-1/moodify/posters"
        })
    ]) 


    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    })

    res.status(201).json({
        message: "Song created successfully",
        song
    })
    
}

async function getSong(req, res){
    const { mood, limit = 12 } = req.query
    const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 12, 1), 30)
    const songs = await songModel.aggregate([
        { $match: mood ? { mood } : {} },
        { $sample: { size: safeLimit } }
    ])

    res.status(200).json({
        message: "playlist fetched successfully",
        mood: mood || "all",
        songs,
        song: songs[0] || null
    })
}

module.exports = {
    uploadSong,
    getSong
}