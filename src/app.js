const dotenv = require("dotenv");
const {Client} = require("discord.js");
const { actionText } = require("./core/text");
const { actionVoice } = require("./core/voice");
dotenv.config();
const client = new Client();
(async () => {
  client.login(process.env.DISCORD_TOKEN)
  client.once("ready", async () => {
    console.log('AQUI')
    const general = client.channels.cache.find((el) => el.name === "general");
    general.send('SALVE SALVE FAMÍLIA!');
    console.log("ready!!!!")
  });
  client.on('message',async message =>{
    if(message.author.bot) return;
    if(!message.content.includes(process.env.PREFIX)) return;
    actionText(message);
    actionVoice(message);
  })
  client.once("reconnecting", () => {
    console.log("reconnecting!!!!");
  });
  client.once("disconnect", () => {
    console.log("disconnect!!!!");
  });
})();
