const { google } = require('googleapis');
const axios = require('axios').default
const YTDL = require('ytdl-core');
exports.findSong = async (valueSearch) => {
    try {
        /* const result = await google.youtube('v3').search.list({
            key: process.env.YOUTUBE_TOKEN,
            part: 'snippet',
            q: valueSearch
        }); */
        const request = await axios.get('https://www.youtube.com/results?search_query=' + valueSearch.split(' ').join('+'));
        const index1 = request.data.indexOf('{"responseContext"')
        const firstPart = request.data.slice(index1, request.data.length);
        const index2 = firstPart.indexOf('};')
        const json = JSON.parse(`${firstPart.slice(0, index2)}}`);
        const arrContent = JSON.parse(`${firstPart.slice(0, index2)}}`)
            .contents.twoColumnSearchResultsRenderer
            .primaryContents.sectionListRenderer
        const videoRender = arrContent.contents
        .filter(el => el.itemSectionRenderer)
        .map(el => el.itemSectionRenderer.contents)
        .filter(el => el.find(ex => ex.videoRenderer))
        .pop();
        const find = videoRender.find(el => el.videoRenderer !== undefined);
        if (find.videoRenderer) {
            return {
                title: find.videoRenderer.title.runs[0].text,
                url: `https://www.youtube.com/watch?v=${find.videoRenderer.videoId}`
            };
        } else {
            return {
                title: null,
                url: null
            };
        }
    } catch (error) {
        console.log(error)
    }
}

exports.addSongs = async (server, queue, song) => {
    try {
        const actualQueue = queue.get(server.guildId);
        let objQueue = {
            volume: 10,
            voiceChannel: server.voiceChannel,
            dispatcher: null,
            connection: server.connection,

        };
        if (!actualQueue || !actualQueue.songs || actualQueue.songs.length === 0) {
            objQueue.songs = [];
            objQueue.songs.push({
                url: song.url,
                title: song.title
            })
            queue.set(server.guildId, objQueue)
            await play(objQueue, server, song);
        } else {
            server.channel.send(`
            VOU DEIXAR AQUI NA FILA ${song.title}
            ${song.url}
            `);
            actualQueue.songs.push(song);
            queue.set(server.guildId, actualQueue);
        }
    } catch (error) {
        console.log(error)
        server.channel.send('DEU RUIM')
    }
}
exports.showQueue = (queue,server) => {
    try {
        const actualQueue = queue.get(server.guildId);
        if (actualQueue && actualQueue.songs && actualQueue.songs.length > 0) {
            
            server.channel.send(`
            CUANDO ESCUCHO MI CANCION FAVORITA!
            ${actualQueue.songs.map((el, id) => {
                return `
                ${id + 1} - ${el.title}
                `
            })}
            `.replace(/,/gi, ""))
        } else {
            server.channel.send(`TO OUVINDO NADA ADIANO ;-(`)
        }
    } catch (error) {
        console.log(error)
        server.channel.send('DEU RUIM')
    }
}
exports.removeQueue = async (id, queue, server) => {
    try {
        const actualQueue = queue.get(server.guildId);
        if (actualQueue) {
            if((id-1) === 0){
                this.skip(queue,server)
            }else{
                const song = actualQueue.songs[(id - 1)];
                if (song) {
                    actualQueue.songs = actualQueue.songs.filter((el, idx) => idx !== (id-1));
                    queue.set(server.guildId, actualQueue);
                    server.channel.send(`REMOVI A ${id} - ${song.title}`)
                } else {
                    server.channel.send('QUAL É A MUSICA ANIMAL???????')
                }
            }
        } else {
            server.channel.send('BURO JUMETO')
        }
        
    } catch (error) {
        console.log(error)        
    }

}
exports.leave = async(queue,server) =>{
    try {
        const actualQueue = queue.get(server.guildId);
        if(actualQueue){
            actualQueue.songs = [];
            queue.set(server.guildId,actualQueue);
            server.voiceChannel.leave();
        }else{
            server.voiceChannel.leave();
        }
    } catch (error) {
        console.log(error)
        server.channel.send('DEU RUIM')
    }
}
exports.skip = async (queue, server) => {
    try {
        const actualQueue = queue.get(server.guildId);
        if (actualQueue) {
            let song = actualQueue.songs.find((el, idx) => idx === 0);
            actualQueue.dispatcher.end();
            server.channel.send(`SKIPANDO A ${song.title}`);
        } else {
            server.channel.send('BURO JUMETO')
        }
    } catch (error) {
        console.log(error)
        server.channel.send('DEU RUIM')
    }

}
async function play(guild, server, song) {
    server.channel.send(`
        AIII VOU TOCAR ${song.title}
        ${song.url}
        `)

    console.log(song.url)
    guild.dispatcher = await guild.connection.play(await YTDL(song.url));
    guild.dispatcher.on('finish', () => {

        guild.songs.shift();
        if (guild.songs[0]) {
            play(guild, server, guild.songs[0])
        } else {
            server.voiceChannel.leave();

        }
    })
}