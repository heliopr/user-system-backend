const database = require("./database")

const passwordChanges = {}

passwordChanges.generateNewCode = function() {
    const chars = "0123456789abcdef"
    let code = ""

    for (let i = 0; i < 6; i++) {
        const n = Math.floor(Math.random() * chars.length)
        code += chars.charAt(n)
    }
    
    return code
}

passwordChanges.newRequest = function(id, newPassword) {
    const code = passwordChanges.generateNewCode()
    return database.run("INSERT INTO password_changes (id, new_password, code) VALUES (?,?,?)", [id, newPassword, code])
}

passwordChanges.exists = async function(id) {
    let [r, e] = await database.get("SELECT COUNT(*) AS count FROM password_changes WHERE id=?", [id])
    if (e) return [false, e]
    if (!r || r.count == undefined || r.count == null || isNaN(r.count)) return [false, null]

    return [r.count==1, null]
}

passwordChanges.get = function(id) {
    return database.get("SELECT * FROM password_changes WHERE id=?", [id])
}

passwordChanges.deleteRequest = function(id) {
    return database.run("DELETE FROM password_changes WHERE id=?", [id])
}

module.exports = passwordChanges