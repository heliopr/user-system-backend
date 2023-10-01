const express = require("express")
const fs = require("fs")
const path = require("path")

const database = require("./database")
const userManager = require("./userManager")
const friendRequests = require("./friendRequests")

const app = express()
const PORT = 1001


async function handleError(e) {
    console.log(e)
    await database.close()
    process.exit()
}


const f = async () => {
    let e = await database.connect()
    if (e) await handleError(e)

    e = await database.setupDatabase()
    if (e) await handleError(e)
    

    fs.readdirSync("./api").forEach((f) => {
        const r = require("./api/"+f)
        app.use("/api", r)
    })

    app.use("/panel", express.static(path.join(__dirname,"./panel/")))
    app.get("/panel/:pg", (req, res) => {
        if (!fs.existsSync(`./panel/${req.params.pg}/index.html`)) {
            res.send("ERROR")
        }
        else {
            res.sendFile(path.join(__dirname, `./panel/${req.params.pg}/index.html`))
        }
    })
    app.get("/panel", (req, res) => {
        res.sendFile(path.join(__dirname, "./panel/main/index.html"))
    })

    app.listen(PORT, () => {
        console.log(`Server is open. Port: ${PORT}`)
    })

    process.on("exit", async () => {
        await database.close()
        console.log(`Server is closed.`)
    })

    for (const e of ["SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM"]) {
        process.on(e, () => {
            process.exit()
        })
    }
}

f()