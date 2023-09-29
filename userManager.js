const database = require("./database")
const emailConfirmations = require("./emailConfirmations")

const userManager = {}

userManager.generateNewCookie = function() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let cookie = ""

    for (let i = 0; i < 128; i++) {
        const n = Math.floor(Math.random() * chars.length)
        cookie += chars.charAt(n)
    }
    
    return cookie
}

userManager.isValidEmail = function(email) {
    return email.match(/^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/g)
}

userManager.isValidUsername = function(username) {
    return username.match(/^[a-zA-Z0-9_]+$/g) && username.match(/[a-zA-Z]/)
}

userManager.isValidPassword = function(password) {
    return password.match(/^[a-zA-Z0-9_#?!@$%&*-]+$/g)
}

userManager.createUser = function(username, password, email) {
    const cookie = userManager.generateNewCookie()
    return database.run("INSERT INTO users (username, cookie, password, email) VALUES (?,?,?,?)", [username, cookie, password, email])
}

/*userManager.getUserIdByUsername = async function(username) {
    let [user, e] = await database.get("SELECT id FROM users WHERE username = ?", [username])
    return [user.id, e]
}*/

userManager.getUserById = function(id) {
    return userManager.getUser("id", id)
}

userManager.getUserByUsername = function(username) {
    return userManager.getUser("username", username)
}

userManager.getUser = function(column, value) {
    return database.get(`SELECT * FROM users WHERE ${column} = ?`, [value])
}

userManager.getAllFriends = async function(id) {
    let [rows, e] = await database.all("SELECT * FROM friendships WHERE user1 = ? OR user2 = ?", [id, id])
    if (e) return [null, e]

    const friends = []
    for (const row of rows) {
        if (row.user1 != id) friends.push(row.user1)
        else if (row.user2 != id) friends.push(row.user2)
    }
    return [friends, null]
}

userManager.areFriends = async function(user1, user2) {
    let [row, e] = await database.get("SELECT COUNT(*) AS count FROM friendships WHERE (user1=? AND user2=?) OR (user1=? AND user2=?)", [user1, user2, user2, user1])
    if (e) return [false, e]
    if (!row  || row.count == undefined || row.count == null) return [false, null]

    return [row.count>0, e]
}

module.exports = userManager