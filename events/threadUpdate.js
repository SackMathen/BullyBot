const client = require("../index");

client.on('threadUpdate', async(oldThread, newThread) => {
    let permaThreads = await client.db.get("permaThreads");
    if (!permaThreads) return;
    if (permaThreads.includes(newThread.id) && newThread.archived) {
        newThread.setArchived(false);
    }
});