const database = require("./database")

const friendRequests = {}

friendRequests.exists = async function(user1, user2) {
    const [row, e] = await database.get("SELECT COUNT(*) AS count FROM friend_requests WHERE (sender=? AND target=?) OR (sender=? AND target=?)", [user1, user2, user2, user1])
    if (e) return [false, e]
    if (!row || row.count == undefined || row.count == null || isNaN(row.count)) return [false, null]

    return [row.count>0, e]
}

friendRequests.getSentRequests = async function(sender) {
    const [rows, e] = await database.all("SELECT target FROM friend_requests WHERE sender=?", [sender])
    if (e) return [null, e]

    const sent = []
    for (const r of rows) {
        if (r && r.target != undefined) {
            sent.push(r.target)
        }
    }
    return [sent, null]
}

friendRequests.getPendingRequests = async function(target) {
    const [rows, e] = await database.all("SELECT sender FROM friend_requests WHERE target=?", [target])
    if (e) return [null, e]

    const received = []
    for (const r of rows) {
        if (r && r.sender != undefined) {
            received.push(r.sender)
        }
    }
    return [received, null]
}

friendRequests.createRequest = function(sender, target) {
    return database.run("INSERT INTO friend_requests (sender, target) VALUES (?,?)", [sender, target])
}

module.exports = friendRequests