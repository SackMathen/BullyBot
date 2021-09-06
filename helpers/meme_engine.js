const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const config = require('../config.json');
const fs = require('fs');

(async() => {
    const json_memes = JSON.parse(fs.readFileSync("persistent/memegen.json"));
    fetch_memes = await fetch('https://api.imgflip.com/get_memes').then(res=>res.json());
    for (let index in fetch_memes.data.memes) {
        const meme = fetch_memes.data.memes[index]
        const new_meme = {
            "id": meme.id,
            "name": meme.name,
            "box_count": meme.box_count
        }
        const meme_string = JSON.stringify(new_meme);
        if (!json_memes.memes.includes(meme_string)) {
            json_memes.memes.push(JSON.stringify(new_meme));
            fs.writeFileSync("persistent/memegen.json", JSON.stringify(json_memes));
        }
    }
})();

module.exports = {
    async getMeme(id, boxes) {
        let request = new URLSearchParams();
        request.append("template_id", id);
        request.append("username", config.imgflip_user);
        request.append("password", config.imgflip_pwd);
        request.append("text0", boxes[0]);
        request.append("text1", boxes[1]);
        console.log(JSON.stringify(request));
        post_memes = await fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: request
        }).then(res=>res.json());

        if (post_memes.success == true) {
            return post_memes.data.url;
        } else {
            return false; 
        }
    }
};



