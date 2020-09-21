const { findSong, addSongs, showQueue, removeQueue,skip, leave } = require("../functions/voiceFunctions");

const queue = new Map();
exports.actionVoice = async (message) => {
    const command = message.content.split(process.env.PREFIX).pop().trim();
    command.split(' ')[0]
    let server = {
        channel: await message.channel,
        voiceChannel: await message.member.voice.channel,
        guildId: await message.member.guild.id
    }
    let commandPlay = ''
    switch (command.split(' ')[0]) {
        case 'p':
            try {
                if (!server.voiceChannel) {
                    server.channel.reply('ENTRA EM UMA SALA SEU BURO JUMETO!!!!!');
                    return;
                }
                const connection = await server.voiceChannel.join();
                server.connection = connection;
                commandPlay = message.content.split('p ').pop().trim();
                console.log(message.content.split('p '))
                const { url, title } = await findSong(commandPlay);
                if(url && title){
                    const song = {
                        url,
                        title
                    }
                    addSongs(server, queue, song)
                }else{
                    server.channel.send('NÃO ACHEI A MÚSICA ;-(')
                }
                
            } catch (error) {
                server.channel.reply('DEU RUIM');
                
            }

            break;

        case 'l':
            leave(queue,server);
            break;
        case 'q':
            showQueue(queue,server)
            break;
        case 's':
            skip(queue,server)
            break;

        case 'r':
            commandPlay = message.content.split('r ').pop().trim();
            if (!Number.isNaN(commandPlay) && Number.isInteger(Number(commandPlay))) {
                removeQueue(Number(commandPlay), queue, server)
            } else {
                server.channel.send('EU NUNTENDI QUIELI FALHOU');
            }
            break;
    }
}
