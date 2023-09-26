const database = require("./database")

const emailConfirmations = {}

emailConfirmations.checkCode = async function(email, code) {
    let [row, e] = await database.get("SELECT * FROM email_confirmations WHERE email = ?", [email])
    if (e) return [false, e]

    if (!row) return [false, null]
    return [row.code === code, null]
}

emailConfirmations.isInDatabase = async function(email) {
    let [row, e] = await database.get("SELECT * FROM email_confirmations WHERE email = ?", [email])
    if (e) return [false, e]
    if (!row) return [false, null]
    return [true, null]
}

emailConfirmations.generateNewCode = function() {
    const chars = "0123456789abcdef"
    let code = ""

    for (let i = 0; i < 6; i++) {
        const n = Math.floor(Math.random() * chars.length)
        code += chars.charAt(n)
    }

    return code
}

emailConfirmations.newConfirmation = async function(email) {
    const code = emailConfirmations.generateNewCode()
    let e = await database.run("INSERT INTO email_confirmations (email, code) VALUES (?,?)", [email, code])
    if (e) return [null, e]
    return [code, null]
}

emailConfirmations.confirmEmail = async function(email) {
    let e = await database.run("DELETE FROM email_confirmations WHERE email = ?", [email])
    if (e) return e

    e = await database.run("UPDATE users SET email_confirmed = 1 WHERE email = ?", [email])
    if (e) return e
}

module.exports = emailConfirmations