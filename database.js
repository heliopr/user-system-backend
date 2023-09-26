const sqlite = require("sqlite3").verbose()

const database = {}
const schemas = require("./db/schemas.json")
database.DB_PATH = "./db/main.db"

database.connect = function() {
    return new Promise((resolve, reject) => {
        console.log("[DB] Opening db connection...")
        database.db = new sqlite.Database(database.DB_PATH, (error) => {
            if (error) {
                console.log("[DB] Error trying to open db connection")
                reject(error)
            }
            else {
                console.log("[DB] Opened db connection!")
                resolve()
            }
        })
    })
}


//#region ASYNC SQLITE
database.exec = function(sql, callback=undefined) {
    if (callback) {
        database.db.exec(sql, callback)
    }
    else {
        return new Promise((resolve, reject) => {
            database.db.exec(sql, (error) => {
                resolve(error)
            })
        })
    }
}

database.run = function(sql, params=[], callback=null) {
    if (callback) {
        database.db.run(sql, params, callback)
    }
    else {
        return new Promise((resolve, reject) => {
            database.db.run(sql, params, (error) => {
                resolve(error)
            })
        })
    }
}

database.get = function(sql, params, callback=undefined) {
    if (callback) {
        database.db.get(sql, params, callback)
    }
    else {
        return new Promise((resolve, reject) => {
            database.db.get(sql, params, (error, row) => {
                if (error) resolve([null, error])
                else resolve([row, null])
            })
        })
    }
}

database.all = function(sql, params, callback=undefined) {
    if (callback) {
        database.db.all(sql, params, callback)
    }
    else {
        return new Promise((resolve, reject) => {
            database.db.all(sql, params, (error, rows) => {
                if (error) resolve([null, error])
                else resolve([rows, null])
            })
        })
    }
}

database.each = function(sql, params, callback=undefined, complete=undefined) {
    return database.db.each(sql, params, callback, complete)
}
//#endregion ASYNC SQLITE


database.close = async function() {
    console.log("[DB] Closing db...")
    //await database.exec("DROP TABLE users")
    await database.db.close()
    console.log("[DB] Closed db!")
}

database.setupDatabase = async function() {
    console.log("[DB] Setting up db...")

    let e = await database.exec("PRAGMA foreign_keys = ON")
    if (e) return e

    for (const s in schemas) {
        e = await database.exec(schemas[s])
        if (e) return e
    }

    console.log("[DB] Db is set up!")
}

module.exports = database