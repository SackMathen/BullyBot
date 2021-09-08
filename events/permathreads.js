const fs = require('fs');

class PermaThreads {
    constructor() {
        console.log("PLUGIN: PERMATHREADS MODULE ENABLED")
    }
    async execute(event) {
        const json_threads = JSON.parse(fs.readFileSync("persistent/permathreads.json"));
        if (json_threads.threads.includes(event.id)) {
            event.setArchived(false);
        }
    }
}

inst_permathreads = new PermaThreads();
module.exports = inst_permathreads;