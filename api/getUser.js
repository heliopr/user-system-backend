const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")

const router = express.Router()

/*
REQUEST:
username (string): the username
id (number): the user id
either username or id have to be passed (XOR)

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true
id (number)
username (string)
description (string)
emailConfirmed (boolean)
image (string, encoded image in base64 (probably)): the user's profile image

ERROR CODES:
1000 - One, and only one of the arguments must be defined
1001 - Wrong param type
1010 - Error trying to get user
*/
router.get("/getUser", bodyParser.urlencoded({extended:true}), async (req, res) => {
    const {username, id} = req.query
    if ((username && id) || (!username && !id)) {
        res.json({success: false, errorCode: 1000, errorMessage: "You have to define one, and only one of the parameters (username, id)"})
        return
    }


    if (username && typeof(username) != "string") {
        res.json({success: false, errorCode: 1001, errorMessage: `Param 'username' must be a string (got '${typeof(username)}' instead)`})
        return
    }

    if (id && isNaN(id)) {
        res.json({success: false, errorCode: 1001, errorMessage: `Param 'id' must be a number (got NaN instead)`})
        return
    }


    let user, error = false
    if (username) {
        let [u, e] = await userManager.getUserByUsername(username)
        if (e) error = true
        else user = u
    }
    else if (id) {
        let [u, e] = await userManager.getUserById(parseInt(id))
        if (e) error = true
        else user = u
    }

    if (error) {
        res.json({success: false, errorCode: 1010, errorMessage: "An error occurred when trying to get user from the database"})
        return
    }

    
    if (user) {
        res.json({success: true, found: true,
            id: user.id, username: user.username, description: user.description, emailConfirmed: user.email_confirmed, image: user.image
        })
    }
    else {
        res.json({success: true, found: false})
    }
}, requestErrorHandler)

module.exports = router