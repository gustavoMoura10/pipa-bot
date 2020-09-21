const { garvoFunction } = require("../functions/textFunctions");

exports.actionText = async (message) => {
    const channel = await message.channel;
    const command = message.content.split(process.env.PREFIX).pop().trim();
    switch (command) {
        case 'garvo':
            const messageSend = await garvoFunction();
            channel.send(messageSend);
            break;
    }
}