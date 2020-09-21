const axios = require('axios').default;

exports.garvoFunction = async() =>{
    const request = await axios.get('https://www.palabrasaleatorias.com/palavras-aleatorias.php');
    const change = String(request.data).split('<div style="font-size:3em; color:#6200C5;">').pop();
    const id = String(change).indexOf('</div>');
    const word = change.slice(0,id).trim().toLocaleLowerCase();
    return `Eu ai sendo ${word}`;
}