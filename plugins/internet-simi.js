const { Miya } = require("../lib/command") 
const axios = require("axios") 

Miya({
command:'^simi$', 
alias: 'simi',
type:'Internet', 
}, async(m, {miya, text, reply}) => {
if (!text) return reply("apaan ajg, kosong") 
const options = new URLSearchParams();
        options.append("text", text);
        options.append("lc", "id");
axios.post("https://api.simsimi.vn/v2/simtalk", options, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                timeout: 6000,
            }).then(res => reply(res.data.message)) 
})